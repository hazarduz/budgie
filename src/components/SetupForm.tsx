"use client";

import { useState } from "react";
import { useActionState } from "react";
import { registerFirstAdmin, type LoginState } from "@/lib/auth-actions";
import { RestoreBackupForm } from "@/components/RestoreBackupForm";

const initialState: LoginState = {};

export function SetupForm() {
  const [state, formAction, pending] = useActionState(registerFirstAdmin, initialState);
  const [showRestore, setShowRestore] = useState(false);

  if (showRestore) {
    return (
      <div className="space-y-4">
        <RestoreBackupForm />
        <button
          type="button"
          onClick={() => setShowRestore(false)}
          className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          ← Create a new account instead
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Username</label>
          <input
            name="username"
            required
            autoFocus
            autoComplete="username"
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Password</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
          <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
        </div>
        {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create admin account"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => setShowRestore(true)}
        className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        Restore from a backup instead →
      </button>
    </div>
  );
}
