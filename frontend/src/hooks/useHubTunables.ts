import { useCallback, useEffect, useState } from "react";
import {
  adoptHubTunable,
  getHubTunables,
  patchHubTunable,
  pushHubTunable,
  type HubTunable,
  type HubTunablesResponse,
} from "../lib/hubTunablesApi";

type Snapshot = {
  data: HubTunablesResponse | null;
  byId: Record<string, HubTunable>;
  state: "loading" | "ready" | "error";
  error?: string;
};

let cache: Snapshot = { data: null, byId: {}, state: "loading" };
let inflight: Promise<void> | null = null;
let timer: number | null = null;
const listeners = new Set<() => void>();
const POLL_MS = 5000;

function emit() {
  for (const l of listeners) l();
}

function absorb(data: HubTunablesResponse) {
  const byId: Record<string, HubTunable> = {};
  for (const r of data.rows) byId[r.entity_id] = r;
  cache = { data, byId, state: "ready" };
}

export async function refreshHubTunables(): Promise<void> {
  if (inflight) return inflight;
  inflight = getHubTunables()
    .then((d) => absorb(d))
    .catch((e: unknown) => {
      cache = { ...cache, state: "error", error: e instanceof Error ? e.message : String(e) };
    })
    .finally(() => {
      inflight = null;
      emit();
    });
  return inflight;
}

function replaceRow(row: HubTunable) {
  if (!cache.data) return;
  const rows = cache.data.rows.map((r) => (r.entity_id === row.entity_id ? row : r));
  absorb({ ...cache.data, rows });
  emit();
}

/**
 * Brain-owned hub tunables with their sync state. Polls every 5 s while any row is
 * mounted so PENDING → SYNCED shows within one ingest poll of a write. Writes replace
 * the row at once with the brain's echo-aware answer.
 */
export function useHubTunables(): Snapshot & {
  refresh: () => Promise<void>;
  set: (entityId: string, value: string | number | boolean) => Promise<HubTunable>;
  adopt: (entityId: string) => Promise<HubTunable>;
  push: (entityId: string) => Promise<HubTunable>;
} {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (cache.state === "loading" && !inflight) void refreshHubTunables();
    if (timer == null) {
      timer = window.setInterval(() => {
        if (cache.state !== "error") void refreshHubTunables();
      }, POLL_MS);
    }
    return () => {
      listeners.delete(l);
      if (!listeners.size && timer != null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  const set = useCallback(async (entityId: string, value: string | number | boolean) => {
    const row = await patchHubTunable(entityId, value);
    replaceRow(row);
    return row;
  }, []);
  const adopt = useCallback(async (entityId: string) => {
    const row = await adoptHubTunable(entityId);
    replaceRow(row);
    return row;
  }, []);
  const push = useCallback(async (entityId: string) => {
    const row = await pushHubTunable(entityId);
    replaceRow(row);
    return row;
  }, []);
  return { ...cache, refresh: refreshHubTunables, set, adopt, push };
}
