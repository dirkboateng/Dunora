import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  error?: string;
}

/**
 * Native checkbox with a custom visible square. The real <input> stays
 * functional and accessible; the styled <span> is a sibling overlay.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, error, className, id, ...rest }, ref) {
    const checkboxId = id ?? rest.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex items-start gap-2.5 cursor-pointer select-none",
            rest.disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <span className="relative inline-flex items-center justify-center mt-0.5 shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="peer sr-only"
              aria-invalid={Boolean(error)}
              {...rest}
            />
            <span
              aria-hidden
              className={cn(
                "w-4 h-4 rounded-[5px] border-[1.5px] bg-surface flex items-center justify-center transition-colors",
                "peer-checked:bg-accent peer-checked:border-accent",
                "peer-checked:[&>svg]:opacity-100",
                "peer-focus-visible:ring-4 peer-focus-visible:ring-accent/15",
                error ? "border-error" : "border-line-strong"
              )}
            >
              <svg
                className="w-2.5 h-2.5 text-white opacity-0 transition-opacity"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 6.5l2.5 2.5L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
          {label && (
            <span className="text-sm text-ink-2 leading-snug">{label}</span>
          )}
        </label>
        {error && <span className="text-xs text-error pl-7">{error}</span>}
      </div>
    );
  }
);
