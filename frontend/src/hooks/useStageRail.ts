import { useCallback, useEffect, useState } from "react";
import { applyStageRail, getStageRail, patchStageRail, resetStageRail, type StageRailResponse, type StageRailRow } from "../lib/hubTunablesApi";
import { applyBrainStageRail } from "../lib/tentWant";

type Snapshot = { data: StageRailResponse | null; state: "loading" | "ready" | "error"; error?: string };

let cache: Snapshot = { data: null, state: "loading" };
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function absorb(data: StageRailResponse) {
  cache = { data, state: "ready" };
  // The desks' stage rail (Want bands, chips) follows the brain's table, not the SPA constant.
  applyBrainStageRail(data.rows);
}

export async function refreshStageRail(): Promise<void> {
  if (inflight) return inflight;
  inflight = getStageRail()
    .then(absorb)
    .catch((e: unknown) => {
      cache = { ...cache, state: "error", error: e instanceof Error ? e.message : String(e) };
    })
    .finally(() => {
      inflight = null;
      emit();
    });
  return inflight;
}

/** The brain's stage presets (shared store); an old brain leaves the SPA constant in place. */
export function useStageRail(): Snapshot & {
  refresh: () => Promise<void>;
  patch: (stage: string, fields: Record<string, number>) => Promise<StageRailRow>;
  reset: (stage?: string) => Promise<void>;
  apply: (stage: string) => Promise<Record<string, string>>;
} {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (cache.state === "loading" && !inflight) void refreshStageRail();
    return () => {
      listeners.delete(l);
    };
  }, []);
  const patch = useCallback(async (stage: string, fields: Record<string, number>) => {
    const row = await patchStageRail(stage, fields);
    if (cache.data) absorb({ ...cache.data, rows: cache.data.rows.map((r) => (r.stage === row.stage ? row : r)) });
    emit();
    return row;
  }, []);
  const reset = useCallback(async (stage?: string) => {
    const rows = await resetStageRail(stage);
    if (cache.data) absorb({ ...cache.data, rows });
    emit();
  }, []);
  const apply = useCallback(async (stage: string) => (await applyStageRail(stage)).written, []);
  return { ...cache, refresh: refreshStageRail, patch, reset, apply };
}
