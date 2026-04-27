import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, className, id, ...rest },
  ref
) {
  const inputId = id ?? rest.name;
  const helperId = `${inputId}-helper`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={helper || error ? helperId : undefined}
        className={cn(
          "h-11 px-3.5 bg-surface border rounded-xl text-sm text-ink",
          "placeholder:text-muted-2",
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
      />
      {(helper || error) && (
        <span
          id={helperId}
          className={cn(
            "text-xs",
            error ? "text-error" : "text-muted"
          )}
        >
          {error || helper}
        </span>
      )}
    </div>
  );
});
