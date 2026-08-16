import { useEffect, useMemo, useRef, useState } from "react";
import { useHass } from "./useHass";
import { useHistory } from "./useHistory";
import type { SeriesPoint } from "../viz/charts";
import { stateToNumber, stepHoldSeries } from "../lib/seriesHold";

export interface EntitySeriesResult {
  series: SeriesPoint[];
  lastSyncAt: number | undefined;
  ghost: SeriesPoint[];
}

export function ghostSpanHours(hours: number): number {
  return hours <= 18 ? hours * 2 : Math.min(hours + 24, 48);
}

export function shiftPriorGhost(series: SeriesPoint[], hours: number): SeriesPoint[] {
  const windowMs = hours * 3600 * 1000;
  const cutoff = Date.now() - windowMs;
  return series
    .filter((p) => p.t < cutoff && Number.isFinite(p.v))
    .map((p) => ({ t: p.t + windowMs, v: p.v }));
}

/**
 * History-seeded numeric series with live appends on DSC state changes.
 * `withGhost` fetches the prior window and returns a shifted overlay (same as inspector).
 */
export function useEntitySeries(
  entityId: string,
  opts?: { maxPoints?: number; hours?: number; withGhost?: boolean },
): EntitySeriesResult {
  const maxPoints = opts?.maxPoints ?? 96;
  const hours = opts?.hours ?? 6;
  const withGhost = !!opts?.withGhost;
  const fetchHours = withGhost ? ghostSpanHours(hours) : hours;
  const fetchPoints = withGhost ? Math.min(Math.max(maxPoints * 2, maxPoints), 288) : maxPoints;
  const { num, available, tick, state } = useHass();
  const { points: seed } = useHistory(entityId, fetchHours, fetchPoints);
  const [live, setLive] = useState<SeriesPoint[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<number | undefined>(undefined);
  const last = useRef<number | null>(null);
  const seeded = useRef(false);

  useEffect(() => {
    seeded.current = false;
    setLive([]);
    last.current = null;
    setLastSyncAt(undefined);
  }, [entityId, hours, maxPoints, fetchHours, withGhost]);

  useEffect(() => {
    if (seed.length && !seeded.current) {
      seeded.current = true;
      const lastSeed = seed[seed.length - 1]?.v;
      if (Number.isFinite(lastSeed)) last.current = lastSeed as number;
    }
  }, [seed]);

  useEffect(() => {
    if (!entityId || !available(entityId)) return;
    const raw = num(entityId);
    const mapped = Number.isFinite(raw) ? raw : stateToNumber(state(entityId, ""));
    if (mapped == null || !Number.isFinite(mapped)) return;
    if (last.current === mapped && live.length > 0) {
      const now = Date.now();
      const prevT = live[live.length - 1]?.t ?? 0;
      if (now - prevT < 4000) return;
    }
    last.current = mapped;
    const now = Date.now();
    setLive((prev) => {
      const next = [...prev, { t: now, v: mapped }];
      return next.slice(-maxPoints);
    });
    setLastSyncAt(now);
    // tick drives live appends from HassProvider state_changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, tick, available, num, state, maxPoints]);

  const heldCap = withGhost ? Math.max(fetchPoints, maxPoints * 2) : maxPoints * 2;
  const { series, ghost } = useMemo(() => {
    const lastSeedT = seed.length ? seed[seed.length - 1].t : 0;
    const liveTail = live.filter((p) => p.t > lastSeedT + 250);
    const merged = seed.length ? [...seed, ...liveTail] : liveTail;
    const held = stepHoldSeries(merged);
    const capped = held.length > heldCap ? held.slice(-heldCap) : held;
    if (!withGhost) return { series: capped, ghost: [] as SeriesPoint[] };
    const windowMs = hours * 3600 * 1000;
    const cutoff = Date.now() - windowMs;
    return {
      series: capped.filter((p) => p.t >= cutoff),
      ghost: shiftPriorGhost(capped, hours),
    };
  }, [seed, live, heldCap, withGhost, hours]);

  return { series, lastSyncAt, ghost };
}
