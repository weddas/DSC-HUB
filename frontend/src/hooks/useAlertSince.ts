import { useMemo, useSyncExternalStore } from "react";

/**
 * When did this SPA first see an alert active? The bus fabricates `last_changed` (every
 * compat entity is stamped "now"), so the only honest "since" is the moment this session
 * first observed the alert. Labelled as such wherever it is shown.
 */
const firstSeen = new Map<string, number>();
const listeners = new Set<() => void>();
let version = 0;

function notify() {
  version += 1;
  for (const l of listeners) l();
}

export function markAlertsActive(activeIds: string[]): void {
  const now = Date.now();
  let changed = false;
  const active = new Set(activeIds);
  for (const id of activeIds) {
    if (!firstSeen.has(id)) {
      firstSeen.set(id, now);
      changed = true;
    }
  }
  for (const id of Array.from(firstSeen.keys())) {
    if (!active.has(id)) {
      firstSeen.delete(id);
      changed = true;
    }
  }
  if (changed) notify();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useAlertSince(activeIds: string[]): (id: string) => number | null {
  markAlertsActive(activeIds);
  useSyncExternalStore(subscribe, () => version, () => version);
  return useMemo(() => (id: string) => firstSeen.get(id) ?? null, [version]); // eslint-disable-line react-hooks/exhaustive-deps
}
