import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  EntityFanSlider,
  EntitySelect,
  EntityToggle,
  Kpi,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { OverflowMenu } from "../components/chrome";
import { TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "../components/HistoryDrawer";
import { AirPathMap } from "../components/AirPathMap";
import { CropScheduler } from "../components/CropScheduler";
import { TentTargetPanel } from "../components/TentTargets";
import { resolveCfm } from "../lib/cfmProvenance";
import { absoluteHumidity } from "../lib/potTrust";
import { useHass } from "../hooks/useHass";
import { useFleet, useHubVitals, useFleetSource, useFleetTick } from "../hooks/useFleet";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { useChartHours } from "../hooks/useChartHours";
import { useZoneFocus, type ZoneFocus } from "../hooks/useZoneFocus";
import { useInspector } from "../components/InspectorHost";
import { ArcGauge, GotWantBars, MultiLineChart, seriesExtrema, type NamedSeries } from "../viz/charts";
import { fmtDurationMs } from "../lib/formatDuration";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

function resolveRoomVpdId(entity: (id: string) => unknown): string {
  if (entity("sensor.dsc_hub_room_vpd_kpa")) return "sensor.dsc_hub_room_vpd_kpa";
  if (entity("sensor.dsc_hub_room_vpd")) return "sensor.dsc_hub_room_vpd";
  return "sensor.dsc_hub_room_vpd_kpa";
}

function withPriorGhost(
  id: string,
  label: string,
  current: { series: { t: number; v: number }[]; ghost: { t: number; v: number }[] },
  color: string,
  unit: string,
  extra?: Partial<NamedSeries>,
): NamedSeries[] {
  const live: NamedSeries = { id, label, series: current.series, color, unit, ...extra };
  if (current.ghost.length <= 1) return [live];
  return [
    live,
    { id: `${id}-ghost`, label: `${label} prior`, series: current.ghost, color, unit, ghost: true },
  ];
}

const FOCUS_OPTIONS: { id: ZoneFocus; label: string }[] = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" },
];

