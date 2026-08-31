# Layouts

Shell + honesty rail + demo banner. All operator routes render inside `Shell`.

---

## App.tsx — Shell / App

**Renders:** `App` wraps Hass/ZoneFocus/Inspector/BandChart providers around `Shell`. `Shell` is the operator chrome: brand row (NavLink + SURFACE version), `DemoBanner`, `HonestyRail`, primary tabs, secondary tabs (when section has more than one), `SeatOverlayHost`, hashed `Routes` inside ErrorBoundary/Suspense, `TwinKeepAlive`.

Also in this file (not separate pages): `NotFoundPage`, `LegacyRedirect`, `RouteFallback`.

```tsx
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Button, Icon, PageHeader } from "./components/ui";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HonestyRail } from "./components/Honesty";
import { DemoBanner } from "./components/DemoBanner";
import { TwinKeepAlive } from "./components/TwinKeepAlive";
import { SeatOverlayHost } from "./components/SeatOverlay";
import { InspectorProvider } from "./components/InspectorHost";
import { BandChartProvider } from "./components/BandChartHost";
import { HassProvider } from "./hooks/useHass";
import { ZoneFocusProvider } from "./hooks/useZoneFocus";
import { type IconName } from "./icons";
import { LiveMissionPage } from "./pages/LiveMissionPage";
import {
  LiveClimatePage,
  LiveClonePage,
  LiveLightPage,
  LiveMainPage,
  LiveRootPage,
  LiveTwinPage,
} from "./pages/LivePages";
import {
  GrowComposePage,
  GrowResearchPage,
  GrowRosterPage,
} from "./pages/GrowPages";
import {
  PRIMARY_TABS,
  SECONDARY_TABS,
  resolveLegacyRedirect,
  sectionFromPath,
  TuneAnalyticsPage,
  TuneLearningPage,
  FleetOverviewPage,
  CalibratePage,
  type PrimarySection,
} from "./routes";
import { SettingsPage } from "./pages/SettingsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { DashHomePage } from "./pages/DashHomePage";
import { preloadPiTwinAssets, piTwinRouteNeedsAssets } from "./lib/ensureLocalCards";
import type { HomeAssistant } from "./vite-env";
import dscCss from "./styles/dsc.css?inline";


export const DSC_PANEL_CSS = dscCss;

function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="alert"
        title="Not found"
        subtitle={`${location.pathname} is not a DSC route.`}
      />
      <p className="dsc-honesty">Unknown hash — not a silent Mission redirect.</p>
      <Button primary onClick={() => navigate("/live/overview")}>
        Go Overview
      </Button>
    </div>
  );
}

function LegacyRedirect() {
  const location = useLocation();
  const target = resolveLegacyRedirect(location.pathname, location.search);
  if (target) return <Navigate to={target} replace />;
  return <NotFoundPage />;
}

function RouteFallback() {
  return (
    <div className="dsc-page">
      <p className="dsc-muted">Loading…</p>
    </div>
  );
}

function Shell({ surfaceVersion = "7.3.0" }: { surfaceVersion?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const section: PrimarySection = sectionFromPath(location.pathname);
  const secondary = SECONDARY_TABS[section];

  useEffect(() => {
    if (piTwinRouteNeedsAssets(location.pathname)) {
      void preloadPiTwinAssets();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/live/climate" || location.pathname === "/ops/home") return;
    const p = new URLSearchParams(location.search);
    if (!p.has("tent") && !p.has("zone")) return;
    p.delete("tent");
    p.delete("zone");
    const search = p.toString();
    navigate({ pathname: location.pathname, search: search ? `?${search}` : "" }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  return (
    <div className="dsc-shell">
      <div className="dsc-brand-row">
        <NavLink className="dsc-brand" to="/live/overview">
          <Icon name="brand" size={36} color="var(--dsc-blue)" />
          <div className="dsc-brand-title">
            <strong>DSC - A Plausible Deniability Project.</strong>
          </div>
        </NavLink>
        <div className="dsc-muted" style={{ fontSize: 12, letterSpacing: "0.08em" }}>
          SURFACE {surfaceVersion}
        </div>
      </div>

      <DemoBanner />

      <HonestyRail />

      <nav className="dsc-primary-tabs" aria-label="Primary">
        {PRIMARY_TABS.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `dsc-tab dsc-tab--${tab.id}${isActive || section === tab.id ? " active" : ""}`
            }
          >
            <Icon name={tab.icon as IconName} size={15} />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {secondary.length > 1 ? (
        <nav className="dsc-secondary-tabs" aria-label="Section pages">
          {secondary.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              end={tab.path === "/fleet" || tab.path.startsWith("/settings/")}
              className={({ isActive }) =>
                `dsc-tab${tab.demoted ? " dsc-tab--demoted" : ""}${isActive ? " active" : ""}`
              }
            >
              <Icon name={tab.icon as IconName} size={14} />
              <span className="dsc-tab-label-stack">
                <span>{tab.label}</span>
                {"subtitle" in tab && tab.subtitle ? (
                  <span className="dsc-tab-sub">{tab.subtitle}</span>
                ) : null}
              </span>
            </NavLink>
          ))}
        </nav>
      ) : null}

      <SeatOverlayHost />

      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
          <Route path="/" element={<Navigate to="/live/overview" replace />} />
          <Route path="/live" element={<Navigate to="/live/overview" replace />} />
          <Route path="/live/overview" element={<OverviewPage />} />
          <Route path="/live/mission" element={<LiveMissionPage />} />
          <Route path="/live/twin" element={<LiveTwinPage />} />
          <Route path="/live/climate" element={<LiveClimatePage />} />
          <Route path="/live/4x8" element={<LiveMainPage />} />
          <Route path="/live/2x4" element={<LiveClonePage />} />
          <Route path="/live/main" element={<Navigate to="/live/4x8" replace />} />
          <Route path="/live/clone" element={<Navigate to="/live/2x4" replace />} />
          <Route path="/live/root" element={<LiveRootPage />} />
          <Route path="/live/light" element={<LiveLightPage />} />
          <Route path="/grow" element={<Navigate to="/grow/roster" replace />} />
          <Route path="/grow/compose" element={<GrowComposePage />} />
          <Route path="/grow/research" element={<GrowResearchPage />} />
          <Route path="/grow/roster" element={<GrowRosterPage />} />
          <Route path="/tune" element={<Navigate to="/tune/learning" replace />} />
          <Route path="/tune/learning" element={<TuneLearningPage />} />
          <Route path="/tune/analytics" element={<TuneAnalyticsPage />} />
          <Route path="/fleet" element={<FleetOverviewPage />} />
          <Route path="/fleet/calibrate" element={<CalibratePage />} />
          <Route path="/fleet/settings" element={<Navigate to="/settings/device" replace />} />
          <Route path="/settings" element={<Navigate to="/settings/device" replace />} />
          <Route path="/settings/:section" element={<SettingsPage />} />
          <Route path="/ops/home" element={<DashHomePage />} />
          <Route path="/ops/dash" element={<LiveTwinPage />} />
          {/* Legacy → 7.0 */}
          <Route path="/ops/*" element={<LegacyRedirect />} />
          <Route path="/plant/*" element={<LegacyRedirect />} />
          <Route path="/plant" element={<LegacyRedirect />} />
          <Route path="/advanced/*" element={<LegacyRedirect />} />
          <Route path="/advanced" element={<LegacyRedirect />} />
          <Route path="/system" element={<LegacyRedirect />} />
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <TwinKeepAlive />
    </div>
  );
}

export function App({
  hass,
  surfaceVersion = "7.3.0",
  hassRevision = 0,
  fleetSource = "ha",
}: {
  hass: HomeAssistant | null;
  surfaceVersion?: string;
  hassRevision?: number;
  fleetSource?: "pi" | "ha";
}) {
  void fleetSource;
  return (
    <HassProvider hass={hass} revision={hassRevision}>
      <ZoneFocusProvider>
        <InspectorProvider>
          <BandChartProvider>
            <Shell surfaceVersion={surfaceVersion} />
          </BandChartProvider>
        </InspectorProvider>
      </ZoneFocusProvider>
    </HassProvider>
  );
}
```

