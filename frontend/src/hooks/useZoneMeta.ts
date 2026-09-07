import { useCallback, useEffect, useSyncExternalStore } from "react";
import { getZones, type ZoneEffects, type ZoneRecord, type ZonesResponse } from "../lib/zonesApi";

/**
 * Brain zone metadata (name, role, role_since, parent) — a small shared store polled every
 * 60 s and refreshed on demand after a PATCH. Readings stay on the entity bus; this is only
 * the *what is this zone* layer.
 */

type Snapshot = {
  zones: ZoneRecord[];
  byId: Record<string, ZoneRecord>;
  roles: ZonesResponse["roles"];
  effects: ZoneEffects | null;
  loading: boolean;
  error: string | null;
  loadedAt: number | null;
};

const EMPTY: Snapshot = { zones: [], byId: {}, roles: ["grow", "dry", "cure", "empty"], effects: null, loading: true, error: null, loadedAt: null };

let snapshot: Snapshot = EMPTY;
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;
let timer: number | null = null;

function emit() {
  for (const l of listeners) l();
}

export async function refreshZoneMeta(): Promise<void> {
  if (inflight) return inflight;
  inflight = getZones()
    .then((res) => {
      const byId: Record<string, ZoneRecord> = {};
      for (const z of res.zones) byId[z.zone_id] = z;
      snapshot = { zones: res.zones, byId, roles: res.roles, effects: res.effects, loading: false, error: null, loadedAt: Date.now() };
    })
    .catch((e: unknown) => {
      snapshot = { ...snapshot, loading: false, error: e instanceof Error ? e.message : "zones failed" };
    })
    .finally(() => {
      inflight = null;
      emit();
    });
  return inflight;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  if (listeners.size === 1) {
    void refreshZoneMeta();
    timer = window.setInterval(() => void refreshZoneMeta(), 60_000);
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size && timer != null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

export function useZoneMeta(): Snapshot & { refresh: () => Promise<void> } {
  const snap = useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
  const refresh = useCallback(() => refreshZoneMeta(), []);
  useEffect(() => {
    if (snap.loadedAt == null && !inflight) void refreshZoneMeta();
  }, [snap.loadedAt]);
  return { ...snap, refresh };
}

/** Map the SPA's zone ids (main / clone / room) onto brain zone ids (4x8 / 2x4 / grow_room). */
export const BRAIN_ZONE_ID: Record<"main" | "clone" | "room", string> = {
  main: "4x8",
  clone: "2x4",
  room: "grow_room",
};
