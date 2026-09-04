import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import { verifyToken } from "../lib/jwt";

// req.userId siempre sale del JWT, nunca de body/params.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "Falta el token de autenticación");
  }

  const token = header.slice("Bearer ".length);

  try {
    req.userId = verifyToken(token).userId;
    next();
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "Token inválido o expirado");
  }
}
