import { z } from "zod";

export const categoryQuerySchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
});

export type CategoryQuery = z.infer<typeof categoryQuerySchema>;
