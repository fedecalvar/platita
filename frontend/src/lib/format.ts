// Formato "$ 842.350,00": Intl ya sabe poner punto de miles y coma decimal
// en es-AR, solo le sacamos el símbolo de moneda propio para controlar
// nosotros el signo +/- en transacciones (ver formatSignedCurrency).
const numberFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  return `$ ${numberFormatter.format(Math.abs(amount))}`;
}

export function formatSignedCurrency(amount: number): string {
  const sign = amount < 0 ? "-" : amount > 0 ? "+" : "";
  return `${sign}${formatCurrency(amount)}`;
}

const dayFormatter = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });

// Las fechas de transacciones llegan como "YYYY-MM-DD" (sin hora) y el
// backend las trata siempre en UTC (ver el comentario de monthRange en
// dashboard.service.ts) — comparamos acá también en UTC para no correrlas
// un día en husos horarios detrás de UTC como Argentina.
export function formatTransactionDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diffDays = Math.round((todayUTC - dateUTC) / 86_400_000);

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  return dayFormatter.format(date);
}
