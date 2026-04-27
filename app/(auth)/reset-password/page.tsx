import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Set new password",
};

/**
 * Reachable after the user clicks the link in their reset email.
 * The /auth/callback route exchanges the recovery code for a session,
 * then redirects here. Without a session, we send them back to start
 * the flow over.
 */
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/forgot-password?error=link_expired");
  }

  return (
    <div className="bg-surface border border-line rounded-2xl p-8 shadow-card animate-fade-in-up">
      <h1 className="text-2xl font-bold tracking-tight text-ink mb-1">
        Set a new password
      </h1>
      <p className="text-ink-2 text-sm mb-8">
        Choose a strong password. You&apos;ll be logged in automatically.
      </p>

      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
