import { listAccounts } from "@/lib/actions";
import { serializeAccount } from "@/lib/serialize";
import { AccountManager } from "@/components/AccountManager";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const accounts = (await listAccounts()).map(serializeAccount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tag entries with an account (e.g. Home, My Bills, Extra Spends) to see running
          totals per account on the monthly page.
        </p>
      </div>
      <AccountManager accounts={accounts} />
    </div>
  );
}
