"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { updateTheme, type ThemePreference } from "@/lib/actions";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle({ defaultValue }: { defaultValue: ThemePreference }) {
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  function choose(next: ThemePreference) {
    if (next === value) return;
    setValue(next);
    applyTheme(next);
    startTransition(async () => {
      await updateTheme(next);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">Appearance</p>
        <p className="text-sm text-slate-500">
          Follow your device, or always use light or dark mode.
        </p>
      </div>
      <div
        role="radiogroup"
        aria-label="Appearance"
        className="inline-flex shrink-0 rounded-full bg-slate-100 p-1 dark:bg-white/10"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            disabled={isPending}
            onClick={() => choose(option.value)}
            className={clsx(
              "rounded-full px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50",
              value === option.value
                ? "bg-teal-600 text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  root.dataset.themePref = theme;
  const isDark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}
