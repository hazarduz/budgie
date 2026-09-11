"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMonth } from "@/lib/actions";
import { monthLabel, type MonthKey } from "@/lib/months";

export function CreateMonthPrompt({ monthKey }: { monthKey: MonthKey }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function create(populateFromMaster: boolean) {
    startTransition(async () => {
      await createMonth(monthKey.year, monthKey.month, { populateFromMaster });
      router.refresh();
    });
  }

  return (
    <div className="card flex flex-col items-center gap-4 p-10 text-center">
      <p className="text-lg font-medium">
        {monthLabel(monthKey)} hasn&apos;t been set up yet.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => create(true)}
          disabled={isPending}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {isPending ? "Creating…" : "Create month"}
        </button>
        <button
          onClick={() => create(false)}
          disabled={isPending}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-teal-50 disabled:opacity-50 dark:hover:bg-white/5"
        >
          {isPending ? "Creating…" : "Create blank month"}
        </button>
      </div>
      <p className="max-w-sm text-xs text-slate-400">
        &ldquo;Create month&rdquo; fills in Monthly Debits from your{" "}
        <a href="/master" className="underline hover:text-slate-600 dark:hover:text-slate-300">
          Master bills
        </a>
        . &ldquo;Create blank month&rdquo; starts with nothing.
      </p>
    </div>
  );
}
