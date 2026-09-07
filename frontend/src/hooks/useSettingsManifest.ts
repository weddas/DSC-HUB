import { useEffect, useState } from "react";
import { get_settings_manifest, type SettingsManifestRow } from "../lib/fleetApi";

type Snapshot = {
  rows: Record<string, SettingsManifestRow>;
  values: Record<string, unknown>;
  state: "loading" | "ready" | "error";
  error?: string;
};

let cache: Snapshot = { rows: {}, values: {}, state: "loading" };
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export async function refreshSettingsManifest(): Promise<void> {
  if (inflight) return inflight;
  inflight = get_settings_manifest()
    .then((m) => {
      const rows: Record<string, SettingsManifestRow> = {};
      for (const r of m.rows) rows[r.key] = r;
      cache = { rows, values: m.values, state: "ready" };
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
 * The brain's settings manifest (defaults, ranges, units, consumers) — fetched once and
 * shared. An old brain that lacks the route degrades to `state: "error"`; rows then fall
 * back to the SPA-side defaults their callers pass.
 */
export function useSettingsManifest(): Snapshot & { refresh: () => Promise<void> } {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (cache.state === "loading" && !inflight) void refreshSettingsManifest();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { ...cache, refresh: refreshSettingsManifest };
}

/** Human default label for a manifest row, e.g. `2 °C`, `1.00`, `on`. */
export function manifestDefaultLabel(row: SettingsManifestRow | undefined, fallback?: string): string | undefined {
  if (!row) return fallback;
  const d = row.default;
  if (d == null || d === "") return fallback ?? "—";
  if (typeof d === "boolean") return d ? "on" : "off";
  if (typeof d === "object") return fallback;
  const text = typeof d === "number" ? String(d) : String(d);
  return row.unit ? `${text} ${row.unit}` : text;
}
