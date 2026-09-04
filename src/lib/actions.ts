"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { addMonths, type MonthKey } from "@/lib/months";
import { verifySession, requireAdmin } from "@/lib/dal";
import { provisionUserDefaults } from "@/lib/provision-user";
import { EntryType, Role, DebtDirection, type Prisma } from "@prisma/client";

// ---------- Months ----------

export async function getMonth(year: number, month: number) {
  const { userId } = await verifySession();
  return prisma.month.findUnique({
    where: { userId_year_month: { userId, year, month } },
    include: {
      entries: {
        include: { category: true, account: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
}

export async function findPreviousMonthWithEntries(key: MonthKey) {
  const { userId } = await verifySession();
  const months = await prisma.month.findMany({
    where: {
      userId,
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

function buildOnOrAfterClauses(key: MonthKey) {
  // `key`'s month, or any month after it.
  return [
    { year: { gt: key.year } },
    { year: key.year, month: { gte: key.month } },
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
  const { userId } = await verifySession();

  const existing = await prisma.month.findUnique({
    where: { userId_year_month: { userId, year, month } },
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
          seriesId: e.seriesId,
          name: e.name,
          amount: e.amount,
          type: e.type,
          categoryId: e.categoryId,
          accountId: e.accountId,
          notes: e.notes,
          sortOrder: e.sortOrder,
        }));
    }
  }

  const created = await prisma.month.create({
    data: {
      userId,
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
  const { userId } = await verifySession();
  const updated = await prisma.month.update({
    where: { id: monthId, userId },
    data: { startWith },
  });
  revalidatePath("/history");
  revalidatePath("/");
  revalidatePath(monthPath(updated.year, updated.month));
}

export async function listMonthSummaries() {
  const { userId } = await verifySession();
  const months = await prisma.month.findMany({
    where: { userId },
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

async function findOwnedEntry(userId: string, entryId: string) {
  return prisma.entry.findFirst({
    where: { id: entryId, month: { userId } },
    include: { month: { select: { year: true, month: true } } },
  });
}

export async function createEntry(input: {
  monthId: string;
  name: string;
  amount: number;
  type: EntryType;
  categoryId?: string | null;
  accountId?: string | null;
  notes?: string | null;
}) {
  const { userId } = await verifySession();

  const month = await prisma.month.findFirst({ where: { id: input.monthId, userId } });
  if (!month) throw new Error("Month not found.");

  if (input.categoryId) {
    const category = await prisma.category.findFirst({ where: { id: input.categoryId, userId } });
    if (!category) throw new Error("Category not found.");
  }
  if (input.accountId) {
    const account = await prisma.account.findFirst({ where: { id: input.accountId, userId } });
    if (!account) throw new Error("Account not found.");
  }

  const id = randomUUID();
  await prisma.entry.create({
    data: {
      id,
      seriesId: id,
      monthId: input.monthId,
      name: input.name,
      amount: input.amount,
      type: input.type,
      categoryId: input.categoryId || null,
      accountId: input.accountId || null,
      notes: input.notes || null,
    },
  });
  revalidatePath("/history");
  revalidatePath("/");
  revalidatePath(monthPath(month.year, month.month));
}

export async function updateEntry(
  entryId: string,
  input: {
    name: string;
    amount: number;
    type: EntryType;
    categoryId?: string | null;
    accountId?: string | null;
    notes?: string | null;
  },
  applyToFuture = false
) {
  const { userId } = await verifySession();
  const owned = await findOwnedEntry(userId, entryId);
  if (!owned) throw new Error("Entry not found.");

  if (input.categoryId) {
    const category = await prisma.category.findFirst({ where: { id: input.categoryId, userId } });
    if (!category) throw new Error("Category not found.");
  }
  if (input.accountId) {
    const account = await prisma.account.findFirst({ where: { id: input.accountId, userId } });
    if (!account) throw new Error("Account not found.");
  }

  const data = {
    name: input.name,
    amount: input.amount,
    type: input.type,
    categoryId: input.categoryId || null,
    accountId: input.accountId || null,
    notes: input.notes || null,
  };

  await prisma.entry.update({ where: { id: entryId }, data });

  const affectedMonths = new Set([monthPath(owned.month.year, owned.month.month)]);

  if (applyToFuture) {
    const futureSiblings = await prisma.entry.findMany({
      where: {
        seriesId: owned.seriesId,
        id: { not: entryId },
        month: {
          userId,
          OR: buildOnOrAfterClauses({ year: owned.month.year, month: owned.month.month }),
        },
      },
      select: { id: true, month: { select: { year: true, month: true } } },
    });

    if (futureSiblings.length > 0) {
      await prisma.entry.updateMany({
        where: { id: { in: futureSiblings.map((e) => e.id) } },
        data,
      });
      for (const sibling of futureSiblings) {
        affectedMonths.add(monthPath(sibling.month.year, sibling.month.month));
      }
    }
  }

  revalidatePath("/history");
  revalidatePath("/");
  for (const path of affectedMonths) revalidatePath(path);
}

export async function deleteEntry(entryId: string) {
  const { userId } = await verifySession();
  const owned = await findOwnedEntry(userId, entryId);
  if (!owned) throw new Error("Entry not found.");

  await prisma.entry.delete({ where: { id: entryId } });
  revalidatePath("/history");
  revalidatePath("/");
  revalidatePath(monthPath(owned.month.year, owned.month.month));
}

// ---------- Categories ----------

export async function listCategories() {
  const { userId } = await verifySession();
  return prisma.category.findMany({ where: { userId }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function createCategory(name: string, color: string) {
  const { userId } = await verifySession();
  await prisma.category.create({ data: { userId, name, color } });
  revalidatePath("/settings/categories");
  revalidatePath("/");
}

export async function updateCategory(id: string, name: string, color: string) {
  const { userId } = await verifySession();
  await prisma.category.update({ where: { id, userId }, data: { name, color } });
  revalidatePath("/settings/categories");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  const { userId } = await verifySession();
  await prisma.category.deleteMany({ where: { id, userId } });
  revalidatePath("/settings/categories");
  revalidatePath("/");
}

// ---------- Accounts ----------

export async function listAccounts() {
  const { userId } = await verifySession();
  return prisma.account.findMany({ where: { userId }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function createAccount(name: string, color: string) {
  const { userId } = await verifySession();
  await prisma.account.create({ data: { userId, name, color } });
  revalidatePath("/settings/accounts");
  revalidatePath("/history");
  revalidatePath("/");
}

export async function updateAccount(id: string, name: string, color: string) {
  const { userId } = await verifySession();
  await prisma.account.update({ where: { id, userId }, data: { name, color } });
  revalidatePath("/settings/accounts");
  revalidatePath("/history");
  revalidatePath("/");
}

export async function deleteAccount(id: string) {
  const { userId } = await verifySession();
  await prisma.account.deleteMany({ where: { id, userId } });
  revalidatePath("/settings/accounts");
  revalidatePath("/history");
  revalidatePath("/");
}

// ---------- Christmas ----------

export async function getChristmasSettings() {
  const { userId } = await verifySession();
  const settings = await prisma.christmasSettings.upsert({
    where: { userId },
    update: {},
    create: { userId, budget: 250 },
  });
  return settings;
}

export async function updateChristmasBudget(budget: number) {
  const { userId } = await verifySession();
  await prisma.christmasSettings.upsert({
    where: { userId },
    update: { budget },
    create: { userId, budget },
  });
  revalidatePath("/christmas");
}

export async function listChristmasEntries() {
  const { userId } = await verifySession();
  return prisma.christmasEntry.findMany({
    where: { userId },
    orderBy: [{ purchased: "asc" }, { createdAt: "desc" }],
  });
}

export async function createChristmasEntry(input: {
  recipient: string;
  item: string;
  amount: number;
  notes?: string | null;
}) {
  const { userId } = await verifySession();
  await prisma.christmasEntry.create({
    data: {
      userId,
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
  const { userId } = await verifySession();
  await prisma.christmasEntry.updateMany({
    where: { id, userId },
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
  const { userId } = await verifySession();
  await prisma.christmasEntry.updateMany({ where: { id, userId }, data: { purchased } });
  revalidatePath("/christmas");
}

export async function deleteChristmasEntry(id: string) {
  const { userId } = await verifySession();
  await prisma.christmasEntry.deleteMany({ where: { id, userId } });
  revalidatePath("/christmas");
}

// ---------- Debts ----------

export async function listDebts() {
  const { userId } = await verifySession();
  return prisma.debt.findMany({
    where: { userId },
    orderBy: [{ settled: "asc" }, { createdAt: "asc" }],
  });
}

export async function createDebt(input: {
  direction: DebtDirection;
  name: string;
  category?: string | null;
  amount: number;
  monthlyPayment?: number | null;
  endDate?: string | null;
  notes?: string | null;
}) {
  const { userId } = await verifySession();
  await prisma.debt.create({
    data: {
      userId,
      direction: input.direction,
      name: input.name,
      category: input.category || null,
      amount: input.amount,
      monthlyPayment: input.monthlyPayment ?? null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      notes: input.notes || null,
    },
  });
  revalidatePath("/debts");
}

export async function updateDebt(
  id: string,
  input: {
    direction: DebtDirection;
    name: string;
    category?: string | null;
    amount: number;
    monthlyPayment?: number | null;
    endDate?: string | null;
    notes?: string | null;
  }
) {
  const { userId } = await verifySession();
  await prisma.debt.updateMany({
    where: { id, userId },
    data: {
      direction: input.direction,
      name: input.name,
      category: input.category || null,
      amount: input.amount,
      monthlyPayment: input.monthlyPayment ?? null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      notes: input.notes || null,
    },
  });
  revalidatePath("/debts");
}

export async function toggleDebtSettled(id: string, settled: boolean) {
  const { userId } = await verifySession();
  await prisma.debt.updateMany({ where: { id, userId }, data: { settled } });
  revalidatePath("/debts");
}

export async function deleteDebt(id: string) {
  const { userId } = await verifySession();
  await prisma.debt.deleteMany({ where: { id, userId } });
  revalidatePath("/debts");
}

// ---------- Users (admin only) ----------

export interface UserActionResult {
  ok: boolean;
  error?: string;
}

export async function listUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, role: true, createdAt: true },
  });
}

export async function createUserAccount(input: {
  username: string;
  password: string;
  role: Role;
}): Promise<UserActionResult> {
  await requireAdmin();

  const username = input.username.trim();
  if (!username || !input.password) {
    return { ok: false, error: "Username and password are required." };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { ok: false, error: "That username is already taken." };
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash, role: input.role },
  });
  await provisionUserDefaults(prisma, user.id);

  revalidatePath("/settings/users");
  return { ok: true };
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<UserActionResult> {
  await requireAdmin();

  if (newPassword.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  revalidatePath("/settings/users");
  return { ok: true };
}

export async function updateUserRole(userId: string, role: Role): Promise<UserActionResult> {
  const session = await requireAdmin();

  if (userId === session.userId && role !== Role.ADMIN) {
    return { ok: false, error: "You can't remove your own admin access." };
  }

  if (role !== Role.ADMIN) {
    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (target?.role === Role.ADMIN) {
      const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
      if (adminCount <= 1) {
        return { ok: false, error: "Cannot remove the last admin account." };
      }
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/settings/users");
  return { ok: true };
}

export async function deleteUserAccount(userId: string): Promise<UserActionResult> {
  const session = await requireAdmin();

  if (userId === session.userId) {
    return { ok: false, error: "You can't delete your own account." };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (target?.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) {
      return { ok: false, error: "Cannot delete the last admin account." };
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/settings/users");
  return { ok: true };
}

// ---------- Dashboard ----------

export interface DashboardFilters {
  year: number | null; // null = all years
  month: number | null; // null = every month within scope
  categoryIds: string[]; // empty = every category
  accountIds: string[]; // empty = every account
}

export async function getDashboardFilterOptions() {
  const { userId } = await verifySession();
  const [years, categories, accounts] = await Promise.all([
    prisma.month.findMany({
      where: { userId },
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    }),
    prisma.category.findMany({ where: { userId }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.account.findMany({ where: { userId }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  return {
    years: years.map((y) => y.year),
    categories,
    accounts,
  };
}

export async function getDashboardData(filters: DashboardFilters) {
  const { userId } = await verifySession();

  const monthWhere: Prisma.MonthWhereInput = { userId };
  if (filters.year !== null) monthWhere.year = filters.year;
  if (filters.month !== null) monthWhere.month = filters.month;

  const entryWhere: Prisma.EntryWhereInput = {};
  if (filters.categoryIds.length > 0) entryWhere.categoryId = { in: filters.categoryIds };
  if (filters.accountIds.length > 0) entryWhere.accountId = { in: filters.accountIds };

  const months = await prisma.month.findMany({
    where: monthWhere,
    orderBy: [{ year: "asc" }, { month: "asc" }],
    include: {
      entries: {
        where: entryWhere,
        include: { category: true, account: true },
      },
    },
  });

  const trend = months.map((m) => {
    const outgoings = m.entries.reduce((sum, e) => sum + Number(e.amount), 0);
    const startWith = Number(m.startWith);
    return {
      year: m.year,
      month: m.month,
      startWith,
      outgoings,
      remaining: startWith - outgoings,
    };
  });

  const categoryTotals = new Map<string, { name: string; color: string; total: number }>();
  const accountTotals = new Map<string, { name: string; color: string; total: number }>();
  let uncategorizedTotal = 0;
  let untaggedTotal = 0;

  for (const m of months) {
    for (const e of m.entries) {
      const amount = Number(e.amount);
      if (e.category) {
        const existing = categoryTotals.get(e.category.id) ?? {
          name: e.category.name,
          color: e.category.color,
          total: 0,
        };
        existing.total += amount;
        categoryTotals.set(e.category.id, existing);
      } else {
        uncategorizedTotal += amount;
      }
      if (e.account) {
        const existing = accountTotals.get(e.account.id) ?? {
          name: e.account.name,
          color: e.account.color,
          total: 0,
        };
        existing.total += amount;
        accountTotals.set(e.account.id, existing);
      } else {
        untaggedTotal += amount;
      }
    }
  }

  const totalOutgoings = trend.reduce((sum, t) => sum + t.outgoings, 0);
  const totalIncomings = trend.reduce((sum, t) => sum + t.startWith, 0);

  return {
    trend,
    categoryBreakdown: [...categoryTotals.values()].sort((a, b) => b.total - a.total),
    accountBreakdown: [...accountTotals.values()].sort((a, b) => b.total - a.total),
    uncategorizedTotal,
    untaggedTotal,
    totals: {
      outgoings: totalOutgoings,
      incomings: totalIncomings,
      net: totalIncomings - totalOutgoings,
      avgMonthlySpend: trend.length > 0 ? totalOutgoings / trend.length : 0,
      monthCount: trend.length,
    },
  };
}

export { addMonths };
