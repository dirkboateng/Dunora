import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover hover:-translate-y-px hover:shadow-cta",
  secondary:
    "bg-surface border border-line-strong text-ink hover:bg-surface-2 hover:-translate-y-px",
  ghost: "bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink",
  outline:
    "bg-transparent border border-accent text-accent hover:bg-accent-wash",
  danger:
    "bg-error text-white hover:bg-[#B91C1C] hover:-translate-y-px",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-[18px] py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base rounded-[14px] gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading,
      disabled,
      leftIcon,
      rightIcon,
      className,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {loading && <Spinner />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

function Spinner() {
  return (
    <span
      className="w-3.5 h-3.5 border-2 border-current border-r-transparent rounded-full animate-spin"
      aria-hidden
    />
  );
}
