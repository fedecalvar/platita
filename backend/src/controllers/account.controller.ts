import type { Request, Response } from "express";
import { sendSuccess } from "../lib/http";
import { accountSchema } from "../schemas/account.schema";
import { createAccount, deleteAccount, listAccounts, updateAccount } from "../services/account.service";

export async function list(req: Request, res: Response) {
  const accounts = await listAccounts(req.userId!);
  sendSuccess(res, accounts);
}

export async function create(req: Request, res: Response) {
  const input = accountSchema.parse(req.body);
  const account = await createAccount(req.userId!, input);
  sendSuccess(res, account, 201);
}

export async function update(req: Request, res: Response) {
  const input = accountSchema.parse(req.body);
  // req.params.id es siempre un string acá (viene de :id, un solo segmento);
  // el tipo string | string[] de Express 5 es por rutas con params repetidos.
  const account = await updateAccount(req.userId!, req.params.id as string, input);
  sendSuccess(res, account);
}

export async function remove(req: Request, res: Response) {
  await deleteAccount(req.userId!, req.params.id as string);
  sendSuccess(res, null);
}
