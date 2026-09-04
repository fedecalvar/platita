import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api";
import type { DashboardByCategory, DashboardSummary } from "@/lib/types";

export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [byCategory, setByCategory] = useState<DashboardByCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([dashboardApi.summary(), dashboardApi.byCategory()])
      .then(([summaryData, byCategoryData]) => {
        setSummary(summaryData);
        setByCategory(byCategoryData);
      })
      .catch(() => setError("No se pudo cargar el resumen del dashboard"))
      .finally(() => setIsLoading(false));
  }, []);

  return { summary, byCategory, isLoading, error };
}
