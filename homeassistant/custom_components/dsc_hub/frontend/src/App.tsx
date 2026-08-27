import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Button, Icon, PageHeader } from "./components/ui";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HonestyRail } from "./components/Honesty";
import { DemoBanner } from "./components/DemoBanner";
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
              end={tab.path === "/fleet"}
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
          <Route path="/fleet/settings" element={<SettingsPage />} />
          <Route path="/settings" element={<Navigate to="/fleet/settings" replace />} />
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