---

## Honesty.tsx — HonestyRail

**Renders:** `HonestyRail` — top chip rail. No gaps → `Kit honest` ok chip. Gaps → up to 6 clickable warn/bad chips + overflow `+N`; DecisionLayer for detail/CTA and overflow list. Also exports `useHonestyGaps` and `NextRecommendedCard` (used on Mission, not in Shell).

```tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, StatusChip } from "./ui";
import { DecisionLayer } from "./DecisionLayer";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import { collectHonestyGapsFromFleet, nextRecommended, type HonestyGap } from "../lib/sensorHonesty";

export function useHonestyGaps(): HonestyGap[] {
  const hass = useEntityBus();
  const fleet = useFleet();
  return useMemo(
    () =>
      collectHonestyGapsFromFleet(fleet, {
        state: hass.state,
        available: hass.available,
        entity: hass.entity,
      }),
    [fleet, hass.state, hass.available, hass.entity, hass.tick],
  );
}

export function HonestyRail({ gaps }: { gaps?: HonestyGap[] }) {
  const computed = useHonestyGaps();
  const list = gaps ?? computed;
  const [open, setOpen] = useState<HonestyGap | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const navigate = useNavigate();
  const overflow = list.length > 6 ? list.slice(6) : [];

  if (!list.length) {
    return (
      <div className="dsc-honesty-rail" aria-label="Honesty">
        <StatusChip icon="ok" label="Kit honest" tone="ok" />
      </div>
    );
  }
  return (
    <>
      <div className="dsc-honesty-rail" aria-label="Honesty gaps">
        {list.slice(0, 6).map((g) => (
          <button
            key={g.id}
            type="button"
            className="dsc-honesty-hit"
            onClick={() => setOpen(g)}
          >
            <StatusChip icon="alert" label={g.label} tone={g.tone === "bad" ? "bad" : "warn"} />
          </button>
        ))}
        {overflow.length ? (
          <button
            type="button"
            className="dsc-honesty-hit"
            onClick={() => setOverflowOpen(true)}
            title={`${overflow.length} more honesty gap(s)`}
            aria-label={`Show ${overflow.length} more honesty gaps`}
          >
            <StatusChip label={`+${overflow.length}`} tone="muted" />
          </button>
        ) : null}
      </div>
      <DecisionLayer
        open={open != null}
        onDismiss={() => setOpen(null)}
        onConfirm={
          open
            ? () => {
                navigate(open.href);
                setOpen(null);
              }
            : undefined
        }
        title={open?.label ?? "Honesty"}
        confirmLabel={open?.cta ?? "Go"}
        help={null}
      >
        <p>{open?.detail}</p>
      </DecisionLayer>
      <DecisionLayer
        open={overflowOpen}
        onDismiss={() => setOverflowOpen(false)}
        title={`${overflow.length} more honesty gap${overflow.length === 1 ? "" : "s"}`}
        help={null}
      >
        <ul className="dsc-honesty-overflow-list">
          {overflow.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                className="dsc-honesty-overflow-item"
                onClick={() => {
                  setOverflowOpen(false);
                  setOpen(g);
                }}
              >
                <StatusChip icon="alert" label={g.label} tone={g.tone === "bad" ? "bad" : "warn"} />
                <span className="dsc-muted">{g.detail}</span>
              </button>
            </li>
          ))}
        </ul>
      </DecisionLayer>
    </>
  );
}

export function NextRecommendedCard({ gaps }: { gaps?: HonestyGap[] }) {
  const computed = useHonestyGaps();
  const list = gaps ?? computed;
  const next = nextRecommended(list);
  const navigate = useNavigate();

  if (!next) {
    return (
      <Card className="dsc-glass dsc-next-rec" title="Next" icon="ok">
        <p className="dsc-muted" style={{ margin: 0 }}>
          No critical gaps — fly Live or open Twin.
        </p>
        <div className="dsc-row-actions">
          <Button primary onClick={() => navigate("/live/twin")}>
            Open Twin
          </Button>
          <Button teal onClick={() => navigate("/live/climate")}>
            Climate Want
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="dsc-glass dsc-next-rec" title="Do this next" icon="alert">
      <p style={{ margin: "0 0 8px" }}>
        <strong>{next.label}</strong> — {next.detail}
      </p>
      <Button primary onClick={() => navigate(next.href)}>
        {next.cta}
      </Button>
    </Card>
  );
}
```

---

## DemoBanner.tsx

**Renders:** Amber demo banner when `/health` reports `mode === "demo"` and the SPA is not iframe-embedded (HA panel hides it). StatusChip `Simulated room` + software-only copy.

```tsx
import { useEffect, useState } from "react";
import { StatusChip } from "./ui";

type Health = { mode?: string; simulation?: boolean; detail?: string };

export function DemoBanner() {
  const [health, setHealth] = useState<Health | null>(null);
  const embedded = typeof window !== "undefined" && window.self !== window.top;

  useEffect(() => {
    if (embedded) return;
    let cancelled = false;
    fetch("/health")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Health | null) => {
        if (!cancelled && data?.mode === "demo") setHealth(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [embedded]);

  if (embedded || !health) return null;

  return (
    <div className="dsc-demo-banner" role="status" aria-live="polite">
      <StatusChip icon="alert" label="Simulated room" tone="warn" />
      <span>
        Software-only WiP demo. No hardware, LAN, or live grow room connected.
        {health.detail ? ` ${health.detail}` : ""}
      </span>
    </div>
  );
}
```
