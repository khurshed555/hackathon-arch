import { NextResponse } from "next/server";

async function computeExpectedToken() {
  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const encoder = new TextEncoder();
  const data = encoder.encode(`${username}|${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isWatchRoute = pathname === "/watch" || pathname.startsWith("/watch/");
  const isLoginRoute = pathname === "/login";
  const isRoot = pathname === "/";

  const sessionCookie = request.cookies.get("session")?.value ?? null;
  const expectedToken = await computeExpectedToken();
  const isAuthed = sessionCookie === expectedToken;

  if ((isAdminRoute || isWatchRoute) && !isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = search ? `?next=${encodeURIComponent(pathname + search)}` : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/watch";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isRoot) {
    const url = request.nextUrl.clone();
    url.pathname = isAuthed ? "/watch" : "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/watch", "/admin/:path*", "/login"],
};

