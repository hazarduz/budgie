import { listMonthSummaries } from "@/lib/actions";
import { currentMonthKey, monthLabel, monthSlug } from "@/lib/months";
import { HistoryCalendar, type MonthSummaryData } from "@/components/HistoryCalendar";
import { formatGBP } from "@/lib/format";
import Link from "next/link";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const summaries = await listMonthSummaries();
  const data: MonthSummaryData[] = summaries.map((s) => ({
    slug: monthSlug(s),
    year: s.year,
    month: s.month,
    remainAfterSpends: s.remainAfterSpends,
    entryCount: s.entryCount,
  }));

  const nowYear = currentMonthKey().year;
  const years = Array.from(new Set([nowYear, ...summaries.map((s) => s.year)])).sort(
    (a, b) => b - a
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-slate-500">
          Browse every month by year, or scan the full list below.
        </p>
      </div>

      <HistoryCalendar years={years} summaries={data} defaultYear={nowYear} />

      {summaries.length > 0 && (
        <section className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)] text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Month</th>
                <th className="px-4 py-2.5 font-medium text-right">Start</th>
                <th className="px-4 py-2.5 font-medium text-right">Debits</th>
                <th className="px-4 py-2.5 font-medium text-right">Planned</th>
                <th className="px-4 py-2.5 font-medium text-right">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {summaries.map((s) => (
                <tr key={s.id} className="hover:bg-teal-50/60 dark:hover:bg-white/5">
                  <td className="px-4 py-2.5">
                    <Link href={`/months/${monthSlug(s)}`} className="font-medium hover:underline">
                      {monthLabel(s)}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatGBP(s.startWith)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatGBP(s.totalDebits)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatGBP(s.totalPlanned)}</td>
                  <td
                    className={clsx(
                      "px-4 py-2.5 text-right font-semibold tabular-nums",
                      s.remainAfterSpends < 0 ? "text-red-500" : "text-emerald-600"
                    )}
                  >
                    {formatGBP(s.remainAfterSpends)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
