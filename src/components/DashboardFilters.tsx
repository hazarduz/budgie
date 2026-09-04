import type { Account, Category } from "@prisma/client";
import { monthNames } from "@/lib/months";

export function DashboardFilters({
  years,
  categories,
  accounts,
  selectedYear,
  selectedMonth,
  selectedCategoryIds,
  selectedAccountIds,
}: {
  years: number[];
  categories: Category[];
  accounts: Account[];
  selectedYear: number | null;
  selectedMonth: number | null;
  selectedCategoryIds: string[];
  selectedAccountIds: string[];
}) {
  return (
    <form method="get" action="/dashboard" className="card space-y-4 p-4 sm:p-5">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Year</label>
          <select
            name="year"
            defaultValue={selectedYear === null ? "all" : String(selectedYear)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-teal-500"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Month</label>
          <select
            name="month"
            defaultValue={selectedMonth === null ? "all" : String(selectedMonth)}
            className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-teal-500"
          >
            <option value="all">All months</option>
            {monthNames().map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Categories</label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <label
                key={c.id}
                className="cursor-pointer select-none rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-slate-600 transition-colors has-checked:border-transparent has-checked:bg-teal-600 has-checked:text-white dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  name="category"
                  value={c.id}
                  defaultChecked={selectedCategoryIds.includes(c.id)}
                  className="hidden"
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {accounts.length > 0 && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Accounts</label>
          <div className="flex flex-wrap gap-1.5">
            {accounts.map((a) => (
              <label
                key={a.id}
                className="cursor-pointer select-none rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-slate-600 transition-colors has-checked:border-transparent has-checked:bg-teal-600 has-checked:text-white dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  name="account"
                  value={a.id}
                  defaultChecked={selectedAccountIds.includes(a.id)}
                  className="hidden"
                />
                {a.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Apply filters
        </button>
        <a href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          Clear filters
        </a>
      </div>
    </form>
  );
}
