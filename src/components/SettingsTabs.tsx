"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function SettingsTabs({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "whitespace-nowrap rounded-full px-2.5 py-1.5 font-medium transition-colors sm:px-3",
              active
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-teal-900/40 dark:hover:text-teal-100"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
