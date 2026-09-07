import { useEffect, useState } from "react";
import { get_entity_history } from "../lib/fleetApi";
import type { SeriesPoint } from "../viz/charts";

function downsample(points: SeriesPoint[], maxPoints: number): SeriesPoint[] {
  if (points.length <= maxPoints) return points;
  const out: SeriesPoint[] = [];
  const step = (points.length - 1) / (maxPoints - 1);
  for (let i = 0; i < maxPoints; i++) {
    out.push(points[Math.round(i * step)]);
  }
  return out;
}

/** Seed a numeric series from the brain /history endpoint. */
export function useHistory(
  entityId: string,
  hours = 6,
  maxPoints = 96,
): { points: SeriesPoint[]; loading: boolean; error: string | null; tracked: boolean | null } {
  const [points, setPoints] = useState<SeriesPoint[]>([]);
  const [tracked, setTracked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!entityId) {
        setPoints([]);
        setTracked(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { points: rows, tracked: isTracked } = await get_entity_history(entityId, hours, maxPoints);
        if (cancelled) return;
        setTracked(isTracked);
        const series = rows.filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));
        series.sort((a, b) => a.t - b.t);
        setPoints(downsample(series, maxPoints));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "history unavailable");
        setPoints([]);
      } finally {
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [entityId, hours, maxPoints]);

  return { points, loading, error, tracked };
}
