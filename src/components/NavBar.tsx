import Link from "next/link";
import { BudgieLogo } from "@/components/BudgieLogo";
import { currentMonthKey, monthSlug } from "@/lib/months";
import { NavLinks } from "@/components/NavLinks";

export function NavBar() {
  const currentSlug = monthSlug(currentMonthKey());

  const links = [
    { href: `/months/${currentSlug}`, label: "This Month" },
    { href: "/history", label: "History" },
    { href: "/christmas", label: "Christmas" },
    { href: "/settings/categories", label: "Categories" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <BudgieLogo className="h-9 w-9" />
          <span className="text-lg font-semibold tracking-tight text-teal-900 dark:text-teal-100">
            Budgie
          </span>
        </Link>
        <NavLinks links={links} />
      </div>
    </header>
  );
}
