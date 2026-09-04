import "dotenv/config";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("Falta la variable de entorno JWT_SECRET");
}

// TS no arrastra el narrowing del if de arriba hasta las funciones de abajo,
// por eso esta segunda const con tipo explícito.
const JWT_SECRET: string = process.env.JWT_SECRET;

export type JwtPayload = { userId: string };

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  // Cast vía unknown: nosotros somos los únicos que firmamos tokens acá, así
  // que sabemos que el payload siempre tiene userId.
  return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
}
