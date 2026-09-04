import { requireAdmin } from "@/lib/dal";
import { RestoreBackupForm } from "@/components/RestoreBackupForm";

export const dynamic = "force-dynamic";

export default async function SettingsBackupPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backup</h1>
        <p className="mt-1 text-sm text-slate-500">
          Back up or restore all of Budgie&apos;s data — every user&apos;s months, categories,
          accounts, debts, and Christmas lists.
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Export
        </h2>
        <div className="card space-y-3 p-4 sm:p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Download a single JSON file with everything currently in Budgie. Keep it somewhere
            safe — it includes login credentials (as hashed passwords), so treat it like a
            database backup.
          </p>
          <a
            href="/api/backup"
            className="inline-block rounded-full bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Download backup
          </a>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Restore
        </h2>
        <div className="card space-y-3 p-4 sm:p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Restoring replaces everything currently in Budgie with the contents of the backup
            file — every user, month, and setting. This can&apos;t be undone, and you&apos;ll be
            signed out afterwards so you can log back in with the restored accounts.
          </p>
          <RestoreBackupForm />
        </div>
      </div>
    </div>
  );
}
