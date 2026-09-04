import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api";
import type { Category } from "@/lib/types";

// Las categorías son fijas (seedeadas, sin endpoint para crear/editar — ver
// CLAUDE.md), así que a diferencia de useAccounts esto no necesita refetch.
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoriesApi
      .list()
      .then(setCategories)
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
}
