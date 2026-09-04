// Errores "esperables" (401, 404, etc). El error middleware los distingue
// de un error de verdad por instanceof.
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
