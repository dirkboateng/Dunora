"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function PasswordChangeForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg(null);

    if (newPassword.length < 8) {
      setStatus("error");
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setStatus("error");
      setErrorMsg("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("ok");
    setNewPassword("");
    setConfirm("");
    setTimeout(() => setStatus("idle"), 2400);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="New password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        helper="At least 8 characters."
        disabled={loading}
        required
      />
      <Input
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        disabled={loading}
        required
      />

      {status === "error" && errorMsg && (
        <div className="bg-error/10 border border-error/20 text-error text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}
      {status === "ok" && (
        <div className="bg-accent-wash border border-accent/20 text-accent-deep text-sm rounded-xl px-4 py-3">
          Password updated.
        </div>
      )}

      <div>
        <Button type="submit" loading={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </div>
    </form>
  );
}
