import { useMemo } from "react";
import { useEntitySeries } from "./useEntitySeries";
import { useHistory } from "./useHistory";
import type { SeriesPoint } from "../viz/charts";
import { stepHoldSeries } from "../lib/seriesHold";

export const TRENDS_HALF_WINDOW_H = 6;

export type TrendsWindow = { min: number; max: number };

export function trendsWindowAround(anchorSec: number, halfHours = TRENDS_HALF_WINDOW_H): TrendsWindow {
  const anchorMs = anchorSec * 1000;
  const halfMs = halfHours * 3600 * 1000;
  return { min: anchorMs - halfMs, max: anchorMs + halfMs };
}

export function trendsWindowForAnchors(anchorsSec: number[], halfHours = TRENDS_HALF_WINDOW_H): TrendsWindow {
  const halfMs = halfHours * 3600 * 1000;
  const ms = anchorsSec.filter((s) => Number.isFinite(s) && s > 0).map((s) => s * 1000);
  if (!ms.length) return { min: Date.now() - halfMs * 2, max: Date.now() };
  const minAnchor = Math.min(...ms);
  const maxAnchor = Math.max(...ms);
  const now = Date.now();
  return {
    min: minAnchor - halfMs,
    max: Math.min(now, maxAnchor + halfMs),
  };
}

function fetchHoursForWindowStart(windowStartSec: number): number {
  const nowSec = Date.now() / 1000;
  return Math.min(168, Math.max(0.5, (nowSec - windowStartSec) / 3600 + 0.25));
}

export function useTrendsSeries(
  entityId: string,
  opts: {
    hours: number;
    maxPoints: number;
    window?: TrendsWindow | null;
  },
): { series: SeriesPoint[]; lastSyncAt: number | undefined; live: boolean } {
  const { hours, maxPoints, window } = opts;
  const anchored = window != null;
  const fetchHours = useMemo(
    () => (window ? fetchHoursForWindowStart(window.min / 1000) : hours),
    [window, hours],
  );
  const fetchPoints = useMemo(
    () => (window ? Math.min(Math.max(maxPoints * 2, 96), 288) : maxPoints),
    [window, maxPoints],
  );

  const liveSeries = useEntitySeries(entityId, {
    hours,
    maxPoints,
    withGhost: false,
  });
  const { points: historyPoints } = useHistory(entityId, fetchHours, fetchPoints);

  return useMemo(() => {
    if (!entityId) {
      return { series: [] as SeriesPoint[], lastSyncAt: undefined, live: false };
    }
    if (!anchored || !window) {
      return {
        series: liveSeries.series,
        lastSyncAt: liveSeries.lastSyncAt,
        live: true,
      };
    }
    const filtered = historyPoints.filter((p) => p.t >= window.min && p.t <= window.max);
    const held = stepHoldSeries(filtered, window.max, { markStale: true });
    const lastReal = held.length ? held[held.length - 1].t : undefined;
    return { series: held, lastSyncAt: lastReal, live: false };
  }, [entityId, anchored, window, liveSeries, historyPoints]);
}
