import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { Button, Icon, PageHeader, Spinner, StatusTag } from "./components/ui";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FleetFreshnessTag, HonestyRail, useHonestyGaps } from "./components/Honesty";
import { DemoBanner } from "./components/DemoBanner";
import { ProbeOverlayHost } from "./components/ProbeOverlay";
import { InspectorProvider } from "./components/InspectorHost";
import { BandChartProvider } from "./components/BandChartHost";
import { SlideDrawer } from "./components/chrome";
import { ZoneStrip } from "./components/ZoneStrip";
import { useEntityBus } from "./hooks/useEntityBus";
import { useFleet, useFleetSelector } from "./hooks/useFleet";
import { ZoneFocusProvider, useZoneFocus } from "./hooks/useZoneFocus";
import { type IconName } from "./icons";
import { LiveMissionPage } from "./pages/LiveMissionPage";
import {
  LiveClimatePage,
  LiveLightPage,
  LiveRootPage,
  LiveTentPage,
} from "./pages/LivePages";
import {
  GrowComposePage,
  GrowResearchPage,
  GrowRosterPage,
} from "./pages/GrowPages";
import {
  DESKS,
  SETTINGS_PATH,
  bottomBarDesks,
  orderDesks,
  deskById,
  deskFromPath,
  deskOwnsZone,
  resolveLegacyRedirect,
  TuneLearningPage,
  FleetOverviewPage,
  CalibratePage,
} from "./routes";
import { paths } from "./lib/paths";
import { SettingsLayout } from "./pages/settings/SettingsLayout";
import { PreferencesRoot } from "./components/PreferencesRoot";
import { AlertNotifier } from "./components/AlertNotifier";
import { usePreferences } from "./hooks/usePreference";
import { setPreference } from "./lib/preferences";
import { OverviewPage } from "./pages/OverviewPage";
import { GrowLogsPage } from "./pages/GrowLogsPage";
import { SetupPage } from "./pages/SetupPage";
import dscCss from "./styles/dsc.css?inline";

// The twin (three.js + the composed scene) is its own chunk and must load lazily: a static
// import made `twin-three` and `tune-fleet` import each other, and the production bundle
// died at boot with `createContext of undefined` (Pi hotpatch, 2026-09-07). Dev never
// chunks, so only `vite preview` / the Pi shows it.
const TwinSpikePage = lazy(() => import("./pages/TwinSpikePage").then((m) => ({ default: m.TwinSpikePage })));
const TwinPage = lazy(() => import("./pages/TwinPage").then((m) => ({ default: m.TwinPage })));


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
      <p className="dsc-honesty">Unknown hash — not a silent Alerts redirect.</p>
      <Button primary onClick={() => navigate(paths.overview())}>
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
      <Spinner label="Loading" />
    </div>
  );
}

/**
 * Top-bar status cluster — hub link, freshness, honesty gaps, critical alerts.
 * Replaces the honesty rail row; the full rail opens under the bar on demand.
 */
function TopStatus({
  gapsOpen,
  onToggleGaps,
}: {
  gapsOpen: boolean;
  onToggleGaps: () => void;
}) {
  const fleet = useFleet();
  const bus = useEntityBus();
  const navigate = useNavigate();
  const gaps = useHonestyGaps();
  const hubOnline = fleet.hub.online;
  const alerts = bus.num("sensor.dsc_active_alert_count", 0);
  return (
    <div className="dsc-topbar-status" aria-label="Hub status">
      <StatusTag
        label={hubOnline ? "HUB ONLINE" : "HUB OFFLINE"}
        tone={hubOnline ? "ok" : "bad"}
        live={hubOnline}
        onClick={() => navigate(paths.kit())}
        title="Hub link — opens Kit"
      />
      <FleetFreshnessTag />
      {gaps.length ? (
        <StatusTag
          label={`${gaps.length} HONESTY GAP${gaps.length === 1 ? "" : "S"}`}
          tone="warn"
          onClick={onToggleGaps}
          title={gapsOpen ? "Hide the honesty rail" : "Show what the kit cannot claim"}
          pressed={gapsOpen}
        />
      ) : (
        <StatusTag label="KIT HONEST" tone="ok" onClick={onToggleGaps} pressed={gapsOpen} />
      )}
      {alerts > 0 ? (
        <StatusTag
          label={`${alerts} CRITICAL`}
          tone="bad"
          live
          onClick={() => navigate(paths.alerts())}
          title="Open Alerts"
        />
      ) : null}
    </div>
  );
}

