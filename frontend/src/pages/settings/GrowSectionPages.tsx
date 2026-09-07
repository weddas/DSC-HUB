import { useEffect, useState } from "react";
import { SettingRow, SettingsCard, Stated } from "../../components/settings/SettingRow";
import { HelperNumberRow, HubTunableRow, HubTunableRows } from "../../components/settings/HubTunableRow";
import { StageRailCard } from "../../components/settings/StageRailCard";
import { ZonesSettingsCard } from "../../components/settings/ZonesSettingsCard";
import { SpaceEnergySettingsCard } from "../../components/settings/SpaceEnergySettingsCard";
import { AutomationRulesCard } from "../../components/settings/AutomationRulesCard";
import { CLIMATE_ZONES, ZONE_LABELS } from "../../components/settings/settingsConstants";
import { useGlobalModifiers, useSaveState } from "../../hooks/useGlobalModifiers";
import { useHubTunables } from "../../hooks/useHubTunables";
import { manifestDefaultLabel, useSettingsManifest } from "../../hooks/useSettingsManifest";
import { get_settings, patch_settings, type ClimateZone } from "../../lib/fleetApi";
import { getRootSteeringTargets, patchRootSteeringTargets, type RootSteeringTargets } from "../../lib/hubTunablesApi";
import { paths } from "../../lib/paths";
import { Button } from "../../components/ui";
import { getAutomationDefaults, patchAutomationDefaults, type AutomationDefaults } from "../../lib/alertPrefsApi";

/**
 * Settings sections for the grow — Zones, Climate, Light, Root, Sensors, Automation.
 * S1 carried over the brain-owned rows (global modifiers, leaf offset, tariff, rules);
 * S2 adds every hub helper as a tier-H row (HubTunableRow) with its sync state, the
 * editable stage presets, the root steering targets and the trust thresholds.
 */

const DEFAULT_MODS = {
  fan_demand_scale: 1,
  light_brightness_scale: 1,
  moisture_dry_pct: 30,
};

function loadStateOf(state: "loading" | "ready" | "error"): "loading" | "ready" | "error" {
  return state;
}

/** Card-level honesty for hub rows: one message per card when the brain predates tunables. */
function useHubCardState(): { loadState: "loading" | "ready" | "error"; loadError?: string; blockedNote: string | null } {
  const t = useHubTunables();
  const blockedNote = t.data?.blocked
    ? "Manual takeover or a reconnect override is holding pushes — values are stored and push when it clears."
    : t.data && !t.data.hub_online
      ? "Hub offline — writes are stored and push on reconnect (rows show HELD)."
      : null;
  return { loadState: t.state, loadError: t.error, blockedNote };
}

/** A 0.5–1.5 scale slider that autosaves on release (tier N). */
function ScaleRow({
  id,
  field,
  label,
  description,
  consumers,
}: {
  id: string;
  field: "fan_demand_scale" | "light_brightness_scale";
  label: string;
  description: string;
  consumers: { label: string; href: string }[];
}) {
  const { modifiers, save } = useGlobalModifiers();
  const manifest = useSettingsManifest();
  const saveState = useSaveState();
  const live = modifiers?.[field] ?? DEFAULT_MODS[field];
  const [draft, setDraft] = useState<number>(live);
  useEffect(() => setDraft(live), [live]);
  const row = manifest.rows[`global_modifiers.${field}`];
  const commit = () => {
    if (draft !== live) void saveState.run(() => save({ [field]: draft }));
  };
  return (
    <SettingRow
      id={id}
      label={label}
      description={description}
      scope="brain"
      defaultLabel={manifestDefaultLabel(row, "1.00")}
      isDefault={Math.abs(live - DEFAULT_MODS[field]) < 1e-9}
      onReset={() => void saveState.run(() => save({ [field]: DEFAULT_MODS[field] }))}
      state={saveState.state}
      stateText={saveState.text}
      consumers={consumers}
      control={
        <>
          <input
            type="range"
            min={row?.min ?? 0.5}
            max={row?.max ?? 1.5}
            step={row?.step ?? 0.05}
            value={draft}
            aria-label={label}
            onChange={(e) => setDraft(Number(e.target.value))}
            onMouseUp={commit}
            onTouchEnd={commit}
            onKeyUp={commit}
          />
          <span className="dsc-setting-value">{draft.toFixed(2)}×</span>
        </>
      }
    />
  );
}

