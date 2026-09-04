import { Prisma, type TransactionType } from "@prisma/client";
import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import type { CreateTransactionInput, TransactionQuery, UpdateTransactionInput } from "../schemas/transaction.schema";

export async function listTransactions(userId: string, query: TransactionQuery) {
  const where: Prisma.TransactionWhereInput = {
    account: { userId },
    ...(query.accountId ? { accountId: query.accountId } : {}),
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.type ? { type: query.type } : {}),
  };

  if (query.from || query.to) {
    where.date = {
      ...(query.from ? { gte: query.from } : {}),
      ...(query.to ? { lte: query.to } : {}),
    };
  }

  return prisma.transaction.findMany({ where, orderBy: { date: "desc" } });
}

export async function getTransaction(userId: string, id: string) {
  const { account, ...transaction } = await findOwned(userId, id);
  return transaction;
}

export async function createTransaction(userId: string, input: CreateTransactionInput) {
  await assertAccountOwnership(userId, input.accountId);
  await assertCategoryMatchesType(input.categoryId, input.type);
  return prisma.transaction.create({ data: input });
}

export async function updateTransaction(userId: string, id: string, input: UpdateTransactionInput) {
  const existing = await findOwned(userId, id);

  if (input.accountId) await assertAccountOwnership(userId, input.accountId);
  if (input.categoryId || input.type) {
    await assertCategoryMatchesType(input.categoryId ?? existing.categoryId, input.type ?? existing.type);
  }

  return prisma.transaction.update({ where: { id }, data: input });
}

export async function deleteTransaction(userId: string, id: string) {
  await findOwned(userId, id);
  await prisma.transaction.delete({ where: { id } });
}

// Trae la transacción solo si cuelga de una cuenta del usuario logueado;
// nunca se confía en el :id de la URL sin cruzarlo contra el dueño real.
async function findOwned(userId: string, id: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { account: true },
  });
  if (!transaction || transaction.account.userId !== userId) {
    throw new AppError(404, "NOT_FOUND", "Transacción no encontrada");
  }
  return transaction;
}

async function assertAccountOwnership(userId: string, accountId: string) {
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account || account.userId !== userId) {
    throw new AppError(404, "NOT_FOUND", "Cuenta no encontrada");
  }
}

// type de la transacción y type de la categoría tienen que coincidir (evita
// cargar, por ej., "Sueldo" como gasto) — son dos campos independientes en
// el schema, nada lo garantiza a nivel de DB.
async function assertCategoryMatchesType(categoryId: string, type: TransactionType) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new AppError(404, "NOT_FOUND", "Categoría no encontrada");
  }
  if (category.type !== type) {
    throw new AppError(400, "CATEGORY_TYPE_MISMATCH", `La categoría "${category.name}" es de tipo ${category.type}`);
  }
}
