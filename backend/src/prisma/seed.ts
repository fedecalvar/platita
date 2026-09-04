// Necesario porque este script se puede correr directo con `tsx` (sin pasar
// por el CLI de Prisma, que carga el .env vía prisma.config.ts) y prisma.ts
// necesita DATABASE_URL ya seteada al construir el adapter.
import "dotenv/config";
import { prisma } from "../lib/prisma";

// Categorías predefinidas (ver CLAUDE.md). Son fijas para el MVP: no hay
// endpoint para que el usuario cree categorías propias, así que el seed es
// la única fuente de verdad para estos datos.
const categories = [
  { name: "Comida", type: "expense", icon: "UtensilsCrossed" },
  { name: "Transporte", type: "expense", icon: "Bus" },
  { name: "Vivienda", type: "expense", icon: "Home" },
  { name: "Entretenimiento", type: "expense", icon: "Gamepad2" },
  { name: "Salud", type: "expense", icon: "HeartPulse" },
  { name: "Educación", type: "expense", icon: "BookOpen" },
  { name: "Ropa", type: "expense", icon: "Shirt" },
  { name: "Otros", type: "expense", icon: "MoreHorizontal" },
  { name: "Sueldo", type: "income", icon: "Briefcase" },
  { name: "Freelance", type: "income", icon: "Laptop" },
  { name: "Regalo", type: "income", icon: "Gift" },
  { name: "Inversiones", type: "income", icon: "TrendingUp" },
  { name: "Otros", type: "income", icon: "MoreHorizontal" },
] as const;

async function main() {
  // Nota: "Otros" existe dos veces (una por tipo), por eso no alcanza con
  // un @unique en `name` a nivel de schema — el upsert de acá filtra por
  // name + type para que correr el seed de nuevo no duplique categorías.
  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name, type: category.type },
    });

    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { icon: category.icon },
      });
    } else {
      await prisma.category.create({ data: category });
    }
  }

  console.log(`Seed de categorías completo (${categories.length} categorías).`);
}

main()
  .catch((error) => {
    console.error("Error corriendo el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
