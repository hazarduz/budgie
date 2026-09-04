"use client";

import { useState, useTransition, type ReactNode } from "react";
import { EntryType } from "@prisma/client";
import { createEntry, deleteEntry, updateEntry } from "@/lib/actions";
import type { PlainCategory, PlainEntry } from "@/lib/serialize";

export function EntryFormModal({
  monthId,
  categories,
  defaultType = EntryType.DEBIT,
  entry,
  trigger,
}: {
  monthId: string;
  categories: PlainCategory[];
  defaultType?: EntryType;
  entry?: PlainEntry;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(entry);

  function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const amount = Number(formData.get("amount"));
    const type = formData.get("type") as EntryType;
    const categoryId = String(formData.get("categoryId") ?? "") || null;
    const account = String(formData.get("account") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!name || !Number.isFinite(amount)) return;

    startTransition(async () => {
      if (isEdit && entry) {
        await updateEntry(entry.id, { name, amount, type, categoryId, account, notes });
      } else {
        await createEntry({ monthId, name, amount, type, categoryId, account, notes });
      }
      setOpen(false);
    });
  }

  function handleDelete() {
    if (!entry) return;
    if (!confirm(`Delete "${entry.name}"?`)) return;
    startTransition(async () => {
      await deleteEntry(entry.id);
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
          <div
            className="card w-full max-w-md p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">
              {isEdit ? "Edit entry" : "Add entry"}
            </h2>
            <form action={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={entry?.name}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="e.g. Rent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="mb-1 block text-xs font-medium text-slate-500">Type</label>
                  <select
                    name="type"
                    defaultValue={entry?.type ?? defaultType}
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value={EntryType.DEBIT}>Monthly debit</option>
                    <option value={EntryType.PLANNED}>Planned spend</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={entry?.categoryId ?? ""}
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="">None</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Account (optional)
                  </label>
                  <input
                    name="account"
                    defaultValue={entry?.account ?? ""}
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                    placeholder="e.g. Joint, Gem"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={entry?.notes ?? ""}
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="e.g. 5 of 27, Hotel Exmouth"
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
