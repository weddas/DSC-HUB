import { useState, type ReactNode } from "react";
import { DecisionLayer } from "../../components/DecisionLayer";
import { Button } from "../../components/ui";
import { SettingRow, SettingsCard, Segmented, Stated, Toggle } from "../../components/settings/SettingRow";
import { usePreference, usePreferences } from "../../hooks/usePreference";
import { useSettingsManifest } from "../../hooks/useSettingsManifest";
import {
  PREFERENCE_DEFAULTS,
  changedPreferenceKeys,
  isPreferenceDefault,
  resetAllPreferences,
  resetPreference,
  setPreference,
  type PreferenceKey,
  type Preferences,
} from "../../lib/preferences";
import { CHART_HOUR_OPTIONS } from "../../hooks/useChartHours";
import { DESKS, orderDesks, type DeskId } from "../../routes";
import { paths } from "../../lib/paths";

function labelFor(v: unknown): string {
  if (typeof v === "boolean") return v ? "on" : "off";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "none";
  if (v == null) return "—";
  return String(v);
}

/** One preference as a SettingRow — default, reset and scope come from the store. */
function PrefRow<K extends PreferenceKey>({
  prefKey,
  label,
  description,
  control,
  advanced,
  forceShow,
  consumers,
  defaultLabel,
}: {
  prefKey: K;
  label: ReactNode;
  description?: ReactNode;
  control: (value: Preferences[K], set: (next: Preferences[K]) => void) => ReactNode;
  advanced?: boolean;
  forceShow?: boolean;
  consumers?: { label: string; href: string }[];
  defaultLabel?: string;
}) {
  const [value, set] = usePreference(prefKey);
  return (
    <SettingRow
      id={`pref-${prefKey}`}
      label={label}
      description={description}
      scope="browser"
      defaultLabel={defaultLabel ?? labelFor(PREFERENCE_DEFAULTS[prefKey])}
      isDefault={isPreferenceDefault(prefKey)}
      onReset={() => resetPreference(prefKey)}
      control={control(value, set)}
      advanced={advanced}
      forceShow={forceShow}
      consumers={consumers}
    />
  );
}

