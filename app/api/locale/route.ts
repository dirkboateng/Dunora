import { NextResponse } from "next/server";
import { LOCALES, type Locale } from "@/lib/i18n/dict";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const next: string | undefined = body?.locale;
  if (!next || !LOCALES.includes(next as Locale)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(LOCALE_COOKIE_NAME, next, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
