// Paleta fija para las porciones del gráfico de categorías. Cicla si algún
// mes hay más categorías con movimientos que colores acá (no debería pasar
// con las ~13 categorías seedeadas, pero tampoco rompe si pasa).
const CHART_PALETTE = [
  "#00685f", // primary
  "#fea619", // secondary-container
  "#006947", // tertiary
  "#855300", // secondary
  "#00855b", // tertiary-container
  "#6d7a77", // outline
  "#ba1a1a", // error
  "#89f5e7", // primary-fixed
];

export function getChartColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}
