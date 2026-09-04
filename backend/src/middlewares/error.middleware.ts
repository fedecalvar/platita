import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/errors";

// Middleware de errores centralizado: los controllers pueden simplemente
// `throw` (incluyendo desde handlers async — Express 5 reenvía esos
// rechazos acá solo) en vez de tener un try/catch por endpoint.
// Debe registrarse último, después de montar todas las rutas.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: { message: err.issues[0]?.message ?? "Datos inválidos", code: "VALIDATION_ERROR" },
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    error: { message: "Error interno del servidor", code: "INTERNAL_ERROR" },
  });
}
