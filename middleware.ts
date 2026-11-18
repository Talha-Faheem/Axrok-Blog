import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("axrok_admin_token")?.value;

  // Protect Admin UI pages
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in, redirect /admin/login to /admin
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Protect Admin APIs
  if (pathname.startsWith("/api/admin")) {
    const authHeader = request.headers.get("authorization");
    if (!token && (!authHeader || !authHeader.startsWith("Bearer "))) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
