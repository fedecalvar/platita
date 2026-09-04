import { Router } from "express";
import { byCategory, summary } from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/summary", summary);
dashboardRouter.get("/by-category", byCategory);
