import { CategoryBadge } from "@/components/CategoryBadge";
import { EntryFormModal } from "@/components/EntryFormModal";
import { formatGBP } from "@/lib/format";
import type { PlainCategory, PlainEntry } from "@/lib/serialize";

export function EntryRow({
  entry,
  monthId,
  categories,
}: {
  entry: PlainEntry;
  monthId: string;
  categories: PlainCategory[];
}) {
  return (
    <EntryFormModal
      monthId={monthId}
      categories={categories}
      entry={entry}
      trigger={
        <div className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-teal-50/70 dark:hover:bg-white/5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-medium">{entry.name}</span>
              {entry.category && (
                <CategoryBadge name={entry.category.name} color={entry.category.color} />
              )}
              {entry.account && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                  {entry.account}
                </span>
              )}
            </div>
            {entry.notes && (
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                {entry.notes}
              </p>
            )}
          </div>
          <span className="shrink-0 font-semibold tabular-nums">{formatGBP(entry.amount)}</span>
        </div>
      }
    />
  );
}
