"use client";

import { useRef, useState, useTransition, type ReactNode } from "react";
import { createMasterBill, deleteMasterBill, updateMasterBill } from "@/lib/actions";
import type { PlainAccount, PlainCategory, PlainMasterBill } from "@/lib/serialize";

export function MasterBillFormModal({
  categories,
  accounts,
  bill,
  trigger,
}: {
  categories: PlainCategory[];
  accounts: PlainAccount[];
  bill?: PlainMasterBill;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(bill);

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const name = String(formData.get("name") ?? "").trim();
    const amount = Number(formData.get("amount"));
    const categoryId = String(formData.get("categoryId") ?? "") || null;
    const accountId = String(formData.get("accountId") ?? "") || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;
    const active = formData.get("active") === "on";

    if (!name || !Number.isFinite(amount)) return;

    startTransition(async () => {
      if (isEdit && bill) {
        await updateMasterBill(bill.id, { name, amount, categoryId, accountId, notes, active });
      } else {
        await createMasterBill({ name, amount, categoryId, accountId, notes });
      }
      setOpen(false);
    });
  }

  function handleDelete() {
    if (!bill) return;
    if (!confirm(`Delete "${bill.name}" from your Master bills? Months already created keep their own copy.`))
      return;
    startTransition(async () => {
      await deleteMasterBill(bill.id);
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
            <h2 className="mb-4 text-lg font-semibold">{isEdit ? "Edit bill" : "Add bill"}</h2>
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="space-y-3"
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={bill?.name}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="e.g. Rent"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Amount (£)</label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={bill?.amount}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
                  <select
                    name="categoryId"
                    defaultValue={bill?.categoryId ?? ""}
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
                  <label className="mb-1 block text-xs font-medium text-slate-500">Account</label>
                  <select
                    name="accountId"
                    defaultValue={bill?.accountId ?? ""}
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
                  defaultValue={bill?.notes ?? ""}
                  rows={2}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </div>

              {isEdit && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={bill?.active ?? true} />
                  Include in new months
                </label>
              )}

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