export function LiveClimatePage() {
  const { num, state, entity, available } = useHass();
  const fleet = useFleet();
  const hubVitals = useHubVitals();
  void fleet;
  const navigate = useNavigate();
  const inspector = useInspector();
  const { focus, setFocus } = useZoneFocus();
  const { hours, setHours, maxPoints } = useChartHours(6);
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const fullAuto = state("switch.dsc_hub_tent_full_auto_mode") === "on";
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");
  const reducedKit = state("binary_sensor.dsc_reduced_kit") === "on";

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

  const tentT = useEntitySeries("sensor.dsc_hub_tent_temperature", { hours, maxPoints, withGhost: true });
  const tentRh = useEntitySeries("sensor.dsc_hub_tent_humidity", { hours, maxPoints, withGhost: true });
  const tentVpd = useEntitySeries("sensor.dsc_hub_vpd_kpa", { hours, maxPoints, withGhost: true });
  const cloneT = useEntitySeries("sensor.dsc_hub_clone_temperature", { hours, maxPoints, withGhost: true });
  const cloneRh = useEntitySeries("sensor.dsc_hub_clone_humidity", { hours, maxPoints, withGhost: true });
  const cloneVpd = useEntitySeries("sensor.dsc_hub_clone_vpd_kpa", { hours, maxPoints, withGhost: true });
  const roomT = useEntitySeries("sensor.dsc_hub_room_temperature", { hours, maxPoints, withGhost: true });
  const roomRh = useEntitySeries("sensor.dsc_hub_room_humidity", { hours, maxPoints, withGhost: true });
  const roomVpd = useEntitySeries(roomVpdId, { hours, maxPoints, withGhost: true });
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
  const boughtH = num("sensor.dsc_bought_runtime_today");
  const dumpBtu = num("sensor.dsc_vent_heat_dump_btu");

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
        <TimespanControl hours={hours} setHours={setHours} extras={CYCLE_TIMESPAN_EXTRAS} />
        <Button teal onClick={() => navigate("/fleet")}>
          Kit / Fleet
        </Button>
      </div>

      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Command" icon="climate">
            <div className="dsc-mode-row">
              <EntityToggle entityId="switch.dsc_hub_tent_full_auto_mode" label="Full Auto" icon="ok" />
              <EntityToggle entityId="switch.dsc_hub_manual_takeover" label="Master takeover" icon="alert" />
              <EntityToggle entityId="switch.dsc_hub_tent_manual_override" label="Fan override" icon="climate" />
              <EntityToggle entityId="switch.dsc_hub_humidifier_intake_routing" label="Hum intake routing" icon="climate" />
              <EntityToggle entityId="switch.dsc_hub_recirc_de_strat_pulse" label="RECIRC de-strat" icon="climate" />
            </div>
            <div className="dsc-mode-selects">
              <EntitySelect entityId="select.dsc_hub_control_strategy" label="Strategy" icon="climate" />
              <EntitySelect entityId="select.dsc_hub_priority_tent" label="Priority tent" icon="tent" />
            </div>
            <div className="dsc-demand-row" style={{ marginTop: 12 }}>
              <EntityToggle entityId="switch.dsc_hub_heater_demand" label="Heat" icon="climate" />
              <EntityToggle
                entityId="switch.dsc_hub_ac_demand"
                label="Cool"
                icon="climate"
                warnWhenMissing={
                  state("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : undefined
                }
              />
              <EntityToggle entityId="switch.dsc_hub_humidifier_demand" label="Hum" icon="climate" />
              <EntityToggle entityId="switch.dsc_hub_dehumidifier_demand" label="Dehum" icon="climate" />
              <EntityToggle entityId="switch.dsc_hub_grow_mat_demand" label="Mat" icon="root" />
              <EntityToggle entityId="switch.dsc_hub_clone_humidifier_demand" label="Mister" icon="clone" />
            </div>
            {fullAuto ? (
              <p className="dsc-honesty">
                <StatusChip
                  icon={reducedKit ? "alert" : "ok"}
                  label={reducedKit ? "Unexpected OOS" : "Full Auto"}
                  tone={reducedKit ? "warn" : "ok"}
                  onClick={() =>
                    inspector.open({
                      entityId: reducedKit ? "binary_sensor.dsc_reduced_kit" : "switch.dsc_hub_tent_full_auto_mode",
                      label: reducedKit ? "Unexpected OOS" : "Full Auto",
                      kind: reducedKit ? "alert" : "binary",
                    })
                  }
                />{" "}
                {honesty || "Hub owns fans + appliance Autos when Full Auto is on."}
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
            <p className="dsc-muted" style={{ marginTop: 8, fontSize: 12 }}>
              ΔT room↔4×8 {fmt(dTRoomMain)}°C · ΔAH {fmt(dAhRoomMain)} g/m³ · ΔVPD {fmt(dVpdRoomMain, 2)} · ΔT/ΔAH 2×4↔4×8{" "}
              {fmt(dTCloneMain)}°C / {fmt(dAhCloneMain)} · ΔAH room↔2×4 {fmt(dAhRoomClone)} g/m³. Early warn is the lung poisoning a tent before Want miss.
            </p>
          </Card>
        </div>

        <div className="dsc-col-12">
          <TentTargetPanel hero />
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
                <ArcGauge label="T" value={cloneTHeld.value} min={15} max={35} unit="°C" target={cloneTargetTemp} extrema={cloneTempExt} stale={cloneTHeld.stale} onClick={() => open("sensor.dsc_hub_clone_temperature", "2×4 T", "°C")} />
                <ArcGauge label="RH" value={cloneRhHeld.value} min={0} max={100} unit="%" band={{ min: cloneRhMin, max: cloneRhMax }} extrema={cloneRhExt} stale={cloneRhHeld.stale} onClick={() => open("sensor.dsc_hub_clone_humidity", "2×4 RH", "%")} />
                <ArcGauge label="VPD" value={cloneVpdHeld.value} min={0} max={2.5} unit="kPa" band={{ min: cloneVpdMin, max: cloneVpdMax }} extrema={cloneVpdExt} stale={cloneVpdHeld.stale} onClick={() => open("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa")} />
              </div>
              <div className={rowLit("main")}>
                <span className="dsc-gauge-row-tag">4×8</span>
                <ArcGauge label="T" value={tentTHeld.value} min={15} max={35} unit="°C" target={targetTemp} extrema={tentTempExt} stale={tentTHeld.stale} onClick={() => open("sensor.dsc_hub_tent_temperature", "4×8 T", "°C")} />
                <ArcGauge label="RH" value={tentRhHeld.value} min={0} max={100} unit="%" band={{ min: rhMin, max: rhMax }} extrema={tentRhExt} stale={tentRhHeld.stale} onClick={() => open("sensor.dsc_hub_tent_humidity", "4×8 RH", "%")} />
                <ArcGauge label="VPD" value={tentVpdHeld.value} min={0} max={2.5} unit="kPa" band={{ min: vpdMin, max: vpdMax }} extrema={tentVpdExt} stale={tentVpdHeld.stale} onClick={() => open("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa")} />
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
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Temperature" icon="climate">
            <MultiLineChart
              unit="°C"
              lastSyncAt={Math.max(roomT.lastSyncAt ?? 0, cloneT.lastSyncAt ?? 0, tentT.lastSyncAt ?? 0) || undefined}
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
              lastSyncAt={Math.max(roomVpd.lastSyncAt ?? 0, cloneVpd.lastSyncAt ?? 0, tentVpd.lastSyncAt ?? 0) || undefined}
              series={[
                ...withPriorGhost("rv", "Room", roomVpd, "var(--dsc-gray-5)", "kPa"),
                ...withPriorGhost("cv", "2×4", cloneVpd, "var(--dsc-teal)", "kPa", { band: { min: cloneVpdMin, max: cloneVpdMax } }),
                ...withPriorGhost("mv", "4×8", tentVpd, "var(--dsc-blue)", "kPa", { band: { min: vpdMin, max: vpdMax } }),
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Air path" icon="climate">
            <AirPathMap
              intakeClone={inCloneReading}
              intakeMain={inMainReading}
              outCfm={outReading}
              recircCfm={recReading}
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Fan duty %" icon="climate">
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
          <Card className="dsc-glass" title="Efficacy · buying kW because the lung could not transfer" icon="alert">
            <div className="dsc-chip-row">
              <StatusChip label={`Heat ${state("switch.dsc_hub_heater_demand") === "on" ? "ON" : "off"}`} tone={state("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted"} onClick={() => open("switch.dsc_hub_heater_demand", "Heater", undefined)} />
              <StatusChip label={`Cool ${state("switch.dsc_hub_ac_demand") === "on" ? "ON" : "off"}`} tone={state("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted"} onClick={() => open("switch.dsc_hub_ac_demand", "Cool", undefined)} />
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
