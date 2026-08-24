import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button, Icon, PageHeader } from "./components/ui";
import { HonestyRail } from "./components/Honesty";
import { TwinKeepAlive } from "./components/TwinKeepAlive";
import { SeatOverlayHost } from "./components/SeatOverlay";
import { InspectorProvider } from "./components/InspectorHost";
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
  TuneAnalyticsPage,
  TuneLearningPage,
  FleetOverviewPage,
} from "./pages/TuneFleetPages";
import { SettingsPage } from "./pages/SettingsPage";
import {
  PRIMARY_TABS,
  SECONDARY_TABS,
  resolveLegacyRedirect,
  sectionFromPath,
  type PrimarySection,
} from "./routes";
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
      <Button primary onClick={() => navigate("/live/mission")}>
        Go Mission
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

function Shell({ surfaceVersion = "7.2.0" }: { surfaceVersion?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const section: PrimarySection = sectionFromPath(location.pathname);
  const secondary = SECONDARY_TABS[section];

  useEffect(() => {
    if (location.pathname === "/live/climate") return;
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
        <NavLink className="dsc-brand" to="/live/mission">
          <Icon name="brand" size={36} color="var(--dsc-blue)" />
          <div className="dsc-brand-title">
            <strong>DSC - A Plausible Deniability Project.</strong>
          </div>
        </NavLink>
        <div className="dsc-muted" style={{ fontSize: 12, letterSpacing: "0.08em" }}>
          SURFACE {surfaceVersion}
        </div>
      </div>

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
              className={({ isActive }) => `dsc-tab${isActive ? " active" : ""}`}
            >
              <Icon name={tab.icon as IconName} size={14} />
              {tab.label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <TwinKeepAlive />
      <SeatOverlayHost />

      <Routes>
        <Route path="/" element={<Navigate to="/live/mission" replace />} />
        <Route path="/live" element={<Navigate to="/live/mission" replace />} />
        <Route path="/live/mission" element={<LiveMissionPage />} />
        <Route path="/live/twin" element={<LiveTwinPage />} />
        <Route path="/live/climate" element={<LiveClimatePage />} />
        <Route path="/live/4x8" element={<LiveMainPage />} />
        <Route path="/live/2x4" element={<LiveClonePage />} />
        <Route path="/live/main" element={<Navigate to="/live/4x8" replace />} />
        <Route path="/live/clone" element={<Navigate to="/live/2x4" replace />} />
        <Route path="/live/root" element={<LiveRootPage />} />
        <Route path="/live/light" element={<LiveLightPage />} />
        <Route path="/grow" element={<Navigate to="/grow/compose" replace />} />
        <Route path="/grow/compose" element={<GrowComposePage />} />
        <Route path="/grow/research" element={<GrowResearchPage />} />
        <Route path="/grow/roster" element={<GrowRosterPage />} />
        <Route path="/tune" element={<Navigate to="/tune/learning" replace />} />
        <Route path="/tune/learning" element={<TuneLearningPage />} />
        <Route path="/tune/analytics" element={<TuneAnalyticsPage />} />
        <Route path="/fleet" element={<FleetOverviewPage />} />
        <Route path="/fleet/settings" element={<SettingsPage />} />
        {/* Legacy → 7.0 */}
        <Route path="/ops/*" element={<LegacyRedirect />} />
        <Route path="/ops" element={<LegacyRedirect />} />
        <Route path="/plant/*" element={<LegacyRedirect />} />
        <Route path="/plant" element={<LegacyRedirect />} />
        <Route path="/advanced/*" element={<LegacyRedirect />} />
        <Route path="/advanced" element={<LegacyRedirect />} />
        <Route path="/system" element={<LegacyRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export function App({
  hass,
  surfaceVersion = "7.2.0",
}: {
  hass: HomeAssistant | null;
  surfaceVersion?: string;
}) {
  return (
    <HassProvider hass={hass}>
      <ZoneFocusProvider>
        <InspectorProvider>
          <Shell surfaceVersion={surfaceVersion} />
        </InspectorProvider>
      </ZoneFocusProvider>
    </HassProvider>
  );
}
