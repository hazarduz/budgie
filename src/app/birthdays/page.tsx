import { listBirthdays } from "@/lib/actions";
import { serializeBirthday } from "@/lib/serialize";
import { BirthdayFormModal } from "@/components/BirthdayFormModal";
import { BirthdayRow } from "@/components/BirthdayRow";

export const dynamic = "force-dynamic";

export default async function BirthdaysPage() {
  const birthdaysRaw = await listBirthdays();
  const birthdays = birthdaysRaw.map(serializeBirthday);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎂</span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Birthdays</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Everyone&apos;s date of birth, with their age worked out for you.
          </p>
        </div>
      </div>

      <section className="card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">People</h2>
          <BirthdayFormModal
            trigger={
              <span className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-700">
                + Add birthday
              </span>
            }
          />
        </div>
        {birthdays.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No birthdays added yet.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {birthdays.map((birthday) => (
              <BirthdayRow key={birthday.id} birthday={birthday} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
