import { Fragment, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  EntityFanSlider,
  EntitySelect,
  EntityToggle,
  type EntityToggleConfirm,
  Kpi,
  StatusChip,
  StatusTag,
} from "../components/ui";
import { Icon } from "../components/ui";
import { Panel } from "../components/Panel";
import { VpdHero } from "../components/VpdHero";
import { ZoneVpdChart } from "../components/ZoneVpdChart";
import { SetpointsByPhase } from "../components/SetpointsByPhase";
import { EquipmentTiles } from "../components/EquipmentTiles";
import { useRecentGrowLog } from "../components/GrowLogCompact";
import { useZones } from "../hooks/useZones";
import { paths } from "../lib/paths";
import { AirPathMap } from "../components/AirPathMap";
import { FlowSankey } from "../components/FlowSankey";
import { CropScheduler } from "../components/CropScheduler";
import { TentTargetPanel } from "../components/TentTargets";
import { resolveCfm } from "../lib/cfmProvenance";
import { inventoryInService } from "../lib/fleetModel";
import { absoluteHumidity } from "../lib/probeTrust";
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
import { useZoneFocus } from "../hooks/useZoneFocus";
import { useInspector } from "../components/InspectorHost";
import { HelpTip } from "../components/HelpTip";
import { MultiLineChart } from "../viz/charts";
import { fmtDurationMs } from "../lib/formatDuration";
import { SHARED_AIR_FAN_PCT, fanPctChip } from "../lib/fanPlant";
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


// Binding metadata + device-health keys (health lives on Settings -> Device) are not readings.
const ZIGBEE_ROW_META_KEYS = new Set([
  "friendly_name",
  "updated_at",
  "role",
  "zone",
  "ieee",
  "bound_stub",
  "kind",
  "last_topic",
  "last_seen",
  "battery",
  "linkquality",
  "voltage",
]);
const ZIGBEE_UNITS: Record<string, string> = {
  co2: "ppm",
  voc: "ppb",
  pm25: "µg/m³",
  illuminance_lux: "lx",
  illuminance: "lx",
  power: "W",
  energy: "kWh",
  temperature: "°C",
  humidity: "%",
};
function zigbeeKeyLabel(key: string): string {
  if (key === "co2") return "CO₂";
  if (key === "pm25") return "PM2.5";
  if (key === "illuminance_lux" || key === "illuminance") return "Lux";
  return key.replace(/_/g, " ");
}
function zigbeeReadingText(key: string, value: number | boolean | string): string {
  if (typeof value === "boolean") {
    // Z2M semantics: contact=true is closed, occupancy=true is presence, state=true is on.
    if (key === "contact") return value ? "Closed" : "Open";
    if (key === "occupancy") return value ? "Occupied" : "Clear";
    if (key === "state") return value ? "On" : "Off";
    return `${zigbeeKeyLabel(key)} ${value ? "on" : "off"}`;
  }
  if (typeof value === "number") {
    const digits = Number.isInteger(value) ? 0 : 1;
    const unit = ZIGBEE_UNITS[key];
    return `${zigbeeKeyLabel(key)} ${value.toFixed(digits)}${unit ? ` ${unit}` : ""}`;
  }
  return `${zigbeeKeyLabel(key)} ${value}`;
}

