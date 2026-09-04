import Link from "next/link";
import { addMonths, monthLabel, monthSlug, type MonthKey } from "@/lib/months";

export function MonthNav({ current }: { current: MonthKey }) {
  const prev = addMonths(current, -1);
  const next = addMonths(current, 1);

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`/months/${monthSlug(prev)}`}
        className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-teal-50 dark:text-slate-300 dark:hover:bg-white/5"
      >
        ← {monthLabel(prev)}
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">{monthLabel(current)}</h1>
      <Link
        href={`/months/${monthSlug(next)}`}
        className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-teal-50 dark:text-slate-300 dark:hover:bg-white/5"
      >
        {monthLabel(next)} →
      </Link>
    </div>
  );
}
