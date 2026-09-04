import { getShowEntryIcons, getTheme } from "@/lib/actions";
import { EntryIconsToggle } from "@/components/EntryIconsToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export const dynamic = "force-dynamic";

export default async function PreferencesPage() {
  const [showEntryIcons, theme] = await Promise.all([getShowEntryIcons(), getTheme()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Preferences</h1>
        <p className="mt-1 text-sm text-slate-500">Personal display settings for your account.</p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold tracking-wide text-slate-500 uppercase">
          Display
        </h2>
        <div className="card space-y-4 p-4 sm:p-5">
          <ThemeToggle defaultValue={theme} />
          <div className="border-t border-[var(--border)] pt-4">
            <EntryIconsToggle defaultValue={showEntryIcons} />
          </div>
        </div>
      </div>
    </div>
  );
}
