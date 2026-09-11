import {
  listMasterBills,
  listCategories,
  listAccounts,
  getShowEntryIcons,
} from "@/lib/actions";
import { serializeAccount, serializeCategory, serializeMasterBill } from "@/lib/serialize";
import { MasterBillManager } from "@/components/MasterBillManager";
import { formatGBP } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MasterPage() {
  const [billsRaw, categoriesRaw, accountsRaw, showEntryIcons] = await Promise.all([
    listMasterBills(),
    listCategories(),
    listAccounts(),
    getShowEntryIcons(),
  ]);

  const bills = billsRaw.map(serializeMasterBill);
  const categories = categoriesRaw.map(serializeCategory);
  const accounts = accountsRaw.map(serializeAccount);
  const activeTotal = bills.filter((b) => b.active).reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Master</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your recurring monthly debits — Rent, Council Tax, and the rest. New months you create
          fill in their Monthly Debits from whatever&apos;s active here. Changing a bill only
          affects months created afterwards; months you&apos;ve already set up keep their own
          amounts, editable as usual.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-white shadow-sm">
        <span className="font-semibold tracking-wide">Active bills total</span>
        <span className="font-semibold tabular-nums">{formatGBP(activeTotal)}</span>
      </div>

      <MasterBillManager
        bills={bills}
        categories={categories}
        accounts={accounts}
        showIcon={showEntryIcons}
      />
    </div>
  );
}
