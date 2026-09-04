import { Router } from "express";
import { list } from "../controllers/category.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const categoryRouter = Router();

categoryRouter.use(requireAuth);
categoryRouter.get("/", list);
