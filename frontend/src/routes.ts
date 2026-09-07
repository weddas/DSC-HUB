import { lazy } from "react";

/**
 * Navigation model (v2 dashboard, Pass A).
 *
 * One flat row of *desks* — what you are looking at — never *which zone*. Zone is
 * context (`?zone=`) carried by the desks that own it (Climate, Root, Light). Sub-tabs
 * exist only where a desk has real sub-surfaces. Settings is the gear, not a desk.
 * See docs/design/plan-v2-dashboard-2026-09-06.md § Navigation.
 */

export type DeskId =
  | "overview"
  | "climate"
  | "root"
  | "light"
  | "plants"
  | "cannalib"
  | "logs"
  | "alerts"
  | "kit";

/** Which accent the active underline takes — live (blue), grow (teal), kit (purple). */
export type DeskAccent = "live" | "grow" | "kit";

export interface SubTab {
  id: string;
  label: string;
  path: string;
  /** NavLink `end` — match only the exact path (index sub-tab). */
  end?: boolean;
}

export interface Desk {
  id: DeskId;
  label: string;
  /** Canonical path of the desk (its index sub-tab when it has sub-tabs). */
  path: string;
  /** Must be a registered IconName — icon gate. */
  icon: string;
  accent: DeskAccent;
  /** Desk reads/writes `?zone=` and shows the zone strip. */
  zone?: boolean;
  /** Real sub-surfaces rendered as a small underline row under the desk nav. */
  sub?: SubTab[];
  /** Appears in the phone bottom bar (the rest live under "More"). */
  mobile?: boolean;
}

export const DESKS: Desk[] = [
  { id: "overview", label: "Overview", path: "/overview", icon: "dashboard-home", accent: "live", mobile: true },
  {
    id: "climate",
    label: "Climate",
    path: "/climate",
    icon: "vpd-gauge",
    accent: "live",
    zone: true,
    mobile: true,
    sub: [
      { id: "room", label: "Room", path: "/climate", end: true },
      { id: "tent", label: "Tent", path: "/climate/tent" },
    ],
  },
  { id: "root", label: "Root", path: "/root", icon: "root-system", accent: "live", zone: true },
  { id: "light", label: "Light", path: "/light", icon: "grow-light", accent: "live", zone: true },
  {
    id: "plants",
    label: "Plants",
    path: "/plants/roster",
    icon: "cannabis-leaf",
    accent: "grow",
    mobile: true,
    sub: [
      { id: "roster", label: "Roster", path: "/plants/roster" },
      { id: "compose", label: "Compose", path: "/plants/compose" },
    ],
  },
  { id: "cannalib", label: "CannaLib", path: "/cannalib", icon: "dna-strand", accent: "grow" },
  { id: "logs", label: "Logs", path: "/logs", icon: "journal", accent: "grow" },
  { id: "alerts", label: "Alerts", path: "/alerts", icon: "alert-triangle", accent: "live", mobile: true },
  {
    id: "kit",
    label: "Kit",
    path: "/kit",
    icon: "controller-hub",
    accent: "kit",
    sub: [
      { id: "inventory", label: "Inventory", path: "/kit", end: true },
      { id: "learning", label: "Learning", path: "/kit/learning" },
      { id: "calibrate", label: "Calibrate", path: "/kit/calibrate" },
    ],
  },
];

export const SETTINGS_PATH = "/settings/device";

export const SETTINGS_SECTIONS = [
  "zones",
  "hub",
  "brain",
  "device",
  "api",
  "network",
  "server",
  "system",
  "general",
] as const;

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number];

/** Settings sections — rendered by SettingsPage as a rail (desktop) / list (mobile). */
export const SETTINGS_TABS: { id: SettingsSectionId; label: string; subtitle?: string; path: string; icon: string }[] = [
  { id: "zones", label: "Zones", subtitle: "Roles", path: "/settings/zones", icon: "site" },
  { id: "hub", label: "Hub", subtitle: "Backup", path: "/settings/hub", icon: "backup-restore" },
  { id: "brain", label: "Brain", subtitle: "Tuning", path: "/settings/brain", icon: "target-goal" },
  { id: "device", label: "Device", subtitle: "Kit", path: "/settings/device", icon: "smart-outlet" },
  { id: "api", label: "API", subtitle: "Integrations", path: "/settings/api", icon: "barcode-tag" },
  { id: "network", label: "Network", subtitle: "AP", path: "/settings/network", icon: "network-ap" },
  { id: "server", label: "Server", subtitle: "Jobs", path: "/settings/server", icon: "server-jobs" },
  { id: "system", label: "System", subtitle: "Logs", path: "/settings/system", icon: "data-log" },
  { id: "general", label: "General", path: "/settings/general", icon: "settings-gear" },
];

