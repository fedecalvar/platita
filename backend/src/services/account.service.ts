import { Prisma } from "@prisma/client";
import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import type { AccountInput } from "../schemas/account.schema";

export async function listAccounts(userId: string) {
  const accounts = await prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  // Un solo groupBy para todas las cuentas en vez de un aggregate por cuenta
  // (evita N+1 queries si el usuario tiene varias cuentas).
  const sums = await prisma.transaction.groupBy({
    by: ["accountId", "type"],
    where: { accountId: { in: accounts.map((a) => a.id) } },
    _sum: { amount: true },
  });

  return accounts.map((account) => ({
    ...account,
    balance: balanceFor(account.id, sums).toNumber(),
  }));
}

export async function createAccount(userId: string, input: AccountInput) {
  const account = await prisma.account.create({ data: { userId, name: input.name } });
  return { ...account, balance: 0 };
}

export async function updateAccount(userId: string, accountId: string, input: AccountInput) {
  await assertOwnership(userId, accountId);
  return prisma.account.update({ where: { id: accountId }, data: { name: input.name } });
}

export async function deleteAccount(userId: string, accountId: string) {
  await assertOwnership(userId, accountId);
  // onDelete: Cascade en el schema se encarga de las transactions de la cuenta.
  await prisma.account.delete({ where: { id: accountId } });
}

async function assertOwnership(userId: string, accountId: string) {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  // 404 y no 403: no confirmamos si la cuenta existe pero es de otro usuario.
  if (!account || account.userId !== userId) {
    throw new AppError(404, "NOT_FOUND", "Cuenta no encontrada");
  }
}

type AmountSum = { accountId: string; type: string; _sum: { amount: Prisma.Decimal | null } };

function balanceFor(accountId: string, sums: AmountSum[]) {
  return sums
    .filter((s) => s.accountId === accountId)
    .reduce((total, s) => {
      const amount = s._sum.amount ?? new Prisma.Decimal(0);
      return s.type === "income" ? total.plus(amount) : total.minus(amount);
    }, new Prisma.Decimal(0));
}
