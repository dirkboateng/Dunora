import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: React.ReactNode;
  sub?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Eyebrow + headline + optional subhead. Used by every section.
 * Keeping this DRY means typography stays consistent without prop-drilling
 * Tailwind classes through the codebase.
 */
export function SectionHeading({
  label,
  title,
  sub,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-[640px]",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <div className="text-xs font-bold uppercase tracking-[0.1em] text-accent mb-4">
          {label}
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.04em] text-ink leading-[1.05]">
        {title}
      </h2>
      {sub && (
        <p className="text-base md:text-lg text-ink-2 leading-relaxed mt-4">
          {sub}
        </p>
      )}
    </div>
  );
}
