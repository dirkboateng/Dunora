import Link from "next/link";
import { ResendVerificationButton } from "@/components/auth/ResendVerificationButton";

export const metadata = {
  title: "Verify your email",
};

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

/**
 * Shown after registration. Asks the user to click the link in their inbox.
 *
 * If email confirmation is OFF in Supabase (typical for dev), the user is
 * already signed in by the time they hit this page — they can ignore it
 * and click "Go to dashboard".
 */
export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email ?? "";

  return (
    <div className="bg-surface border border-line rounded-2xl p-8 shadow-card text-center animate-fade-in-up">
      <div className="w-14 h-14 rounded-2xl bg-accent-wash text-accent inline-flex items-center justify-center text-2xl mb-5">
        ✉
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-ink mb-2">
        Check your inbox
      </h1>

      <p className="text-sm text-ink-2 leading-relaxed mb-6">
        We sent a confirmation link to{" "}
        {email ? (
          <strong className="text-ink">{email}</strong>
        ) : (
          "your email"
        )}
        . Click the link to verify your account and start your first gallery.
      </p>

      {email && (
        <div className="mb-6">
          <ResendVerificationButton email={email} />
        </div>
      )}

      <div className="text-xs text-muted leading-relaxed">
        Didn&apos;t get an email? Check your spam folder, or{" "}
        <Link href="/register" className="text-accent hover:text-accent-hover font-medium">
          try a different address
        </Link>
        .
      </div>

      <div className="mt-6 pt-6 border-t border-line text-sm">
        <Link
          href="/login"
          className="text-accent font-semibold hover:text-accent-hover"
        >
          Already verified? Log in
        </Link>
      </div>
    </div>
  );
}
