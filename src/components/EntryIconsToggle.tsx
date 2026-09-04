"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { updateShowEntryIcons } from "@/lib/actions";

export function EntryIconsToggle({ defaultValue }: { defaultValue: boolean }) {
  const [checked, setChecked] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !checked;
    setChecked(next);
    startTransition(async () => {
      await updateShowEntryIcons(next);
    });
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">Show entry icons</p>
        <p className="text-sm text-slate-500">
          Show a little icon next to each monthly debit and planned spend, guessed from its name
          (e.g. a house for &ldquo;Rent&rdquo;, a phone for &ldquo;O2&rdquo;).
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={toggle}
        disabled={isPending}
        className={clsx(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
          checked ? "bg-teal-600" : "bg-slate-300 dark:bg-white/15"
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-[20px]"
          )}
        />
      </button>
    </div>
  );
}