export function ZonesSettingsPage() {
  return <ZonesSettingsCard />;
}

export function ClimateSettingsPage() {
  const { state, error } = useGlobalModifiers();
  const hub = useHubCardState();
  return (
    <>
      <SettingsCard
        id="targets"
        title="Targets"
        icon="target-goal"
        intro="What the hub aims at, per tent. The Climate desk edits the same values; here they carry their default, their source and whether the hub has taken them."
        loadState={hub.loadState}
        loadError={hub.loadError}
      >
        {hub.blockedNote ? <p className="dsc-honesty">{hub.blockedNote}</p> : null}
        <HubTunableRows
          ids={[
            "number.dsc_hub_target_temp",
            "number.dsc_hub_rh_target_min",
            "number.dsc_hub_rh_target_max",
            "number.dsc_hub_vpd_target_min",
            "number.dsc_hub_vpd_target_max",
          ]}
        />
        <HubTunableRows
          ids={[
            "number.dsc_hub_clone_target_temp",
            "number.dsc_hub_clone_rh_min",
            "number.dsc_hub_clone_rh_max",
            "number.dsc_hub_clone_vpd_min",
            "number.dsc_hub_clone_vpd_max",
          ]}
        />
        <SettingRow
          id="targets-desk"
          label="Stage, climate mode and manual holds"
          scope="hub"
          control={<a href={`#${paths.climate()}`}>Climate desk →</a>}
          description="Live controls, not settings: the active stage, the 2×4 climate mode and the manual overrides stay on the desk."
        />
      </SettingsCard>

      <StageRailCard />

      <SettingsCard
        id="control"
        title="Control"
        icon="gauge-dial"
        intro="How the hub chooses what to chase and which tent wins."
        loadState={hub.loadState}
        loadError={hub.loadError}
        advanced={
          <>
            <HubTunableRows
              ids={[
                "number.dsc_hub_clone_hum_hysteresis",
                "number.dsc_hub_humidifier_min_off_time",
                "number.dsc_hub_clone_hum_min_off_time",
                "number.dsc_hub_heater_min_off_time",
                "number.dsc_hub_ladder_wait_dehum",
                "number.dsc_hub_ladder_wait_hum",
                "number.dsc_hub_ladder_wait_heat",
                "number.dsc_hub_ladder_wait_ac",
                "switch.dsc_hub_recirc_de_strat_pulse",
                "number.dsc_hub_de_strat_pulse_period",
                "number.dsc_hub_de_strat_pulse_length",
                "number.dsc_hub_de_strat_pulse_level",
                "number.dsc_hub_mister_target_hours",
                "number.dsc_hub_mister_min_off_hours",
              ]}
              advanced
              forceShow
            />
          </>
        }
      >
        <HubTunableRows
          ids={[
            "select.dsc_hub_control_strategy",
            "select.dsc_hub_priority_tent",
            "number.dsc_hub_vpd_band_target_hours",
            "switch.dsc_hub_humidifier_intake_routing",
          ]}
        />
      </SettingsCard>

      <SettingsCard
        id="fans"
        title="Fans"
        icon="inline-fan"
        intro="The fan loop runs on the hub; the brain scales what it asks for."
        loadState={loadStateOf(state)}
        loadError={error}
      >
        <ScaleRow
          id="fan-demand-scale"
          field="fan_demand_scale"
          label="Fan demand scale"
          description="Multiplies every fan demand the brain sends. 1.0 is nameplate."
          consumers={[
            { label: "Climate", href: `#${paths.climate()}` },
            { label: "Overview", href: `#${paths.overview()}` },
          ]}
        />
      </SettingsCard>
    </>
  );
}

