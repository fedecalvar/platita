import { Prisma, type TransactionType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { DashboardByCategoryQuery } from "../schemas/dashboard.schema";

export async function getSummary(userId: string) {
  const accountIds = await getAccountIds(userId);

  const now = new Date();
  const allTime = await sumsByType(accountIds);
  const thisMonth = await sumsByType(accountIds, monthRange(now.getUTCFullYear(), now.getUTCMonth()));

  return {
    // Balance total = todo lo que entró menos todo lo que salió, histórico
    // (mismo criterio que el balance por cuenta, sumado entre todas).
    totalBalance: allTime.income.minus(allTime.expense).toNumber(),
    monthlyIncome: thisMonth.income.toNumber(),
    monthlyExpense: thisMonth.expense.toNumber(),
  };
}

export async function getByCategory(userId: string, query: DashboardByCategoryQuery) {
  const now = new Date();
  const year = query.year ?? now.getUTCFullYear();
  const month = query.month ?? now.getUTCMonth() + 1; // getUTCMonth() es 0-indexed, acá usamos 1-12

  const accountIds = await getAccountIds(userId);
  const range = monthRange(year, month - 1);
  const grouped = await prisma.transaction.groupBy({
    by: ["categoryId", "type"],
    where: { accountId: { in: accountIds }, ...dateRangeFilter(range) },
    _sum: { amount: true },
  });

  const categories = await prisma.category.findMany({
    where: { id: { in: grouped.map((g) => g.categoryId) } },
  });

  const totals: Record<TransactionType, Prisma.Decimal> = {
    income: new Prisma.Decimal(0),
    expense: new Prisma.Decimal(0),
  };
  for (const g of grouped) {
    totals[g.type] = totals[g.type].plus(g._sum.amount ?? 0);
  }

  const breakdown = grouped
    .map((g) => {
      const category = categories.find((c) => c.id === g.categoryId)!;
      const amount = (g._sum.amount ?? new Prisma.Decimal(0)).toNumber();
      const totalForType = totals[g.type].toNumber();
      return {
        categoryId: category.id,
        name: category.name,
        icon: category.icon,
        type: g.type,
        total: amount,
        percentage: totalForType === 0 ? 0 : Math.round((amount / totalForType) * 1000) / 10,
      };
    })
    .sort((a, b) => b.total - a.total);

  return {
    month,
    year,
    totalIncome: totals.income.toNumber(),
    totalExpense: totals.expense.toNumber(),
    categories: breakdown,
  };
}

async function getAccountIds(userId: string) {
  const accounts = await prisma.account.findMany({ where: { userId }, select: { id: true } });
  return accounts.map((a) => a.id);
}

// Todo en UTC, nunca hora local: las fechas de transacciones vienen de
// strings tipo "2026-09-01" (sin hora), que JS/zod parsean como medianoche
// UTC. Si acá se construyera el rango con `new Date(year, month, 1)` (hora
// local del server), en un huso horario detrás de UTC como Argentina
// medianoche UTC del día 1 todavía es el mes anterior en hora local, y las
// transacciones del primer día de cada mes quedarían mal clasificadas.
function monthRange(year: number, monthIndex0: number) {
  const start = new Date(Date.UTC(year, monthIndex0, 1));
  const end = new Date(Date.UTC(year, monthIndex0 + 1, 1));
  return { start, end };
}

function dateRangeFilter(range?: { start: Date; end: Date }) {
  return range ? { date: { gte: range.start, lt: range.end } } : {};
}

async function sumsByType(accountIds: string[], range?: { start: Date; end: Date }) {
  const sums = await prisma.transaction.groupBy({
    by: ["type"],
    where: { accountId: { in: accountIds }, ...dateRangeFilter(range) },
    _sum: { amount: true },
  });

  return {
    income: sums.find((s) => s.type === "income")?._sum.amount ?? new Prisma.Decimal(0),
    expense: sums.find((s) => s.type === "expense")?._sum.amount ?? new Prisma.Decimal(0),
  };
}
