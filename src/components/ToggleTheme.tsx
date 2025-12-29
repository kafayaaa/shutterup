"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-200 hover:dark:bg-zinc-700 transition-colors duration-200 ease-out"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <FaSun className="h-5 w-5 dark:hidden text-teal-500" />
      <FaMoon className="h-5 w-5 hidden dark:block text-teal-500" />
    </button>
  );
}