export function LightSettingsPage() {
  const { state, error } = useGlobalModifiers();
  const hub = useHubCardState();
  return (
    <>
      <SettingsCard
        id="schedule"
        title="Schedule"
        icon="light-schedule"
        intro="The photoperiod rail the hub runs. Lights-on times stay on the Light desk (they are clock entities); everything around them is here."
        loadState={hub.loadState}
        loadError={hub.loadError}
      >
        {hub.blockedNote ? <p className="dsc-honesty">{hub.blockedNote}</p> : null}
        <HubTunableRows
          ids={[
            "switch.dsc_hub_auto_photoperiod",
            "number.dsc_hub_clone_light_hours",
            "number.dsc_hub_min_dark_hours",
            "number.dsc_hub_sunrise_duration",
            "number.dsc_hub_sunset_duration",
          ]}
        />
        <SettingRow
          id="schedule-desk"
          label="Lights-on times"
          scope="hub"
          control={<a href={`#${paths.light()}`}>Light desk →</a>}
          description="4×8 and 2×4 on-times are clock entities on the desk. The hub's own on-time is not yet in the fleet snapshot (tracker)."
        />
      </SettingsCard>

      <SettingsCard
        id="fixtures"
        title="Fixtures"
        icon="grow-light"
        intro="Lamp targets and the brain's brightness scale. Nameplate watts per fixture are on the Light desk's fixtures panel."
        loadState={loadStateOf(state)}
        loadError={error}
        advanced={<HubTunableRows ids={["number.dsc_hub_sf1000_ramp_floor"]} advanced forceShow />}
      >
        <HubTunableRow entityId="number.dsc_hub_sf1000_target_brightness" />
        <ScaleRow
          id="light-brightness-scale"
          field="light_brightness_scale"
          label="Light brightness scale"
          description="Multiplies lamp brightness targets. 1.0 is the schedule's own value."
          consumers={[{ label: "Light", href: `#${paths.light()}` }]}
        />
        <SettingRow
          id="fixtures-desk"
          label="Fixtures and nameplate watts"
          scope="brain"
          control={<a href={`#${paths.light()}`}>Light desk →</a>}
          description="Per-space devices with their watts drive the energy estimate."
        />
      </SettingsCard>
      <div id="tariff" style={{ scrollMarginTop: 80 }}>
        <SpaceEnergySettingsCard />
      </div>
    </>
  );
}

const STEERING_ROWS: { key: string; label: string; description: string; unit: string; step: number }[] = [
  { key: "dryback_p1_max_pct", label: "P1 dry-back ceiling", description: "Below this dry-back the pot is still in P1 (saturating shots).", unit: "%", step: 1 },
  { key: "dryback_p2_max_pct", label: "P2 dry-back ceiling", description: "Between P1 and this the pot is in P2 (maintenance shots).", unit: "%", step: 1 },
  { key: "dryback_p3_min_pct", label: "P3 dry-back floor", description: "Past this dry-back the pot is in P3 (overnight dry-back).", unit: "%", step: 1 },
  { key: "vwc_target_day_pct", label: "VWC target · day", description: "Substrate water content the day shots aim for.", unit: "%", step: 1 },
  { key: "vwc_target_night_pct", label: "VWC target · night", description: "Where the overnight dry-back should land.", unit: "%", step: 1 },
  { key: "ec_target_ms", label: "EC target", description: "Substrate EC the feed aims for.", unit: "mS/cm", step: 0.1 },
];

function SteeringTargetRow({
  spec,
  data,
  onSaved,
}: {
  spec: (typeof STEERING_ROWS)[number];
  data: RootSteeringTargets;
  onSaved: (next: RootSteeringTargets) => void;
}) {
  const save = useSaveState();
  const live = data.targets[spec.key];
  const def = data.defaults[spec.key];
  const [draft, setDraft] = useState(String(live));
  useEffect(() => setDraft(String(live)), [live]);
  const commit = () => {
    const n = Number(draft);
    if (!Number.isFinite(n) || n === live) return;
    void save.run(async () => onSaved(await patchRootSteeringTargets({ [spec.key]: n })));
  };
  return (
    <SettingRow
      id={`steer-${spec.key}`}
      label={spec.label}
      description={spec.description}
      scope="brain"
      defaultLabel={`${def} ${spec.unit}`}
      isDefault={live === def}
      onReset={() => void save.run(async () => onSaved(await patchRootSteeringTargets({ [spec.key]: def })))}
      state={save.state}
      stateText={save.text}
      consumers={[{ label: "Root", href: `#${paths.root()}` }]}
      control={
        <>
          <input
            type="number"
            step={spec.step}
            value={draft}
            aria-label={spec.label}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          <span className="dsc-setting-value">{spec.unit}</span>
        </>
      }
    />
  );
}

