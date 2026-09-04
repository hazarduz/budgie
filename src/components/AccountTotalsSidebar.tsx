import { formatGBP } from "@/lib/format";

export function AccountTotalsSidebar({ totals }: { totals: [string, number][] }) {
  if (totals.length === 0) return null;

  const grandTotal = totals.reduce((sum, [, amount]) => sum + amount, 0);

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <section className="card p-4 sm:p-5">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
          Transfer To
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Outgoings tagged to each account this month.
        </p>
        <div className="mt-4 divide-y divide-[var(--border)]">
          {totals.map(([account, amount]) => (
            <div key={account} className="flex items-center justify-between gap-3 py-2.5">
              <span className="min-w-0 truncate font-medium">{account}</span>
              <span className="shrink-0 font-semibold tabular-nums">{formatGBP(amount)}</span>
            </div>
          ))}
        </div>
        {totals.length > 1 && (
          <div className="mt-2 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-2.5 text-sm">
            <span className="font-semibold text-slate-500">Total</span>
            <span className="font-bold tabular-nums">{formatGBP(grandTotal)}</span>
          </div>
        )}
      </section>
    </aside>
  );
}
