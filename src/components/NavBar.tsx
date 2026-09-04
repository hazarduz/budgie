import Link from "next/link";
import { BudgieLogo } from "@/components/BudgieLogo";
import { currentMonthKey, monthSlug } from "@/lib/months";
import { NavLinks } from "@/components/NavLinks";
import { getOptionalSession } from "@/lib/dal";
import { LogoutButton } from "@/components/LogoutButton";

export async function NavBar() {
  const session = await getOptionalSession();
  const currentSlug = monthSlug(currentMonthKey());

  const links = [
    { href: `/months/${currentSlug}`, label: "This Month" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "History" },
    { href: "/christmas", label: "Christmas" },
    { href: "/debts", label: "Debts" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <BudgieLogo className="h-9 w-9" />
          <span className="text-lg font-semibold tracking-tight text-teal-900 dark:text-teal-100">
            Budgie
          </span>
        </Link>
        {session && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <NavLinks links={links} />
            <div className="flex items-center gap-2 border-l border-[var(--border)] pl-4 text-sm">
              <span className="text-slate-500">{session.username}</span>
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