export function RootSettingsPage() {
  const { modifiers, state, error, save } = useGlobalModifiers();
  const manifest = useSettingsManifest();
  const saveState = useSaveState();
  const hub = useHubCardState();
  const [steer, setSteer] = useState<RootSteeringTargets | null>(null);
  const [steerState, setSteerState] = useState<"loading" | "ready" | "error">("loading");
  const [steerError, setSteerError] = useState<string | undefined>(undefined);
  useEffect(() => {
    getRootSteeringTargets()
      .then((d) => {
        setSteer(d);
        setSteerState("ready");
      })
      .catch((e: unknown) => {
        setSteerError(e instanceof Error ? e.message : String(e));
        setSteerState("error");
      });
  }, []);
  const live = modifiers?.moisture_dry_pct ?? DEFAULT_MODS.moisture_dry_pct;
  const [draft, setDraft] = useState<string>(String(live));
  useEffect(() => setDraft(String(live)), [live]);
  const row = manifest.rows["global_modifiers.moisture_dry_pct"];
  const commit = () => {
    const n = Number(draft);
    if (!Number.isFinite(n) || n === live) return;
    void saveState.run(() => save({ moisture_dry_pct: Math.max(5, Math.min(80, n)) }));
  };
  return (
    <>
      <SettingsCard
        id="steering"
        title="Steering"
        icon="dry-back"
        intro="Crop-steering phases P1–P3 are computed by the brain from each probe's dry-back; these are the thresholds it uses. Auto / manual steering stays on the Root desk."
        loadState={steerState === "error" ? "error" : steerState === "loading" && !steer ? "loading" : "ready"}
        loadError={steerError}
      >
        {steer ? STEERING_ROWS.map((spec) => <SteeringTargetRow key={spec.key} spec={spec} data={steer} onSaved={setSteer} />) : null}
      </SettingsCard>

      <SettingsCard
        id="heatmat"
        title="Heat mat"
        icon="heater-mat"
        intro="Root-zone band the mat keeps and which probes may call for it."
        loadState={hub.loadState}
        loadError={hub.loadError}
        advanced={<HubTunableRows ids={["number.dsc_hub_mat_min_off_time", "number.dsc_hub_ladder_wait_mat"]} advanced forceShow />}
      >
        {hub.blockedNote ? <p className="dsc-honesty">{hub.blockedNote}</p> : null}
        <HubTunableRows
          ids={[
            "number.dsc_hub_mat_root_zone_low",
            "number.dsc_hub_mat_root_zone_high",
            "switch.dsc_hub_mat_vote_pot_1",
            "switch.dsc_hub_mat_vote_pot_2",
          ]}
        />
      </SettingsCard>

      <SettingsCard
        id="references"
        title="References"
        icon="soil-probe"
        intro="What the Root desk draws as reference lines."
        loadState={loadStateOf(state)}
        loadError={error}
      >
        <SettingRow
          id="moisture-dry-line"
          label="Probe dry reference line"
          description="The red reference line on Root probe-moisture charts."
          scope="brain"
          defaultLabel={manifestDefaultLabel(row, "30 %")}
          isDefault={live === DEFAULT_MODS.moisture_dry_pct}
          onReset={() => void saveState.run(() => save({ moisture_dry_pct: DEFAULT_MODS.moisture_dry_pct }))}
          state={saveState.state}
          stateText={saveState.text}
          consumers={[{ label: "Root", href: `#${paths.root()}` }]}
          control={
            <>
              <input
                type="number"
                min={row?.min ?? 5}
                max={row?.max ?? 80}
                step={row?.step ?? 1}
                value={draft}
                aria-label="Probe dry reference line percent"
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
              />
              <span className="dsc-setting-value">%</span>
            </>
          }
        />
      </SettingsCard>
    </>
  );
}

