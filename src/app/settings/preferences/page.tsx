import { getShowEntryIcons } from "@/lib/actions";
import { EntryIconsToggle } from "@/components/EntryIconsToggle";

export const dynamic = "force-dynamic";

export default async function PreferencesPage() {
  const showEntryIcons = await getShowEntryIcons();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Preferences</h1>
        <p className="mt-1 text-sm text-slate-500">Personal display settings for your account.</p>
      </div>
      <div className="card p-4 sm:p-5">
        <EntryIconsToggle defaultValue={showEntryIcons} />
      </div>
    </div>
  );
}
