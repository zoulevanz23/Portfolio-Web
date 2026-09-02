import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        surface: "var(--bg-elevated)",
        "surface-muted": "var(--bg-muted)",
        "surface-subtle": "var(--bg-subtle)",
        border: "var(--border)",
        "border-muted": "var(--border-muted)",
        foreground: "var(--text)",
        muted: "var(--text-muted)",
        subtle: "var(--text-subtle)",
        accent: "var(--accent)",
        "accent-fg": "var(--accent-fg)",
        status: {
          passed: "#4A7C59",
          warning: "#8B7355",
          critical: "#8B4545",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