function LeafOffsetRow() {
  const manifest = useSettingsManifest();
  const saveState = useSaveState();
  const [live, setLive] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");
  useEffect(() => {
    get_settings()
      .then((s) => {
        const v = s.settings.leaf_offset_c ?? "2";
        setLive(v);
        setDraft(v);
      })
      .catch(() => setLive(null));
  }, []);
  const row = manifest.rows.leaf_offset_c;
  const def = String(row?.default ?? "2");
  const commit = () => {
    if (draft === live) return;
    const n = Number(draft);
    if (!Number.isFinite(n)) return;
    void saveState.run(async () => {
      await patch_settings({ leaf_offset_c: String(n) });
      setLive(String(n));
      const { refreshBrainSettings } = await import("../../hooks/useBrainSettings");
      await refreshBrainSettings();
    });
  };
  return (
    <SettingRow
      id="leaf-offset"
      label="Leaf-to-air offset"
      description="Subtracted from air temperature to estimate leaf temperature for leaf VPD (4×8 and 2×4) until an IR leaf sensor exists. The desks' derived leaf VPD reads this same value."
      scope="brain"
      defaultLabel={manifestDefaultLabel(row, "2 °C")}
      isDefault={live === def}
      onReset={() =>
        void saveState.run(async () => {
          await patch_settings({ leaf_offset_c: def });
          setLive(def);
          setDraft(def);
          const { refreshBrainSettings } = await import("../../hooks/useBrainSettings");
          await refreshBrainSettings();
        })
      }
      state={saveState.state}
      stateText={saveState.text}
      consumers={[
        { label: "Climate", href: `#${paths.climate()}` },
        { label: "Overview", href: `#${paths.overview()}` },
      ]}
      control={
        <>
          <input
            type="number"
            step={row?.step ?? 0.1}
            min={row?.min ?? -5}
            max={row?.max ?? 5}
            value={draft}
            aria-label="Leaf-to-air offset in degrees Celsius"
            disabled={live == null}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          <span className="dsc-setting-value">°C</span>
        </>
      }
    />
  );
}

function ZoneOffsetRow({ zone }: { zone: ClimateZone }) {
  const { modifiers, save } = useGlobalModifiers();
  const saveState = useSaveState();
  const liveT = modifiers?.temp_offset_c[zone] ?? 0;
  const liveRh = modifiers?.rh_offset_pct[zone] ?? 0;
  const [t, setT] = useState(String(liveT));
  const [rh, setRh] = useState(String(liveRh));
  useEffect(() => setT(String(liveT)), [liveT]);
  useEffect(() => setRh(String(liveRh)), [liveRh]);
  const commit = () => {
    const nt = Number(t);
    const nrh = Number(rh);
    if (!Number.isFinite(nt) || !Number.isFinite(nrh)) return;
    if (nt === liveT && nrh === liveRh) return;
    void saveState.run(() => save({ temp_offset_c: { [zone]: nt }, rh_offset_pct: { [zone]: nrh } }));
  };
  return (
    <SettingRow
      id={`offset-${zone}`}
      label={`${ZONE_LABELS[zone]} sensor offsets`}
      description="Added to this zone's temperature and RH before control and ingest. Use after a reference-thermometer check, not to chase a target."
      scope="brain"
      defaultLabel="0 °C · 0 %"
      isDefault={liveT === 0 && liveRh === 0}
      onReset={() => void saveState.run(() => save({ temp_offset_c: { [zone]: 0 }, rh_offset_pct: { [zone]: 0 } }))}
      state={saveState.state}
      stateText={saveState.text}
      control={
        <>
          <input type="number" step={0.1} value={t} aria-label={`${ZONE_LABELS[zone]} temperature offset`} onChange={(e) => setT(e.target.value)} onBlur={commit} />
          <span className="dsc-setting-value">°C</span>
          <input type="number" step={0.5} value={rh} aria-label={`${ZONE_LABELS[zone]} humidity offset`} onChange={(e) => setRh(e.target.value)} onBlur={commit} />
          <span className="dsc-setting-value">%</span>
        </>
      }
    />
  );
}

