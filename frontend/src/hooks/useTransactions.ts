import { useCallback, useEffect, useState } from "react";
import { transactionsApi, type TransactionFilters } from "@/lib/api";
import type { Transaction } from "@/lib/types";

export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // El objeto `filters` es nuevo en cada render de quien llama al hook;
  // usamos su JSON como dependencia real para no refetchear en un loop.
  const filtersKey = JSON.stringify(filters);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    transactionsApi
      .list(filters)
      .then(setTransactions)
      .catch(() => setError("No se pudieron cargar las transacciones"))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { transactions, isLoading, error, refetch };
}
