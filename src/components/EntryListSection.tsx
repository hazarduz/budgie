"use client";

import { useState, useTransition } from "react";
import { EntryType } from "@prisma/client";
import { reorderEntries } from "@/lib/actions";
import { EntryFormModal } from "@/components/EntryFormModal";
import { EntryRow } from "@/components/EntryRow";
import { SortableList } from "@/components/SortableList";
import type { PlainAccount, PlainCategory, PlainEntry } from "@/lib/serialize";

export function EntryListSection({
  monthId,
  title,
  addLabel,
  emptyLabel,
  defaultType,
  entries,
  categories,
  accounts,
  showIcon,
}: {
  monthId: string;
  title: string;
  addLabel: string;
  emptyLabel: string;
  defaultType: EntryType;
  entries: PlainEntry[];
  categories: PlainCategory[];
  accounts: PlainAccount[];
  showIcon: boolean;
}) {
  const [reordering, setReordering] = useState(false);
  const [, startTransition] = useTransition();

  function handleReorder(orderedIds: string[]) {
    startTransition(async () => {
      await reorderEntries(monthId, orderedIds);
    });
  }

  return (
    <section className="card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
        <div className="flex items-center gap-2">
          {entries.length > 1 && (
            <button
              type="button"
              onClick={() => setReordering((r) => !r)}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {reordering ? "Done" : "Reorder"}
            </button>
          )}
          <EntryFormModal
            monthId={monthId}
            categories={categories}
            accounts={accounts}
            defaultType={defaultType}
            trigger={
              <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                {addLabel}
              </span>
            }
          />
        </div>
      </div>
      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          <SortableList
            items={entries}
            reordering={reordering}
            onReorder={handleReorder}
            renderItem={(entry) => (
              <EntryRow
                entry={entry}
                monthId={monthId}
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
