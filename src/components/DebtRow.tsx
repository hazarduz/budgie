"use client";

import { useTransition } from "react";
import clsx from "clsx";
import { toggleDebtSettled } from "@/lib/actions";
import { formatGBP } from "@/lib/format";
import { DebtFormModal } from "@/components/DebtFormModal";
import type { PlainDebt } from "@/lib/serialize";

function isEndingThisYear(endDate: string | null) {
  if (!endDate) return false;
  return new Date(endDate).getFullYear() === new Date().getFullYear();
}

export function DebtRow({ debt }: { debt: PlainDebt }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 px-1 py-2.5">
      <input
        type="checkbox"
        checked={debt.settled}
        disabled={isPending}
        onChange={(e) =>
          startTransition(async () => {
            await toggleDebtSettled(debt.id, e.target.checked);
          })
        }
        className="h-4 w-4 shrink-0 rounded accent-teal-600"
        title={debt.direction === "I_OWE" ? "Paid off" : "Repaid"}
      />
      <DebtFormModal
        debt={debt}
        trigger={
          <div className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-teal-50/70 dark:hover:bg-white/5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={clsx(
                    "truncate font-medium",
                    debt.settled && "text-slate-400 line-through"
                  )}
                >
                  {debt.name}
                </span>
                {debt.category && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                    {debt.category}
                  </span>
                )}
                {!debt.settled && isEndingThisYear(debt.endDate) && (
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                    This year!
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                {debt.monthlyPayment !== null && <span>{formatGBP(debt.monthlyPayment)}/mo</span>}
                {debt.endDate && (
                  <span>Ends {new Date(debt.endDate).toLocaleDateString("en-GB")}</span>
                )}
                {debt.notes && <span className="truncate">{debt.notes}</span>}
              </div>
            </div>
            <span
              className={clsx(
                "shrink-0 font-semibold tabular-nums",
                debt.direction === "OWED_TO_ME" ? "text-emerald-600" : "text-slate-900 dark:text-slate-100"
              )}
            >
              {formatGBP(debt.amount)}
            </span>
          </div>
        }
      />
    </div>
  );
}
