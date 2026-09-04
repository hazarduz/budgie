import { getDashboardData, getDashboardFilterOptions, type DashboardFilters as Filters } from "@/lib/actions";
import { currentMonthKey, shortMonthLabel } from "@/lib/months";
import { formatGBP } from "@/lib/format";
import { DashboardFilters } from "@/components/DashboardFilters";
import { StatTile } from "@/components/StatTile";
import { TrendChart, type TrendPoint } from "@/components/dashboard/TrendChart";
import { BreakdownChart, type BreakdownItem } from "@/components/dashboard/BreakdownChart";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

const UNTAGGED_COLOR = "#94a3b8";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const yearParam = typeof sp.year === "string" ? sp.year : String(currentMonthKey().year);
  const monthParam = typeof sp.month === "string" ? sp.month : "all";

  const filters: Filters = {
    year: yearParam === "all" ? null : Number(yearParam),
    month: monthParam === "all" ? null : Number(monthParam),
    categoryIds: toArray(sp.category),
    accountIds: toArray(sp.account),
  };

  const [options, data] = await Promise.all([getDashboardFilterOptions(), getDashboardData(filters)]);

  const years = Array.from(new Set([currentMonthKey().year, ...options.years])).sort((a, b) => b - a);

  const multiYear = filters.year === null;
  const trend: TrendPoint[] = data.trend.map((t) => ({
    label: multiYear ? `${shortMonthLabel({ year: t.year, month: t.month })} ${t.year}` : shortMonthLabel({ year: t.year, month: t.month }),
    startWith: t.startWith,
    outgoings: t.outgoings,
    remaining: t.remaining,
  }));

  const categoryBreakdown: BreakdownItem[] = data.categoryBreakdown.map((c) => ({
    name: c.name,
    color: c.color,
    total: c.total,
  }));
  if (data.uncategorizedTotal > 0) {
    categoryBreakdown.push({ name: "Uncategorized", color: UNTAGGED_COLOR, total: data.uncategorizedTotal });
  }
  categoryBreakdown.sort((a, b) => b.total - a.total);

  const accountBreakdown: BreakdownItem[] = data.accountBreakdown.map((a) => ({
    name: a.name,
    color: a.color,
    total: a.total,
  }));
  if (data.untaggedTotal > 0) {
    accountBreakdown.push({ name: "No account", color: UNTAGGED_COLOR, total: data.untaggedTotal });
  }
  accountBreakdown.sort((a, b) => b.total - a.total);

  const isFiltered = filters.categoryIds.length > 0 || filters.accountIds.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Trends across your months — filter by year, month, category, or account.
        </p>
      </div>

      <DashboardFilters
        years={years}
        categories={options.categories}
        accounts={options.accounts}
        selectedYear={filters.year}
        selectedMonth={filters.month}
        selectedCategoryIds={filters.categoryIds}
        selectedAccountIds={filters.accountIds}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total outgoings" value={formatGBP(data.totals.outgoings)} />
        <StatTile label="Total start with" value={formatGBP(data.totals.incomings)} />
        <StatTile
          label="Net"
          value={formatGBP(data.totals.net)}
          tone={data.totals.net >= 0 ? "positive" : "negative"}
        />
        <StatTile
          label="Avg. monthly outgoings"
          value={formatGBP(data.totals.avgMonthlySpend)}
        />
      </div>

      <section className="card p-4 sm:p-5">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Monthly trend</h2>
        {isFiltered && (
          <p className="mt-0.5 text-xs text-slate-500">
            Outgoings and Remaining reflect your category/account filters; Start With always shows the
            whole month.
          </p>
        )}
        <div className="mt-3">
          <TrendChart data={trend} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-4 sm:p-5">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">By category</h2>
          <div className="mt-3">
            <BreakdownChart data={categoryBreakdown} emptyLabel="No categorised spend in this range." />
          </div>
        </section>
        <section className="card p-4 sm:p-5">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">By account</h2>
          <div className="mt-3">
            <BreakdownChart data={accountBreakdown} emptyLabel="No account-tagged spend in this range." />
          </div>
        </section>
      </div>
    </div>
  );
}
