import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./Icon";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
  primary?: boolean;
}

export function QuickActionCard({
  icon,
  title,
  description,
  href,
  disabled,
  primary,
}: QuickActionCardProps) {
  const inner = (
    <div
      className={cn(
        "group relative h-full bg-surface border rounded-2xl p-5 transition-all duration-200",
        primary
          ? "border-accent/30 bg-accent-wash/40"
          : "border-line",
        !disabled && "hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-card cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
            primary
              ? "bg-accent text-white"
              : "bg-accent-wash text-accent group-hover:bg-accent group-hover:text-white"
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[15px] font-semibold text-ink">{title}</span>
            {disabled && (
              <span className="text-[9px] font-semibold uppercase tracking-wider bg-surface-2 text-muted px-1.5 py-0.5 rounded">
                Soon
              </span>
            )}
          </div>
          <p className="text-sm text-ink-2 leading-snug">{description}</p>
        </div>
        {!disabled && (
          <ArrowRightIcon
            size={18}
            className="text-muted group-hover:text-accent transition-colors shrink-0 mt-1"
          />
        )}
      </div>
    </div>
  );

  if (disabled) {
    return <div aria-disabled>{inner}</div>;
  }

  return <Link href={href}>{inner}</Link>;
}
