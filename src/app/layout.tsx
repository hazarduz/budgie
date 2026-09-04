import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { getTheme } from "@/lib/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budgie — Personal Budget Tracker",
  description: "Keep your monthly budget, spending history, and Christmas fund on track.",
};

// Resolves "system" against the browser's OS preference before first paint,
// so there's no flash of the wrong theme. Explicit Light/Dark preferences
// are already resolved server-side (see the `dark` class below) and this
// script is then a no-op for them.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    if (document.documentElement.dataset.themePref === "system") {
      var isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getTheme();

  return (
    <html
      lang="en"
      data-theme-pref={theme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <NavBar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] py-4 text-center text-xs text-slate-400">
          Budgie · self-hosted budget tracker
        </footer>
      </body>
    </html>
  );
}
