# Routes

HashRouter SPA. Browser URLs are `#/live/overview` etc. (pathname inside the router is `/live/overview`).
All pages render inside `Shell` (`src/App.tsx`). Providers wrap Shell in `App`.

Config: `src/routes.ts` (tabs, legacy map, lazy Tune/Fleet/Calibrate) + `<Routes>` in `src/App.tsx`.

## Route map

| URL path | Hash URL | Component file | Export | Layout |
|---|---|---|---|---|
| `/` | `#/` | redirect | → `/live/overview` | Shell |
| `/live` | `#/live` | redirect | → `/live/overview` | Shell |
| `/live/overview` | `#/live/overview` | `src/pages/OverviewPage.tsx` | `OverviewPage` | Shell |
| `/live/mission` | `#/live/mission` | `src/pages/LiveMissionPage.tsx` | `LiveMissionPage` | Shell |
| `/live/twin` | `#/live/twin` | `src/pages/LivePages.tsx` | `LiveTwinPage` | Shell |
| `/live/climate` | `#/live/climate` | `src/pages/ClimatePage.tsx` (re-export `LivePages.tsx`) | `LiveClimatePage` | Shell |
| `/live/4x8` | `#/live/4x8` | `src/pages/LivePages.tsx` | `LiveMainPage` | Shell |
| `/live/2x4` | `#/live/2x4` | `src/pages/LivePages.tsx` | `LiveClonePage` | Shell |
| `/live/main` | `#/live/main` | redirect | → `/live/4x8` | Shell |
| `/live/clone` | `#/live/clone` | redirect | → `/live/2x4` | Shell |
| `/live/root` | `#/live/root` | `src/pages/RootPage.tsx` (re-export `LivePages.tsx`) | `LiveRootPage` | Shell |
| `/live/light` | `#/live/light` | `src/pages/LightPage.tsx` (re-export `LivePages.tsx`) | `LiveLightPage` | Shell |
| `/grow` | `#/grow` | redirect | → `/grow/roster` | Shell |
| `/grow/roster` | `#/grow/roster` | `src/pages/GrowPages.tsx` | `GrowRosterPage` | Shell |
| `/grow/compose` | `#/grow/compose` | `src/pages/GrowPages.tsx` | `GrowComposePage` | Shell |
| `/grow/research` | `#/grow/research` | `src/pages/GrowPages.tsx` | `GrowResearchPage` | Shell |
| `/tune` | `#/tune` | redirect | → `/tune/learning` | Shell |
| `/tune/learning` | `#/tune/learning` | `src/pages/TuneFleetPages.tsx` (lazy via `routes.ts`) | `TuneLearningPage` | Shell |
| `/tune/analytics` | `#/tune/analytics` | `src/pages/TuneFleetPages.tsx` (lazy) | `TuneAnalyticsPage` | Shell |
| `/fleet` | `#/fleet` | `src/pages/TuneFleetPages.tsx` (lazy) | `FleetOverviewPage` | Shell |
| `/fleet/calibrate` | `#/fleet/calibrate` | `src/pages/CalibratePage.tsx` (lazy) | `CalibratePage` | Shell |
| `/fleet/settings` | `#/fleet/settings` | redirect | → `/settings/device` | Shell |
| `/settings` | `#/settings` | redirect | → `/settings/device` | Shell |
| `/settings/:section` | `#/settings/hub` … `#/settings/general` | `src/pages/SettingsPage.tsx` | `SettingsPage` | Shell |
| `/ops/home` | `#/ops/home` | `src/pages/DashHomePage.tsx` | `DashHomePage` | Shell |
| `/ops/dash` | `#/ops/dash` | `src/pages/LivePages.tsx` | `LiveTwinPage` | Shell |
| `/ops/*` | `#/ops/…` | `LegacyRedirect` in `App.tsx` | `resolveLegacyRedirect` | Shell |
| `/plant`, `/plant/*` | `#/plant/…` | `LegacyRedirect` | `resolveLegacyRedirect` | Shell |
| `/advanced`, `/advanced/*` | `#/advanced/…` | `LegacyRedirect` | `resolveLegacyRedirect` | Shell |
| `/system` | `#/system` | `LegacyRedirect` | `resolveLegacyRedirect` | Shell |
| `*` | unknown hash | `NotFoundPage` in `App.tsx` | — | Shell |

