"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { addMonths, type MonthKey } from "@/lib/months";
import { EntryType, type Prisma } from "@prisma/client";

// ---------- Months ----------

export async function getMonth(year: number, month: number) {
  return prisma.month.findUnique({
    where: { year_month: { year, month } },
    include: {
      entries: {
        include: { category: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function findPreviousMonthWithEntries(key: MonthKey) {
  const months = await prisma.month.findMany({
    where: {
      OR: buildBeforeClauses(key),
    },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: { entries: true },
    take: 12,
  });
  return months.find((m) => m.entries.length > 0) ?? null;
}

function buildBeforeClauses(key: MonthKey) {
  // Any month strictly before `key`.
  return [
    { year: { lt: key.year } },
    { year: key.year, month: { lt: key.month } },
  ];
}

function monthPath(year: number, month: number) {
  return `/months/${year}-${String(month).padStart(2, "0")}`;
}

export async function createMonth(
  year: number,
  month: number,
  options: { copyFromPrevious: boolean }
) {
  const existing = await prisma.month.findUnique({
    where: { year_month: { year, month } },
  });
  if (existing) {
    return { id: existing.id, year: existing.year, month: existing.month };
  }

  let entriesToCopy: Prisma.EntryUncheckedCreateWithoutMonthInput[] = [];

  if (options.copyFromPrevious) {
    const source = await findPreviousMonthWithEntries({ year, month });
    if (source) {
      entriesToCopy = source.entries
        .filter((e) => e.type === EntryType.DEBIT)
        .map((e) => ({
          name: e.name,
          amount: e.amount,
          type: e.type,
          categoryId: e.categoryId,
          account: e.account,
          sortOrder: e.sortOrder,
        }));
    }
  }

  const created = await prisma.month.create({
    data: {
      year,
      month,
      startWith: 0,
      entries: { create: entriesToCopy },
    },
  });

  revalidatePath("/history");
  revalidatePath(monthPath(year, month));
  return { id: created.id, year: created.year, month: created.month };
}

export async function updateMonthStartWith(monthId: string, startWith: number) {
  const updated = await prisma.month.update({ where: { id: monthId }, data: { startWith } });
  revalidatePath("/history");
  revalidatePath("/");
  revalidatePath(monthPath(updated.year, updated.month));
}

export async function listMonthSummaries() {
  const months = await prisma.month.findMany({
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: { entries: true },
  });
  return months.map((m) => {
    const debits = m.entries
      .filter((e) => e.type === EntryType.DEBIT)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const planned = m.entries
      .filter((e) => e.type === EntryType.PLANNED)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const startWith = Number(m.startWith);
    return {
      id: m.id,
      year: m.year,
      month: m.month,
      startWith,
      totalDebits: debits,
      totalPlanned: planned,
      leftAfterDebits: startWith - debits,
      remainAfterSpends: startWith - debits - planned,
      entryCount: m.entries.length,
    };
  });
}

// ---------- Entries ----------

export async function createEntry(input: {
  monthId: string;
  name: string;
  amount: number;
  type: EntryType;
  categoryId?: string | null;
  account?: string | null;
  notes?: string | null;
}) {
  const entry = await prisma.entry.create({
    data: {
      monthId: input.monthId,
      name: input.name,
      amount: input.amount,
      type: input.type,
      categoryId: input.categoryId || null,
      account: input.account || null,
      notes: input.notes || null,
    },
    include: { month: { select: { year: true, month: true } } },
  });
  revalidatePath("/history");
  revalidatePath("/");
  revalidatePath(monthPath(entry.month.year, entry.month.month));
}

export async function updateEntry(
  entryId: string,
  input: {
    name: string;
    amount: number;
    type: EntryType;
    categoryId?: string | null;
    account?: string | null;
    notes?: string | null;
  }
) {
  const entry = await prisma.entry.update({
    where: { id: entryId },
    data: {
      name: input.name,
      amount: input.amount,
      type: input.type,
      categoryId: input.categoryId || null,
      account: input.account || null,
      notes: input.notes || null,
    },
    include: { month: { select: { year: true, month: true } } },
  });
  revalidatePath("/history");
  revalidatePath("/");
  revalidatePath(monthPath(entry.month.year, entry.month.month));
}

export async function deleteEntry(entryId: string) {
  const entry = await prisma.entry.delete({
    where: { id: entryId },
    include: { month: { select: { year: true, month: true } } },
  });
  revalidatePath("/history");
  revalidatePath("/");
  revalidatePath(monthPath(entry.month.year, entry.month.month));
}

// ---------- Categories ----------

export async function listCategories() {
  return prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function createCategory(name: string, color: string) {
  await prisma.category.create({ data: { name, color } });
  revalidatePath("/settings/categories");
  revalidatePath("/");
}

export async function updateCategory(id: string, name: string, color: string) {
  await prisma.category.update({ where: { id }, data: { name, color } });
  revalidatePath("/settings/categories");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/settings/categories");
  revalidatePath("/");
}

// ---------- Christmas ----------

export async function getChristmasSettings() {
  const settings = await prisma.christmasSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, budget: 250 },
  });
  return settings;
}

export async function updateChristmasBudget(budget: number) {
  await prisma.christmasSettings.upsert({
    where: { id: 1 },
    update: { budget },
    create: { id: 1, budget },
  });
  revalidatePath("/christmas");
}

export async function listChristmasEntries() {
  return prisma.christmasEntry.findMany({
    orderBy: [{ purchased: "asc" }, { createdAt: "desc" }],
  });
}

export async function createChristmasEntry(input: {
  recipient: string;
  item: string;
  amount: number;
  notes?: string | null;
}) {
  await prisma.christmasEntry.create({
    data: {
      recipient: input.recipient,
      item: input.item,
      amount: input.amount,
      notes: input.notes || null,
    },
  });
  revalidatePath("/christmas");
}

export async function updateChristmasEntry(
  id: string,
  input: { recipient: string; item: string; amount: number; notes?: string | null }
) {
  await prisma.christmasEntry.update({
    where: { id },
    data: {
      recipient: input.recipient,
      item: input.item,
      amount: input.amount,
      notes: input.notes || null,
    },
  });
  revalidatePath("/christmas");
}

export async function toggleChristmasPurchased(id: string, purchased: boolean) {
  await prisma.christmasEntry.update({ where: { id }, data: { purchased } });
  revalidatePath("/christmas");
}

export async function deleteChristmasEntry(id: string) {
  await prisma.christmasEntry.delete({ where: { id } });
  revalidatePath("/christmas");
}

export { addMonths };