function DeskOrderControl() {
  const p = usePreferences();
  const ordered = orderDesks(p.deskOrder, []);
  const hidden = new Set(p.hiddenDesks);
  const move = (id: DeskId, dir: -1 | 1) => {
    const ids = ordered.map((d) => d.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setPreference("deskOrder", ids);
  };
  const toggleHidden = (id: DeskId) => {
    if (id === "overview") return; // the landing desk is never hidden
    const next = hidden.has(id) ? p.hiddenDesks.filter((h) => h !== id) : [...p.hiddenDesks, id];
    setPreference("hiddenDesks", next);
  };
  return (
    <div className="dsc-desk-order" role="list" aria-label="Desk order and visibility">
      {ordered.map((d, i) => (
        <div key={d.id} className={`dsc-desk-order-row${hidden.has(d.id) ? " is-hidden" : ""}`} role="listitem">
          <span className="dsc-desk-order-name">{d.label}</span>
          <button type="button" aria-label={`Move ${d.label} up`} disabled={i === 0} onClick={() => move(d.id, -1)}>
            ↑
          </button>
          <button
            type="button"
            aria-label={`Move ${d.label} down`}
            disabled={i === ordered.length - 1}
            onClick={() => move(d.id, 1)}
          >
            ↓
          </button>
          <button
            type="button"
            aria-pressed={!hidden.has(d.id)}
            aria-label={`${hidden.has(d.id) ? "Show" : "Hide"} ${d.label}`}
            disabled={d.id === "overview"}
            onClick={() => toggleHidden(d.id)}
          >
            {hidden.has(d.id) ? "hidden" : "shown"}
          </button>
        </div>
      ))}
    </div>
  );
}

function BottomBarControl() {
  const p = usePreferences();
  const picked = p.bottomBar.length ? p.bottomBar : DESKS.filter((d) => d.mobile).map((d) => d.id);
  const toggle = (id: DeskId) => {
    const has = picked.includes(id);
    if (has) {
      if (picked.length <= 1) return;
      setPreference("bottomBar", picked.filter((x) => x !== id));
      return;
    }
    if (picked.length >= 4) return;
    setPreference("bottomBar", [...picked, id]);
  };
  return (
    <div className="dsc-desk-order" role="group" aria-label="Phone bottom bar desks (pick four)">
      {orderDesks(p.deskOrder, p.hiddenDesks).map((d) => (
        <div key={d.id} className="dsc-desk-order-row">
          <span className="dsc-desk-order-name">{d.label}</span>
          <button
            type="button"
            aria-pressed={picked.includes(d.id)}
            disabled={!picked.includes(d.id) && picked.length >= 4}
            onClick={() => toggle(d.id)}
          >
            {picked.includes(d.id) ? "on bar" : "in More"}
          </button>
        </div>
      ))}
    </div>
  );
}

export function PreferencesPage() {
  const manifest = useSettingsManifest();
  const p = usePreferences();
  const [confirmReset, setConfirmReset] = useState(false);
  const changed = changedPreferenceKeys().length;
  const retention = manifest.values.fleet_history_retention_days;

  return (
    <>
      <SettingsCard
        id="appearance"
        title="Appearance"
        icon="settings-gear"
        intro="Dark is the only theme (operator decision). These rows change texture, motion and size, never state colours' meaning."
      >
        <PrefRow
          prefKey="showAdvanced"
          label="Show advanced rows"
          description="Open every Advanced disclosure by default — hysteresis, hold gaps, stale horizons and the like."
          control={(v, set) => <Toggle checked={v} onChange={set} label="Show advanced rows" />}
        />
        <PrefRow
          prefKey="gridWash"
          label="Grid wash"
          description="The faint grid behind operator surfaces. Off is a flat ground."
          control={(v, set) => <Toggle checked={v} onChange={set} label="Grid wash" />}
        />
        <PrefRow
          prefKey="motion"
          label="Motion"
          description="Reduced stops the decorative loops (fan spin, heat lines, glows, the fresh pulse) but keeps state transitions. Off stops everything."
          control={(v, set) => (
            <Segmented
              value={v}
              onChange={set}
              label="Motion"
              options={[
                { value: "full", label: "FULL" },
                { value: "reduced", label: "REDUCED" },
                { value: "off", label: "OFF" },
              ]}
            />
          )}
        />
        <PrefRow
          prefKey="freshPulse"
          label="Fresh pulse on new readings"
          description="A brief lift on a numeral that just changed. Off keeps the update, drops the lift."
          control={(v, set) => <Toggle checked={v} onChange={set} label="Fresh pulse" />}
          consumers={[
            { label: "Overview", href: `#${paths.overview()}` },
            { label: "Climate", href: `#${paths.climate()}` },
          ]}
        />
        <PrefRow
          prefKey="depth"
          label="Depth and glow"
          description="Glass panels and glows. Off is flat borders — better on projectors and cheap panels."
          control={(v, set) => <Toggle checked={v} onChange={set} label="Depth and glow" />}
        />
        <PrefRow
          prefKey="textScale"
          label="Text scale"
          description="Scales the whole surface, labels included. 125 % is meant for a wall display."
          control={(v, set) => (
            <Segmented
              value={v}
              onChange={set}
              label="Text scale"
              options={[
                { value: 90, label: "90%" },
                { value: 100, label: "100%" },
                { value: 110, label: "110%" },
                { value: 125, label: "125%" },
              ]}
            />
          )}
          defaultLabel="100%"
        />
        <PrefRow
          prefKey="highContrast"
          label="High contrast"
          description="Brighter muted text and borders (the AA-safe pair from the token reference)."
          control={(v, set) => <Toggle checked={v} onChange={set} label="High contrast" />}
        />
        <PrefRow
          prefKey="stateColors"
          label="State colour set"
          description="Colour is only ever state: in band, drifting, out of band. Deuteranopia-safe swaps green/red for blue/vermilion; mono relies on glyphs and text."
          control={(v, set) => (
            <Segmented
              value={v}
              onChange={set}
              label="State colour set"
              options={[
                { value: "default", label: "DEFAULT" },
                { value: "deuteranopia", label: "CB-SAFE" },
                { value: "mono", label: "MONO" },
              ]}
            />
          )}
        />
        <PrefRow
          prefKey="density"
          label="Density"
          description="Auto follows the zone count (two zones breathe, ten compress). The overrides exist for wall displays."
          control={(v, set) => (
            <Segmented
              value={v}
              onChange={set}
              label="Density"
              options={[
                { value: "auto", label: "AUTO" },
                { value: "comfortable", label: "COMFORTABLE" },
                { value: "compact", label: "COMPACT" },
              ]}
            />
          )}
        />
      </SettingsCard>

      <SettingsCard
        id="units"
        title="Units & formats"
        icon="ruler-height"
        intro="Everything stays metric (operator decision). Rows without a control state the unit so nothing is left implicit."
      >
        <SettingRow id="unit-temperature" label="Temperature" scope="browser" control={<Stated>°C</Stated>} />
        <SettingRow id="unit-vpd" label="Vapour-pressure deficit" scope="browser" control={<Stated>kPa</Stated>} />
        <SettingRow id="unit-moisture" label="Substrate moisture" scope="browser" control={<Stated>% VWC</Stated>} />
        <SettingRow
          id="unit-light"
          label="Light"
          scope="browser"
          control={<Stated>PPFD µmol/m²/s · DLI mol/m²/d</Stated>}
        />
        <SettingRow id="unit-energy" label="Energy" scope="browser" control={<Stated>kWh</Stated>} />
        <PrefRow
          prefKey="conductivity"
          label="Conductivity scale"
          description="The probes report µS/cm; most feed charts speak mS/cm."
          control={(v, set) => (
            <Segmented
              value={v}
              onChange={set}
              label="Conductivity scale"
              options={[
                { value: "mS/cm", label: "mS/cm" },
                { value: "µS/cm", label: "µS/cm" },
              ]}
            />
          )}
          consumers={[{ label: "Root", href: `#${paths.root()}` }]}
        />
        <PrefRow
          prefKey="airflow"
          label="Airflow scale"
          description="Fan nameplates and the calibration helpers are CFM; m³/h is the metric reading of the same number."
          control={(v, set) => (
            <Segmented
              value={v}
              onChange={set}
              label="Airflow scale"
              options={[
                { value: "m3h", label: "m³/h" },
                { value: "cfm", label: "CFM" },
              ]}
            />
          )}
          defaultLabel="m³/h"
          consumers={[{ label: "Climate", href: `#${paths.climate()}` }]}
        />
        <PrefRow
          prefKey="currency"
          label="Currency symbol"
          description="Shown on the energy estimate. It is tariff × nameplate watts, never a bill."
          control={(v, set) => (
            <input
              type="text"
              value={v}
              maxLength={3}
              aria-label="Currency symbol"
              style={{ width: 56, minWidth: 0 }}
              onChange={(e) => set(e.target.value)}
            />
          )}
          consumers={[{ label: "Light", href: `#${paths.light()}` }]}
        />
        <PrefRow
          prefKey="timeFormat"
          label="Clock"
          description="Timestamps on journals, tooltips and the duty strips."
          control={(v, set) => (
            <Segmented
              value={v}
              onChange={set}
              label="Clock format"
              options={[
                { value: "24h", label: "24 H" },
                { value: "12h", label: "12 H" },
              ]}
            />
          )}
        />
      </SettingsCard>

      <SettingsCard
        id="home"
        title="Home & navigation"
        icon="dashboard-home"
        intro="Where the app opens and which desks you see. A hidden desk stays reachable by URL."
      >
        <PrefRow
          prefKey="landingDesk"
          label="Landing desk"
          description="Where the brand mark and the root URL go."
          control={(v, set) => (
            <select value={v} aria-label="Landing desk" onChange={(e) => set(e.target.value as Preferences["landingDesk"])}>
              {DESKS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
              <option value="last">Last visited</option>
            </select>
          )}
          defaultLabel="Overview"
        />
        <PrefRow
          prefKey="defaultZone"
          label="Default zone"
          description="The zone Climate, Root and Light open on when the URL carries none."
          control={(v, set) => (
            <select value={v} aria-label="Default zone" onChange={(e) => set(e.target.value as Preferences["defaultZone"])}>
              <option value="main">4×8</option>
              <option value="clone">2×4</option>
              <option value="room">Room</option>
              <option value="last">Last used</option>
            </select>
          )}
          defaultLabel="4×8"
        />
        <PrefRow
          prefKey="deskOrder"
          label="Desk order and visibility"
          description="Reorder the desk row; hide desks the kit does not use (CannaLib without a catalog, Root without probes)."
          control={() => <DeskOrderControl />}
          defaultLabel="Overview · Climate · Root · Light · Plants · CannaLib · Logs · Alerts · Kit"
        />
        <PrefRow
          prefKey="bottomBar"
          label="Phone bottom bar"
          description="Four desks on the bar; the rest live under More."
          control={() => <BottomBarControl />}
          defaultLabel="Overview · Climate · Plants · Alerts"
        />
        <PrefRow
          prefKey="missionLine"
          label="Mission line on Overview"
          description="The one-line story of what the hub did last night, above the zone cards."
          control={(v, set) => <Toggle checked={v} onChange={set} label="Mission line on Overview" />}
          consumers={[{ label: "Overview", href: `#${paths.overview()}` }]}
        />
        <PrefRow
          prefKey="tooltipDelayMs"
          label="Tooltip open delay"
          description="Hover time before a reading tooltip opens. Keyboard focus opens at once regardless."
          advanced
          control={(v, set) => (
            <>
              <input
                type="number"
                min={0}
                max={2000}
                step={50}
                value={v}
                aria-label="Tooltip open delay in milliseconds"
                onChange={(e) => set(Math.max(0, Math.min(2000, Number(e.target.value) || 0)))}
              />
              <span className="dsc-setting-value">ms</span>
            </>
          )}
          defaultLabel="300 ms"
        />
        <PrefRow
          prefKey="cameraThumbRefreshS"
          label="Camera thumbnail refresh"
          description="How often a zone card re-reads its camera's latest frame. The brain captures on the camera's own interval; this only decides how soon this browser shows it. Set high on a phone to save data."
          control={(v, set) => (
            <>
              <input
                type="number"
                min={0}
                max={600}
                step={5}
                value={v}
                aria-label="Camera thumbnail refresh in seconds"
                onChange={(e) => set(Math.max(0, Math.min(600, Number(e.target.value) || 0)))}
              />
              <span className="dsc-setting-value">s</span>
            </>
          )}
          consumers={[{ label: "Overview", href: `#${paths.overview()}` }]}
          defaultLabel="30 s"
        />
      </SettingsCard>

      <SettingsCard
        id="charts"
        title="Charts & history"
        icon="trend-chart"
        intro="Defaults for every chart on the desks. Retention itself is the brain's and lives under System."
        advanced={
          <>
            <PrefRow
              prefKey="holdGapMs"
              label="Hold gap"
              description="A series is drawn flat across a gap shorter than this; longer gaps open a hole."
              advanced
              forceShow
              control={(v, set) => (
                <>
                  <input
                    type="number"
                    min={500}
                    max={60000}
                    step={500}
                    value={v}
                    aria-label="Hold gap in milliseconds"
                    onChange={(e) => set(Math.max(500, Number(e.target.value) || 500))}
                  />
                  <span className="dsc-setting-value">ms</span>
                </>
              )}
              defaultLabel="2000 ms"
            />
            <PrefRow
              prefKey="maxHoldToNowMs"
              label="Hold to now"
              description="How long the last good value is extended to the right edge before the trace stops."
              advanced
              forceShow
              control={(v, set) => (
                <>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    step={1}
                    value={Math.round(v / 60000)}
                    aria-label="Hold to now in minutes"
                    onChange={(e) => set(Math.max(1, Number(e.target.value) || 1) * 60000)}
                  />
                  <span className="dsc-setting-value">min</span>
                </>
              )}
              defaultLabel="5 min"
            />
            <PrefRow
              prefKey="staleMs"
              label="Reading stale horizon"
              description="A timestamped reading older than this turns HELD. Display-side; the brain's control-side horizon is under Sensors."
              advanced
              forceShow
              control={(v, set) => (
                <>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    step={1}
                    value={Math.round(v / 60000)}
                    aria-label="Stale horizon in minutes"
                    onChange={(e) => set(Math.max(1, Number(e.target.value) || 1) * 60000)}
                  />
                  <span className="dsc-setting-value">min</span>
                </>
              )}
              defaultLabel="10 min"
              consumers={[{ label: "Sensors", href: `#${paths.settings("sensors", "stale-control")}` }]}
            />
            <PrefRow
              prefKey="offlineCooldownMs"
              label="Offline cooldown"
              description="How long a seat must be silent before the UI calls it offline (link flaps do not flash the kit)."
              advanced
              forceShow
              control={(v, set) => (
                <>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    step={5}
                    value={Math.round(v / 1000)}
                    aria-label="Offline cooldown in seconds"
                    onChange={(e) => set(Math.max(5, Number(e.target.value) || 5) * 1000)}
                  />
                  <span className="dsc-setting-value">s</span>
                </>
              )}
              defaultLabel="25 s"
            />
            <PrefRow
              prefKey="trendsHalfWindowH"
              label="Trends window around an event"
              description="Logs › trends shows this many hours either side of the entry you open."
              advanced
              forceShow
              control={(v, set) => (
                <>
                  <input
                    type="number"
                    min={1}
                    max={48}
                    step={1}
                    value={v}
                    aria-label="Trends half window in hours"
                    onChange={(e) => set(Math.max(1, Math.min(48, Number(e.target.value) || 1)))}
                  />
                  <span className="dsc-setting-value">h</span>
                </>
              )}
              defaultLabel="6 h"
              consumers={[{ label: "Logs", href: `#${paths.logs()}` }]}
            />
          </>
        }
      >
        <PrefRow
          prefKey="chartHours"
          label="Default chart range"
          description="What the desk charts open on. Survives a reload; each chart can still change it in place."
          control={(v, set) => (
            <Segmented
              value={v}
              onChange={set}
              label="Default chart range"
              options={CHART_HOUR_OPTIONS.map((h) => ({ value: h, label: `${h} H` }))}
            />
          )}
          defaultLabel="6 h"
        />
        <PrefRow
          prefKey="chartBands"
          label="Band shading"
          description="The Want band drawn behind the trace."
          control={(v, set) => <Toggle checked={v} onChange={set} label="Band shading" />}
        />
        <PrefRow
          prefKey="chartLightsOff"
          label="Lights-off shading"
          description="Dark hours shaded from the zone's photoperiod."
          control={(v, set) => <Toggle checked={v} onChange={set} label="Lights-off shading" />}
        />
        <PrefRow
          prefKey="chartMarkers"
          label="Stage and alert markers"
          description="Phase boundaries and alert ticks from the grow log."
          control={(v, set) => <Toggle checked={v} onChange={set} label="Stage and alert markers" />}
        />
        <SettingRow
          id="chart-retention"
          label="History retention"
          description="How far back any chart can reach. Brain-owned — change it under System › Storage."
          scope="brain"
          control={
            <Stated>
              {retention != null ? `${String(retention)} days` : manifest.state === "error" ? "brain predates the manifest" : "…"}
            </Stated>
          }
          consumers={[{ label: "System › Storage", href: `#${paths.settings("system", "storage")}` }]}
        />
      </SettingsCard>

      <SettingsCard id="reset" title="Reset" icon="refresh" intro={`${changed} preference${changed === 1 ? "" : "s"} differ from the defaults in this browser.`}>
        <SettingRow
          id="pref-reset-all"
          label="Reset this browser's preferences"
          description="Every row above returns to its default. Nothing on the hub or the brain changes."
          scope="browser"
          control={
            <Button variant="danger" disabled={changed === 0} onClick={() => setConfirmReset(true)}>
              Reset all
            </Button>
          }
        />
      </SettingsCard>
      <DecisionLayer
        open={confirmReset}
        onDismiss={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false);
          resetAllPreferences();
        }}
        title="Reset this browser's preferences"
        confirmLabel="Reset all"
        help={null}
      >
        <p>
          {changed} preference{changed === 1 ? "" : "s"} return to default: {changedPreferenceKeys().join(", ")}.
          {p.hiddenDesks.length ? " Hidden desks come back." : ""}
        </p>
      </DecisionLayer>
    </>
  );
}
