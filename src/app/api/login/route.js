import { NextResponse } from "next/server";
import crypto from "crypto";

function computeExpectedToken() {
  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const digest = crypto
    .createHash("sha256")
    .update(`${username}|${password}`)
    .digest("hex");
  return digest;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const envUsername = process.env.ADMIN_USERNAME ?? "";
    const envPassword = process.env.ADMIN_PASSWORD ?? "";

    if (username !== envUsername || password !== envPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = computeExpectedToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

