import bcrypt from "bcryptjs";
import { AppError } from "../lib/errors";
import { signToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 10;

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(400, "EMAIL_TAKEN", "Ya existe una cuenta con ese email");
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email: input.email, password: hashedPassword, name: input.name },
  });

  return { token: signToken({ userId: user.id }), user: toPublicUser(user) };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Mismo error para email inexistente o password mal: no dar pistas de qué falló.
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Email o contraseña incorrectos");
  }

  return { token: signToken({ userId: user.id }), user: toPublicUser(user) };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "NOT_FOUND", "Usuario no encontrado");
  }
  return toPublicUser(user);
}

// nunca devolver el hash de password
function toPublicUser(user: { id: string; email: string; name: string; createdAt: Date }) {
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
}
