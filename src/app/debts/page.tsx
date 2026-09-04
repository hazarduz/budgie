import { listDebts } from "@/lib/actions";
import { serializeDebt } from "@/lib/serialize";
import { DebtDirection } from "@prisma/client";
import { DebtFormModal } from "@/components/DebtFormModal";
import { DebtRow } from "@/components/DebtRow";
import { StatBar } from "@/components/StatBar";

export const dynamic = "force-dynamic";

export default async function DebtsPage() {
  const debtsRaw = await listDebts();
  const debts = debtsRaw.map(serializeDebt);

  const iOwe = debts.filter((d) => d.direction === DebtDirection.I_OWE);
  const owedToMe = debts.filter((d) => d.direction === DebtDirection.OWED_TO_ME);

  const totalIOwe = iOwe.filter((d) => !d.settled).reduce((sum, d) => sum + d.amount, 0);
  const totalOwedToMe = owedToMe.filter((d) => !d.settled).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Debts</h1>
        <p className="mt-1 text-sm text-slate-500">
          Phone contracts, credit cards, store cards, and money owed between you and other
          people.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <StatBar label="Total you owe" amount={totalIOwe} color="amber" />
        <StatBar label="Total owed to you" amount={totalOwedToMe} color="green" />
      </div>

      <section className="card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
            What you owe
          </h2>
          <DebtFormModal
            defaultDirection={DebtDirection.I_OWE}
            trigger={
              <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                + Add
              </span>
            }
          />
        </div>
        {iOwe.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Nothing logged yet.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {iOwe.map((debt) => (
              <DebtRow key={debt.id} debt={debt} />
            ))}
          </div>
        )}
      </section>

      <section className="card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">
            Owed to you
          </h2>
          <DebtFormModal
            defaultDirection={DebtDirection.OWED_TO_ME}
            trigger={
              <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                + Add
              </span>
            }
          />
        </div>
        {owedToMe.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">Nothing logged yet.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {owedToMe.map((debt) => (
              <DebtRow key={debt.id} debt={debt} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
