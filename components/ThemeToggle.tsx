"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4 text-stone-600 dark:text-stone-400" />
      ) : (
        <Sun className="w-4 h-4 text-stone-400" />
      )}
    </button>
  );
}
