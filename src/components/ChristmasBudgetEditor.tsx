"use client";

import { useState, useTransition } from "react";
import { updateChristmasBudget } from "@/lib/actions";
import { formatGBP } from "@/lib/format";

export function ChristmasBudgetEditor({ value }: { value: number }) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(value.toString());
  const [isPending, startTransition] = useTransition();

  function save() {
    const num = Number(amount);
    if (!Number.isFinite(num)) {
      setEditing(false);
      return;
    }
    startTransition(async () => {
      await updateChristmasBudget(num);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.01"
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="w-32 rounded-lg border border-white/40 bg-white/20 px-2 py-1 text-lg font-bold text-white outline-none placeholder:text-white/60"
        />
        <button
          onClick={save}
          disabled={isPending}
          className="rounded-lg bg-white/20 px-2.5 py-1 text-sm font-semibold text-white hover:bg-white/30"
        >
          {isPending ? "…" : "Save"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setAmount(value.toString());
        setEditing(true);
      }}
      className="text-lg font-bold tabular-nums underline decoration-white/40 decoration-dashed underline-offset-4 hover:decoration-white"
      title="Click to edit"
    >
      {formatGBP(value)}
    </button>
  );
}
