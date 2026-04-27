"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

/**
 * Top-level error boundary. Catches any uncaught error in the route tree
 * and renders a friendly fallback. Reset retries the segment.
 *
 * In production this should hook into an error reporter (Sentry/etc.).
 * For MVP we keep it minimal and console-log so dev sees the stack.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dunora] route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="px-6 py-6 md:px-10 md:py-8">
        <Logo size={32} />
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="max-w-[480px] w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-error/10 text-error inline-flex items-center justify-center text-2xl mb-5">
            !
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-ink-2 leading-relaxed mb-8">
            An unexpected error occurred. We&apos;ve logged it. You can try
            again, or head back to the dashboard.
          </p>

          {error.digest && (
            <p className="text-[11px] font-mono text-muted mb-6">
              Reference: {error.digest}
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => reset()} variant="primary">
              Try again
            </Button>
            <Link href="/dashboard">
              <Button variant="secondary">Back to dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
