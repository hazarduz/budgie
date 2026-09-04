import { verifySession } from "@/lib/dal";
import { SettingsTabs } from "@/components/SettingsTabs";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  const links = [
    { href: "/settings/categories", label: "Categories" },
    { href: "/settings/accounts", label: "Accounts" },
    { href: "/settings/preferences", label: "Preferences" },
  ];
  if (session.role === "ADMIN") {
    links.push({ href: "/settings/users", label: "Users" });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Settings</p>
        <div className="mt-2 border-b border-[var(--border)] pb-3">
          <SettingsTabs links={links} />
        </div>
      </div>
      {children}
    </div>
  );
}
