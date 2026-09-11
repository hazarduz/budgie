"use client";

import { useState, useTransition } from "react";
import { reorderMasterBills } from "@/lib/actions";
import { MasterBillFormModal } from "@/components/MasterBillFormModal";
import { MasterBillRow } from "@/components/MasterBillRow";
import { SortableList } from "@/components/SortableList";
import type { PlainAccount, PlainCategory, PlainMasterBill } from "@/lib/serialize";

export function MasterBillManager({
  bills,
  categories,
  accounts,
  showIcon,
}: {
  bills: PlainMasterBill[];
  categories: PlainCategory[];
  accounts: PlainAccount[];
  showIcon: boolean;
}) {
  const [reordering, setReordering] = useState(false);
  const [, startTransition] = useTransition();

  function handleReorder(orderedIds: string[]) {
    startTransition(async () => {
      await reorderMasterBills(orderedIds);
    });
  }

  return (
    <section className="card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
          Recurring bills
        </h2>
        <div className="flex items-center gap-2">
          {bills.length > 1 && (
            <button
              type="button"
              onClick={() => setReordering((r) => !r)}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {reordering ? "Done" : "Reorder"}
            </button>
          )}
          <MasterBillFormModal
            categories={categories}
            accounts={accounts}
            trigger={
              <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                + Add bill
              </span>
            }
          />
        </div>
      </div>
      {bills.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          No recurring bills yet — add Rent, Council Tax, and the rest here so new months fill
          themselves in.
        </p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          <SortableList
            items={bills}
            reordering={reordering}
            onReorder={handleReorder}
            renderItem={(bill) => (
              <MasterBillRow
                bill={bill}
                categories={categories}
                accounts={accounts}
                showIcon={showIcon}
                interactive={!reordering}
              />
            )}
          />
        </div>
      )}
    </section>
  );
}
