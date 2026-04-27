import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback for email-confirmation and magic-link flows.
 * Supabase redirects users here after they click a link in an email.
 *
 * Flow:
 *   1. Read the `code` query param.
 *   2. Exchange it for a session — this sets the auth cookies.
 *   3. Redirect to `next` (or /dashboard by default).
 *
 * Security: `next` is validated to be a same-origin pathname only —
 * no protocol-relative URLs (`//evil.com`), no absolute URLs
 * (`https://evil.com`), no schemes (`javascript:`).
 */
function safeNextPath(raw: string | null): string {
  const fallback = "/dashboard";
  if (!raw) return fallback;
  // Must start with single "/" and not "//"
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.startsWith("/\\")) return fallback;
  // Disallow obvious scheme injections
  if (/^[a-z]+:/i.test(raw)) return fallback;
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
