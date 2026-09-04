import type { Request, Response } from "express";
import { sendSuccess } from "../lib/http";
import { categoryQuerySchema } from "../schemas/category.schema";
import { listCategories } from "../services/category.service";

export async function list(req: Request, res: Response) {
  const query = categoryQuerySchema.parse(req.query);
  const categories = await listCategories(query);
  sendSuccess(res, categories);
}
