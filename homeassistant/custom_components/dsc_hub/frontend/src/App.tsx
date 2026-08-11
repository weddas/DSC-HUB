import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Icon } from "./components/ui";
import { HonestyRail } from "./components/Honesty";
import { TwinKeepAlive } from "./components/TwinKeepAlive";
import { HassProvider } from "./hooks/useHass";
import { ZoneFocusProvider } from "./hooks/useZoneFocus";
import { type IconName } from "./icons";
import { LiveMissionPage } from "./pages/LiveMissionPage";
import {
  LiveClimatePage,
  LiveLightPage,
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

function LegacyRedirect() {
  const location = useLocation();
  const target = resolveLegacyRedirect(location.pathname, location.search);
  if (target) return <Navigate to={target} replace />;
  return <Navigate to="/live/mission" replace />;
}

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const section: PrimarySection = sectionFromPath(location.pathname);
  const secondary = SECONDARY_TABS[section];

  useEffect(() => {
    const onSelect = (ev: Event) => {
      const detail = (ev as CustomEvent<{ pot?: number | string }>).detail;
      const pot = Number(detail?.pot);
      if (pot >= 1 && pot <= 4) {
        navigate(`/live/root?pot=${pot}`);
      }
    };
    window.addEventListener("dsc-dash-select-pot", onSelect);
    return () => window.removeEventListener("dsc-dash-select-pot", onSelect);
  }, [navigate]);

  return (
    <div className="dsc-shell">
      <div className="dsc-brand-row">
        <NavLink className="dsc-brand" to="/live/mission">
          <Icon name="brand" size={36} color="var(--dsc-blue)" />
          <div className="dsc-brand-title">
            <img
              className="dsc-brand-wordmark"
              src="/dsc_hub/assets/brand/dsc-brand-wordmark.svg"
              alt="DSC-HUB"
            />
            <span>DSC-Dashboard</span>
          </div>
        </NavLink>
        <div className="dsc-muted" style={{ fontSize: 12, letterSpacing: "0.08em" }}>
          SURFACE 7.0.0
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

      <Routes>
        <Route path="/" element={<Navigate to="/live/mission" replace />} />
        <Route path="/live" element={<Navigate to="/live/mission" replace />} />
        <Route path="/live/mission" element={<LiveMissionPage />} />
        <Route path="/live/twin" element={<LiveTwinPage />} />
        <Route path="/live/climate" element={<LiveClimatePage />} />
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
        {/* Legacy → 7.0 */}
        <Route path="/ops/*" element={<LegacyRedirect />} />
        <Route path="/ops" element={<LegacyRedirect />} />
        <Route path="/plant/*" element={<LegacyRedirect />} />
        <Route path="/plant" element={<LegacyRedirect />} />
        <Route path="/advanced/*" element={<LegacyRedirect />} />
        <Route path="/advanced" element={<LegacyRedirect />} />
        <Route path="/system" element={<LegacyRedirect />} />
        <Route path="*" element={<Navigate to="/live/mission" replace />} />
      </Routes>

      <TwinKeepAlive />
    </div>
  );
}

export function App({ hass }: { hass: HomeAssistant | null }) {
  return (
    <HassProvider hass={hass}>
      <ZoneFocusProvider>
        <Shell />
      </ZoneFocusProvider>
    </HassProvider>
  );
}
