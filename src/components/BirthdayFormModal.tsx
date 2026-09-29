"use client";

import { useState, useTransition, type ReactNode } from "react";
import { createBirthday, deleteBirthday, updateBirthday } from "@/lib/actions";
import type { PlainBirthday } from "@/lib/serialize";

export function BirthdayFormModal({
  birthday,
  trigger,
}: {
  birthday?: PlainBirthday;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(birthday);

  function handleSubmit(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const dateOfBirth = String(formData.get("dateOfBirth") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim() || null;

    if (!name || !dateOfBirth) return;

    startTransition(async () => {
      if (isEdit && birthday) {
        await updateBirthday(birthday.id, { name, dateOfBirth, notes });
      } else {
        await createBirthday({ name, dateOfBirth, notes });
      }
      setOpen(false);
    });
  }

  function handleDelete() {
    if (!birthday) return;
    if (!confirm(`Delete "${birthday.name}"?`)) return;
    startTransition(async () => {
      await deleteBirthday(birthday.id);
      setOpen(false);
    });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="contents">
        {trigger}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div className="card w-full max-w-md p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold">{isEdit ? "Edit birthday" : "Add birthday"}</h2>
            <form action={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
                <input
                  name="name"
                  required
                  autoFocus
                  defaultValue={birthday?.name}
                  placeholder="e.g. Mum"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Date of birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  required
                  defaultValue={birthday?.dateOfBirth ? birthday.dateOfBirth.slice(0, 10) : ""}
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={birthday?.notes ?? ""}
                  rows={2}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  {isEdit && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                  >
                    {isPending ? "Saving…" : isEdit ? "Save" : "Add"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
