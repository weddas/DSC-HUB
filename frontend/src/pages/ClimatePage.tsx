import { Fragment, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  EntityFanSlider,
  EntitySelect,
  EntityToggle,
  type EntityToggleConfirm,
  Kpi,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { OverflowMenu } from "../components/chrome";
import { TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "../components/HistoryDrawer";
import { AirPathMap } from "../components/AirPathMap";
import { FlowSankey } from "../components/FlowSankey";
import { CropScheduler } from "../components/CropScheduler";
import { TentTargetPanel } from "../components/TentTargets";
import { resolveCfm } from "../lib/cfmProvenance";
import { inventoryInService } from "../lib/fleetModel";
import { absoluteHumidity } from "../lib/potTrust";
import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet, useHubVitals } from "../hooks/useFleet";
import { useFleetEntity } from "../hooks/useFleetEntity";
import { useEntitySeries } from "../hooks/useEntitySeries";
import {
  useHeldReading,
  timestampedReading,
  TIMESTAMPED_READING_STALE_MS,
} from "../hooks/useHeldReading";
import { SettingsTable, SettingsRow, StaleValueCell } from "../components/settings/SettingsTable";
import { useChartHours } from "../hooks/useChartHours";
import { useZoneFocus, type ZoneFocus } from "../hooks/useZoneFocus";
import { useInspector } from "../components/InspectorHost";
import { HelpTip } from "../components/HelpTip";
import { withPriorGhost } from "../lib/chartSeries";
import { ArcGauge, GotWantBars, MultiLineChart, seriesExtrema } from "../viz/charts";
import { rhSegments, tempSegments, vpdSegments } from "../viz/gaugeTheme";
import { fmtDurationMs } from "../lib/formatDuration";
import { SHARED_AIR_FAN_PCT, fanPctChip } from "../components/DashHomeSections";
import { isZigbeeSafetyLeakRole } from "../lib/fleetApi";

function resolveRoomVpdId(entity: (id: string) => unknown): string {
  if (entity("sensor.dsc_hub_room_vpd_kpa")) return "sensor.dsc_hub_room_vpd_kpa";
  if (entity("sensor.dsc_hub_room_vpd")) return "sensor.dsc_hub_room_vpd";
  return "sensor.dsc_hub_room_vpd_kpa";
}

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

/** A dropped Zigbee climate sensor must not read as an ordinary confident number
 *  forever. Shared with the settings-table primitives — one horizon, one rule. */
const ZIGBEE_ROLE_STALE_MS = TIMESTAMPED_READING_STALE_MS;

const FOCUS_OPTIONS: { id: ZoneFocus; label: string }[] = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" },
];

