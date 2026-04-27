"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/dict";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState<Locale | null>(null);

  async function setLocale(next: Locale) {
    if (next === current || pending) return;
    setPending(next);
    try {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="inline-flex items-center bg-surface-2 rounded-full p-0.5 border border-line">
      {LOCALES.map((loc) => {
        const active = loc === current;
        const isPending = pending === loc;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            disabled={isPending}
            className={
              "px-2.5 py-1 text-xs font-semibold rounded-full transition-colors " +
              (active
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink-2")
            }
          >
            {LOCALE_LABELS[loc]}
          </button>
        );
      })}
    </div>
  );
}
