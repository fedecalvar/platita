// Versión mínima de "clsx": une clases condicionales sin sumar una
// dependencia nueva solo para esto (el proyecto no las necesita en ningún
// otro lado). El tipo es laxo a propósito: se usa con expresiones tipo
// `condicion && "clase"`, que TS tipa como `false | "clase"` (o `0` si la
// condición es un número), no como `string | false`.
export function cn(...classes: unknown[]): string {
  return classes.filter((c) => typeof c === "string" && c.length > 0).join(" ");
}
