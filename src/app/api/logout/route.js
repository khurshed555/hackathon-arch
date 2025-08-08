import { NextResponse } from "next/server";

export async function GET(request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("session", "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}

