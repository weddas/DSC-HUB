import { useEffect, useState } from "react";
import { useHass } from "./useHass";
import type { SeriesPoint } from "../viz/charts";

type HistoryState = {
  s: string | number;
  lu?: number;
  last_changed?: string;
  last_updated?: string;
  state?: string;
};

type HistoryResult = Record<string, HistoryState[]>;

function toMs(point: HistoryState): number | null {
  if (typeof point.lu === "number" && Number.isFinite(point.lu)) {
    return point.lu * 1000;
  }
  const iso = point.last_changed || point.last_updated;
  if (iso) {
    const t = Date.parse(iso);
    return Number.isFinite(t) ? t : null;
  }
  return null;
}

function toNum(point: HistoryState): number | null {
  const raw = point.s ?? point.state;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : null;
}

function downsample(points: SeriesPoint[], maxPoints: number): SeriesPoint[] {
  if (points.length <= maxPoints) return points;
  const out: SeriesPoint[] = [];
  const step = (points.length - 1) / (maxPoints - 1);
  for (let i = 0; i < maxPoints; i++) {
    out.push(points[Math.round(i * step)]);
  }
  return out;
}

/**
 * Seed a numeric series from HA history for the last `hours`, then keep it
 * static (live append is handled by useEntitySeries).
 */
export function useHistory(
  entityId: string,
  hours = 6,
  maxPoints = 96,
): { points: SeriesPoint[]; loading: boolean; error: string | null } {
  const { hass, callWS } = useHass();
  const connReady = !!(hass && (hass.callWS || hass.connection));
  const [points, setPoints] = useState<SeriesPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!entityId) {
        setPoints([]);
        setLoading(false);
        return;
      }
      if (!connReady) {
        setPoints([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const end = new Date();
      const start = new Date(end.getTime() - hours * 3600 * 1000);
      try {
        const raw = await callWS<HistoryResult | HistoryState[][]>({
          type: "history/history_during_period",
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          significant_changes_only: false,
          minimal_response: true,
          no_attributes: true,
          entity_ids: [entityId],
        });

        if (cancelled) return;
        if (raw == null) {
          setPoints([]);
          setError("history unavailable");
          return;
        }

        let rows: HistoryState[] = [];
        if (Array.isArray(raw)) {
          rows = (raw[0] as HistoryState[]) || [];
        } else if (raw && typeof raw === "object") {
          rows = (raw as HistoryResult)[entityId] || [];
        }

        const series: SeriesPoint[] = [];
        for (const row of rows) {
          const t = toMs(row);
          const v = toNum(row);
          if (t == null || v == null) continue;
          series.push({ t, v });
        }
        series.sort((a, b) => a.t - b.t);
        setPoints(downsample(series, maxPoints));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "history unavailable");
          setPoints([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [connReady, entityId, hours, maxPoints, callWS]);

  return { points, loading, error };
}
