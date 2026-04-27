import type { Config } from "tailwindcss";

/**
 * Dunora design tokens — light + emerald (rebrand v2.0).
 * Source of truth: lib/tokens.ts.
 * If you change a value here, change it there too.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF7",
        surface: {
          DEFAULT: "#FFFFFF",
          2: "#F4F4EE",
          3: "#ECECE4",
        },
        accent: {
          DEFAULT: "#047857",
          hover: "#065F46",
          deep: "#064E3B",
          bright: "#10B981",
          soft: "#D1FAE5",
          wash: "#ECFDF5",
        },
        ink: {
          DEFAULT: "#0F172A",
          2: "#334155",
        },
        muted: {
          DEFAULT: "#64748B",
          2: "#94A3B8",
        },
        line: {
          DEFAULT: "rgba(15,23,42,0.07)",
          strong: "rgba(15,23,42,0.12)",
        },
        error: "#DC2626",
        success: "#10B981",
        warn: "#D97706",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 12px 32px rgba(15,23,42,0.06)",
        cta: "0 8px 24px rgba(4,120,87,0.18)",
        toast: "0 20px 60px rgba(15,23,42,0.12)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out",
        spin: "spin 0.7s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
