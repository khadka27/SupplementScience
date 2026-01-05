import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add pathname to headers for layout detection
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Proxy functionality: URL normalization
  // Convert to lowercase
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // Remove trailing slashes
  const hasTrailingSlash = pathname.endsWith("/") && pathname !== "/";
  if (hasTrailingSlash) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // Fix double slashes
  if (pathname.includes("//")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/+/g, "/");
    return NextResponse.redirect(url, 301);
  }

  // Remove www. from paths
  if (pathname.startsWith("/www.")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace("/www.", "/");
    return NextResponse.redirect(url, 301);
  }

  // Authentication: Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = await auth();

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Authentication: Redirect to dashboard if already logged in
  if (pathname === "/admin/login") {
    const session = await auth();

    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated admin from public pages to admin panel
  const publicPages = [
    "/",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/editorial-policy",
    "/medical-disclaimer",
  ];
  const isPublicPage =
    publicPages.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/category/") ||
    pathname.startsWith("/tag/");

  if (isPublicPage) {
    const session = await auth();

    if (session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/admin/:path*",
  ],
};
