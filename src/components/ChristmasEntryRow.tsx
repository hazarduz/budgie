"use client";

import { useTransition } from "react";
import clsx from "clsx";
import { toggleChristmasPurchased } from "@/lib/actions";
import { formatGBP } from "@/lib/format";
import { ChristmasEntryFormModal } from "@/components/ChristmasEntryFormModal";
import type { PlainChristmasEntry } from "@/lib/serialize";

export function ChristmasEntryRow({ entry }: { entry: PlainChristmasEntry }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 px-1 py-2.5">
      <input
        type="checkbox"
        checked={entry.purchased}
        disabled={isPending}
        onChange={(e) =>
          startTransition(async () => {
            await toggleChristmasPurchased(entry.id, e.target.checked);
          })
        }
        className="h-4 w-4 shrink-0 rounded accent-teal-600"
      />
      <ChristmasEntryFormModal
        entry={entry}
        trigger={
          <div className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-teal-50/70 dark:hover:bg-white/5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <span
                  className={clsx(
                    "truncate font-medium",
                    entry.purchased && "text-slate-400 line-through"
                  )}
                >
                  {entry.item}
                </span>
                <span className="text-xs text-slate-500">for {entry.recipient}</span>
              </div>
              {entry.notes && (
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {entry.notes}
                </p>
              )}
            </div>
            <span className="shrink-0 font-semibold tabular-nums">{formatGBP(entry.amount)}</span>
          </div>
        }
      />
    </div>
  );
}
