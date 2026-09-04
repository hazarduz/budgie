"use client";

import { useTransition } from "react";
import { logout } from "@/lib/auth-actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="rounded-full px-2.5 py-1 font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:hover:bg-white/5 dark:hover:text-slate-100"
    >
      {isPending ? "…" : "Log out"}
    </button>
  );
}
