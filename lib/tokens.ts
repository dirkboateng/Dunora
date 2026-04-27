/**
 * Dunora design tokens (rebrand v2.0 — light + emerald).
 * Mirrors tailwind.config.ts. Use these in TS code where Tailwind classes don't fit
 * (e.g. inline styles for SVG fills, dynamic colors, design-system tooling).
 */

export const tokens = {
  color: {
    bg: "#FAFAF7",
    surface: "#FFFFFF",
    surface2: "#F4F4EE",
    surface3: "#ECECE4",

    accent: "#047857",
    accentHover: "#065F46",
    accentDeep: "#064E3B",
    accentBright: "#10B981",
    accentSoft: "#D1FAE5",
    accentWash: "#ECFDF5",

    ink: "#0F172A",
    ink2: "#334155",
    muted: "#64748B",
    muted2: "#94A3B8",

    line: "rgba(15,23,42,0.07)",
    lineStrong: "rgba(15,23,42,0.12)",

    success: "#047857",
    warning: "#D97706",
    error: "#DC2626",
    info: "#0284C7",
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    full: 9999,
  },

  // 4-point spacing grid (matches Tailwind's defaults — listed for reference).
  space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const,

  duration: {
    fast: 150,
    base: 200,
    slow: 300,
  },
} as const;

export type Token = typeof tokens;
