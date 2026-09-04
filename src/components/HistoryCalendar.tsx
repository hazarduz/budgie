"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { monthNames, monthSlug } from "@/lib/months";
import { formatGBP } from "@/lib/format";

export interface MonthSummaryData {
  slug: string;
  year: number;
  month: number;
  remainAfterSpends: number;
  entryCount: number;
}

export function HistoryCalendar({
  years,
  summaries,
  defaultYear,
}: {
  years: number[];
  summaries: MonthSummaryData[];
  defaultYear: number;
}) {
  const [year, setYear] = useState(defaultYear);
  const bySlug = useMemo(() => {
    const map = new Map<string, MonthSummaryData>();
    for (const s of summaries) map.set(s.slug, s);
    return map;
  }, [summaries]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              y === year
                ? "bg-teal-600 text-white shadow-sm"
                : "border border-[var(--border)] text-slate-600 hover:bg-teal-50 dark:text-slate-300 dark:hover:bg-white/5"
            )}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {monthNames().map((name, idx) => {
          const m = idx + 1;
          const slug = monthSlug({ year, month: m });
          const data = bySlug.get(slug);
          const exists = Boolean(data);
          return (
            <Link
              key={slug}
              href={`/months/${slug}`}
              className={clsx(
                "card flex flex-col gap-1 p-4 transition-transform hover:-translate-y-0.5 hover:shadow-md",
                !exists && "opacity-50"
              )}
            >
              <span className="text-sm font-semibold">{name}</span>
              {exists ? (
                <span
                  className={clsx(
                    "text-lg font-bold tabular-nums",
                    data!.remainAfterSpends < 0 ? "text-red-500" : "text-emerald-600"
                  )}
                >
                  {formatGBP(data!.remainAfterSpends)}
                </span>
              ) : (
                <span className="text-sm text-slate-400">Not set up</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
