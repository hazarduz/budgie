"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  createChristmasEntry,
  deleteChristmasEntry,
  updateChristmasEntry,
} from "@/lib/actions";
import type { PlainChristmasEntry } from "@/lib/serialize";

export function ChristmasEntryFormModal({
  entry,
  trigger,
}: {
  entry?: PlainChristmasEntry;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(entry);

  function handleSubmit(formData: FormData) {
    const recipient = String(formData.get("recipient") ?? "").trim();
    const item = String(formData.get("item") ?? "").trim();
    const amount = Number(formData.get("amount"));
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!recipient || !item || !Number.isFinite(amount)) return;

    startTransition(async () => {
      if (isEdit && entry) {
        await updateChristmasEntry(entry.id, { recipient, item, amount, notes });
      } else {
        await createChristmasEntry({ recipient, item, amount, notes });
      }
      setOpen(false);
    });
  }

  function handleDelete() {
    if (!entry) return;
    if (!confirm(`Delete "${entry.item}"?`)) return;
    startTransition(async () => {
      await deleteChristmasEntry(entry.id);
      setOpen(false);
    });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="contents">
        {trigger}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div className="card w-full max-w-md p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold">{isEdit ? "Edit gift" : "Add gift"}</h2>
            <form action={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Recipient
                </label>
                <input
                  name="recipient"
                  required
                  defaultValue={entry?.recipient}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="e.g. Mum"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Gift</label>
                <input
                  name="item"
                  required
                  defaultValue={entry?.item}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="e.g. Scarf"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Amount (£)
                </label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={entry?.amount}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={entry?.notes ?? ""}
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="Optional"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  {isEdit && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                  >
                    {isPending ? "Saving…" : isEdit ? "Save" : "Add"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
