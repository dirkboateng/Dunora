"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dunora auth] error:", error);
  }, [error]);

  return (
    <div className="bg-surface border border-line rounded-2xl p-8 shadow-card text-center">
      <div className="w-12 h-12 rounded-2xl bg-error/10 text-error inline-flex items-center justify-center text-xl mb-4 font-bold mx-auto">
        !
      </div>
      <h1 className="text-lg font-bold text-ink mb-2">Something went wrong</h1>
      <p className="text-sm text-ink-2 leading-relaxed mb-6">
        We couldn&apos;t load the form. Try again, or go back to the homepage.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={() => reset()} variant="primary" size="sm">
          Try again
        </Button>
        <Link href="/">
          <Button variant="secondary" size="sm">
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