export function LiveClimatePage() {
  const { num, state, entity, available } = useEntityBus();
  const fleet = useFleet();
  const hubVitals = useHubVitals();
  const navigate = useNavigate();
  const inspector = useInspector();
  const { focus } = useZoneFocus();
  const { hours, maxPoints } = useChartHours(6);
  const zones = useZones();
  const log = useRecentGrowLog(168, 200);
  const heroZone = focus === "clone" ? zones.clone : focus === "room" ? zones.room : zones.main;
  const otherZones = [zones.main, zones.clone, zones.room].filter((z) => z.id !== heroZone.id);
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
  const roomTHeld = useHeldReading("sensor.dsc_hub_room_temperature");
  const roomRhHeld = useHeldReading("sensor.dsc_hub_room_humidity");
  const roomVpdId = resolveRoomVpdId(entity);
  const roomVpdHeld = useHeldReading(roomVpdId);


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

  // The four readings above are the *allocated* pair: intake_*_allocated is Sigma-exhaust-capacity
  // split by intake fan pct, exhaust_*_allocated is Sigma-intake-capacity split by exhaust fan pct.
  // Each is derived from the other, so they can never disagree and cannot answer "is this rig
  // over-pressure?". Capacity vs capacity can, and that is what these three chips report.
  const intakeCapacity = num("sensor.dsc_cfm_intake_capacity_total");
  const exhaustCapacity = num("sensor.dsc_cfm_exhaust_capacity_total");
  const netPressure = num("sensor.dsc_flow_net_pressure_cfm");

  const roomAh = absoluteHumidity(roomTHeld.value, roomRhHeld.value);
  const tentAh = absoluteHumidity(tentTHeld.value, tentRhHeld.value);
  const cloneAh = absoluteHumidity(cloneTHeld.value, cloneRhHeld.value);

  const open = (id: string, label: string, unit?: string) => inspector.open({ entityId: id, label, unit });

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
  // Lung transfer, not an outdoor dump — there is no outdoor probe, so tent->outdoors BTU/h
  // is not computable and is not shown. This is 4x8 -> room off measured temps.
  const transferBtu = num("sensor.dsc_vent_heat_transfer_btu");

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
      .filter(([role, row]) => {
        const kind = String(row.kind ?? "");
        return kind ? kind === "climate" : !isZigbeeSafetyLeakRole(role);
      })
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

  // Non-climate, non-leak roles (CO₂, lux, contact, power, button, plugs). The brain
  // exposes each datapoint as sensor./binary_sensor.dsc_zigbee_<role>_<key>; this
  // table is the same data, held/greyed through the shared timestamp gate.
  const zigbeeOtherRows = useMemo(() => {
    if (!zigbeeByRole) return [];
    return Object.entries(zigbeeByRole)
      .filter(([role, row]) => {
        const kind = String(row.kind ?? "");
        if (!kind) return false;
        return kind !== "climate" && !isZigbeeSafetyLeakRole(role);
      })
      .map(([role, row]) => {
        const updatedAt = row.updated_at as number | string | null | undefined;
        const stale = timestampedReading(0, updatedAt, ZIGBEE_ROLE_STALE_MS).stale;
        const readings = Object.entries(row)
          .filter(
            ([k, v]) =>
              !ZIGBEE_ROW_META_KEYS.has(k) &&
              v != null &&
              (typeof v === "number" || typeof v === "boolean" || typeof v === "string"),
          )
          .map(([k, v]) => ({ key: k, text: zigbeeReadingText(k, v as number | boolean | string) }));
        return {
          role,
          kind: String(row.kind),
          zone: String(row.zone ?? "—"),
          name: String(row.friendly_name ?? role),
          boundStub: Boolean(row.bound_stub),
          stale,
          readings,
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

  return (
    <div className="dsc-page">
      <header className="dsc-ov-head">
        <div>
          <div className="dsc-eyebrow">Live · Climate</div>
          <h1 className="dsc-headline">The room is the umbrella lung.</h1>
          <p className="dsc-subline">T, RH and VPD only together. The 2×4 and 4×8 are grow rooms inside it.</p>
        </div>
        <div className="dsc-tagrow dsc-ov-tags">
          <StatusTag
            label={
              hubVitals.online
                ? `HUB ${hubVitals.temp_c != null ? `${hubVitals.temp_c.toFixed(1)} °C` : "LIVE"}`
                : "HUB OFFLINE"
            }
            tone={hubVitals.online ? "ok" : "bad"}
            live={!hubVitals.online}
            onClick={() => navigate(paths.kit())}
          />
          <StatusTag label={fullAuto ? "FULL AUTO" : "FULL AUTO OFF"} tone={fullAuto ? "ok" : "warn"} title="Brain owns fans and demand while Full Auto is on" />
          {manualTakeover ? <StatusTag icon="manual-hand" label="MANUAL TAKEOVER" tone="bad" live /> : null}
          {fanOverride ? <StatusTag label="FAN OVERRIDE" tone="warn" /> : null}
          {reducedKit ? <StatusTag label="CAPACITY OFFLINE" tone="warn" /> : null}
          <StatusTag label={`${heroZone.label} ${focus === "compare" ? "· COMPARE" : ""}`.trim()} tone="teal" title="Zone in focus — change it on the zone strip" />
        </div>
      </header>

      {manualTakeover ? (
        <div className="dsc-mission dsc-mission--bad" role="alert">
          <span className="dsc-mission-dot" aria-hidden="true" />
          <span className="dsc-mission-title">Manual takeover</span>
          <span className="dsc-mission-detail">— you own every fan and appliance; the brain re-plans on clear or hub reconnect.</span>
        </div>
      ) : null}

      <div className="dsc-climate-grid">
        <div className="dsc-climate-col">
          <Panel legendIcon="vpd-gauge" legend={`${heroZone.label} · VPD · MASTER`} tone={heroZone.vpd.tone === "critical" ? "bad" : heroZone.vpd.tone === "warn" || heroZone.vpd.tone === "stale" ? "warn" : heroZone.vpd.tone === "ok" ? "ok" : "muted"} live={heroZone.vpd.tone === "critical"}>
            <VpdHero zone={heroZone} onOpen={open} />
          </Panel>
          <Panel legendIcon="growth-stage-timeline" legend="SETPOINTS BY PHASE">
            <SetpointsByPhase zone={heroZone} />
          </Panel>
        </div>
        <div className="dsc-climate-col">
          <Panel legendIcon="trend-chart" legend={`${heroZone.label} · VPD · WITH HISTORY`} legendRight={focus === "compare" ? <><Icon name="compare" size={11} /> OTHER ZONES GHOSTED</> : undefined}>
            <ZoneVpdChart zone={heroZone} others={otherZones} events={log.events} compare={focus === "compare"} />
          </Panel>
          <Panel legendIcon="fan-speed-controller" legend="EQUIPMENT · PULLING TOWARD SETPOINT">
            <EquipmentTiles
              zone={heroZone}
              onOpen={(entityId, label, kind, unit) => inspector.open({ entityId, label, kind, unit })}
            />
          </Panel>
        </div>
      </div>

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
          <Card className="dsc-glass" title="Air path" icon="climate">
            <AirPathMap
              intakeClone={inCloneReading}
              intakeMain={inMainReading}
              cascade={cascadeReading}
              outCfm={outReading}
              recircCfm={recReading}
            />
            <div className="dsc-chip-row" style={{ marginTop: 8 }}>
              <StatusChip
                label={`Intake capacity ${Number.isFinite(intakeCapacity) ? Math.round(intakeCapacity) : "—"} cfm`}
                tone="muted"
                onClick={() => open("sensor.dsc_cfm_intake_capacity_total", "Intake capacity", "CFM")}
              />
              <StatusChip
                label={`Exhaust capacity ${Number.isFinite(exhaustCapacity) ? Math.round(exhaustCapacity) : "—"} cfm`}
                tone="muted"
                onClick={() => open("sensor.dsc_cfm_exhaust_capacity_total", "Exhaust capacity", "CFM")}
              />
              <StatusChip
                label={
                  Number.isFinite(netPressure)
                    ? netPressure > 5
                      ? `Positive pressure +${Math.round(netPressure)} cfm`
                      : netPressure < -5
                        ? `Negative pressure ${Math.round(netPressure)} cfm`
                        : "Pressure balanced"
                    : "Pressure — no reading"
                }
                tone={Number.isFinite(netPressure) && Math.abs(netPressure) > 5 ? "warn" : "ok"}
                onClick={() => open("sensor.dsc_flow_net_pressure_cfm", "Net pressure", "CFM")}
              />
            </div>
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
        zigbeeSafetyRows.length ||
        zigbeeOtherRows.length ? (
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
              ) : zigbeeSafetyRows.length || zigbeeOtherRows.length ? null : (
                <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
                  No climate roles bound yet — permit join, then set Role + Zone and Save.
                </p>
              )}
              {zigbeeOtherRows.length ? (
                <>
                  <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)", marginTop: 12, marginBottom: 8 }}>
                    Other sensors — every datapoint the device reports. Automations can trigger on each one as{" "}
                    <code>sensor.dsc_zigbee_&lt;role&gt;_&lt;key&gt;</code>.
                  </p>
                  <SettingsTable
                    columns={[
                      { key: "role", label: "Role" },
                      { key: "zone", label: "Zone" },
                      { key: "device", label: "Device" },
                      { key: "readings", label: "Readings" },
                    ]}
                  >
                    {zigbeeOtherRows.map((row) => (
                      <SettingsRow key={row.role} tone={row.stale ? "muted" : undefined}>
                        <td>{row.role}</td>
                        <td>{row.zone}</td>
                        <td>{row.name}</td>
                        <td>
                          {row.readings.length ? (
                            <div className="dsc-chip-row" style={{ flexWrap: "wrap" }}>
                              {row.readings.map((r) => (
                                <StatusChip
                                  key={r.key}
                                  label={row.stale ? `${r.text} ⏸` : r.text}
                                  tone={row.stale ? "muted" : "ok"}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="dsc-muted">
                              {row.boundStub ? "bound — no report yet" : "no datapoints reported"}
                            </span>
                          )}
                        </td>
                      </SettingsRow>
                    ))}
                  </SettingsTable>
                </>
              ) : null}
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
                label={`Bought ${Number.isFinite(boughtH) ? boughtH.toFixed(1) : "—"} appliance-h today`}
                tone="muted"
                onClick={() => open("sensor.dsc_bought_runtime_today", "Bought runtime today", "h")}
              />
              <StatusChip
                label={
                  Number.isFinite(transferBtu)
                    ? `Lung transfer ${Math.round(transferBtu)} BTU/h`
                    : "Lung transfer — no reading"
                }
                tone="muted"
                onClick={() => open("sensor.dsc_vent_heat_transfer_btu", "Lung heat transfer", "BTU/h")}
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
