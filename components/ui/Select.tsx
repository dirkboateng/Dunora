import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helper?: string;
  error?: string;
  children: ReactNode;
}

/**
 * Native <select> styled to match the Input primitive.
 * Native is intentional — better mobile UX (system picker), no JS, accessible.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helper, error, className, id, children, ...rest },
  ref
) {
  const selectId = id ?? rest.name;
  const helperId = `${selectId}-helper`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={helper || error ? helperId : undefined}
          className={cn(
            "h-11 w-full pl-3.5 pr-10 bg-surface border rounded-xl text-sm text-ink",
            "appearance-none cursor-pointer",
            "transition-[border-color,box-shadow] duration-200 outline-none",
            "hover:border-line-strong/60",
            "focus:border-accent focus:ring-4 focus:ring-accent/15",
            error
              ? "border-error focus:border-error focus:ring-error/15"
              : "border-line-strong",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...rest}
        >
          {children}
        </select>
        {/* Chevron — purely decorative */}
        <svg
          aria-hidden
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {(helper || error) && (
        <span
          id={helperId}
          className={cn("text-xs", error ? "text-error" : "text-muted")}
        >
          {error || helper}
        </span>
      )}
    </div>
  );
});
