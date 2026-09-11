import { CategoryBadge } from "@/components/CategoryBadge";
import { EntryFormModal } from "@/components/EntryFormModal";
import { EntryIcon } from "@/components/EntryIcon";
import { formatGBP } from "@/lib/format";
import type { PlainAccount, PlainCategory, PlainEntry } from "@/lib/serialize";

function EntryRowContent({ entry, showIcon }: { entry: PlainEntry; showIcon: boolean }) {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left">
      <div className="flex min-w-0 items-center gap-2.5">
        {showIcon && <EntryIcon name={entry.name} />}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{entry.name}</span>
            {entry.category && (
              <CategoryBadge name={entry.category.name} color={entry.category.color} />
            )}
            {entry.account && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10 dark:text-slate-300">
                {entry.account.name}
              </span>
            )}
          </div>
          {entry.notes && (
            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              {entry.notes}
            </p>
          )}
        </div>
      </div>
      <span className="shrink-0 font-semibold tabular-nums">{formatGBP(entry.amount)}</span>
    </div>
  );
}

export function EntryRow({
  entry,
  monthId,
  categories,
  accounts,
  showIcon = true,
  interactive = true,
}: {
  entry: PlainEntry;
  monthId: string;
  categories: PlainCategory[];
  accounts: PlainAccount[];
  showIcon?: boolean;
  // Set to false while the list is in reorder mode, so dragging a row
  // doesn't also open its edit modal.
  interactive?: boolean;
}) {
  if (!interactive) {
    return <EntryRowContent entry={entry} showIcon={showIcon} />;
  }

  return (
    <EntryFormModal
      monthId={monthId}
      categories={categories}
      accounts={accounts}
      entry={entry}
      trigger={
        <div className="cursor-pointer rounded-lg transition-colors hover:bg-teal-50/70 dark:hover:bg-white/5">
          <EntryRowContent entry={entry} showIcon={showIcon} />
        </div>
      }
    />
  );
}
