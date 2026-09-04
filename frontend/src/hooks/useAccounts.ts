import { useCallback, useEffect, useState } from "react";
import { accountsApi } from "@/lib/api";
import type { Account } from "@/lib/types";

// `refetch` expuesto a propósito: después de crear/editar/borrar una cuenta
// (pantalla de Cuentas) hace falta volver a traer la lista con los balances
// recalculados, no alcanza con mutar el estado local a mano.
export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAccounts(await accountsApi.list());
    } catch {
      setError("No se pudieron cargar las cuentas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { accounts, isLoading, error, refetch };
}
