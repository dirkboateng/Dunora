"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Login form — client component.
 *
 * Talks directly to Supabase Auth from the browser. On success, refreshes
 * the router so middleware can re-evaluate auth state and route to the
 * intended destination (?next=…) or /dashboard.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  // Same-origin path validation. No protocol-relative or absolute URLs.
  const next =
    rawNext &&
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.startsWith("/\\") &&
    !/^[a-z]+:/i.test(rawNext)
      ? rawNext
      : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // Initial error can come from ?error= (e.g. when /auth/callback redirects)
  const initialUrlError = searchParams.get("error");
  const [error, setError] = useState<string | null>(
    initialUrlError === "missing_code"
      ? "Your verification link expired or was already used. Please request a new one."
      : initialUrlError
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      // Supabase returns generic messages for security — keep them as-is.
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Force a full reload so server components re-fetch with the new session.
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email"
        name="email"
        autoFocus
        type="email"
        autoComplete="email"
        required
        placeholder="you@studio.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <div className="flex justify-end -mt-2">
        <Link
          href="/forgot-password"
          className="text-xs text-muted hover:text-ink-2"
        >
          Forgot password?
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3"
        >
          {error}
        </div>
      )}

      <Button type="submit" size="lg" loading={loading}>
        {loading ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}
