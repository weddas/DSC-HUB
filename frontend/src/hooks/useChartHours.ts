import { useCallback } from "react";
import { usePreference } from "./usePreference";

export type ChartHours = number;
export const CHART_HOUR_OPTIONS = [1, 6, 24, 48] as const;

/**
 * Default chart range — an operator preference (Preferences › Charts) that survives a
 * reload and is shared by every desk chart in this browser. Each chart may still change
 * it in place; the change becomes the new default.
 */
export function useChartHours(defaultHours: ChartHours = 6): {
  hours: ChartHours;
  setHours: (h: ChartHours) => void;
  maxPoints: number;
} {
  const [stored, setStored] = usePreference("chartHours");
  const hours = Number.isFinite(stored) && stored > 0 && stored <= 48 ? stored : defaultHours;
  const setHours = useCallback((h: ChartHours) => setStored(h), [setStored]);
  const maxPoints = hours <= 1 ? 60 : hours <= 6 ? 96 : hours <= 24 ? 144 : 192;
  return { hours, setHours, maxPoints };
}
