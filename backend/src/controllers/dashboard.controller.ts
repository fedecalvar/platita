import type { Request, Response } from "express";
import { sendSuccess } from "../lib/http";
import { dashboardByCategoryQuerySchema } from "../schemas/dashboard.schema";
import { getByCategory, getSummary } from "../services/dashboard.service";

export async function summary(req: Request, res: Response) {
  const data = await getSummary(req.userId!);
  sendSuccess(res, data);
}

export async function byCategory(req: Request, res: Response) {
  const query = dashboardByCategoryQuerySchema.parse(req.query);
  const data = await getByCategory(req.userId!, query);
  sendSuccess(res, data);
}
