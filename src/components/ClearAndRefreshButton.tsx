"use client";

import { useState, useTransition } from "react";
import { clearAndRefreshMonth } from "@/lib/actions";

const CONFIRM_WORD = "REFRESH";

export function ClearAndRefreshButton({ monthId }: { monthId: string }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setConfirmText("");
  }

  function confirmClear() {
    if (confirmText !== CONFIRM_WORD) return;
    startTransition(async () => {
      await clearAndRefreshMonth(monthId);
      close();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
      >
        Clear and refresh
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={close}
        >
          <div className="card w-full max-w-sm p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-semibold">Clear and refresh this month?</h2>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
              This deletes every Monthly Debit and Planned Spend entry in this month, then
              refills Monthly Debits from your current{" "}
              <a href="/master" className="underline hover:text-slate-800 dark:hover:text-slate-100">
                Master
              </a>{" "}
              list. Start With is left as-is. This can&apos;t be undone.
            </p>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Type {CONFIRM_WORD} to confirm
            </label>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoFocus
              className="mb-4 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
              placeholder={CONFIRM_WORD}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClear}
                disabled={confirmText !== CONFIRM_WORD || isPending}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Clearing…" : "Clear and refresh"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
