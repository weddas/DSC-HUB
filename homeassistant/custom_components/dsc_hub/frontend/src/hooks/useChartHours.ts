import { useCallback, useState } from "react";

export const CHART_HOUR_OPTIONS = [1, 6, 24, 48] as const;
export type ChartHours = (typeof CHART_HOUR_OPTIONS)[number];

const STORAGE_KEY = "dsc_chart_hours";

function readStored(): ChartHours {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const n = Number(raw);
    if ((CHART_HOUR_OPTIONS as readonly number[]).includes(n)) return n as ChartHours;
  } catch {
    /* ignore */
  }
  return 6;
}

export function useChartHours(defaultHours: ChartHours = 6): {
  hours: ChartHours;
  setHours: (h: ChartHours) => void;
  maxPoints: number;
} {
  const [hours, setHoursState] = useState<ChartHours>(() => {
    const stored = readStored();
    return stored || defaultHours;
  });

  const setHours = useCallback((h: ChartHours) => {
    setHoursState(h);
    try {
      sessionStorage.setItem(STORAGE_KEY, String(h));
    } catch {
      /* ignore */
    }
  }, []);

  const maxPoints = hours <= 1 ? 60 : hours <= 6 ? 96 : hours <= 24 ? 144 : 192;
  return { hours, setHours, maxPoints };
}
