import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cu-red": "#8A1020",
        "cu-red-dark": "#640B15",
        "cu-red-light": "#B91C35",
        "cu-bg": "#F5F6F8",
        "cu-border": "#E5E7EB",
        "cu-text": "#111827",
        "cu-muted": "#6B7280",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        "card-md": "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
