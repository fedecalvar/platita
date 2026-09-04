import { prisma } from "../lib/prisma";
import type { CategoryQuery } from "../schemas/category.schema";

export async function listCategories(query: CategoryQuery) {
  return prisma.category.findMany({
    where: query.type ? { type: query.type } : undefined,
    orderBy: { name: "asc" },
  });
}
