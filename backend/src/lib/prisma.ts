// Carga el .env acá mismo (no solo en index.ts) para que este módulo funcione
// sin depender de quién lo importe primero: scripts sueltos como seed.ts,
// tests, etc. `dotenv/config` no pisa variables ya seteadas por el entorno.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Usamos el driver adapter de pg (en vez del engine binario de Prisma) porque
// Neon es Postgres serverless: el adapter maneja el pool de conexiones desde
// nuestro propio proceso, lo cual es más liviano y evita cold starts del
// query engine nativo en plataformas serverless como Render.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Guardamos la instancia en `global` para que, en desarrollo, `tsx watch`
// (que reinicia el módulo en cada cambio) no abra un pool de conexiones nuevo
// por cada reload y termine agotando las conexiones disponibles en Neon.
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
