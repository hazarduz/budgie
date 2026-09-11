import { notFound } from "next/navigation";
import clsx from "clsx";
import { getMonth, listCategories, listAccounts, getShowEntryIcons } from "@/lib/actions";
import { parseMonthSlug } from "@/lib/months";
import { serializeAccount, serializeCategory, serializeEntry } from "@/lib/serialize";
import { EntryType } from "@prisma/client";
import { MonthNav } from "@/components/MonthNav";
import { CreateMonthPrompt } from "@/components/CreateMonthPrompt";
import { StatBar } from "@/components/StatBar";
import { StartWithEditor } from "@/components/StartWithEditor";
import { EntryListSection } from "@/components/EntryListSection";
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
    return (
      <div className="space-y-6">
        <MonthNav current={key} />
        <CreateMonthPrompt monthKey={key} />
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

          <EntryListSection
            monthId={month.id}
            title="Monthly Debits"
            addLabel="+ Add debit"
            emptyLabel="No monthly debits yet."
            defaultType={EntryType.DEBIT}
            entries={debits}
            categories={categories}
            accounts={accounts}
            showIcon={showEntryIcons}
          />

          <StatBar label="Total Left After Monthly Debits" amount={leftAfterDebits} color="green" />

          <EntryListSection
            monthId={month.id}
            title="Planned Spend"
            addLabel="+ Add planned spend"
            emptyLabel="No planned spend yet."
            defaultType={EntryType.PLANNED}
            entries={planned}
            categories={categories}
            accounts={accounts}
            showIcon={showEntryIcons}
          />

          <StatBar label="Total Remain After Spends" amount={remainAfterSpends} color="purple" />
        </div>

        <AccountTotalsSidebar totals={[...accountTotals.entries()]} />
      </div>
    </div>
  );
}
