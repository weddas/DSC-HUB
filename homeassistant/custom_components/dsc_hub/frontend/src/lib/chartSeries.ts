import type { NamedSeries } from "../viz/charts";

export function withPriorGhost(
  id: string,
  label: string,
  current: { series: { t: number; v: number }[]; ghost: { t: number; v: number }[] },
  color: string,
  unit: string,
  extra?: Partial<NamedSeries>,
): NamedSeries[] {
  const live: NamedSeries = { id, label, series: current.series, color, unit, ...extra };
  if (current.ghost.length <= 1) return [live];
  return [
    live,
    { id: `${id}-ghost`, label: `${label} prior`, series: current.ghost, color, unit, ghost: true },
  ];
}
