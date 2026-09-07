import { useCallback, useEffect, useState } from "react";
import { getAlertPrefs, patchAlertPrefs, type AlertPref, type AlertPrefs, type AlertSeverity, type QuietHours } from "../lib/alertPrefsApi";

type Snapshot = { data: AlertPrefs | null; state: "loading" | "ready" | "error"; error?: string };

let cache: Snapshot = { data: null, state: "loading" };
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export async function refreshAlertPrefs(): Promise<void> {
  if (inflight) return inflight;
  inflight = getAlertPrefs()
    .then((d) => {
      cache = { data: d, state: "ready" };
    })
    .catch((e: unknown) => {
      cache = { ...cache, state: "error", error: e instanceof Error ? e.message : String(e) };
    })
    .finally(() => {
      inflight = null;
      emit();
    });
  return inflight;
}

/**
 * Shared alert catalogue preferences. On an old brain (no route) every alert stays
 * enabled and counts as critical, exactly as before the catalogue existed — disabling is a convenience, never a safety gate.
 */
export function useAlertPrefs(): Snapshot & {
  refresh: () => Promise<void>;
  isEnabled: (entityId: string) => boolean;
  severityOf: (entityId: string) => AlertSeverity;
  quietHours: QuietHours | null;
  setAlert: (entityId: string, pref: AlertPref) => Promise<void>;
  setQuietHours: (q: QuietHours | null) => Promise<void>;
} {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (cache.state === "loading" && !inflight) void refreshAlertPrefs();
    return () => {
      listeners.delete(l);
    };
  }, []);
  const data = cache.data;
  const isEnabled = useCallback((id: string) => data?.alerts[id]?.enabled !== false, [data]);
  const severityOf = useCallback(
    (id: string): AlertSeverity => (data ? data.alerts[id]?.severity ?? data.default_severity[id] ?? data.baseline_severity ?? "warn" : "critical"),
    [data],
  );
  const setAlert = useCallback(async (id: string, pref: AlertPref) => {
    const next = await patchAlertPrefs({ alerts: { [id]: pref } });
    cache = { data: next, state: "ready" };
    emit();
  }, []);
  const setQuietHours = useCallback(async (q: QuietHours | null) => {
    const next = await patchAlertPrefs(q ? { quiet_hours: q } : { clear_quiet_hours: true });
    cache = { data: next, state: "ready" };
    emit();
  }, []);
  return { ...cache, refresh: refreshAlertPrefs, isEnabled, severityOf, quietHours: data?.quiet_hours ?? null, setAlert, setQuietHours };
}

/** Non-hook read for call sites that only need the enabled check (e.g. activeAlertIds). */
export function alertEnabled(entityId: string): boolean {
  return cache.data?.alerts[entityId]?.enabled !== false;
}
