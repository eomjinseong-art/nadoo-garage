import { NextRequest, NextResponse } from "next/server";
import {
  GATE_COOKIE,
  isValidSession,
  passwordPageHtml,
  safeNextPath,
} from "@/lib/gate";

const PUBLIC_PATHS = new Set(["/robots.txt", "/sitemap.xml"]);
const ROBOTS_TAG = "noindex, nofollow, noarchive, nosnippet, noimageindex";

function withRobots(res: NextResponse) {
  res.headers.set("X-Robots-Tag", ROBOTS_TAG);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

function isDocumentRequest(req: NextRequest) {
  const dest = req.headers.get("sec-fetch-dest");
  if (dest === "document") return true;
  if (dest && dest !== "empty") return false;
  const accept = req.headers.get("accept") || "";
  return accept.includes("text/html");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return withRobots(NextResponse.next());
  }

  if (pathname === "/api/login") {
    return withRobots(NextResponse.next());
  }

  const token = req.cookies.get(GATE_COOKIE)?.value;
  if (await isValidSession(token)) {
    return withRobots(NextResponse.next());
  }

  if (isDocumentRequest(req) || req.method === "GET" || req.method === "HEAD") {
    if (!isDocumentRequest(req) && (req.method === "GET" || req.method === "HEAD")) {
      const looksLikePage =
        !pathname.startsWith("/_next/") &&
        !pathname.startsWith("/img/") &&
        !pathname.startsWith("/api/") &&
        !/\.(?:avif|css|gif|ico|jpe?g|js|json|map|png|svg|txt|webp|woff2?)$/i.test(pathname);
      if (!looksLikePage) {
        return withRobots(
          new NextResponse("Unauthorized", {
            status: 401,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          }),
        );
      }
    }
    const nextPath = safeNextPath(pathname + req.nextUrl.search);
    const html = passwordPageHtml({
      nextPath,
      error: req.nextUrl.searchParams.get("error") === "1",
    });
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": ROBOTS_TAG,
      },
    });
  }

  return withRobots(
    new NextResponse("Unauthorized", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }),
  );
}

export const config = {
  matcher: ["/:path*"],
};
