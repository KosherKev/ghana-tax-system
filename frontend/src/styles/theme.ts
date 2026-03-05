/**
 * CU design token constants for use in TypeScript/TSX.
 * Keep in sync with globals.css and tailwind.config.ts.
 */

export const colors = {
  cuRed: "#8A1020",
  cuRedDark: "#640B15",
  cuRedLight: "#B91C35",
  cuWhite: "#FFFFFF",
  cuBg: "#F5F6F8",
  cuBorder: "#E5E7EB",
  cuText: "#111827",
  cuMuted: "#6B7280",
} as const;

export const spacing = {
  cardPadding: "1.5rem",
  sectionGap: "2rem",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;
