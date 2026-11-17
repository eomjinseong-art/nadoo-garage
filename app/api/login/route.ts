import { NextRequest, NextResponse } from "next/server";
import {
  passwordsMatch,
  passwordPageHtml,
  safeNextPath,
  sessionCookie,
  signSession,
  sitePassword,
} from "@/lib/gate";

function isAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === req.nextUrl.origin;
  } catch {
    return false;
  }
}

async function readPasswordAndNext(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = (await req.json().catch(() => null)) as { password?: unknown; next?: unknown } | null;
    return {
      password: typeof body?.password === "string" ? body.password : "",
      nextPath: safeNextPath(typeof body?.next === "string" ? body.next : "/"),
    };
  }
  const form = await req.formData().catch(() => null);
  const password = form?.get("password");
  const next = form?.get("next");
  return {
    password: typeof password === "string" ? password : "",
    nextPath: safeNextPath(typeof next === "string" ? next : "/"),
  };
}

export async function POST(req: NextRequest) {
  const wantsHtml = (req.headers.get("accept") || "").includes("text/html");

  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  const { password, nextPath } = await readPasswordAndNext(req);
  const expected = sitePassword();

  if (!expected) {
    const res = wantsHtml
      ? new NextResponse(passwordPageHtml({ nextPath, error: true }), {
          status: 500,
          headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
        })
      : NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (!password || password.length > 200 || !(await passwordsMatch(password, expected))) {
    if (wantsHtml) {
      const dest = new URL(nextPath, req.nextUrl.origin);
      dest.searchParams.set("error", "1");
      const res = NextResponse.redirect(dest, 303);
      res.headers.set("Cache-Control", "no-store");
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }
    return NextResponse.json({ ok: false, error: "wrong password" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const token = await signSession();
  if (!token) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }

  const dest = new URL(nextPath, req.nextUrl.origin);
  const res = wantsHtml
    ? NextResponse.redirect(dest, 303)
    : NextResponse.json({ ok: true, next: nextPath }, { status: 200 });
  res.headers.set("Set-Cookie", sessionCookie(token));
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
}

export async function GET() {
  return NextResponse.json({ error: "method not allowed" }, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
}
