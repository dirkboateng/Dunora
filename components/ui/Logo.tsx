import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  /** Hide the wordmark — show only the icon. */
  iconOnly?: boolean;
  className?: string;
  /** Use white wordmark + bright accent dot for dark surfaces. */
  inverted?: boolean;
}

/**
 * Dunora logo — Concept B (Frame D).
 * Solid emerald square + white D + bright-green accent dot top-right.
 * Doubles as the app icon (just use `iconOnly`).
 */
export function Logo({
  size = 36,
  iconOnly = false,
  inverted = false,
  className,
}: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
      >
        <rect
          x="3"
          y="3"
          width="34"
          height="34"
          rx="9"
          fill={inverted ? "#10B981" : "#047857"}
        />
        <path
          d="M13 11 L13 29 L21 29 C26 29 30 25 30 20 C30 15 26 11 21 11 L13 11 Z"
          fill="white"
        />
        <circle cx="29" cy="13" r="2.5" fill="#10B981" />
      </svg>
      {!iconOnly && (
        <span
          className={cn(
            "font-bold tracking-tight",
            inverted ? "text-white" : "text-accent-deep"
          )}
          style={{ fontSize: size * 0.5 }}
        >
          Dunora
        </span>
      )}
    </div>
  );
}
