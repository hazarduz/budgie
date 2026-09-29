import { listBirthdays } from "@/lib/actions";
import { serializeBirthday } from "@/lib/serialize";
import { BirthdayManager } from "@/components/BirthdayManager";

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

      <BirthdayManager birthdays={birthdays} />
    </div>
  );
}
