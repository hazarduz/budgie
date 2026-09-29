"use client";

import { useMemo, useState } from "react";
import { BirthdayFormModal } from "@/components/BirthdayFormModal";
import { BirthdayRow } from "@/components/BirthdayRow";
import type { PlainBirthday } from "@/lib/serialize";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "date-asc"
  | "date-desc"
  | "age-asc"
  | "age-desc";

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Name (A–Z)",
  "name-desc": "Name (Z–A)",
  "date-asc": "Date of birth (oldest first)",
  "date-desc": "Date of birth (newest first)",
  "age-asc": "Age (youngest first)",
  "age-desc": "Age (oldest first)",
};

function sortBirthdays(birthdays: PlainBirthday[], sort: SortOption): PlainBirthday[] {
  const sorted = [...birthdays];
  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "date-asc":
      return sorted.sort((a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth));
    case "date-desc":
      return sorted.sort((a, b) => b.dateOfBirth.localeCompare(a.dateOfBirth));
    case "age-asc":
      return sorted.sort((a, b) => a.age - b.age);
    case "age-desc":
      return sorted.sort((a, b) => b.age - a.age);
  }
}

export function BirthdayManager({ birthdays }: { birthdays: PlainBirthday[] }) {
  const [sort, setSort] = useState<SortOption>("date-asc");
  const sorted = useMemo(() => sortBirthdays(birthdays, sort), [birthdays, sort]);

  return (
    <section className="card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">People</h2>
        <div className="flex items-center gap-2">
          {birthdays.length > 1 && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort by"
              className="rounded-full border border-[var(--border)] bg-transparent px-3 py-1 text-xs font-medium text-slate-600 outline-none focus:border-teal-500 dark:text-slate-300"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
          )}
          <BirthdayFormModal
            trigger={
              <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                + Add birthday
              </span>
            }
          />
        </div>
      </div>
      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">No birthdays added yet.</p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {sorted.map((birthday) => (
            <BirthdayRow key={birthday.id} birthday={birthday} />
          ))}
        </div>
      )}
    </section>
  );
}
