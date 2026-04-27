"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FieldErrors {
  password?: string;
  confirm?: string;
}

export function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (password.length < 8) next.password = "Use at least 8 characters";
    if (password !== confirm) next.confirm = "Passwords don't match";
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

    // updateUser requires a session — Supabase sets one when the user
    // clicks the recovery link → exchangeCodeForSession in /auth/callback.
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    // Password updated. Force a refresh so middleware re-evaluates.
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="New password"
        name="password"
        autoFocus
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={loading}
        required
      />

      <Input
        label="Confirm new password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        disabled={loading}
        required
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
        {loading ? "Updating password…" : "Update password"}
      </Button>
    </form>
  );
}
