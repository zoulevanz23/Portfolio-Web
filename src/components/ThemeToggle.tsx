"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ fullWidth = false }: { fullWidth?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`flex border border-border ${fullWidth ? "w-full" : ""}`}
      role="group"
      aria-label="Theme selection"
    >
      <button
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label="Dark mode"
        className={`${fullWidth ? "flex-1" : ""} px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
          theme === "dark"
            ? "bg-accent text-accent-fg"
            : "text-muted hover:text-foreground"
        }`}
      >
        Dark
      </button>
      <button
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label="Light mode"
        className={`${fullWidth ? "flex-1" : ""} border-l border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
          theme === "light"
            ? "bg-accent text-accent-fg"
            : "text-muted hover:text-foreground"
        }`}
      >
        Light
      </button>
    </div>
  );
}
