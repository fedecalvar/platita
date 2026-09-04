// Prisma 7 movió la configuración del CLI (antes en el campo "prisma" de
// package.json) a este archivo. Lo necesitamos porque el schema no vive en
// la ubicación default (./prisma/schema.prisma) sino en src/prisma/, como
// pide la estructura de carpetas del proyecto.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  // Prisma 7 sacó `url` del datasource del schema.prisma; el connection
  // string para el CLI (migrate, introspect, etc.) se define acá.
  // Usamos process.env directo (en vez del helper `env()` de prisma/config,
  // que tira si la variable no existe) para que `prisma generate` funcione
  // aunque todavía no exista el .env real — migrate/seed sí van a pedirla.
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "tsx src/prisma/seed.ts",
  },
});
