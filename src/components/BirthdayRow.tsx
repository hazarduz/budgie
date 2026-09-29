import { BirthdayFormModal } from "@/components/BirthdayFormModal";
import { formatDDMMYYYY } from "@/lib/format";
import type { PlainBirthday } from "@/lib/serialize";

function isToday(dateOfBirth: string) {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  return dob.getUTCMonth() === now.getUTCMonth() && dob.getUTCDate() === now.getUTCDate();
}

export function BirthdayRow({ birthday }: { birthday: PlainBirthday }) {
  return (
    <BirthdayFormModal
      birthday={birthday}
      trigger={
        <div className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-teal-50/70 dark:hover:bg-white/5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl" aria-hidden>
                🎂
              </span>
              <span className="truncate font-medium">{birthday.name}</span>
              {isToday(birthday.dateOfBirth) && (
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                  Today!
                </span>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-slate-500 dark:text-slate-400">
              <span>{formatDDMMYYYY(new Date(birthday.dateOfBirth))}</span>
              {birthday.notes && <span className="truncate">{birthday.notes}</span>}
            </div>
          </div>
          <span className="shrink-0 font-semibold tabular-nums">
            {birthday.age} {birthday.age === 1 ? "year" : "years"}
          </span>
        </div>
      }
    />
  );
}
