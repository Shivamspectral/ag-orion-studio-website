import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Request proxy:
 *  1. Canonical trailing-slash redirects (308) for page URLs. API routes and
 *     file-like paths are left untouched so health checks and text files never
 *     bounce.
 *  2. Protection for every /admin route. Unauthenticated requests go to the
 *     login page; authenticated visits to the login page go to the dashboard.
 *     Server actions re-verify the session independently (see `requireAdmin`).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  const isFileLike = lastSegment.includes(".");
  if (pathname !== "/" && !pathname.endsWith("/") && !isFileLike && !pathname.startsWith("/api/")) {
    // Plain URL (not NextURL) so the trailing slash is preserved verbatim.
    const url = new URL(request.url);
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const isLoginPage = pathname.startsWith("/admin/login");
    const authenticated = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value, process.env.ADMIN_SESSION_SECRET);

    if (!authenticated && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login/";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if (authenticated && isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/";
      url.search = "";
      return NextResponse.redirect(url);
    }

    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and static assets with extensions.
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
