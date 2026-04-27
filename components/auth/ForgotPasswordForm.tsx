"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Note: we deliberately don't reveal whether the email exists.
    // Supabase returns success either way; we show the same message.
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      }
    );

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-accent-wash text-accent inline-flex items-center justify-center text-xl mb-4">
          ✓
        </div>
        <h2 className="text-lg font-semibold text-ink mb-2">
          Check your inbox
        </h2>
        <p className="text-sm text-ink-2 leading-relaxed">
          If an account exists for <strong className="text-ink">{email}</strong>,
          we&apos;ve sent a password reset link. The link expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email"
        name="email"
        autoFocus
        type="email"
        autoComplete="email"
        placeholder="you@studio.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error ?? undefined}
        disabled={loading}
        required
      />

      <Button type="submit" size="lg" loading={loading}>
        {loading ? "Sending link…" : "Send reset link"}
      </Button>
    </form>
  );
}
