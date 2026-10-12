import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isContentApiWrite = pathname === "/api/content" && req.method !== "GET";

  // Allow login page and login api always
  if (isLoginPage || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Protect admin pages and content writes
  if (isAdminPage || isContentApiWrite) {
    const auth = req.cookies.get("admin_auth")?.value;
    if (auth !== "1") {
      if (isAdminPage) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
      // API: return 401 JSON
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Prevent allowing login when already authed - optional
  if (isAdminApi && isLoginPage) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/content", "/api/admin/:path*"],
};
