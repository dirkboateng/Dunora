import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

/**
 * Runs on every request matched by middleware.ts.
 * Refreshes the auth session and gates protected routes.
 *
 * IMPORTANT: we call getUser() not getSession() — getSession() trusts
 * whatever's in the cookie (forge-able), getUser() validates against
 * Supabase Auth on every call. Slower but safe.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected: anything under /dashboard or /onboarding
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  // Auth pages that should bounce logged-in users to /dashboard:
  // /login, /register, /forgot-password.
  // Note: /reset-password and /verify-email are deliberately NOT in this list:
  //   - /reset-password works during a recovery session (user IS logged in).
  //   - /verify-email is an interstitial — works in either state.
  const bouncesIfLoggedIn =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && bouncesIfLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
