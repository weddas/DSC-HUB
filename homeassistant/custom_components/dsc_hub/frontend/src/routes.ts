import { lazy } from "react";

export type PrimarySection = "live" | "grow" | "tune" | "fleet";

/** Route-level code splits — Tune, Fleet, Calibrate, Learning. */
export const TuneLearningPage = lazy(() =>
  import("./pages/TuneFleetPages").then((m) => ({ default: m.TuneLearningPage })),
);
export const TuneAnalyticsPage = lazy(() =>
  import("./pages/TuneFleetPages").then((m) => ({ default: m.TuneAnalyticsPage })),
);
export const FleetOverviewPage = lazy(() =>
  import("./pages/TuneFleetPages").then((m) => ({ default: m.FleetOverviewPage })),
);
export const CalibratePage = lazy(() =>
  import("./pages/CalibratePage").then((m) => ({ default: m.CalibratePage })),
);

export interface TabRoute {
  id: string;
  label: string;
  path: string;
  /** Must be a registered IconName — icon gate. */
  icon: string;
  /** Short tent/context line under tab label (7.4 T-03). */
  subtitle?: string;
  /** Secondary tab shown after cockpit routes — not a peer "home". */
  demoted?: boolean;
}

export const PRIMARY_TABS: { id: PrimarySection; label: string; path: string; icon: string }[] = [
  { id: "live", label: "Live", path: "/live/overview", icon: "live" },
  { id: "grow", label: "Grow", path: "/grow/roster", icon: "grow" },
  { id: "tune", label: "Tune", path: "/tune/learning", icon: "tune" },
  { id: "fleet", label: "Fleet", path: "/fleet", icon: "fleet" },
];

export const SECONDARY_TABS: Record<PrimarySection, TabRoute[]> = {
  live: [
    { id: "overview", label: "Overview", path: "/live/overview", icon: "home" },
    { id: "climate", label: "Climate", path: "/live/climate", icon: "climate" },
    { id: "main", label: "4×8", subtitle: "Flower", path: "/live/4x8", icon: "tent" },
    { id: "clone", label: "2×4", subtitle: "Clone & veg", path: "/live/2x4", icon: "clone" },
    { id: "root", label: "Root", path: "/live/root", icon: "root" },
    { id: "light", label: "Light", path: "/live/light", icon: "lighting" },
    { id: "twin", label: "Twin", subtitle: "3D view", path: "/live/twin", icon: "twin", demoted: true },
    { id: "mission", label: "Mission", subtitle: "Triage", path: "/live/mission", icon: "mission", demoted: true },
    { id: "dash", label: "Dash", subtitle: "Legacy", path: "/ops/home", icon: "dash", demoted: true },
  ],
  grow: [
    { id: "roster", label: "Roster", path: "/grow/roster", icon: "roster" },
    { id: "compose", label: "Compose", path: "/grow/compose", icon: "compose" },
    { id: "research", label: "Research", path: "/grow/research", icon: "research" },
  ],
  tune: [
    { id: "learning", label: "Learning", path: "/tune/learning", icon: "learning" },
    { id: "analytics", label: "Analytics", path: "/tune/analytics", icon: "analytics" },
  ],
  fleet: [
    { id: "overview", label: "Overview", path: "/fleet", icon: "fleet" },
    { id: "calibrate", label: "Calibrate", path: "/fleet/calibrate", icon: "learning" },
    { id: "settings", label: "Settings", path: "/fleet/settings", icon: "settings" },
  ],
};

/** Legacy paths → 7.1 destinations (query preserved by caller when needed). */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/": "/live/overview",
  "/ops": "/ops/home",
  "/ops/home": "/ops/home",
  "/ops/dash": "/ops/dash",
  "/ops/climate": "/live/climate",
  "/ops/main-4x8": "/live/4x8",
  "/ops/clone-2x4": "/live/2x4",
  "/ops/root-zone": "/live/root",
  "/ops/plant-seat": "/live/root",
  "/ops/tank": "/fleet",
  "/ops/lighting": "/live/light",
  "/plant": "/grow/roster",
  "/plant/build": "/grow/compose",
  "/plant/catalog": "/grow/research",
  "/plant/seat": "/grow/roster",
  "/plant/strains": "/grow/roster",
  "/plant/nutrient": "/grow/compose",
  "/advanced": "/tune/learning",
  "/advanced/learning": "/tune/learning",
  "/advanced/trends": "/tune/analytics",
  "/advanced/history": "/tune/analytics",
  "/system": "/fleet",
  "/settings": "/fleet/settings",
};

export function sectionFromPath(pathname: string): PrimarySection {
  if (pathname.startsWith("/grow") || pathname.startsWith("/plant")) return "grow";
  if (pathname.startsWith("/tune") || pathname.startsWith("/advanced")) return "tune";
  if (pathname.startsWith("/fleet") || pathname.startsWith("/system") || pathname.startsWith("/settings")) return "fleet";
  if (pathname.startsWith("/ops")) return "live";
  return "live";
}

export function resolveLegacyRedirect(pathname: string, search: string): string | null {
  const target = LEGACY_REDIRECTS[pathname];
  if (!target) return null;
  if (target.includes("?")) {
    // Explicit query in map wins; append leftover search keys only if empty.
    return target;
  }
  return `${target}${search || ""}`;
}
