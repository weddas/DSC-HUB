import type { ZoneFocus } from "../hooks/useZoneFocus";

/**
 * Typed route builders — the only place a desk path is spelled. Call sites use
 * `paths.climate({ zone: "main" })`, never a string, so the next IA change is one file.
 */

function withZone(base: string, zone?: ZoneFocus): string {
  return zone ? `${base}?zone=${zone}` : base;
}

export const paths = {
  overview: () => "/overview",
  climate: (opts?: { zone?: ZoneFocus }) => withZone("/climate", opts?.zone),
  /** Tent cockpit — the per-tent sub-surface of the Climate desk. */
  tent: (zone: "main" | "clone") => `/climate/tent?zone=${zone}`,
  root: (opts?: { zone?: ZoneFocus; pot?: number }) => {
    const p = new URLSearchParams();
    if (opts?.zone) p.set("zone", opts.zone);
    if (opts?.pot != null) p.set("pot", String(opts.pot));
    const s = p.toString();
    return s ? `/root?${s}` : "/root";
  },
  light: (opts?: { zone?: ZoneFocus }) => withZone("/light", opts?.zone),
  roster: () => "/plants/roster",
  compose: () => "/plants/compose",
  cannalib: () => "/cannalib",
  logs: (search?: string) => (search ? `/logs?${search.replace(/^\?/, "")}` : "/logs"),
  alerts: () => "/alerts",
  kit: () => "/kit",
  learning: () => "/kit/learning",
  calibrate: () => "/kit/calibrate",
  settings: (section = "device") => `/settings/${section}`,
  setup: () => "/setup",
} as const;
