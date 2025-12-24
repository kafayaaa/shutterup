"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <FaSun className="h-5 w-5 dark:hidden text-cyan-500" />
      <FaMoon className="h-5 w-5 hidden dark:block text-cyan-500" />
    </button>
  );
}
