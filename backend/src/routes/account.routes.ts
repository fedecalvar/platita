import { Router } from "express";
import { create, list, remove, update } from "../controllers/account.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const accountRouter = Router();

accountRouter.use(requireAuth);

accountRouter.get("/", list);
accountRouter.post("/", create);
accountRouter.patch("/:id", update);
accountRouter.delete("/:id", remove);
