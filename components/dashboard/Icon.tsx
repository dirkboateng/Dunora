/**
 * Lightweight icon set for the dashboard.
 * Uses inline SVG — no external dep, no client JS, fully tree-shakeable.
 * If we need more icons later we'll switch to lucide-react which is already
 * in package.json.
 */

interface IconProps {
  className?: string;
  size?: number;
}

const baseProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function HomeIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" />
    </svg>
  );
}

export function FolderIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

export function UploadIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function GalleryIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="M21 16l-5-5-9 9" />
    </svg>
  );
}

export function PresetIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M4 6h16M4 12h10M4 18h16" />
      <circle cx="17" cy="12" r="2.5" />
    </svg>
  );
}

export function WatermarkIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 16l3-7 3 7" />
      <path d="M9 14h4" />
    </svg>
  );
}

export function SettingsIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

export function PlusIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function PhotoIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="M3 17l5-5 7 7" />
      <path d="M14 14l3-3 4 4" />
    </svg>
  );
}

export function ActivityIcon({ size = 24, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M3 12h4l3-9 4 18 3-9h4" />
    </svg>
  );
}

export function StorageIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0018 0V5" />
      <path d="M3 12a9 3 0 0018 0" />
    </svg>
  );
}

export function SparkleIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className} aria-hidden>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9z" />
    </svg>
  );
}
