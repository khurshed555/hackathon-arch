import { NextResponse } from "next/server";
import { supportedLocales } from "@/i18n/config";

export async function POST(request) {
  const { locale } = await request.json().catch(() => ({ locale: null }));
  const lang = supportedLocales.includes(locale) ? locale : null;
  const res = NextResponse.json({ success: Boolean(lang) });
  if (lang) {
    res.cookies.set("lang", lang, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

