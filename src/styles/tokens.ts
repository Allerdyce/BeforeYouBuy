/**
 * BeforeYouBuy — Design Tokens (TypeScript mirror)
 * --------------------------------------------------
 * The CSS theme in `globals.css` is the source of truth at runtime.
 * This file mirrors those tokens for use in TS (config, charts, JS-driven UI).
 * If you change a value here, change it in globals.css too — and vice-versa.
 */

export const colors = {
  paper: "#ffffff",
  canvas: "#fafaf7",
  surface: "#f4f3ee",
  mist: "#ececea",
  ink: "#111110",
  inkSoft: "#2c2c27",
  stone: {
    50: "#f7f7f5",
    100: "#ececea",
    200: "#d8d7d2",
    300: "#b8b7b1",
    400: "#8c8b85",
    500: "#65655f",
    600: "#45453f",
    700: "#2c2c27",
    800: "#1a1a17",
  },
  accent: {
    clay: "#b06a3b",
    moss: "#4a5d3a",
    sky: "#c9d6db",
  },
  semantic: {
    success: "#2f6b3a",
    warning: "#b8860b",
    danger: "#a3382f",
    info: "#2d5a78",
  },
} as const;

export const radii = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "28px",
  pill: "999px",
} as const;

export const shadows = {
  xs: "0 1px 2px rgba(17, 17, 16, 0.04)",
  sm: "0 2px 6px rgba(17, 17, 16, 0.05)",
  md: "0 8px 24px rgba(17, 17, 16, 0.06)",
  lg: "0 18px 48px rgba(17, 17, 16, 0.08)",
  ring: "0 0 0 1px rgba(17, 17, 16, 0.06)",
} as const;

export const typography = {
  family: {
    sans: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    display: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    mono: 'var(--font-geist-mono), ui-monospace, Menlo, monospace',
  },
  scale: {
    xs: "0.75rem",
    sm: "0.8125rem",
    base: "0.9375rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.375rem",
    "2xl": "1.75rem",
    "3xl": "2.25rem",
    "4xl": "3rem",
    "5xl": "4rem",
    "6xl": "5.5rem",
    display: "7.5rem",
  },
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

export const motion = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  duration: { fast: "150ms", base: "220ms", slow: "420ms" },
} as const;

export const tokens = { colors, radii, shadows, typography, motion } as const;
export type Tokens = typeof tokens;