export function SensorsSettingsPage() {
  const { modifiers, state, error } = useGlobalModifiers();
  const manifest = useSettingsManifest();
  const clamp = modifiers?.sensor_clamp;
  const stale = manifest.rows["appliance_driver.STALE_SEC"];
  return (
    <>
      <SettingsCard
        id="offsets"
        title="Offsets"
        icon="temp-humidity-sensor"
        intro="Corrections applied before a reading is trusted. Every offset is visible here and nowhere else."
        loadState={loadStateOf(state)}
        loadError={error}
        advanced={
          <SettingRow
            id="sensor-clamps"
            label="Sensor clamps"
            description="Readings outside these bounds are clamped and flagged. Read-only until the brain's patch route accepts clamps (logged in the tracker)."
            scope="brain"
            advanced
            forceShow
            control={
              <Stated>
                {clamp
                  ? `T ${clamp.temp_c?.min ?? -5}…${clamp.temp_c?.max ?? 50} °C · RH ${clamp.rh_pct?.min ?? 0}…${clamp.rh_pct?.max ?? 100} %`
                  : "—"}
              </Stated>
            }
          />
        }
      >
        <LeafOffsetRow />
        {CLIMATE_ZONES.map((z) => (
          <ZoneOffsetRow key={z} zone={z} />
        ))}
      </SettingsCard>
      <SettingsCard
        id="trust"
        title="Trust"
        icon="status-ok"
        intro="Thresholds that decide when a reading is distrusted: the two hub DHTs disagreeing, and a probe drifting from its peers (median absolute deviation)."
        advanced={
          <SettingRow
            id="stale-control"
            label="Control-side stale horizon"
            description={stale?.description ?? "A seat silent for longer is treated as stale by the appliance driver."}
            scope="firmware"
            advanced
            forceShow
            control={<Stated>{stale ? `${String(stale.default)} ${stale.unit ?? ""}` : "45 s"}</Stated>}
            consumers={[{ label: "Preferences › Charts", href: `#${paths.settings("preferences", "pref-staleMs")}` }]}
          />
        }
      >
        <HelperNumberRow entityId="input_number.dsc_dht_delta_t_c" label="DHT disagreement · temperature" description="Tent and room sensors further apart than this raise the climate-sensor-fault alert." fallback={4} unit="°C" step={0.5} min={0.5} max={15} />
        <HelperNumberRow entityId="input_number.dsc_dht_delta_rh" label="DHT disagreement · humidity" fallback={15} unit="%" step={1} min={2} max={40} />
        <HelperNumberRow entityId="input_number.dsc_trust_mad_ph" label="Peer drift · pH" description="A probe this far from the median of its peers is distrusted." fallback={0.6} unit="pH" step={0.1} min={0.1} max={3} />
        <HelperNumberRow entityId="input_number.dsc_trust_mad_ec" label="Peer drift · EC" fallback={250} unit="µS/cm" step={10} min={20} max={2000} />
        <HelperNumberRow entityId="input_number.dsc_trust_mad_moisture" label="Peer drift · moisture" fallback={12} unit="%" step={1} min={2} max={50} />
      </SettingsCard>
    </>
  );
}

function DefaultsNumberRow({
  id,
  label,
  description,
  value,
  onSave,
}: {
  id: string;
  label: string;
  description: string;
  value: number;
  onSave: (n: number) => Promise<void>;
}) {
  const save = useSaveState();
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const n = Math.max(0, Math.round(Number(draft) || 0));
    if (n === value) return;
    void save.run(() => onSave(n));
  };
  return (
    <SettingRow
      id={id}
      label={label}
      description={description}
      scope="brain"
      defaultLabel="0 s"
      isDefault={value === 0}
      onReset={() => void save.run(() => onSave(0))}
      state={save.state}
      stateText={save.text}
      control={
        <>
          <input type="number" min={0} max={86400} step={5} value={draft} aria-label={label} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} />
          <span className="dsc-setting-value">s</span>
        </>
      }
    />
  );
}

