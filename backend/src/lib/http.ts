import type { Response } from "express";

// Wrapper chiquito para no repetir la forma `{ success: true, data }` (ver
// convención de API en CLAUDE.md) en cada controller.
export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}
