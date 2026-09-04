const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface MonthKey {
  year: number;
  month: number; // 1-12
}

export function monthSlug({ year, month }: MonthKey): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function parseMonthSlug(slug: string): MonthKey | null {
  const match = /^(\d{4})-(\d{2})$/.exec(slug);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return { year, month };
}

export function monthLabel({ year, month }: MonthKey): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export function shortMonthLabel({ month }: MonthKey): string {
  return MONTH_NAMES[month - 1].slice(0, 3);
}

export function currentMonthKey(): MonthKey {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function addMonths({ year, month }: MonthKey, delta: number): MonthKey {
  const total = (year * 12 + (month - 1)) + delta;
  const newYear = Math.floor(total / 12);
  const newMonth = (total % 12) + 1;
  return { year: newYear, month: newMonth };
}

export function monthNames(): string[] {
  return MONTH_NAMES;
}
