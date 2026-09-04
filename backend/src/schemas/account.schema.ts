import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
});

export type AccountInput = z.infer<typeof accountSchema>;
