"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * Error boundary for the (dashboard) segment. Renders inside DashboardShell
 * if children throw, so the user keeps sidebar/topbar context.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dunora dashboard] error:", error);
  }, [error]);

  return (
    <div className="flex-1 px-5 md:px-8 py-12 max-w-[1280px] w-full">
      <div className="bg-surface border border-line rounded-2xl p-8 md:p-10 max-w-[560px]">
        <div className="w-12 h-12 rounded-2xl bg-error/10 text-error inline-flex items-center justify-center text-xl mb-4 font-bold">
          !
        </div>
        <h1 className="text-xl font-bold text-ink mb-2">
          Couldn&apos;t load this page
        </h1>
        <p className="text-sm text-ink-2 leading-relaxed mb-6">
          Something went wrong while loading this page. You can try again, or
          go back to the dashboard home.
        </p>
        {error.digest && (
          <p className="text-[11px] font-mono text-muted mb-4">
            Reference: {error.digest}
          </p>
        )}
        <div className="flex items-center gap-3">
          <Button onClick={() => reset()} variant="primary">
            Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary">Dashboard home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
