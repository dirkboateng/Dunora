"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface ResendVerificationButtonProps {
  email: string;
}

export function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
    // Reset the "sent" flag after 30s so the user can resend again if needed.
    setTimeout(() => setSent(false), 30_000);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant="secondary"
        size="md"
        onClick={handleResend}
        disabled={loading || sent}
        loading={loading}
      >
        {sent ? "Email sent — check your inbox" : "Resend verification email"}
      </Button>
      {error && (
        <span role="alert" className="text-xs text-error">
          {error}
        </span>
      )}
    </div>
  );
}
