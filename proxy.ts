import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  const url = request.nextUrl.clone();
  const hasTrailingSlash = pathname.endsWith("/") && pathname !== "/";

  if (hasTrailingSlash) {
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  if (pathname.includes("//")) {
    url.pathname = pathname.replace(/\/+/g, "/");
    return NextResponse.redirect(url, 301);
  }

  if (pathname.startsWith("/www.")) {
    url.pathname = pathname.replace("/www.", "/");
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