export function AutomationSettingsPage() {
  const [seats, setSeats] = useState<string[]>([]);
  const [defaults, setDefaults] = useState<AutomationDefaults | null>(null);
  const [maxConditions, setMaxConditions] = useState<number | null>(null);
  const [defaultsState, setDefaultsState] = useState<"loading" | "ready" | "error">("loading");
  const [defaultsError, setDefaultsError] = useState<string | undefined>(undefined);
  const windowSave = useSaveState();
  const [winStart, setWinStart] = useState("");
  const [winEnd, setWinEnd] = useState("");
  useEffect(() => {
    getAutomationDefaults()
      .then((d) => {
        setDefaults(d.defaults);
        setMaxConditions(d.max_conditions);
        setWinStart(d.defaults.window?.start ?? "");
        setWinEnd(d.defaults.window?.end ?? "");
        setDefaultsState("ready");
      })
      .catch((e: unknown) => {
        setDefaultsError(e instanceof Error ? e.message : String(e));
        setDefaultsState("error");
      });
  }, []);
  const apply = async (patch: Parameters<typeof patchAutomationDefaults>[0]) => {
    const d = await patchAutomationDefaults(patch);
    setDefaults(d.defaults);
    setWinStart(d.defaults.window?.start ?? "");
    setWinEnd(d.defaults.window?.end ?? "");
  };
  useEffect(() => {
    get_settings()
      .then((s) =>
        setSeats(
          s.inventory
            // "Seat out of service" only makes sense for appliances and operator-added
            // Zigbee/extra seats — never hub / panel / probes.
            .filter((r) => !["hub", "panel", "pot"].includes(String(r.role ?? "")))
            .map((r) => String(r.seat_id))
            .filter(Boolean),
        ),
      )
      .catch(() => setSeats([]));
  }, []);
  return (
    <>
      <SettingsCard
        id="rule-defaults"
        title="New-rule defaults"
        icon="timer"
        intro="What a freshly added rule starts with. Existing rules keep their own values."
        loadState={defaultsState}
        loadError={defaultsError}
      >
        {defaults ? (
          <>
            <DefaultsNumberRow id="rule-default-debounce" label="Debounce" description="A condition must hold this long before a new rule fires." value={defaults.debounce_s} onSave={(n) => apply({ debounce_s: n })} />
            <DefaultsNumberRow id="rule-default-release" label="Release" description="A condition must be clear this long before a new rule releases." value={defaults.release_s} onSave={(n) => apply({ release_s: n })} />
            <SettingRow
              id="rule-default-window"
              label="Time window"
              description="Local-time window a new rule is active in (may wrap midnight). Blank means always."
              scope="brain"
              defaultLabel="always"
              isDefault={defaults.window == null}
              onReset={() => void windowSave.run(() => apply({ clear_window: true }))}
              state={windowSave.state}
              stateText={windowSave.text}
              control={
                <>
                  <input type="time" value={winStart} aria-label="Default window start" onChange={(e) => setWinStart(e.target.value)} />
                  <span className="dsc-setting-value">to</span>
                  <input type="time" value={winEnd} aria-label="Default window end" onChange={(e) => setWinEnd(e.target.value)} />
                  <Button variant="secondary" disabled={!winStart || !winEnd || winStart === winEnd} onClick={() => void windowSave.run(() => apply({ window: { start: winStart, end: winEnd } }))}>
                    Set
                  </Button>
                </>
              }
            />
            <SettingRow
              id="rule-max-conditions"
              label="Max conditions per rule"
              description="Upper bound on conditions in one rule."
              scope="firmware"
              control={<Stated>{maxConditions ?? 8}</Stated>}
            />
          </>
        ) : null}
      </SettingsCard>
      <AutomationRulesCard seats={seats} defaults={defaults ?? undefined} />
    </>
  );
}
