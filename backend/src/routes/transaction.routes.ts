import { Router } from "express";
import { create, getOne, list, remove, update } from "../controllers/transaction.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const transactionRouter = Router();

transactionRouter.use(requireAuth);

transactionRouter.get("/", list);
transactionRouter.get("/:id", getOne);
transactionRouter.post("/", create);
transactionRouter.patch("/:id", update);
transactionRouter.delete("/:id", remove);
