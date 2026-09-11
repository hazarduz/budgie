import clsx from "clsx";
import { CategoryBadge } from "@/components/CategoryBadge";
import { MasterBillFormModal } from "@/components/MasterBillFormModal";
import { EntryIcon } from "@/components/EntryIcon";
import { formatGBP } from "@/lib/format";
import type { PlainAccount, PlainCategory, PlainMasterBill } from "@/lib/serialize";

function MasterBillRowContent({ bill, showIcon }: { bill: PlainMasterBill; showIcon: boolean }) {
  return (
    <div
      className={clsx(
        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left",
        !bill.active && "opacity-50"
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {showIcon && <EntryIcon name={bill.name} />}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{bill.name}</span>
            {bill.category && <CategoryBadge name={bill.category.name} color={bill.category.color} />}
            {bill.account && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                {bill.account.name}
              </span>
            )}
            {!bill.active && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                Paused
              </span>
            )}
          </div>
          {bill.notes && (
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{bill.notes}</p>
          )}
        </div>
      </div>
      <span className="shrink-0 font-semibold tabular-nums">{formatGBP(bill.amount)}</span>
    </div>
  );
}

export function MasterBillRow({
  bill,
  categories,
  accounts,
  showIcon = true,
  interactive = true,
}: {
  bill: PlainMasterBill;
  categories: PlainCategory[];
  accounts: PlainAccount[];
  showIcon?: boolean;
  interactive?: boolean;
}) {
  if (!interactive) {
    return <MasterBillRowContent bill={bill} showIcon={showIcon} />;
  }

  return (
    <MasterBillFormModal
      categories={categories}
      accounts={accounts}
      bill={bill}
      trigger={
        <div className="cursor-pointer rounded-lg transition-colors hover:bg-teal-50/70 dark:hover:bg-white/5">
          <MasterBillRowContent bill={bill} showIcon={showIcon} />
        </div>
      }
    />
  );
}
