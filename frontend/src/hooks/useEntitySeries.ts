import { useEffect, useMemo, useRef, useState } from "react";
import { useEntityBus } from "./useEntityBus";
import { useFleet, useFleetSource, useFleetTick } from "./useFleet";
import { fleetEntityAvailable, fleetLiveNumber } from "../lib/entityFleetMap";
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
  const { num, available, tick, state } = useEntityBus();
  const fleet = useFleet();
  const source = useFleetSource();
  const fleetTick = useFleetTick();
  const { points: seed } = useHistory(entityId, fetchHours, fetchPoints);
  const [live, setLive] = useState<SeriesPoint[]>([]);
  const last = useRef<number | null>(null);
  const seeded = useRef(false);

  useEffect(() => {
    seeded.current = false;
    setLive([]);
    last.current = null;
  }, [entityId, hours, maxPoints, fetchHours, withGhost]);

  useEffect(() => {
    if (seed.length && !seeded.current) {
      seeded.current = true;
      const lastSeed = seed[seed.length - 1]?.v;
      if (Number.isFinite(lastSeed)) last.current = lastSeed as number;
    }
  }, [seed]);

  useEffect(() => {
    const liveOk = source === "pi" ? fleetEntityAvailable(entityId, fleet) : available(entityId);
    if (!entityId || !liveOk) return;
    const fleetNum = source === "pi" ? fleetLiveNumber(entityId, fleet) : null;
    const raw = num(entityId);
    const mapped =
      fleetNum != null && Number.isFinite(fleetNum)
        ? fleetNum
        : Number.isFinite(raw)
          ? raw
          : stateToNumber(state(entityId, ""));
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
    // tick / fleetTick drives live appends
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, tick, fleetTick, source, fleet, available, num, state, maxPoints]);

  const heldCap = withGhost ? Math.max(fetchPoints, maxPoints * 2) : maxPoints * 2;
  const { series, ghost, lastSyncAt } = useMemo(() => {
    const lastSeedT = seed.length ? seed[seed.length - 1].t : 0;
    const liveTail = live.filter((p) => p.t > lastSeedT + 250);
    const merged = seed.length ? [...seed, ...liveTail] : liveTail;
    const lastRealT = merged.length ? merged[merged.length - 1].t : undefined;
    const staleGap = lastRealT != null && Date.now() - lastRealT > 5 * 60 * 1000;
    const held = stepHoldSeries(merged, Date.now(), { markStale: staleGap });
    const capped = held.length > heldCap ? held.slice(-heldCap) : held;
    if (!withGhost) return { series: capped, ghost: [] as SeriesPoint[], lastSyncAt: lastRealT };
    const windowMs = hours * 3600 * 1000;
    const cutoff = Date.now() - windowMs;
    return {
      series: capped.filter((p) => p.t >= cutoff),
      ghost: shiftPriorGhost(capped, hours),
      lastSyncAt: lastRealT,
    };
  }, [seed, live, heldCap, withGhost, hours]);

  return { series, lastSyncAt, ghost };
}
