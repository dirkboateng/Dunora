import Link from "next/link";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-surface border border-line rounded-2xl p-8 shadow-card animate-fade-in-up">
      <h1 className="text-2xl font-bold tracking-tight text-ink mb-1">
        Reset your password
      </h1>
      <p className="text-ink-2 text-sm mb-8">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>

      <Suspense>
        <ForgotPasswordForm />
      </Suspense>

      <div className="mt-6 pt-6 border-t border-line text-sm text-center text-ink-2">
        Remembered it?{" "}
        <Link
          href="/login"
          className="text-accent font-semibold hover:text-accent-hover"
        >
          Back to log in
        </Link>
      </div>
    </div>
  );
}
