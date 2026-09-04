import type { Category, ChristmasEntry, Entry, EntryType } from "@prisma/client";

export interface PlainCategory {
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
  account: string | null;
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

export function serializeEntry(entry: Entry & { category: Category | null }): PlainEntry {
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
    account: entry.account,
    notes: entry.notes,
  };
}

export function serializeCategory(category: Category): PlainCategory {
  return { id: category.id, name: category.name, color: category.color };
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
