import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon, type IconName } from "../../components/ui";
import {
  SETTINGS_GROUPS,
  SETTINGS_PATH,
  parseSettingsSection,
  resolveLegacyRedirect,
  settingsTab,
  type SettingsSectionId,
} from "../../routes";
import { paths } from "../../lib/paths";
import { searchSettings } from "./settingsIndex";
import { useSettingsRailStatus } from "./useSettingsRailStatus";
import { PreferencesPage } from "./PreferencesPage";
import { AlertsSettingsPage } from "./AlertsSettingsPage";
import {
  AutomationSettingsPage,
  ClimateSettingsPage,
  LightSettingsPage,
  RootSettingsPage,
  SensorsSettingsPage,
  ZonesSettingsPage,
} from "./GrowSectionPages";
import { DevicesSettingsPage } from "./DevicesSettingsPage";
import { IntegrationsSettingsPage, NetworkSettingsPage, SystemSettingsPage } from "./KitSectionPages";

const SECTION_PAGE: Record<SettingsSectionId, ComponentType> = {
  preferences: PreferencesPage,
  alerts: AlertsSettingsPage,
  zones: ZonesSettingsPage,
  climate: ClimateSettingsPage,
  light: LightSettingsPage,
  root: RootSettingsPage,
  sensors: SensorsSettingsPage,
  automation: AutomationSettingsPage,
  devices: DevicesSettingsPage,
  integrations: IntegrationsSettingsPage,
  network: NetworkSettingsPage,
  system: SystemSettingsPage,
};

function SettingsSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const results = useMemo(() => searchSettings(q), [q]);

  // `/` focuses the search box when nothing else is being typed into.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="dsc-settings-search">
      <span className="dsc-settings-search-icon">
        <Icon name="search" size={13} />
      </span>
      <input
        ref={inputRef}
        type="search"
        value={q}
        placeholder="Find a setting  /"
        aria-label="Find a setting"
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setQ("");
          if (e.key === "Enter" && results[0]) {
            navigate(paths.settings(results[0].section, results[0].anchor));
            setQ("");
          }
        }}
      />
      {q && (
        <ul className="dsc-settings-results" role="listbox" aria-label="Matching settings" style={{ marginTop: 6 }}>
          {results.length ? (
            results.map((r) => (
              <li key={`${r.section}-${r.anchor}`} role="option" aria-selected={false}>
                <button
                  type="button"
                  className="dsc-settings-result"
                  onClick={() => {
                    navigate(paths.settings(r.section, r.anchor));
                    setQ("");
                  }}
                >
                  {r.label}
                  <span className="dsc-settings-result-where">{settingsTab(r.section).label}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", padding: "4px 8px" }}>
              No setting matches “{q}”.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function SettingsRail() {
  const status = useSettingsRailStatus();
  return (
    <nav className="dsc-settings-rail" aria-label="Settings sections">
      <SettingsSearch />
      <div className="dsc-settings-groups">
        {SETTINGS_GROUPS.map((g) => (
          <div key={g.id} className="dsc-settings-group">
            <p className="dsc-settings-group-label">{g.label}</p>
            {g.sections.map((id) => {
              const tab = settingsTab(id);
              const st = status[id];
              return (
                <NavLink
                  key={id}
                  to={tab.path}
                  className={({ isActive }) => `dsc-settings-link${isActive ? " active" : ""}`}
                >
                  <Icon name={tab.icon as IconName} size={15} />
                  <span className="dsc-settings-link-text">
                    <span className="dsc-settings-link-label">{tab.label}</span>
                    {st ? <span className={`dsc-settings-link-sub${st.tone ? ` is-${st.tone}` : ""}`}>{st.text}</span> : null}
                  </span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}

/**
 * Settings — rail (grouped, with live status subtitles) + search + one section page.
 * Depth is capped at rail → section → drawer (plan-settings § Part 4). Unknown sections
 * land on Preferences; the old tab paths are redirected by App's LegacyRedirect.
 */
export function SettingsLayout() {
  const location = useLocation();
  const section = parseSettingsSection(location.pathname);

  // Card anchors (#tariff, #backup, #firmware …) scroll into view; rows scroll themselves.
  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el && !el.classList.contains("dsc-setting-row")) el.scrollIntoView({ block: "start" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [location.hash, section]);

  if (!section) {
    // Old tab paths (/settings/brain, /settings/device, …) land on their new section + anchor.
    return <Navigate to={resolveLegacyRedirect(location.pathname, location.search) ?? SETTINGS_PATH} replace />;
  }
  const tab = settingsTab(section);
  const Page = SECTION_PAGE[section];
  return (
    <div className="dsc-page">
      <div className="dsc-settings-layout">
        <SettingsRail />
        <div className="dsc-settings-main">
          <header>
            <p className="dsc-settings-eyebrow">Settings · {tab.label}</p>
            <h1 className="dsc-settings-headline">{tab.headline}</h1>
            <p className="dsc-settings-subline">{tab.subline}</p>
          </header>
          <Page key={section} />
        </div>
      </div>
    </div>
  );
}
