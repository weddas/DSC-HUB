import { useEffect, useMemo, useRef, useState } from "react";
import { useHass } from "./useHass";
import { useHistory } from "./useHistory";
import type { SeriesPoint } from "../viz/charts";

export interface EntitySeriesResult {
  series: SeriesPoint[];
  lastSyncAt: number | undefined;
}

/**
 * History-seeded numeric series with live appends on DSC state changes.
 */
export function useEntitySeries(
  entityId: string,
  opts?: { maxPoints?: number; hours?: number },
): EntitySeriesResult {
  const maxPoints = opts?.maxPoints ?? 96;
  const hours = opts?.hours ?? 6;
  const { num, available, tick } = useHass();
  const { points: seed } = useHistory(entityId, hours, maxPoints);
  const [live, setLive] = useState<SeriesPoint[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<number | undefined>(undefined);
  const last = useRef<number | null>(null);
  const seeded = useRef(false);

  useEffect(() => {
    seeded.current = false;
    setLive([]);
    last.current = null;
    setLastSyncAt(undefined);
  }, [entityId, hours, maxPoints]);

  useEffect(() => {
    if (seed.length && !seeded.current) {
      seeded.current = true;
      const lastSeed = seed[seed.length - 1]?.v;
      if (Number.isFinite(lastSeed)) last.current = lastSeed as number;
    }
  }, [seed]);

  useEffect(() => {
    if (!entityId || !available(entityId)) return;
    const v = num(entityId);
    if (!Number.isFinite(v)) return;
    if (last.current === v && live.length > 0) {
      const now = Date.now();
      const prevT = live[live.length - 1]?.t ?? 0;
      if (now - prevT < 4000) return;
    }
    last.current = v;
    const now = Date.now();
    setLive((prev) => {
      const next = [...prev, { t: now, v }];
      return next.slice(-maxPoints);
    });
    setLastSyncAt(now);
    // tick drives live appends from HassProvider state_changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, tick, available, num, maxPoints]);

  const series = useMemo(() => {
    if (!seed.length && !live.length) return live;
    if (!live.length) return seed;
    if (!seed.length) return live;
    const cutoff = live[0]?.t ?? 0;
    const head = seed.filter((p) => p.t < cutoff - 500);
    const merged = [...head, ...live];
    return merged.length > maxPoints ? merged.slice(-maxPoints) : merged;
  }, [seed, live, maxPoints]);

  return { series, lastSyncAt };
}
