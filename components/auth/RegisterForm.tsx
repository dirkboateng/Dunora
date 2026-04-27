"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import type { AccountType } from "@/types/database";

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  accountType?: string;
  terms?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [terms, setTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!fullName.trim()) next.fullName = "Required";
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email";
    if (password.length < 8)
      next.password = "Use at least 8 characters";
    if (!accountType) next.accountType = "Pick what describes you";
    if (!terms) next.terms = "You must agree to the terms";
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    const supabase = createClient();

    // signUp puts metadata in raw_user_meta_data, which the
    // handle_new_user trigger reads to populate profiles + workspace.
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        data: {
          full_name: fullName.trim(),
          account_type: accountType,
        },
      },
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    // Push to verify-email interstitial. If email confirmation is OFF
    // in Supabase (dev), the user is already signed in — middleware
    // will route them through /verify-email to /dashboard cleanly.
    router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Full name"
        name="fullName"
        autoFocus
        autoComplete="name"
        placeholder="Dami van Engelen"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
        disabled={loading}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@studio.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={loading}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        helper={!errors.password ? "Use 8 characters or more." : undefined}
        disabled={loading}
        required
      />

      <Select
        label="What best describes you?"
        name="accountType"
        value={accountType}
        onChange={(e) => setAccountType(e.target.value as AccountType)}
        error={errors.accountType}
        disabled={loading}
        required
      >
        <option value="" disabled>Select one…</option>
        <option value="photographer">Photographer</option>
        <option value="club">Sports club / organization</option>
        <option value="event">Event organizer</option>
        <option value="agency">Agency</option>
        <option value="other">Other</option>
      </Select>

      <Checkbox
        name="terms"
        checked={terms}
        onChange={(e) => setTerms(e.target.checked)}
        disabled={loading}
        error={errors.terms}
        label={
          <>
            I agree to the{" "}
            <Link href="/terms" className="text-accent hover:text-accent-hover font-medium">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent hover:text-accent-hover font-medium">
              Privacy Policy
            </Link>
            .
          </>
        }
      />

      {serverError && (
        <div
          role="alert"
          className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3"
        >
          {serverError}
        </div>
      )}

      <Button type="submit" size="lg" loading={loading}>
        {loading ? "Creating account…" : "Create your Dunora account"}
      </Button>
    </form>
  );
}
