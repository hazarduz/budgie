"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { EntryType } from "@prisma/client";
import { createEntry, deleteEntry, updateEntry } from "@/lib/actions";
import type { PlainAccount, PlainCategory, PlainEntry } from "@/lib/serialize";

export function EntryFormModal({
  monthId,
  categories,
  accounts,
  defaultType = EntryType.DEBIT,
  entry,
  trigger,
}: {
  monthId: string;
  categories: PlainCategory[];
  accounts: PlainAccount[];
  defaultType?: EntryType;
  entry?: PlainEntry;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(entry);

  function submit(applyToFuture: boolean) {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const name = String(formData.get("name") ?? "").trim();
    const amount = Number(formData.get("amount"));
    const type = formData.get("type") as EntryType;
    const categoryId = String(formData.get("categoryId") ?? "") || null;
    const accountId = String(formData.get("accountId") ?? "") || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!name || !Number.isFinite(amount)) return;

    startTransition(async () => {
      if (isEdit && entry) {
        await updateEntry(entry.id, { name, amount, type, categoryId, accountId, notes }, applyToFuture);
      } else {
        await createEntry({ monthId, name, amount, type, categoryId, accountId, notes });
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
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                submit(false);
              }}
              className="space-y-3"
            >
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
                    Account
                  </label>
                  <select
                    name="accountId"
                    defaultValue={entry?.accountId ?? ""}
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value="">None</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
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
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  {isEdit ? (
                    <>
                      <button
                        type="button"
                        onClick={() => submit(false)}
                        disabled={isPending}
                        title="Only update this month's entry"
                        className="rounded-lg border border-teal-600 px-3 py-1.5 text-sm font-semibold text-teal-700 hover:bg-teal-50 disabled:opacity-50 dark:text-teal-300 dark:hover:bg-teal-900/30"
                      >
                        {isPending ? "Saving…" : "Save this month"}
                      </button>
                      <button
                        type="button"
                        onClick={() => submit(true)}
                        disabled={isPending}
                        title="Also update this same debit in every later month, leaving past months untouched"
                        className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                      >
                        {isPending ? "Saving…" : "Save + future months"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      disabled={isPending}
                      className="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                    >
                      {isPending ? "Saving…" : "Add"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
