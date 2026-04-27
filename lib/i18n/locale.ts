import { cookies, headers } from "next/headers";
import { LOCALES, type Locale } from "./dict";

const COOKIE_NAME = "dunora_locale";

/**
 * Resolve the visitor's locale.
 *
 * 1. Manual cookie wins (set by the language switcher).
 * 2. Otherwise inspect Accept-Language header.
 * 3. Default to English.
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (fromCookie && LOCALES.includes(fromCookie as Locale)) {
    return fromCookie as Locale;
  }

  const headerStore = await headers();
  const accept = headerStore.get("accept-language") ?? "";
  // Match e.g. "nl-NL,nl;q=0.9,en;q=0.8" — first language tag wins
  const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("nl")) return "nl";
  return "en";
}

export const LOCALE_COOKIE_NAME = COOKIE_NAME;
