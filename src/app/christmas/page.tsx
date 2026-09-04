import { getChristmasSettings, listChristmasEntries } from "@/lib/actions";
import { serializeChristmasEntry } from "@/lib/serialize";
import { ChristmasBudgetEditor } from "@/components/ChristmasBudgetEditor";
import { ChristmasEntryFormModal } from "@/components/ChristmasEntryFormModal";
import { ChristmasEntryRow } from "@/components/ChristmasEntryRow";
import { StatBar } from "@/components/StatBar";

export const dynamic = "force-dynamic";

export default async function ChristmasPage() {
  const [settings, entriesRaw] = await Promise.all([
    getChristmasSettings(),
    listChristmasEntries(),
  ]);
  const entries = entriesRaw.map(serializeChristmasEntry);
  const budget = Number(settings.budget);

  const spent = entries.filter((e) => e.purchased).reduce((sum, e) => sum + e.amount, 0);
  const toBuy = entries.filter((e) => !e.purchased).reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - spent;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎄</span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Christmas</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Gifts bought throughout the year, tracked against your budget.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-red-700 px-4 py-3 text-white shadow-sm">
        <span className="font-semibold tracking-wide">Christmas Budget</span>
        <ChristmasBudgetEditor value={budget} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatBar label="Spent so far" amount={spent} color="green" />
        <StatBar label="Remaining budget" amount={remaining} color="purple" />
      </div>

      {toBuy > 0 && (
        <p className="text-sm text-slate-500">
          Plus <span className="font-semibold">{toBuy.toFixed(2)}</span> planned for gifts not yet bought.
        </p>
      )}

      <section className="card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Gift list</h2>
          <ChristmasEntryFormModal
            trigger={
              <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                + Add gift
              </span>
            }
          />
        </div>
        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No gifts added yet.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {entries.map((entry) => (
              <ChristmasEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
