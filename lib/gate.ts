/** Site-wide password gate helpers. Edge-safe (Web Crypto). The password itself lives in SITE_PASSWORD. */

export const GATE_COOKIE = "ng_gate";
export const GATE_MAX_AGE = 30 * 24 * 60 * 60;
const PAYLOAD_PREFIX = "v1";

function textEncode(s: string) {
  return new TextEncoder().encode(s);
}

function b64url(bytes: Uint8Array) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromB64url(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function asArrayBuffer(data: Uint8Array) {
  const copy = new ArrayBuffer(data.byteLength);
  new Uint8Array(copy).set(data);
  return copy;
}

async function sha256(data: Uint8Array) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", asArrayBuffer(data)));
}

async function hmac(secret: Uint8Array, data: string) {
  const key = await crypto.subtle.importKey("raw", asArrayBuffer(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, asArrayBuffer(textEncode(data))));
}

export function sitePassword() {
  return process.env.SITE_PASSWORD ?? "";
}

/** HMAC key: SITE_AUTH_SECRET if long enough, otherwise a digest of the site password. */
export async function signingKey() {
  const explicit = process.env.SITE_AUTH_SECRET ?? "";
  if (explicit.length >= 32) return textEncode(explicit);
  const password = sitePassword();
  if (!password) return null;
  return sha256(textEncode(`nadoo-garage.gate.v1:${password}`));
}

export async function passwordsMatch(input: string, expected: string) {
  if (!expected) return false;
  const [a, b] = await Promise.all([sha256(textEncode(input)), sha256(textEncode(expected))]);
  return timingSafeEqual(a, b);
}

export async function signSession(maxAge = GATE_MAX_AGE) {
  const key = await signingKey();
  if (!key) return null;
  const exp = Math.floor(Date.now() / 1000) + maxAge;
  const payload = `${PAYLOAD_PREFIX}.${exp}`;
  const sig = b64url(await hmac(key, payload));
  return `${payload}.${sig}`;
}

export async function isValidSession(token: string | undefined | null) {
  if (!token) return false;
  const key = await signingKey();
  if (!key) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== PAYLOAD_PREFIX) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  let sig: Uint8Array;
  try {
    sig = fromB64url(parts[2]);
  } catch {
    return false;
  }
  const want = await hmac(key, payload);
  if (!timingSafeEqual(sig, want)) return false;
  const exp = Number(parts[1]);
  return Number.isFinite(exp) && exp > Date.now() / 1000;
}

export function sessionCookie(token: string) {
  return `${GATE_COOKIE}=${token}; Path=/; Max-Age=${GATE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
}

/** Only same-origin relative paths. Reject protocol-relative and backslash tricks. */
export function safeNextPath(raw: string | null | undefined) {
  if (!raw) return "/";
  let value = raw.trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    return "/";
  }
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return "/";
  }
  return value;
}

const ROBOTS_META = "noindex, nofollow, noarchive, nosnippet, noimageindex";

export function passwordPageHtml(opts: { nextPath: string; error?: boolean }) {
  const nextPath = safeNextPath(opts.nextPath);
  const errorBlock = opts.error
    ? `<p class="err" role="alert">비밀번호가 올바르지 않습니다.</p>`
    : "";
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="${ROBOTS_META}">
  <title>비밀번호를 입력하세요</title>
  <style>
    :root { color-scheme: light dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100dvh;
      display: grid;
      place-items: center;
      background: #f2f1ee;
      color: #16171a;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    main {
      width: min(22rem, calc(100% - 2rem));
      background: #fff;
      border: 1px solid #dddcd7;
      border-radius: 1rem;
      padding: 1.75rem 1.5rem 1.5rem;
    }
    h1 { margin: 0 0 1rem; font-size: 1.15rem; font-weight: 700; }
    label { display: block; font-size: 0.85rem; color: #5a5d63; margin-bottom: 0.4rem; }
    input[type="password"] {
      width: 100%;
      padding: 0.7rem 0.8rem;
      border: 1px solid #dddcd7;
      border-radius: 0.6rem;
      font-size: 1rem;
      background: #fff;
      color: inherit;
    }
    button {
      margin-top: 0.9rem;
      width: 100%;
      padding: 0.7rem 0.8rem;
      border: 0;
      border-radius: 0.6rem;
      background: #c2410c;
      color: #fff7ef;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    .err { margin: 0 0 0.85rem; color: #b42318; font-size: 0.9rem; }
    @media (prefers-color-scheme: dark) {
      body { background: #0f1012; color: #eeede9; }
      main { background: #18191c; border-color: #2c2e33; }
      input[type="password"] { background: #111214; border-color: #2c2e33; }
      button { background: #fb8b4b; color: #1a0d05; }
      .err { color: #ff7a6e; }
    }
  </style>
</head>
<body>
  <main>
    <h1>비밀번호를 입력하세요</h1>
    ${errorBlock}
    <form method="post" action="/api/login" autocomplete="current-password">
      <label for="password">비밀번호</label>
      <input id="password" name="password" type="password" required autofocus maxlength="200">
      <input type="hidden" name="next" value="${escapeHtml(nextPath)}">
      <button type="submit">확인</button>
    </form>
  </main>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
