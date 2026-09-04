import { notFound } from "next/navigation";
import clsx from "clsx";
import {
  getMonth,
  findPreviousMonthWithEntries,
  listCategories,
  listAccounts,
  getShowEntryIcons,
} from "@/lib/actions";
import { parseMonthSlug } from "@/lib/months";
import { serializeAccount, serializeCategory, serializeEntry } from "@/lib/serialize";
import { EntryType } from "@prisma/client";
import { MonthNav } from "@/components/MonthNav";
import { CreateMonthPrompt } from "@/components/CreateMonthPrompt";
import { StatBar } from "@/components/StatBar";
import { StartWithEditor } from "@/components/StartWithEditor";
import { EntryRow } from "@/components/EntryRow";
import { EntryFormModal } from "@/components/EntryFormModal";
import { AccountTotalsSidebar } from "@/components/AccountTotalsSidebar";

export default async function MonthPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = parseMonthSlug(slug);
  if (!key) notFound();

  const [month, categoriesRaw, accountsRaw, showEntryIcons] = await Promise.all([
    getMonth(key.year, key.month),
    listCategories(),
    listAccounts(),
    getShowEntryIcons(),
  ]);
  const categories = categoriesRaw.map(serializeCategory);
  const accounts = accountsRaw.map(serializeAccount);

  if (!month) {
    const previous = await findPreviousMonthWithEntries(key);
    return (
      <div className="space-y-6">
        <MonthNav current={key} />
        <CreateMonthPrompt monthKey={key} hasPrevious={Boolean(previous)} />
      </div>
    );
  }

  const entries = month.entries.map(serializeEntry);
  const debits = entries.filter((e) => e.type === EntryType.DEBIT);
  const planned = entries.filter((e) => e.type === EntryType.PLANNED);
  const startWith = Number(month.startWith);
  const totalDebits = debits.reduce((sum, e) => sum + e.amount, 0);
  const totalPlanned = planned.reduce((sum, e) => sum + e.amount, 0);
  const leftAfterDebits = startWith - totalDebits;
  const remainAfterSpends = leftAfterDebits - totalPlanned;

  const accountTotals = new Map<string, number>();
  for (const e of entries) {
    if (e.account) {
      accountTotals.set(e.account.name, (accountTotals.get(e.account.name) ?? 0) + e.amount);
    }
  }

  return (
    <div className="space-y-6">
      <MonthNav current={key} />

      <div
        className={clsx(
          "grid gap-6",
          accountTotals.size > 0 && "lg:grid-cols-[minmax(0,1fr)_260px]"
        )}
      >
        <div className="min-w-0 space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-white shadow-sm">
            <span className="font-semibold tracking-wide">Start With</span>
            <StartWithEditor monthId={month.id} value={startWith} />
          </div>

          <section className="card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Monthly Debits
              </h2>
              <EntryFormModal
                monthId={month.id}
                categories={categories}
                accounts={accounts}
                defaultType={EntryType.DEBIT}
                trigger={
                  <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                    + Add debit
                  </span>
                }
              />
            </div>
            {debits.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No monthly debits yet.</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {debits.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} monthId={month.id} categories={categories} accounts={accounts} showIcon={showEntryIcons} />
                ))}
              </div>
            )}
          </section>

          <StatBar label="Total Left After Monthly Debits" amount={leftAfterDebits} color="green" />

          <section className="card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Planned Spend
              </h2>
              <EntryFormModal
                monthId={month.id}
                categories={categories}
                accounts={accounts}
                defaultType={EntryType.PLANNED}
                trigger={
                  <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                    + Add planned spend
                  </span>
                }
              />
            </div>
            {planned.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No planned spend yet.</p>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {planned.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} monthId={month.id} categories={categories} accounts={accounts} showIcon={showEntryIcons} />
                ))}
              </div>
            )}
          </section>

          <StatBar label="Total Remain After Spends" amount={remainAfterSpends} color="purple" />
        </div>

        <AccountTotalsSidebar totals={[...accountTotals.entries()]} />
      </div>
    </div>
  );
}