/** `/` → the operator's landing desk (Preferences › Home), or the last desk they visited. */
function LandingRedirect() {
  const prefs = usePreferences();
  const id = prefs.landingDesk === "last" ? prefs.lastDesk ?? "overview" : prefs.landingDesk;
  const desk = DESKS.find((d) => d.id === id) ?? DESKS[0];
  return <Navigate to={desk.path} replace />;
}

function DeskNav() {
  const prefs = usePreferences();
  const desks = orderDesks(prefs.deskOrder, prefs.hiddenDesks);
  return (
    <nav className="dsc-desk-nav" aria-label="Desks">
      {desks.map((desk) => (
        <NavLink
          key={desk.id}
          to={desk.path}
          className={({ isActive }) =>
            `dsc-desk dsc-desk--${desk.accent}${isActive ? " active" : ""}`
          }
        >
          <Icon name={desk.icon as IconName} size={14} />
          <span>{desk.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function SubTabs({ tabs }: { tabs: { id: string; label: string; path: string; end?: boolean; subtitle?: string }[] }) {
  return (
    <nav className="dsc-subtabs" aria-label="Section pages">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          end={tab.end}
          className={({ isActive }) => `dsc-subtab${isActive ? " active" : ""}`}
        >
          {tab.label}
          {tab.subtitle ? <span className="dsc-subtab-sub">{tab.subtitle}</span> : null}
        </NavLink>
      ))}
    </nav>
  );
}

/** Phone bottom bar — four desks plus "More" (a sheet with every desk and Settings). */
function BottomBar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const prefs = usePreferences();
  const primary = bottomBarDesks(prefs.bottomBar, prefs.hiddenDesks);
  const allDesks = orderDesks(prefs.deskOrder, prefs.hiddenDesks);
  const current = deskFromPath(location.pathname);
  const moreActive = current != null && !primary.some((d) => d.id === current);
  return (
    <>
      <nav className="dsc-bottom-bar" aria-label="Desks">
        {primary.map((desk) => (
          <NavLink
            key={desk.id}
            to={desk.path}
            className={({ isActive }) =>
              `dsc-bottom-tab dsc-desk--${desk.accent}${isActive ? " active" : ""}`
            }
          >
            <Icon name={desk.icon as IconName} size={18} />
            <span>{desk.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          className={`dsc-bottom-tab${moreActive ? " active" : ""}`}
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
        >
          <Icon name="more" size={18} />
          <span>More</span>
        </button>
      </nav>
      <SlideDrawer open={moreOpen} onClose={() => setMoreOpen(false)} title="All desks">
        <div className="dsc-more-sheet">
          {allDesks.map((desk) => (
            <button
              key={desk.id}
              type="button"
              className={`dsc-more-item dsc-desk--${desk.accent}${current === desk.id ? " active" : ""}`}
              onClick={() => {
                setMoreOpen(false);
                navigate(desk.path);
              }}
            >
              <Icon name={desk.icon as IconName} size={16} />
              {desk.label}
            </button>
          ))}
          <button
            type="button"
            className={`dsc-more-item${current === "settings" ? " active" : ""}`}
            onClick={() => {
              setMoreOpen(false);
              navigate(SETTINGS_PATH);
            }}
          >
            <Icon name="settings" size={16} />
            Settings
          </button>
        </div>
      </SlideDrawer>
    </>
  );
}

function Shell({ surfaceVersion = "8.0.0" }: { surfaceVersion?: string }) {
  const fleetSurface = useFleetSelector((v) => v.fleet.surface);
  const displaySurface =
    fleetSurface && fleetSurface !== "—" && fleetSurface !== "unknown" ? fleetSurface : surfaceVersion;
  const location = useLocation();
  const navigate = useNavigate();
  const deskId = deskFromPath(location.pathname);
  const desk = deskId && deskId !== "settings" ? deskById(deskId) : null;
  const { focus } = useZoneFocus();
  const [gapsOpen, setGapsOpen] = useState(false);
  const isTentCockpit = location.pathname === "/climate/tent";

  useEffect(() => {
    if (deskId && deskId !== "settings") setPreference("lastDesk", deskId);
  }, [deskId]);

  // `?zone=` / `?tent=` belong to the desks that own zone context; strip elsewhere so a
  // stale param can never re-focus a desk that does not read it.
  useEffect(() => {
    if (deskOwnsZone(location.pathname)) return;
    const p = new URLSearchParams(location.search);
    if (!p.has("tent") && !p.has("zone")) return;
    p.delete("tent");
    p.delete("zone");
    const search = p.toString();
    navigate({ pathname: location.pathname, search: search ? `?${search}` : "" }, { replace: true });
  }, [location.pathname, location.search, navigate]);

  return (
    <div className={`dsc-shell${desk ? ` dsc-shell--${desk.id}` : ""}`}>
      <header className="dsc-topbar">
        <NavLink className="dsc-brand" to={paths.overview()} aria-label="DSC-HUB overview">
          <Icon name="brand" size={28} color="var(--dsc-teal)" />
          <span className="dsc-brand-name">DSC-HUB</span>
          <span className="dsc-brand-meta">{displaySurface}</span>
        </NavLink>
        <DeskNav />
        <div className="dsc-topbar-right">
          <TopStatus gapsOpen={gapsOpen} onToggleGaps={() => setGapsOpen((v) => !v)} />
          <NavLink
            to={SETTINGS_PATH}
            className={({ isActive }) => `dsc-desk dsc-desk--gear${isActive ? " active" : ""}`}
            aria-label="Settings"
            title="Settings"
          >
            <Icon name="settings" size={16} />
          </NavLink>
        </div>
      </header>

      <PreferencesRoot />
      <AlertNotifier />
      <DemoBanner />

      {gapsOpen ? <HonestyRail /> : null}

      {desk?.sub ? <SubTabs tabs={desk.sub} /> : null}

      {desk?.zone ? (
        <ZoneStrip
          only={isTentCockpit ? ["main", "clone"] : undefined}
          label={isTentCockpit ? "TENT" : "ZONE"}
        />
      ) : null}

      <ProbeOverlayHost />

      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingRedirect />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/climate" element={<LiveClimatePage />} />
            <Route path="/climate/tent" element={<LiveTentPage key={focus} />} />
            <Route path="/root" element={<LiveRootPage />} />
            <Route path="/light" element={<LiveLightPage />} />
            <Route path="/plants" element={<Navigate to={paths.roster()} replace />} />
            <Route path="/plants/roster" element={<GrowRosterPage />} />
            <Route path="/plants/compose" element={<GrowComposePage />} />
            <Route path="/cannalib" element={<GrowResearchPage />} />
            <Route path="/logs" element={<GrowLogsPage />} />
            <Route path="/alerts" element={<LiveMissionPage />} />
            <Route path="/kit" element={<FleetOverviewPage />} />
            <Route path="/kit/learning" element={<TuneLearningPage />} />
            <Route path="/kit/calibrate" element={<CalibratePage />} />
            <Route path="/settings" element={<Navigate to={SETTINGS_PATH} replace />} />
            <Route path="/settings/:section" element={<SettingsLayout />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/twin-spike" element={<TwinSpikePage />} />
            <Route path="/twin" element={<TwinPage />} />
            {/* Every pre-v2 path (7.x live/grow/fleet, older ops/plant/tune/advanced) lands on its desk. */}
            <Route path="/live" element={<LegacyRedirect />} />
            <Route path="/live/*" element={<LegacyRedirect />} />
            <Route path="/grow" element={<LegacyRedirect />} />
            <Route path="/grow/*" element={<LegacyRedirect />} />
            <Route path="/fleet" element={<LegacyRedirect />} />
            <Route path="/fleet/*" element={<LegacyRedirect />} />
            <Route path="/tune" element={<LegacyRedirect />} />
            <Route path="/tune/*" element={<LegacyRedirect />} />
            <Route path="/ops" element={<LegacyRedirect />} />
            <Route path="/ops/*" element={<LegacyRedirect />} />
            <Route path="/plant" element={<LegacyRedirect />} />
            <Route path="/plant/*" element={<LegacyRedirect />} />
            <Route path="/advanced" element={<LegacyRedirect />} />
            <Route path="/advanced/*" element={<LegacyRedirect />} />
            <Route path="/system" element={<LegacyRedirect />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <BottomBar />
    </div>
  );
}

export function App({ surfaceVersion = "8.0.0" }: { surfaceVersion?: string }) {
  return (
    <ZoneFocusProvider>
      <InspectorProvider>
        <BandChartProvider>
          <Shell surfaceVersion={surfaceVersion} />
        </BandChartProvider>
      </InspectorProvider>
    </ZoneFocusProvider>
  );
}