/** Route-level code splits — Kit, Calibrate, Learning. */
export const TuneLearningPage = lazy(() =>
  import("./pages/TuneFleetPages").then((m) => ({ default: m.TuneLearningPage })),
);
export const FleetOverviewPage = lazy(() =>
  import("./pages/TuneFleetPages").then((m) => ({ default: m.FleetOverviewPage })),
);
export const CalibratePage = lazy(() =>
  import("./pages/CalibratePage").then((m) => ({ default: m.CalibratePage })),
);

function firstSegment(pathname: string): string {
  return pathname.replace(/^\/+/, "").split("/")[0] || "";
}

/** Desk that owns a path, `"settings"` for the gear, `null` for setup/unknown. */
export function deskFromPath(pathname: string): DeskId | "settings" | null {
  const seg = firstSegment(pathname);
  if (seg === "settings") return "settings";
  const desk = DESKS.find((d) => firstSegment(d.path) === seg);
  return desk ? desk.id : null;
}

export function deskById(id: DeskId): Desk {
  const desk = DESKS.find((d) => d.id === id);
  if (!desk) throw new Error(`unknown desk ${id}`);
  return desk;
}

/** Desks that read/write `?zone=` — the Shell strips the param everywhere else. */
export function deskOwnsZone(pathname: string): boolean {
  const id = deskFromPath(pathname);
  if (!id || id === "settings") return false;
  return !!deskById(id).zone;
}

export function parseSettingsSection(pathname: string): SettingsSectionId {
  const part = pathname.replace(/^\/settings\/?/, "").split("/")[0] || "device";
  return (SETTINGS_SECTIONS as readonly string[]).includes(part)
    ? (part as SettingsSectionId)
    : "device";
}

/**
 * Legacy paths → v2 desks. Every pre-Pass-A path (7.x `/live/*`, `/grow/*`, `/fleet*`,
 * and the older `/ops/*`, `/plant/*`, `/tune/*`, `/advanced/*`, `/system`) lands on its
 * desk; the caller preserves the query unless the map carries its own.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/": "/overview",
  "/live": "/overview",
  "/live/overview": "/overview",
  "/live/twin": "/overview",
  "/live/mission": "/alerts",
  "/live/climate": "/climate",
  "/live/4x8": "/climate/tent?zone=main",
  "/live/main": "/climate/tent?zone=main",
  "/live/2x4": "/climate/tent?zone=clone",
  "/live/clone": "/climate/tent?zone=clone",
  "/live/root": "/root",
  "/live/light": "/light",
  "/grow": "/plants/roster",
  "/grow/roster": "/plants/roster",
  "/grow/compose": "/plants/compose",
  "/grow/research": "/cannalib",
  "/grow/logs": "/logs",
  "/fleet": "/kit",
  "/fleet/learning": "/kit/learning",
  "/fleet/calibrate": "/kit/calibrate",
  "/fleet/settings": "/settings/device",
  "/ops": "/overview",
  "/ops/home": "/overview",
  "/ops/dash": "/overview",
  "/ops/climate": "/climate",
  "/ops/main-4x8": "/climate/tent?zone=main",
  "/ops/clone-2x4": "/climate/tent?zone=clone",
  "/ops/root-zone": "/root",
  "/ops/plant-seat": "/root",
  "/ops/tank": "/kit",
  "/ops/lighting": "/light",
  "/plant": "/plants/roster",
  "/plant/build": "/plants/compose",
  "/plant/catalog": "/cannalib",
  "/plant/seat": "/plants/roster",
  "/plant/strains": "/plants/roster",
  "/plant/nutrient": "/plants/compose",
  "/advanced": "/kit/learning",
  "/advanced/learning": "/kit/learning",
  "/advanced/trends": "/logs?view=trends&scope=space&id=4x8",
  "/advanced/history": "/logs?view=trends&scope=space&id=4x8",
  "/tune": "/kit/learning",
  "/tune/learning": "/kit/learning",
  "/tune/analytics": "/logs?view=trends&scope=space&id=4x8",
  "/system": "/kit",
  "/settings": "/settings/device",
};

/** `?tent=` was the 7.x zone param; v2 desks read `?zone=`. */
function migrateZoneQuery(search: string): string {
  if (!search) return "";
  const p = new URLSearchParams(search);
  const tent = p.get("tent");
  if (tent != null) {
    p.delete("tent");
    if (!p.has("zone")) p.set("zone", tent);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function resolveLegacyRedirect(pathname: string, search: string): string | null {
  const target = LEGACY_REDIRECTS[pathname];
  if (!target) return null;
  if (target.includes("?")) {
    // Explicit query in map wins.
    return target;
  }
  return `${target}${migrateZoneQuery(search)}`;
}
