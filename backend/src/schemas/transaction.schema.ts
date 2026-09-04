import { z } from "zod";

export const transactionQuerySchema = z.object({
  accountId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(["income", "expense"]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const createTransactionSchema = z.object({
  accountId: z.string().uuid(),
  categoryId: z.string().uuid(),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  type: z.enum(["income", "expense"]),
  description: z.string().trim().max(255).optional(),
  date: z.coerce.date(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
