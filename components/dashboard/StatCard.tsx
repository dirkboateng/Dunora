import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  helper?: string;
  className?: string;
}

export function StatCard({ icon, label, value, helper, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-line rounded-2xl p-5 transition-all duration-200",
        "hover:border-accent/25 hover:-translate-y-0.5 hover:shadow-card",
        className
      )}
    >
      <div className="w-9 h-9 rounded-xl bg-accent-wash text-accent flex items-center justify-center mb-3">
        {icon}
      </div>
      <div className="text-2xl font-bold tracking-[-0.5px] text-ink">{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
      {helper && <div className="text-[11px] text-muted-2 mt-1.5">{helper}</div>}
    </div>
  );
}
