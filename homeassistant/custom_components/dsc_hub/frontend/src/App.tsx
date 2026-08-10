import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Icon } from "./components/ui";
import { HassProvider } from "./hooks/useHass";
import { type IconName } from "./icons";
import { OpsHomePage } from "./pages/OpsHomePage";
import {
  OpsClimatePage,
  OpsClone2x4Page,
  OpsDashPage,
  OpsLightingPage,
  OpsMain4x8Page,
  OpsRootZonePage,
  OpsTankPage,
} from "./pages/OpsPages";
import {
  PlantBuildPage,
  PlantCatalogPage,
  PlantHubPage,
  PlantNutrientPage,
  PlantStrainsPage,
} from "./pages/PlantPages";
import { PlantSeatPage } from "./pages/PlantSeatPage";
import {
  AdvancedHistoryPage,
  AdvancedLearningPage,
  AdvancedTrendsPage,
  SystemOverviewPage,
} from "./pages/AdvancedSystemPages";
import {
  PRIMARY_TABS,
  SECONDARY_TABS,
  sectionFromPath,
  type PrimarySection,
} from "./routes";
import type { HomeAssistant } from "./vite-env";
import dscCss from "./styles/dsc.css?inline";

export const DSC_PANEL_CSS = dscCss;

function Shell() {
  const location = useLocation();
  const section: PrimarySection = sectionFromPath(location.pathname);
  const secondary = SECONDARY_TABS[section];

  return (
    <div className="dsc-shell">
      <div className="dsc-brand-row">
        <NavLink className="dsc-brand" to="/ops/home">
          <Icon name="brand" size={36} color="var(--dsc-neon)" />
          <div className="dsc-brand-title">
            <img
              className="dsc-brand-wordmark"
              src="/dsc_hub/assets/brand/dsc-brand-wordmark.svg"
              alt="DSC-HUB"
            />
            <span>Grow operations panel</span>
          </div>
        </NavLink>
        <div className="dsc-muted" style={{ fontSize: 12, letterSpacing: "0.08em" }}>
          SURFACE 6.3.0
        </div>
      </div>

      <nav className="dsc-primary-tabs" aria-label="Primary">
        {PRIMARY_TABS.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `dsc-tab${isActive || section === tab.id ? " active" : ""}`
            }
          >
            <Icon name={tab.icon as IconName} size={15} />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <nav className="dsc-secondary-tabs" aria-label="Section pages">
        {secondary.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            end={tab.path === "/plant" || tab.path === "/system"}
            className={({ isActive }) => `dsc-tab${isActive ? " active" : ""}`}
          >
            <Icon name={tab.icon as IconName} size={14} />
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/ops/home" replace />} />
        <Route path="/ops" element={<Navigate to="/ops/home" replace />} />
        <Route path="/ops/home" element={<OpsHomePage />} />
        <Route path="/ops/dash" element={<OpsDashPage />} />
        <Route path="/ops/climate" element={<OpsClimatePage />} />
        <Route path="/ops/main-4x8" element={<OpsMain4x8Page />} />
        <Route path="/ops/clone-2x4" element={<OpsClone2x4Page />} />
        <Route path="/ops/root-zone" element={<OpsRootZonePage />} />
        <Route path="/ops/plant-seat" element={<PlantSeatPage />} />
        <Route path="/ops/tank" element={<OpsTankPage />} />
        <Route path="/ops/lighting" element={<OpsLightingPage />} />
        <Route path="/plant" element={<PlantHubPage />} />
        <Route path="/plant/build" element={<PlantBuildPage />} />
        <Route path="/plant/catalog" element={<PlantCatalogPage />} />
        <Route path="/plant/seat" element={<PlantSeatPage />} />
        <Route path="/plant/strains" element={<PlantStrainsPage />} />
        <Route path="/plant/nutrient" element={<PlantNutrientPage />} />
        <Route path="/advanced" element={<Navigate to="/advanced/learning" replace />} />
        <Route path="/advanced/learning" element={<AdvancedLearningPage />} />
        <Route path="/advanced/trends" element={<AdvancedTrendsPage />} />
        <Route path="/advanced/history" element={<AdvancedHistoryPage />} />
        <Route path="/system" element={<SystemOverviewPage />} />
        <Route path="*" element={<Navigate to="/ops/home" replace />} />
      </Routes>
    </div>
  );
}

export function App({ hass }: { hass: HomeAssistant | null }) {
  return (
    <HassProvider hass={hass}>
      <Shell />
    </HassProvider>
  );
}
