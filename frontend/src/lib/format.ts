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

// timeZone: "UTC" es la parte que importa acá: sin esto, Intl formatea en
// el huso horario local del navegador, y una fecha guardada como
// "2026-09-01" (medianoche UTC, ver dashboard.service.ts) se muestra como
// "31 ago" en cualquier huso detrás de UTC (Argentina incluida) — lo
// detecté probando con datos reales, se veía mal en el listado.
const dayFormatter = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", timeZone: "UTC" });

export function formatTransactionDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  // "Hoy"/"Ayer" comparan contra el día calendario LOCAL del usuario (acá sí
  // queremos su día real, no el de UTC), contra el día UTC que representa
  // la fecha guardada (mismo criterio que isoToDateInputValue).
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dateUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diffDays = Math.round((todayLocal - dateUTC) / 86_400_000);

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  return dayFormatter.format(date);
}

// Para precargar el <input type="date"> al editar una transacción: hay que
// leer los componentes en UTC (no local) porque así es como el backend
// interpreta y guarda la fecha (ver formatTransactionDate arriba) — usar
// getDate() en vez de getUTCDate() correría la fecha un día en Argentina.
export function isoToDateInputValue(iso: string): string {
  const date = new Date(iso);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Para el valor por defecto de una transacción NUEVA sí queremos el "hoy"
// real del usuario (hora local), no el de UTC — a la noche en Argentina
// (UTC-3) ya es "mañana" en UTC.
export function getTodayInputValue(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
