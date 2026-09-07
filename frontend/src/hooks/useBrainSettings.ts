import { useEffect, useState } from "react";
import { get_settings } from "../lib/fleetApi";

type Snapshot = { values: Record<string, string>; state: "loading" | "ready" | "error" };

let cache: Snapshot = { values: {}, state: "loading" };
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export async function refreshBrainSettings(): Promise<void> {
  if (inflight) return inflight;
  inflight = get_settings()
    .then((s) => {
      cache = { values: s.settings, state: "ready" };
    })
    .catch(() => {
      cache = { ...cache, state: "error" };
    })
    .finally(() => {
      inflight = null;
      emit();
    });
  return inflight;
}

/**
 * The brain's public key-value settings (`GET /settings`), fetched once and shared. Exists so
 * derived numbers on the desks read the same value the brain uses — the leaf-to-air
 * offset was the first case of an SPA constant drifting from the brain's setting.
 */
export function useBrainSettings(): Snapshot & { refresh: () => Promise<void> } {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (cache.state === "loading" && !inflight) void refreshBrainSettings();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { ...cache, refresh: refreshBrainSettings };
}

/** Numeric brain setting with a fallback (used while loading or on an old brain). */
export function useBrainNumber(key: string, fallback: number): number {
  const { values } = useBrainSettings();
  const n = Number(values[key]);
  return Number.isFinite(n) ? n : fallback;
}