export function LiveClimatePage() {
  const { num, state, entity, available } = useEntityBus();
  const fleet = useFleet();
  const hubVitals = useHubVitals();
  const navigate = useNavigate();
  const inspector = useInspector();
  const { focus, setFocus } = useZoneFocus();
  const { hours, setHours, maxPoints } = useChartHours(6);
  const fanOverride = useFleetEntity("switch.dsc_hub_tent_manual_override").state === "on";
  const fullAuto = useFleetEntity("switch.dsc_hub_tent_full_auto_mode").state === "on";
  const manualTakeover = useFleetEntity("switch.dsc_hub_manual_takeover").state === "on";
  // Under Full Auto a manual demand flip is swallowed by the brain on the next tick — say so
  // up front instead of letting the toggle look like it did nothing.
  const demandConfirm: EntityToggleConfirm = fullAuto
    ? {
        body: "Full Auto is on, so the brain owns this demand and will set it back within a few seconds. Turn Full Auto off (or use Manual takeover) to hold it yourself.",
      }
    : true;
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");
  // Capacity offline SoT is computed hass_extras — not fleet.system (often unset on /fleet).
  const reducedKit = state("binary_sensor.dsc_reduced_kit") === "on";
  const fanBus = { state, num, available, entity };

  const tentTHeld = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRhHeld = useHeldReading("sensor.dsc_hub_tent_humidity");
  const tentVpdHeld = useHeldReading("sensor.dsc_hub_vpd_kpa");
  const cloneTHeld = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRhHeld = useHeldReading("sensor.dsc_hub_clone_humidity");
  const cloneVpdHeld = useHeldReading("sensor.dsc_hub_clone_vpd_kpa");
  const roomTHeld = useHeldReading("sensor.dsc_hub_room_temperature");
  const roomRhHeld = useHeldReading("sensor.dsc_hub_room_humidity");
  const roomVpdId = resolveRoomVpdId(entity);
  const roomVpdHeld = useHeldReading(roomVpdId);

  const leafVpdHeld = useHeldReading("sensor.dsc_leaf_vpd_kpa");
  const cloneLeafVpdHeld = useHeldReading("sensor.dsc_clone_leaf_vpd_kpa");

  const tentT = useEntitySeries("sensor.dsc_hub_tent_temperature", { hours, maxPoints, withGhost: true });
  const tentRh = useEntitySeries("sensor.dsc_hub_tent_humidity", { hours, maxPoints, withGhost: true });
  const tentVpd = useEntitySeries("sensor.dsc_hub_vpd_kpa", { hours, maxPoints, withGhost: true });
  const cloneT = useEntitySeries("sensor.dsc_hub_clone_temperature", { hours, maxPoints, withGhost: true });
  const cloneRh = useEntitySeries("sensor.dsc_hub_clone_humidity", { hours, maxPoints, withGhost: true });
  const cloneVpd = useEntitySeries("sensor.dsc_hub_clone_vpd_kpa", { hours, maxPoints, withGhost: true });
  const roomT = useEntitySeries("sensor.dsc_hub_room_temperature", { hours, maxPoints, withGhost: true });
  const roomRh = useEntitySeries("sensor.dsc_hub_room_humidity", { hours, maxPoints, withGhost: true });
  const roomVpd = useEntitySeries(roomVpdId, { hours, maxPoints, withGhost: true });
  const leafVpd = useEntitySeries("sensor.dsc_leaf_vpd_kpa", { hours, maxPoints, withGhost: true });
  const cloneLeafVpd = useEntitySeries("sensor.dsc_clone_leaf_vpd_kpa", { hours, maxPoints, withGhost: true });
  const fanOut = useEntitySeries("sensor.dsc_fan_exhaust_outside_pct", { hours, maxPoints });
  const fanRecirc = useEntitySeries("sensor.dsc_fan_exhaust_room_pct", { hours, maxPoints });

  const outReading = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available,
    num,
  });
  const recReading = resolveCfm(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    "sensor.dsc_cfm_exhaust_recirc",
    { available, num },
  );
  const inMainReading = resolveCfm(
    "sensor.dsc_cfm_intake_main_allocated",
    "sensor.dsc_cfm_intake_main",
    { available, num },
  );
  const inCloneReading = resolveCfm(
    "sensor.dsc_cfm_intake_2x4_allocated",
    "sensor.dsc_cfm_intake_2x4",
    { available, num },
  );
  const cascadeReading = resolveCfm(
    "sensor.dsc_cfm_cascade_2x4_allocated",
    "sensor.dsc_cfm_cascade_2x4_allocated",
    { available, num },
  );

  const roomAh = absoluteHumidity(roomTHeld.value, roomRhHeld.value);
  const tentAh = absoluteHumidity(tentTHeld.value, tentRhHeld.value);
  const cloneAh = absoluteHumidity(cloneTHeld.value, cloneRhHeld.value);

  const targetTemp = num("number.dsc_hub_target_temp");
  const rhMin = num("number.dsc_hub_rh_target_min");
  const rhMax = num("number.dsc_hub_rh_target_max");
  const vpdMin = num("number.dsc_hub_vpd_target_min");
  const vpdMax = num("number.dsc_hub_vpd_target_max");
  const cloneTargetTemp = num("number.dsc_hub_clone_target_temp");
  const cloneRhMin = num("number.dsc_hub_clone_rh_min");
  const cloneRhMax = num("number.dsc_hub_clone_rh_max");
  const cloneVpdMin = num("number.dsc_hub_clone_vpd_min");
  const cloneVpdMax = num("number.dsc_hub_clone_vpd_max");

  const open = (id: string, label: string, unit?: string) => inspector.open({ entityId: id, label, unit });

  const tentTempExt = useMemo(() => seriesExtrema(tentT.series), [tentT.series]);
  const tentRhExt = useMemo(() => seriesExtrema(tentRh.series), [tentRh.series]);
  const tentVpdExt = useMemo(() => seriesExtrema(tentVpd.series), [tentVpd.series]);
  const cloneTempExt = useMemo(() => seriesExtrema(cloneT.series), [cloneT.series]);
  const cloneRhExt = useMemo(() => seriesExtrema(cloneRh.series), [cloneRh.series]);
  const cloneVpdExt = useMemo(() => seriesExtrema(cloneVpd.series), [cloneVpd.series]);
  const roomTempExt = useMemo(() => seriesExtrema(roomT.series), [roomT.series]);
  const roomRhExt = useMemo(() => seriesExtrema(roomRh.series), [roomRh.series]);
  const roomVpdExt = useMemo(() => seriesExtrema(roomVpd.series), [roomVpd.series]);

  const dTRoomMain = tentTHeld.value - roomTHeld.value;
  const dAhRoomMain = tentAh - roomAh;
  const dVpdRoomMain = tentVpdHeld.value - roomVpdHeld.value;
  const dTCloneMain = tentTHeld.value - cloneTHeld.value;
  const dAhCloneMain = tentAh - cloneAh;
  const dAhRoomClone = cloneAh - roomAh;
  // The KPI cards above already flag stale sources individually — this sentence draws from
  // the same held readings and must not read as fully live when any of them is stale.
  const deltaLineStale =
    tentTHeld.stale ||
    roomTHeld.stale ||
    cloneTHeld.stale ||
    tentVpdHeld.stale ||
    roomVpdHeld.stale ||
    tentRhHeld.stale ||
    roomRhHeld.stale ||
    cloneRhHeld.stale;
  const boughtH = num("sensor.dsc_bought_runtime_today");
  const dumpBtu = num("sensor.dsc_vent_heat_dump_btu");

  const canopyTempHeld = useHeldReading("sensor.dsc_canopy_temperature");
  const canopyRhHeld = useHeldReading("sensor.dsc_canopy_humidity");
  const canopyRole =
    typeof fleet.canopy?.role === "string" ? String(fleet.canopy.role) : null;
  const canopyDevice =
    typeof fleet.canopy?.friendly_name === "string" ? String(fleet.canopy.friendly_name) : null;
  // Entity bus often lacks canopy sensors (compat map omits them); fleet.canopy is Zigbee SoT.
  // Unbound → never paint T/RH (even if a held reading lingers from a prior bind).
  const canopyTempFleet = Number(fleet.canopy?.temp_c);
  const canopyRhFleet = Number(fleet.canopy?.rh_pct);
  const canopyTemp = !canopyRole
    ? NaN
    : canopyTempHeld.live && Number.isFinite(canopyTempHeld.value)
      ? canopyTempHeld.value
      : Number.isFinite(canopyTempFleet)
        ? canopyTempFleet
        : Number.isFinite(canopyTempHeld.value)
          ? canopyTempHeld.value
          : NaN;
  const canopyRh = !canopyRole
    ? NaN
    : canopyRhHeld.live && Number.isFinite(canopyRhHeld.value)
      ? canopyRhHeld.value
      : Number.isFinite(canopyRhFleet)
        ? canopyRhFleet
        : Number.isFinite(canopyRhHeld.value)
          ? canopyRhHeld.value
          : NaN;
  const canopyTempStale =
    Boolean(canopyRole) &&
    Number.isFinite(canopyTemp) &&
    !(canopyTempHeld.live && Number.isFinite(canopyTempHeld.value)) &&
    !Number.isFinite(canopyTempFleet) &&
    canopyTempHeld.stale;
  const canopyRhStale =
    Boolean(canopyRole) &&
    Number.isFinite(canopyRh) &&
    !(canopyRhHeld.live && Number.isFinite(canopyRhHeld.value)) &&
    !Number.isFinite(canopyRhFleet) &&
    canopyRhHeld.stale;
  // Reflect the worse of the two — a live temp reading must not mask a stale RH one, or vice versa.
  const canopyStale = canopyTempStale || canopyRhStale;

  const zigbeeByRole = (fleet.system.zigbee_by_role ?? fleet.system.zigbee_by_placement) as
    | Record<string, Record<string, unknown>>
    | undefined;
  const bindings = (fleet.system.zigbee_device_bindings ?? {}) as Record<
    string,
    { role?: string; zone?: string; recipe_id?: string }
  >;
  const policies = (fleet.system.zigbee_device_policies ?? {}) as Record<
    string,
    { recipe_id?: string }
  >;
  const policyState = (fleet.system.zigbee_policy_state ?? {}) as Record<
    string,
    { problem?: boolean; active?: boolean }
  >;

  function ieeeForRole(roleId: string): string | null {
    for (const [ieee, row] of Object.entries(bindings)) {
      if (String(row?.role ?? "") === roleId) return ieee;
    }
    return null;
  }

  const zigbeeClimateRows = useMemo(() => {
    if (!zigbeeByRole) return [];
    return Object.entries(zigbeeByRole)
      .filter(([role]) => !isZigbeeSafetyLeakRole(role))
      .map(([role, row]) => {
        // Each value routed through the shared fail-closed gate: present value +
        // stale updated_at (or none) -> held/greyed, not a confident number.
        const t = timestampedReading(
          row.temperature as number | string | null | undefined,
          row.updated_at as number | string | null | undefined,
          ZIGBEE_ROLE_STALE_MS,
        );
        const rh = timestampedReading(
          row.humidity as number | string | null | undefined,
          row.updated_at as number | string | null | undefined,
          ZIGBEE_ROLE_STALE_MS,
        );
        return {
          role,
          zone: String(row.zone ?? "—"),
          temp: t.value,
          tempStale: t.stale,
          rh: rh.value,
          rhStale: rh.stale,
          name: String(row.friendly_name ?? role),
          stale: t.stale || rh.stale,
        };
      });
  }, [zigbeeByRole]);

  const zigbeeSafetyRows = useMemo(() => {
    if (!zigbeeByRole) return [];
    return Object.entries(zigbeeByRole)
      .filter(([role]) => isZigbeeSafetyLeakRole(role))
      .map(([role, row]) => {
        const ieee = ieeeForRole(role);
        const recipeId = ieee ? String(policies[ieee]?.recipe_id ?? "none") : "none";
        const st = ieee ? policyState[ieee] : undefined;
        const wet =
          typeof row.wet === "boolean"
            ? row.wet
            : typeof row.active === "boolean"
              ? row.active
              : null;
        const showProblem = Boolean(ieee && recipeId !== "none" && st && typeof st.problem === "boolean");
        return {
          role,
          zone: String(row.zone ?? "—"),
          name: String(row.friendly_name ?? role),
          wet,
          showProblem,
          problem: showProblem ? Boolean(st?.problem) : null,
        };
      });
  }, [zigbeeByRole, bindings, policies, policyState]);

  const rowLit = (id: "room" | "clone" | "main") =>
    focus === "compare" || focus === id ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";

  return (
    <div className="dsc-page">
      <PageHeader
        icon="climate"
        title="Climate"
        subtitle="Room is the umbrella lung. 2×4 and 4×8 are grow rooms and transfer/storage. T, RH, VPD only together."
        actions={
          <OverflowMenu
            label="Climate settings"
            items={[
              { id: "mission", label: "Mission", onSelect: () => navigate("/live/mission") },
              { id: "main", label: "4×8 cockpit", onSelect: () => navigate("/live/4x8") },
              { id: "clone", label: "2×4 cockpit", onSelect: () => navigate("/live/2x4") },
              { id: "fleet", label: "Fleet kit", onSelect: () => navigate("/fleet") },
            ]}
          />
        }
      />

      <div className="dsc-chip-row" style={{ marginBottom: 14 }} role="group" aria-label="Zone emphasis">
        <StatusChip
          icon={hubVitals.online ? "ok" : "alert"}
          label={
            hubVitals.online
              ? `Hub ${hubVitals.temp_c != null ? `${hubVitals.temp_c.toFixed(1)}°C` : "live"}`
              : "Hub offline"
          }
          tone={hubVitals.online ? "ok" : "bad"}
        />
        {FOCUS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`dsc-chip${focus === opt.id ? " dsc-chip--ok" : ""}`}
            onClick={() => setFocus(opt.id)}
          >
            {opt.label}
          </button>
        ))}
        <HelpTip title="Zone focus">
          <p>
            Focus lights gauges and Want columns for the zone you are walking. <b>All</b> (compare) keeps both tents
            hot. <b>Room</b> is the umbrella lung — not a tent Want editor.
          </p>
          <p>
            Example: dial 2×4 RH → tap 2×4 so that column stays bright and 4×8 dims. Bare Climate URL keeps your last
            focus; only <code>?tent=</code> rewrites it.
          </p>
        </HelpTip>
        <TimespanControl hours={hours} setHours={setHours} extras={CYCLE_TIMESPAN_EXTRAS} />
        <Button teal onClick={() => navigate("/fleet")}>
          Kit / Fleet
        </Button>
      </div>

      {manualTakeover ? (
        <div className="dsc-banner dsc-banner--warn" style={{ marginBottom: 14 }}>
          <strong>Manual takeover — brain will re-plan on clear/reconnect</strong>
        </div>
      ) : null}

      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Command" icon="climate">
            <div className="dsc-mode-row">
              <EntityToggle
                confirm={{
                  body: "Full Auto ON hands fans and appliance demand back to the brain. OFF freezes them at their current state until you re-enable it or take manual takeover.",
                }}
                entityId="switch.dsc_hub_tent_full_auto_mode"
                label="Full Auto"
                icon="ok"
              />
              <EntityToggle
                confirm={{
                  body: "Manual takeover ON hands every fan and appliance to you and turns Full Auto off — the brain stops driving climate until you clear it (it re-plans on clear or hub reconnect).",
                }}
                entityId="switch.dsc_hub_manual_takeover"
                label="Manual takeover"
                icon="alert"
              />
              <EntityToggle
                confirm={{
                  body: "Fan override frees the fan duty sliders for you to set by hand. Appliance demand toggles stay brain-owned unless Manual takeover is also on.",
                }}
                entityId="switch.dsc_hub_tent_manual_override"
                label="Fan override"
                icon="climate"
              />
              <EntityToggle confirm entityId="switch.dsc_hub_humidifier_intake_routing" label="Hum intake routing" icon="climate" />
              <EntityToggle confirm entityId="switch.dsc_hub_recirc_de_strat_pulse" label="RECIRC de-strat" icon="climate" />
              <HelpTip title="Full Auto vs takeover">
                <p>
                  <b>Full Auto</b> lets the brain chase Want with fans and demand switches.{" "}
                  <b>Manual takeover</b> freezes automation so you own every flip.
                </p>
                <p>
                  Example: walk-in check → takeover on → nudge exhaust → takeover off when the room is stable again.
                  Fan override only frees the fan sliders; demand toggles stay brain-owned unless takeover is on.
                </p>
              </HelpTip>
            </div>
            <div className="dsc-mode-selects">
              <EntitySelect entityId="select.dsc_hub_control_strategy" label="Strategy" icon="climate" />
              <EntitySelect entityId="select.dsc_hub_priority_tent" label="Priority tent" icon="tent" />
            </div>
            <div className="dsc-demand-row" style={{ marginTop: 12 }}>
              <EntityToggle confirm={demandConfirm} entityId="switch.dsc_hub_heater_demand" label="Heat" icon="climate" />
              <EntityToggle
                confirm={demandConfirm}
                entityId="switch.dsc_hub_ac_demand"
                label="Cool"
                icon="climate"
                oos={!inventoryInService(fleet, "ac")}
                oosHelp={
                  <p>
                    The room AC relay (F-001) is on hold indefinitely for this kit. Cool stays out of
                    service — this is honest state, not a pending install. Bring it back from{" "}
                    <b>Settings → Device</b> if the relay is fitted.
                  </p>
                }
                warnWhenMissing={
                  state("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : undefined
                }
              />
              <EntityToggle confirm={demandConfirm} entityId="switch.dsc_hub_humidifier_demand" label="Hum" icon="climate" />
              <EntityToggle confirm={demandConfirm} entityId="switch.dsc_hub_dehumidifier_demand" label="Dehum" icon="climate" />
              <EntityToggle confirm={demandConfirm} entityId="switch.dsc_hub_grow_mat_demand" label="Mat" icon="root" />
              <EntityToggle
                confirm={demandConfirm}
                entityId="switch.dsc_hub_clone_humidifier_demand"
                label="Mister"
                icon="clone"
                oos={!inventoryInService(fleet, "mister")}
                oosHelp={
                  <p>
                    The 2×4 clone mister (F-002) is on hold indefinitely for this kit. It stays out of
                    service until the mister is fitted and set in service under <b>Settings → Device</b>.
                  </p>
                }
              />
            </div>
            {fullAuto ? (
              <p className="dsc-honesty">
                <StatusChip
                  icon={reducedKit ? "alert" : "ok"}
                  label={reducedKit ? "Capacity offline" : "Full Auto"}
                  tone={reducedKit ? "warn" : "ok"}
                  onClick={() =>
                    inspector.open({
                      entityId: reducedKit ? "binary_sensor.dsc_reduced_kit" : "switch.dsc_hub_tent_full_auto_mode",
                      label: reducedKit ? "Capacity offline" : "Full Auto",
                      kind: reducedKit ? "alert" : "binary",
                    })
                  }
                />{" "}
                {honesty ||
                  "The hub drives fans and appliances automatically while Full Auto is on — a manual demand flip is re-asserted on the next tick."}
              </p>
            ) : null}
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Room umbrella" icon="climate">
            <div className="dsc-chip-row">
              <Kpi
                label="Room °C"
                value={fmt(roomTHeld.value)}
                unit="°C"
                stale={roomTHeld.stale}
                onClick={() => open("sensor.dsc_hub_room_temperature", "Room T", "°C")}
              />
              <Kpi
                label="Room RH"
                value={fmt(roomRhHeld.value, 0)}
                unit="%"
                stale={roomRhHeld.stale}
                onClick={() => open("sensor.dsc_hub_room_humidity", "Room RH", "%")}
              />
              <Kpi
                label="Room VPD"
                value={fmt(roomVpdHeld.value, 2)}
                unit="kPa"
                stale={roomVpdHeld.stale}
                onClick={() => open(roomVpdId, "Room VPD", "kPa")}
              />
              <Kpi
                label="Room AH"
                value={Number.isFinite(roomAh) ? roomAh.toFixed(1) : "—"}
                unit="g/m³"
                sub={!Number.isFinite(roomAh) ? "Need T+RH" : `24h ${fmt(num("sensor.dsc_hub_room_temp_mean_24h"))}°C`}
                onClick={() => open("sensor.dsc_ah_room", "Room AH", "g/m³")}
              />
            </div>
            <p className="dsc-muted" style={{ marginTop: 8, fontSize: "var(--dsc-fs-sm)" }}>
              {deltaLineStale ? <StatusChip label="HELD" tone="warn" /> : null}{" "}
              ΔT room↔4×8 {fmt(dTRoomMain)}°C · ΔAH {fmt(dAhRoomMain)} g/m³ · ΔVPD {fmt(dVpdRoomMain, 2)} · ΔT/ΔAH 2×4↔4×8{" "}
              {fmt(dTCloneMain)}°C / {fmt(dAhCloneMain)} · ΔAH room↔2×4 {fmt(dAhRoomClone)} g/m³. Early warn is the lung poisoning a tent before Want miss.
            </p>
          </Card>
        </div>

        <div className="dsc-col-12">
          <TentTargetPanel
            hero
            emphasize={focus === "main" || focus === "clone" ? focus : undefined}
          />
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Triad · T / RH / VPD" icon="gauge">
            <div className="dsc-gauge-matrix">
              <div className={rowLit("room")}>
                <span className="dsc-gauge-row-tag">Room</span>
                <ArcGauge label="T" value={roomTHeld.value} min={10} max={40} unit="°C" extrema={roomTempExt} stale={roomTHeld.stale} onClick={() => open("sensor.dsc_hub_room_temperature", "Room T", "°C")} />
                <ArcGauge label="RH" value={roomRhHeld.value} min={0} max={100} unit="%" extrema={roomRhExt} stale={roomRhHeld.stale} onClick={() => open("sensor.dsc_hub_room_humidity", "Room RH", "%")} />
                <ArcGauge label="VPD" value={roomVpdHeld.value} min={0} max={2.5} unit="kPa" extrema={roomVpdExt} stale={roomVpdHeld.stale} onClick={() => open(roomVpdId, "Room VPD", "kPa")} />
              </div>
              <div className={rowLit("clone")}>
                <span className="dsc-gauge-row-tag">2×4</span>
                <ArcGauge label="T" value={cloneTHeld.value} min={15} max={35} unit="°C" target={cloneTargetTemp} band={{ min: cloneTargetTemp - 2, max: cloneTargetTemp + 2 }} segments={tempSegments(cloneTargetTemp)} extrema={cloneTempExt} stale={cloneTHeld.stale} onClick={() => open("sensor.dsc_hub_clone_temperature", "2×4 T", "°C")} />
                <ArcGauge label="RH" value={cloneRhHeld.value} min={0} max={100} unit="%" band={{ min: cloneRhMin, max: cloneRhMax }} segments={rhSegments(cloneRhMin, cloneRhMax)} extrema={cloneRhExt} stale={cloneRhHeld.stale} onClick={() => open("sensor.dsc_hub_clone_humidity", "2×4 RH", "%")} />
                <ArcGauge label="VPD" value={cloneVpdHeld.value} min={0} max={2.5} unit="kPa" band={{ min: cloneVpdMin, max: cloneVpdMax }} segments={vpdSegments(cloneVpdMin, cloneVpdMax)} extrema={cloneVpdExt} stale={cloneVpdHeld.stale} onClick={() => open("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa")} />
              </div>
              <div className={rowLit("main")}>
                <span className="dsc-gauge-row-tag">4×8</span>
                <ArcGauge label="T" value={tentTHeld.value} min={15} max={35} unit="°C" target={targetTemp} band={{ min: targetTemp - 2, max: targetTemp + 2 }} segments={tempSegments(targetTemp)} extrema={tentTempExt} stale={tentTHeld.stale} onClick={() => open("sensor.dsc_hub_tent_temperature", "4×8 T", "°C")} />
                <ArcGauge label="RH" value={tentRhHeld.value} min={0} max={100} unit="%" band={{ min: rhMin, max: rhMax }} segments={rhSegments(rhMin, rhMax)} extrema={tentRhExt} stale={tentRhHeld.stale} onClick={() => open("sensor.dsc_hub_tent_humidity", "4×8 RH", "%")} />
                <ArcGauge label="VPD" value={tentVpdHeld.value} min={0} max={2.5} unit="kPa" band={{ min: vpdMin, max: vpdMax }} segments={vpdSegments(vpdMin, vpdMax)} extrema={tentVpdExt} stale={tentVpdHeld.stale} onClick={() => open("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa")} />
              </div>
            </div>
            <GotWantBars
              rows={[
                { label: "Room T", got: roomTHeld.value, stale: roomTHeld.stale, want: num("sensor.dsc_hub_room_temp_mean_24h"), unit: "°C" },
                { label: "2×4 T", got: cloneTHeld.value, stale: cloneTHeld.stale, want: cloneTargetTemp, unit: "°C" },
                { label: "4×8 T", got: tentTHeld.value, stale: tentTHeld.stale, want: targetTemp, unit: "°C" },
                { label: "2×4 RH", got: cloneRhHeld.value, stale: cloneRhHeld.stale, wantMin: cloneRhMin, wantMax: cloneRhMax, unit: "%" },
                { label: "4×8 RH", got: tentRhHeld.value, stale: tentRhHeld.stale, wantMin: rhMin, wantMax: rhMax, unit: "%" },
                { label: "2×4 VPD", got: cloneVpdHeld.value, stale: cloneVpdHeld.stale, wantMin: cloneVpdMin, wantMax: cloneVpdMax, unit: "kPa" },
                { label: "4×8 VPD", got: tentVpdHeld.value, stale: tentVpdHeld.stale, wantMin: vpdMin, wantMax: vpdMax, unit: "kPa" },
                { label: "4×8 leaf VPD", got: leafVpdHeld.value, stale: leafVpdHeld.stale, unit: "kPa" },
                { label: "2×4 leaf VPD", got: cloneLeafVpdHeld.value, stale: cloneLeafVpdHeld.stale, unit: "kPa" },
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Temperature" icon="climate">
            <MultiLineChart
              unit="°C"
              chartHours={hours}
              lastSyncAt={Math.max(roomT.lastSyncAt ?? 0, cloneT.lastSyncAt ?? 0, tentT.lastSyncAt ?? 0) || undefined}
              yDomain={{ left: { min: 15, max: 35 } }}
              series={[
                ...withPriorGhost("rt", "Room", roomT, "var(--dsc-gray-5)", "°C"),
                ...withPriorGhost("ct", "2×4", cloneT, "var(--dsc-teal)", "°C", { band: { min: cloneTargetTemp - 1.5, max: cloneTargetTemp + 1.5 } }),
                ...withPriorGhost("mt", "4×8", tentT, "var(--dsc-blue)", "°C", { band: { min: targetTemp - 1.5, max: targetTemp + 1.5 } }),
              ]}
              targets={[{ axis: "left", value: targetTemp, color: "var(--dsc-amber)", label: "4×8 Want T" }]}
            />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Humidity" icon="climate">
            <MultiLineChart
              unit="%"
              chartHours={hours}
              lastSyncAt={Math.max(roomRh.lastSyncAt ?? 0, cloneRh.lastSyncAt ?? 0, tentRh.lastSyncAt ?? 0) || undefined}
              yDomain={{ left: { min: 0, max: 100 } }}
              series={[
                ...withPriorGhost("rrh", "Room", roomRh, "var(--dsc-gray-5)", "%"),
                ...withPriorGhost("crh", "2×4", cloneRh, "var(--dsc-teal)", "%", { band: { min: cloneRhMin, max: cloneRhMax } }),
                ...withPriorGhost("mrh", "4×8", tentRh, "var(--dsc-blue)", "%", { band: { min: rhMin, max: rhMax } }),
              ]}
              targets={[{ axis: "left", min: rhMin, max: rhMax, color: "var(--dsc-teal)" }]}
            />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="VPD" icon="climate">
            <MultiLineChart
              unit="kPa"
              chartHours={hours}
              lastSyncAt={
                Math.max(
                  roomVpd.lastSyncAt ?? 0,
                  cloneVpd.lastSyncAt ?? 0,
                  tentVpd.lastSyncAt ?? 0,
                  leafVpd.lastSyncAt ?? 0,
                  cloneLeafVpd.lastSyncAt ?? 0,
                ) || undefined
              }
              yDomain={{ left: { min: 0, max: 2.5 } }}
              series={[
                ...withPriorGhost("rv", "Room", roomVpd, "var(--dsc-gray-5)", "kPa"),
                ...withPriorGhost("cv", "2×4 air", cloneVpd, "var(--dsc-teal)", "kPa", { band: { min: cloneVpdMin, max: cloneVpdMax } }),
                ...withPriorGhost("mv", "4×8 air", tentVpd, "var(--dsc-blue)", "kPa", { band: { min: vpdMin, max: vpdMax } }),
                ...withPriorGhost("lv", "4×8 leaf", leafVpd, "var(--dsc-green)", "kPa"),
                ...withPriorGhost("clv", "2×4 leaf", cloneLeafVpd, "var(--dsc-green-dim)", "kPa"),
              ]}
              targets={[
                { min: vpdMin, max: vpdMax, color: "var(--dsc-blue-dim)" },
                { min: cloneVpdMin, max: cloneVpdMax, color: "var(--dsc-teal-dim)" },
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Air path" icon="climate">
            <AirPathMap
              intakeClone={inCloneReading}
              intakeMain={inMainReading}
              cascade={cascadeReading}
              outCfm={outReading}
              recircCfm={recReading}
            />
            <FlowSankey
              intakeClone={inCloneReading}
              intakeMain={inMainReading}
              cascade={cascadeReading}
              outCfm={outReading}
              recircCfm={recReading}
              massBalanceOk={null}
            />
            <p className="dsc-muted" style={{ marginTop: 8, fontSize: "0.85rem" }}>
              Sankey is air CFM only (Allocated / Nameplate). Heat and humidity estimated splits are not shown.
              Cascade uses the 2×4→4×8 allocated sensor — zero / missing links are omitted, not invented balance.
              Mass-imbalance chip stays gated (not a live alarm).
            </p>
          </Card>
        </div>

        {canopyRole ||
        zigbeeClimateRows.length ||
        zigbeeSafetyRows.length ? (
          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Zigbee by role" icon="gauge">
              <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", marginBottom: 8 }}>
                Assign Role/Zone in Settings → Device → Zigbee. Save re-routes into Climate immediately.
                Unbound sensors never fill canopy.
              </p>
              <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
                {canopyRole ? (
                  <StatusChip
                    label={`Canopy ← ${canopyRole}${canopyDevice ? ` (${canopyDevice})` : ""}`}
                    tone="ok"
                  />
                ) : (
                  <StatusChip label="Canopy unbound" tone="muted" />
                )}
                {canopyRole && Number.isFinite(canopyTemp) ? (
                  <StatusChip
                    label={`Canopy ${canopyTemp.toFixed(1)}°C / ${
                      Number.isFinite(canopyRh) ? `${canopyRh.toFixed(0)}% RH` : "— RH"
                    }`}
                    tone={canopyStale ? "warn" : "ok"}
                  />
                ) : null}
              </div>
              {zigbeeClimateRows.length ? (
                <SettingsTable
                  columns={[
                    { key: "role", label: "Role" },
                    { key: "zone", label: "Zone" },
                    { key: "device", label: "Device" },
                    { key: "t", label: "°C", numeric: true },
                    { key: "rh", label: "RH %", numeric: true },
                  ]}
                  help={{
                    title: "Zigbee by role",
                    body: (
                      <p>
                        Values are held from the last MQTT report. A sensor silent for more than
                        10 minutes shows its last reading greyed with <b>⏸</b> — never a confident
                        live number.
                      </p>
                    ),
                  }}
                >
                  {zigbeeClimateRows.map((row) => (
                    <SettingsRow key={row.role} tone={row.stale ? "muted" : undefined}>
                      <td>{row.role}</td>
                      <td>{row.zone}</td>
                      <td>{row.name}</td>
                      <StaleValueCell value={row.temp} unit="°C" stale={row.tempStale} digits={1} />
                      <StaleValueCell value={row.rh} unit="%" stale={row.rhStale} digits={0} />
                    </SettingsRow>
                  ))}
                </SettingsTable>
              ) : zigbeeSafetyRows.length ? null : (
                <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                  No climate roles bound yet — permit join, then set Role + Zone and Save.
                </p>
              )}
              {zigbeeSafetyRows.length ? (
                <>
                  <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", marginTop: 12, marginBottom: 8 }}>
                    Safety — Wet/Dry is the raw sensor. Problem/Clear appears only when a Task is bound.
                  </p>
                  <div className="dsc-chip-row">
                    {zigbeeSafetyRows.map((row) => (
                      <Fragment key={row.role}>
                        <StatusChip
                          label={`${row.role} · ${row.zone} · ${row.name}`}
                          tone="muted"
                        />
                        <StatusChip
                          label={
                            row.wet === true ? "Wet" : row.wet === false ? "Dry" : "Wet/Dry —"
                          }
                          tone={row.wet === true ? "warn" : row.wet === false ? "ok" : "muted"}
                        />
                        {row.showProblem ? (
                          <StatusChip
                            label={row.problem ? "Problem" : "Clear"}
                            tone={row.problem ? "warn" : "ok"}
                          />
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
            </Card>
          </div>
        ) : null}

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Fan duty %" icon="climate">
            <div className="dsc-chip-row" role="group" aria-label="Shared air fan plant" style={{ marginBottom: 10 }}>
              {SHARED_AIR_FAN_PCT.map(({ label, id }) => {
                const { live, pct } = fanPctChip(fanBus, id);
                return (
                  <StatusChip
                    key={id}
                    label={live ? `${label} ${pct}%` : `${label} —`}
                    tone={live && pct > 0 ? "ok" : "muted"}
                    motion={live && pct > 0 ? "fan" : undefined}
                    onClick={() => open(id, label, "%")}
                  />
                );
              })}
            </div>
            <MultiLineChart
              unit="%"
              yDomain={{ left: { min: 0, max: 100 } }}
              lastSyncAt={Math.max(fanOut.lastSyncAt ?? 0, fanRecirc.lastSyncAt ?? 0) || undefined}
              series={[
                { id: "fout", label: "OUT %", series: fanOut.series, color: "var(--dsc-teal)", unit: "%", step: true, band: { min: 0, max: 90 } },
                { id: "frec", label: "RECIRC %", series: fanRecirc.series, color: "var(--dsc-amber)", unit: "%", step: true, band: { min: 0, max: 90 } },
              ]}
            />
            <div className="dsc-fan-stack" style={{ marginTop: 12 }}>
              <EntityFanSlider entityId="fan.dsc_hub_4_inch_intake_fan_main" label="Intake 4×8" disabled={!fanOverride} />
              <EntityFanSlider entityId="fan.dsc_hub_4_inch_intake_fan_2x4" label="Intake 2×4" disabled={!fanOverride} />
              <EntityFanSlider entityId="fan.dsc_hub_6_inch_exhaust_room" label="Exhaust room" disabled={!fanOverride} />
              <EntityFanSlider entityId="fan.dsc_hub_6_inch_exhaust_outside" label="Exhaust outside" disabled={!fanOverride} />
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Efficacy" icon="alert">
            <p className="dsc-muted" style={{ margin: "0 0 8px", fontSize: "var(--dsc-fs-sm)" }}>
              Buying kW because the lung could not transfer.
            </p>
            <div className="dsc-chip-row">
              <StatusChip label={`Heat ${state("switch.dsc_hub_heater_demand") === "on" ? "ON" : "off"}`} tone={state("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted"} onClick={() => open("switch.dsc_hub_heater_demand", "Heater", undefined)} />
              <StatusChip
                label={!inventoryInService(fleet, "ac") ? "Cool on hold" : `Cool ${state("switch.dsc_hub_ac_demand") === "on" ? "ON" : "off"}`}
                tone={!inventoryInService(fleet, "ac") ? "muted" : state("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted"}
                onClick={() => open("switch.dsc_hub_ac_demand", "Cool", undefined)}
              />
              <StatusChip label={`Hum ${state("switch.dsc_hub_humidifier_demand") === "on" ? "ON" : "off"}`} tone={state("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted"} onClick={() => open("switch.dsc_hub_humidifier_demand", "Humidifier", undefined)} />
              <StatusChip label={`Dehum ${state("switch.dsc_hub_dehumidifier_demand") === "on" ? "ON" : "off"}`} tone={state("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted"} onClick={() => open("switch.dsc_hub_dehumidifier_demand", "Dehumidifier", undefined)} />
              <StatusChip
                label={state("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "Hum ineffective" : "Hum ok"}
                tone={state("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "warn" : "muted"}
                onClick={() => open("binary_sensor.dsc_humidifier_ineffective_suspect", "Humidifier ineffective", undefined)}
              />
              <StatusChip
                label={state("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "Heat ineffective" : "Heat ok"}
                tone={state("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "warn" : "muted"}
                onClick={() => open("binary_sensor.dsc_heater_ineffective_suspect", "Heater ineffective", undefined)}
              />
              <StatusChip
                label={`Bought ${Number.isFinite(boughtH) ? boughtH.toFixed(1) : "—"}h today`}
                tone="muted"
                onClick={() => open("sensor.dsc_bought_runtime_today", "Bought runtime today", "h")}
              />
              <StatusChip
                label={`Dump ${Number.isFinite(dumpBtu) ? Math.round(dumpBtu) : "—"} BTU/h`}
                tone="muted"
                onClick={() => open("sensor.dsc_vent_heat_dump_btu", "Vent heat dump", "BTU/h")}
              />
              <StatusChip
                label={`Heater today ${fmtDurationMs(num("sensor.dsc_heater_runtime_today") * 3600000)}`}
                tone="muted"
                onClick={() => open("sensor.dsc_heater_runtime_today", "Heater runtime today", "h")}
              />
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <CropScheduler compact />
        </div>
      </div>
    </div>
  );
}
