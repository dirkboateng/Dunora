import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-dashed border-line-strong rounded-2xl p-8 text-center",
        className
      )}
    >
      <div className="inline-flex w-12 h-12 rounded-xl bg-accent-wash text-accent items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink-2 leading-relaxed max-w-md mx-auto">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
