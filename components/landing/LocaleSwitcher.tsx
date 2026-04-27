"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/dict";

interface Props {
  current: Locale;
}

export function LocaleSwitcher({ current }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState<Locale>(current);

  async function pick(next: Locale) {
    if (next === active || isPending) return;
    setActive(next);
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex items-center bg-surface-2 rounded-full p-0.5"
    >
      {LOCALES.map((loc) => {
        const isActive = loc === active;
        return (
          <button
            key={loc}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => pick(loc)}
            disabled={isPending}
            className={
              "text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full transition-colors " +
              (isActive
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
