import type { Request, Response } from "express";
import { sendSuccess } from "../lib/http";
import { createTransactionSchema, transactionQuerySchema, updateTransactionSchema } from "../schemas/transaction.schema";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from "../services/transaction.service";

export async function list(req: Request, res: Response) {
  const query = transactionQuerySchema.parse(req.query);
  const transactions = await listTransactions(req.userId!, query);
  sendSuccess(res, transactions);
}

export async function getOne(req: Request, res: Response) {
  const transaction = await getTransaction(req.userId!, req.params.id as string);
  sendSuccess(res, transaction);
}

export async function create(req: Request, res: Response) {
  const input = createTransactionSchema.parse(req.body);
  const transaction = await createTransaction(req.userId!, input);
  sendSuccess(res, transaction, 201);
}

export async function update(req: Request, res: Response) {
  const input = updateTransactionSchema.parse(req.body);
  const transaction = await updateTransaction(req.userId!, req.params.id as string, input);
  sendSuccess(res, transaction);
}

export async function remove(req: Request, res: Response) {
  await deleteTransaction(req.userId!, req.params.id as string);
  sendSuccess(res, null);
}
