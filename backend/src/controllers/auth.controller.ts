import type { Request, Response } from "express";
import { sendSuccess } from "../lib/http";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { getUserById, loginUser, registerUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  const result = await registerUser(input);
  sendSuccess(res, result, 201);
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const result = await loginUser(input);
  sendSuccess(res, result);
}

export async function me(req: Request, res: Response) {
  // requireAuth corrió antes y garantiza req.userId (ver auth.middleware.ts).
  const user = await getUserById(req.userId!);
  sendSuccess(res, user);
}