Settings `:section` ids from `SETTINGS_SECTIONS`: `hub` | `brain` | `device` | `api` | `network` | `server` | `general`.

Secondary Live tabs also expose demoted Dash at `/ops/home` (`demoted: true`).

## Key page summaries

- **/live/overview (`OverviewPage`)** — Operational home: critical alerts, area vitals/bands, duties, root strip, grow log. Prefer this over Dash.
- **/live/climate (`LiveClimatePage` in `ClimatePage.tsx`)** — Want→Got climate desk: gauges, airflow map, Sankey, tent targets, zone focus.
- **/live/root (`LiveRootPage` in `RootPage.tsx`)** — Probe/plant root desk: moisture/EC gauges, soil test, plant seat drawer.
- **/live/light (`LiveLightPage` in `LightPage.tsx`)** — Photoperiod / PPFD / DLI / crop scheduler / tent clocks.
- **/live/4x8 (`LiveMainPage`)** / **/live/2x4 (`LiveClonePage`)** — Tent desks (Flower vs Clone & veg) in `LivePages.tsx`.
- **/live/twin (`LiveTwinPage`)** — 3D twin viewport (`TwinViewport` + `TwinKeepAlive` portal). Also `/ops/dash`.
- **/live/mission (`LiveMissionPage`)** — Triage: honesty next-step, kit pulse, pot seats, alerts. Demoted secondary tab.
- **/grow/roster (`GrowRosterPage`)** — Plant roster, assign/detach probes, seat drawer.
- **/grow/compose (`GrowComposePage`)** — `ComposePlant` → `PlantWizard`.
- **/grow/research (`GrowResearchPage`)** — `CatalogResearch`.
- **/tune/learning (`TuneLearningPage`)** — `LearningWizard` (CFM/anemometer learning).
- **/tune/analytics (`TuneAnalyticsPage`)** — History charts / timespan.
- **/fleet (`FleetOverviewPage`)** — Kit pulse, hub link, tank cutaway, in-service toggles.
- **/fleet/calibrate (`CalibratePage`)** — SoftCal + soil test wizards.
- **/settings/:section (`SettingsPage`)** — Hub backup, brain modifiers, device/Zigbee kit, API, network AP, server jobs, general.
- **/ops/home (`DashHomePage`)** — **DESIGN TARGET.** Legacy Lovelace-parity dump. Demoted Live tab. Prefer Overview.

## FULL `src/routes.ts`

```ts
import { lazy } from "react";

export type PrimarySection = "live" | "grow" | "tune" | "fleet" | "settings";

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
  { id: "settings", label: "Settings", path: "/settings/device", icon: "settings" },
];

export const SETTINGS_SECTIONS = [
  "hub",
  "brain",
  "device",
  "api",
  "network",
  "server",
  "general",
] as const;

export type SettingsSectionId = (typeof SETTINGS_SECTIONS)[number];

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
  ],
  settings: [
    { id: "hub", label: "Hub", subtitle: "Backup", path: "/settings/hub", icon: "home" },
    { id: "brain", label: "Brain", subtitle: "Tuning", path: "/settings/brain", icon: "advanced" },
    { id: "device", label: "Device", subtitle: "Kit", path: "/settings/device", icon: "fleet" },
    { id: "api", label: "API", subtitle: "Integrations", path: "/settings/api", icon: "catalog" },
    { id: "network", label: "Network", subtitle: "AP", path: "/settings/network", icon: "climate" },
    { id: "server", label: "Server", subtitle: "Jobs", path: "/settings/server", icon: "system" },
    { id: "general", label: "General", path: "/settings/general", icon: "settings" },
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
  "/settings": "/settings/device",
  "/fleet/settings": "/settings/device",
};

export function sectionFromPath(pathname: string): PrimarySection {
  if (pathname.startsWith("/grow") || pathname.startsWith("/plant")) return "grow";
  if (pathname.startsWith("/tune") || pathname.startsWith("/advanced")) return "tune";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/fleet") || pathname.startsWith("/system")) return "fleet";
  if (pathname.startsWith("/ops")) return "live";
  return "live";
}

export function parseSettingsSection(pathname: string): SettingsSectionId {
  const part = pathname.replace(/^\/settings\/?/, "").split("/")[0] || "device";
  return (SETTINGS_SECTIONS as readonly string[]).includes(part)
    ? (part as SettingsSectionId)
    : "device";
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
```
