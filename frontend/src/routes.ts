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
  | "kit"
  | "twin";

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
  /** The room live in 3D — a view of Zone state, never a data source (plan § 3D twin). */
  { id: "twin", label: "Twin", path: "/twin", icon: "twin-3d", accent: "kit", zone: true },
];

export const SETTINGS_PATH = "/settings/preferences";

/**
 * Settings sections (plan-settings-2026-09-07 § Part 4). Grouped by the question the
 * operator asks — You / The grow / The kit — never by which process stores the answer.
 * Sections whose pass has not landed yet are absent from the rail (no dead pages).
 */
export const SETTINGS_SECTIONS = [
  "preferences",
  "alerts",
  "zones",
  "climate",
  "light",
  "root",
  "sensors",
  "automation",
  "devices",
  "integrations",
  "network",
  "system",
] as const;

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number];

export interface SettingsTab {
  id: SettingsSectionId;
  label: string;
  path: string;
  /** Must be a registered IconName — icon gate. */
  icon: string;
  /** Sentence headline for the section page. */
  headline: string;
  /** One-line subline under the headline. */
  subline: string;
}

export interface SettingsGroup {
  id: "you" | "grow" | "kit";
  label: string;
  sections: SettingsSectionId[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  { id: "you", label: "You", sections: ["preferences", "alerts"] },
  { id: "grow", label: "The grow", sections: ["zones", "climate", "light", "root", "sensors", "automation"] },
  { id: "kit", label: "The kit", sections: ["devices", "integrations", "network", "system"] },
];

export const SETTINGS_TABS: SettingsTab[] = [
  {
    id: "preferences",
    label: "Preferences",
    path: "/settings/preferences",
    icon: "settings-gear",
    headline: "How this browser shows the grow.",
    subline: "Appearance, units, home and charts. Stored here, not on the hub — a phone and a laptop can differ.",
  },
  {
    id: "alerts",
    label: "Alerts",
    path: "/settings/alerts",
    icon: "bell",
    headline: "What the hub tells you, and how.",
    subline: "Every alert the hub can raise, its severity, quiet hours, and this browser's toast and tone.",
  },
  {
    id: "zones",
    label: "Zones",
    path: "/settings/zones",
    icon: "site",
    headline: "Rooms and tents — name them, flip their role in place.",
    subline: "A zone keeps its history when its role changes.",
  },
  {
    id: "climate",
    label: "Climate",
    path: "/settings/climate",
    icon: "vpd-gauge",
    headline: "What the room lung is asked to do.",
    subline: "Fan demand scale here; live targets and modes stay on the Climate desk.",
  },
  {
    id: "light",
    label: "Light",
    path: "/settings/light",
    icon: "grow-light",
    headline: "Lamps, tariff and the energy estimate.",
    subline: "Schedules stay on the Light desk; this is what they cost and how bright they may go.",
  },
  {
    id: "root",
    label: "Root",
    path: "/settings/root",
    icon: "root-system",
    headline: "Substrate references the Root desk draws.",
    subline: "Dry line today; steering targets and the heat mat arrive with the hub rows.",
  },
  {
    id: "sensors",
    label: "Sensors",
    path: "/settings/sensors",
    icon: "temp-humidity-sensor",
    headline: "What a reading is trusted to mean.",
    subline: "Per-zone offsets, the leaf-to-air assumption, and the clamps behind every number.",
  },
  {
    id: "automation",
    label: "Automation",
    path: "/settings/automation",
    icon: "timer",
    headline: "Rules the hub runs without you.",
    subline: "Compound conditions, windows, debounce and release — the Alerts desk shows what fired.",
  },
  {
    id: "devices",
    label: "Devices",
    path: "/settings/devices",
    icon: "smart-outlet",
    headline: "Inventory, assignment, Zigbee and firmware.",
    subline: "Everything the brain is allowed to read from or act on.",
  },
  {
    id: "integrations",
    label: "Integrations",
    path: "/settings/integrations",
    icon: "barcode-tag",
    headline: "Ollama, CannaLib and the catalogs.",
    subline: "Local-first; each one has a test button and an honest status.",
  },
  {
    id: "network",
    label: "Network",
    path: "/settings/network",
    icon: "network-ap",
    headline: "SoftAP and the LAN uplink.",
    subline: "Apply restarts hub Wi-Fi — devices reconnect on their own.",
  },
  {
    id: "system",
    label: "System",
    path: "/settings/system",
    icon: "server-jobs",
    headline: "Backup, logs, storage and power.",
    subline: "The widest blast radius lives here.",
  },
];

export function settingsTab(id: SettingsSectionId): SettingsTab {
  const tab = SETTINGS_TABS.find((t) => t.id === id);
  if (!tab) throw new Error(`unknown settings section ${id}`);
  return tab;
}

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

export function parseSettingsSection(pathname: string): SettingsSectionId | null {
  const part = pathname.replace(/^\/settings\/?/, "").split("/")[0] || "preferences";
  return (SETTINGS_SECTIONS as readonly string[]).includes(part) ? (part as SettingsSectionId) : null;
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
  "/live/twin": "/twin",
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
  "/fleet/settings": "/settings/devices",
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
  "/settings": "/settings/preferences",
  "/settings/general": "/settings/preferences",
  "/settings/brain": "/settings/sensors",
  "/settings/hub": "/settings/system#backup",
  "/settings/server": "/settings/devices#firmware",
  "/settings/device": "/settings/devices",
  "/settings/api": "/settings/integrations",
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
  if (target.includes("?") || target.includes("#")) {
    // Explicit query / anchor in map wins.
    return target;
  }
  return `${target}${migrateZoneQuery(search)}`;
}

/**
 * Desks in the operator's preferred order with hidden ones removed (Preferences › Home).
 * Unknown ids are ignored; desks missing from the order keep their default position at
 * the end, so a new desk shows up without a preference migration.
 */
export function orderDesks(order: readonly DeskId[], hidden: readonly DeskId[]): Desk[] {
  const byId = new Map(DESKS.map((d) => [d.id, d] as const));
  const seen = new Set<DeskId>();
  const out: Desk[] = [];
  for (const id of order) {
    const d = byId.get(id);
    if (d && !seen.has(id)) {
      seen.add(id);
      out.push(d);
    }
  }
  for (const d of DESKS) if (!seen.has(d.id)) out.push(d);
  return out.filter((d) => !hidden.includes(d.id));
}

/** Phone bottom-bar desks — the operator's picks (max four), else the default `mobile` set. */
export function bottomBarDesks(picked: readonly DeskId[], hidden: readonly DeskId[]): Desk[] {
  const chosen = picked.length ? picked : DESKS.filter((d) => d.mobile).map((d) => d.id);
  return orderDesks(chosen, hidden).filter((d) => chosen.includes(d.id)).slice(0, 4);
}
