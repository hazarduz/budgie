"use client";

import { useActionState } from "react";
import { changeOwnPassword, type ChangePasswordState } from "@/lib/actions";

const initialState: ChangePasswordState = {};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changeOwnPassword, initialState);

  return (
    <form action={formAction} className="space-y-3" key={state?.success ? "done" : "form"}>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Current password</label>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">New password</label>
        <input
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
        <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Confirm new password</label>
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
      </div>
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm font-medium text-teal-600">Password updated.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
