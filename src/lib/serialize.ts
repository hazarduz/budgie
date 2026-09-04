import type { Account, Category, ChristmasEntry, Debt, DebtDirection, Entry, EntryType } from "@prisma/client";

export interface PlainCategory {
  id: string;
  name: string;
  color: string;
}

export interface PlainAccount {
  id: string;
  name: string;
  color: string;
}

export interface PlainEntry {
  id: string;
  monthId: string;
  name: string;
  amount: number;
  type: EntryType;
  categoryId: string | null;
  category: PlainCategory | null;
  accountId: string | null;
  account: PlainAccount | null;
  notes: string | null;
}

export interface PlainChristmasEntry {
  id: string;
  recipient: string;
  item: string;
  amount: number;
  purchased: boolean;
  notes: string | null;
}

export function serializeEntry(
  entry: Entry & { category: Category | null; account: Account | null }
): PlainEntry {
  return {
    id: entry.id,
    monthId: entry.monthId,
    name: entry.name,
    amount: Number(entry.amount),
    type: entry.type,
    categoryId: entry.categoryId,
    category: entry.category
      ? { id: entry.category.id, name: entry.category.name, color: entry.category.color }
      : null,
    accountId: entry.accountId,
    account: entry.account
      ? { id: entry.account.id, name: entry.account.name, color: entry.account.color }
      : null,
    notes: entry.notes,
  };
}

export function serializeCategory(category: Category): PlainCategory {
  return { id: category.id, name: category.name, color: category.color };
}

export function serializeAccount(account: Account): PlainAccount {
  return { id: account.id, name: account.name, color: account.color };
}

export function serializeChristmasEntry(entry: ChristmasEntry): PlainChristmasEntry {
  return {
    id: entry.id,
    recipient: entry.recipient,
    item: entry.item,
    amount: Number(entry.amount),
    purchased: entry.purchased,
    notes: entry.notes,
  };
}

export interface PlainDebt {
  id: string;
  direction: DebtDirection;
  name: string;
  category: string | null;
  amount: number;
  monthlyPayment: number | null;
  endDate: string | null;
  settled: boolean;
  notes: string | null;
}

export function serializeDebt(debt: Debt): PlainDebt {
  return {
    id: debt.id,
    direction: debt.direction,
    name: debt.name,
    category: debt.category,
    amount: Number(debt.amount),
    monthlyPayment: debt.monthlyPayment === null ? null : Number(debt.monthlyPayment),
    endDate: debt.endDate ? debt.endDate.toISOString() : null,
    settled: debt.settled,
    notes: debt.notes,
  };
}
