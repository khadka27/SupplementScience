import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { proxy } from "./proxy";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply proxy middleware first
  const proxyResponse = proxy(request);
  if (proxyResponse.status !== 200) {
    return proxyResponse;
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = await auth();

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (pathname === "/admin/login") {
    const session = await auth();

    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/blog/new";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/admin/:path*",
  ],
};
