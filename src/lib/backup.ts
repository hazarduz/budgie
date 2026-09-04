import type { Role, EntryType, DebtDirection, Theme } from "@prisma/client";

// Bumped whenever the shape below changes in a way that breaks restoring an
// older export.
export const BACKUP_VERSION = 1;

export interface BackupUser {
  id: string;
  username: string;
  passwordHash: string;
  role: Role;
  showEntryIcons: boolean;
  theme: Theme;
  avatar: string | null;
  createdAt: string;
}

export interface BackupCategory {
  id: string;
  userId: string;
  name: string;
  color: string;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface BackupAccount {
  id: string;
  userId: string;
  name: string;
  color: string;
  sortOrder: number;
  createdAt: string;
}

export interface BackupMonth {
  id: string;
  userId: string;
  year: number;
  month: number;
  startWith: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackupEntry {
  id: string;
  monthId: string;
  seriesId: string;
  name: string;
  amount: number;
  type: EntryType;
  categoryId: string | null;
  accountId: string | null;
  notes: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackupChristmasSettings {
  id: string;
  userId: string;
  budget: number;
}

export interface BackupChristmasEntry {
  id: string;
  userId: string;
  recipient: string;
  item: string;
  amount: number;
  purchased: boolean;
  notes: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackupDebt {
  id: string;
  userId: string;
  direction: DebtDirection;
  name: string;
  category: string | null;
  amount: number;
  monthlyPayment: number | null;
  endDate: string | null;
  settled: boolean;
  notes: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackupData {
  app: "budgie";
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  users: BackupUser[];
  categories: BackupCategory[];
  accounts: BackupAccount[];
  months: BackupMonth[];
  entries: BackupEntry[];
  christmasSettings: BackupChristmasSettings[];
  christmasEntries: BackupChristmasEntry[];
  debts: BackupDebt[];
}

// A structural check, not full schema validation — this file format is only
// ever produced by Budgie's own export and consumed by an admin restoring
// it, not an untrusted public input.
export function isValidBackup(data: unknown): data is BackupData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    d.app === "budgie" &&
    d.version === BACKUP_VERSION &&
    Array.isArray(d.users) &&
    Array.isArray(d.categories) &&
    Array.isArray(d.accounts) &&
    Array.isArray(d.months) &&
    Array.isArray(d.entries) &&
    Array.isArray(d.christmasSettings) &&
    Array.isArray(d.christmasEntries) &&
    Array.isArray(d.debts)
  );
}
