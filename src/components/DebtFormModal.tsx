"use client";

import { useState, useTransition, type ReactNode } from "react";
import { DebtDirection } from "@prisma/client";
import { createDebt, deleteDebt, updateDebt } from "@/lib/actions";
import type { PlainDebt } from "@/lib/serialize";

export function DebtFormModal({
  defaultDirection = DebtDirection.I_OWE,
  debt,
  trigger,
}: {
  defaultDirection?: DebtDirection;
  debt?: PlainDebt;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(debt);

  function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const direction = formData.get("direction") as DebtDirection;
    const category = String(formData.get("category") ?? "").trim() || null;
    const amount = Number(formData.get("amount"));
    const monthlyPaymentRaw = String(formData.get("monthlyPayment") ?? "").trim();
    const monthlyPayment = monthlyPaymentRaw ? Number(monthlyPaymentRaw) : null;
    const endDate = String(formData.get("endDate") ?? "").trim() || null;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!name || !Number.isFinite(amount)) return;

    startTransition(async () => {
      if (isEdit && debt) {
        await updateDebt(debt.id, { direction, name, category, amount, monthlyPayment, endDate, notes });
      } else {
        await createDebt({ direction, name, category, amount, monthlyPayment, endDate, notes });
      }
      setOpen(false);
    });
  }

  function handleDelete() {
    if (!debt) return;
    if (!confirm(`Delete "${debt.name}"?`)) return;
    startTransition(async () => {
      await deleteDebt(debt.id);
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
            <h2 className="mb-4 text-lg font-semibold">{isEdit ? "Edit" : "Add"}</h2>
            <form action={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Direction</label>
                  <select
                    name="direction"
                    defaultValue={debt?.direction ?? defaultDirection}
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  >
                    <option value={DebtDirection.I_OWE}>I owe this</option>
                    <option value={DebtDirection.OWED_TO_ME}>Owed to me</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
                  <input
                    name="category"
                    defaultValue={debt?.category ?? ""}
                    placeholder="e.g. Credit card"
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
                <input
                  name="name"
                  required
                  defaultValue={debt?.name}
                  placeholder="e.g. Barclaycard, EE - iPhone contract, Dave"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Amount (£)</label>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={debt?.amount}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Monthly payment (£)
                  </label>
                  <input
                    name="monthlyPayment"
                    type="number"
                    step="0.01"
                    defaultValue={debt?.monthlyPayment ?? ""}
                    placeholder="Optional"
                    className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Ends / paid off by
                </label>
                <input
                  name="endDate"
                  type="date"
                  defaultValue={debt?.endDate ? debt.endDate.slice(0, 10) : ""}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={debt?.notes ?? ""}
                  rows={2}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
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
