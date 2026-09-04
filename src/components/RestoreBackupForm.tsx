"use client";

import { useActionState } from "react";
import { restoreBackup, type RestoreState } from "@/lib/actions";

const initialState: RestoreState = {};

export function RestoreBackupForm() {
  const [state, formAction, pending] = useActionState(restoreBackup, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Backup file</label>
        <input
          type="file"
          name="file"
          accept="application/json"
          required
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 dark:text-slate-300 dark:file:bg-white/10 dark:file:text-slate-200"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input type="checkbox" name="confirm" className="mt-0.5" required />
        I understand this replaces all existing data for every user and can&apos;t be undone.
      </label>
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {pending ? "Restoring…" : "Restore backup"}
      </button>
    </form>
  );
}
