import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  EntityFanSlider,
  EntitySelect,
  EntityTime,
  EntityToggle,
  Kpi,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { OverflowMenu, SlideDrawer } from "../components/chrome";
import { HistoryDrawer, TimespanControl, CYCLE_TIMESPAN_EXTRAS } from "../components/HistoryDrawer";
import { LungLoop } from "../components/LungLoop";
import { CfmProvenanceBadge } from "../components/CfmBadge";
import { resolveCfm } from "../lib/cfmProvenance";
import { absoluteHumidity, readPotTrust } from "../lib/potTrust";
import { DecisionLayer } from "../components/DecisionLayer";
import { VesselGlyph } from "../components/VesselGlyph";
import { readPotVessel } from "../lib/vesselSpec";
import { TargetNumber, TentTargetPanel } from "../components/TentTargets";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useHeldReading } from "../hooks/useHeldReading";
import { useChartHours } from "../hooks/useChartHours";
import { useZoneFocus, type ZoneFocus } from "../hooks/useZoneFocus";
import { ArcGauge, MultiLineChart, Sparkline, seriesExtrema } from "../viz/charts";
import {
  ALL_POT_NUMBERS,
  buildPlantSeat,
  potsInTent,
  activePotNumbers,
  inServiceCount,
  isPotInService,
  potGotEntity,
  tentLabel,
  type TentId,
} from "../lib/seatModel";
import { PlantSeatPanel } from "./GrowPages";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

const FOCUS_OPTIONS: { id: ZoneFocus; label: string }[] = [
  { id: "main", label: "Main" },
  { id: "clone", label: "Clone" },
  { id: "room", label: "Room" },
  { id: "compare", label: "Compare" },
];

export function LiveTwinPage() {
  const navigate = useNavigate();
  return (
    <div className="dsc-page dsc-page--twin-chrome">
      <PageHeader
        icon="twin"
        title="Twin"
        subtitle="Cinematic digital twin — pick a pot to open Root seat."
        primaryAction={
          <Button teal onClick={() => navigate("/live/climate")}>
            Set Climate Want
          </Button>
        }
        actions={
          <>
            <Button onClick={() => navigate("/live/main")}>Main cockpit</Button>
            <Button onClick={() => navigate("/live/clone")}>Clone cockpit</Button>
          </>
        }
      />
      <p className="dsc-honesty dsc-muted" style={{ marginTop: 0 }}>
        Pick a pot in the twin to open its seat. Twin stays warm across Twin / Main / Clone.
        4×8 fixture glow follows photoperiod window until a main lamp is wired.
      </p>
    </div>
  );
}

export function LiveClimatePage() {
  const { num, state, entity, available } = useHass();
  const navigate = useNavigate();
  const { focus, setFocus } = useZoneFocus();
  const { hours, setHours, maxPoints } = useChartHours(6);
  const [hist, setHist] = useState<{ id: string; label: string; unit: string } | null>(null);
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const fullAuto = state("switch.dsc_hub_tent_full_auto_mode") === "on";
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");

  const tentTHeld = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRhHeld = useHeldReading("sensor.dsc_hub_tent_humidity");
  const cloneTHeld = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRhHeld = useHeldReading("sensor.dsc_hub_clone_humidity");
  const vpdHeld = useHeldReading("sensor.dsc_hub_vpd_kpa");

  const tentT = useEntitySeries("sensor.dsc_hub_tent_temperature", { hours, maxPoints });
  const tentRh = useEntitySeries("sensor.dsc_hub_tent_humidity", { hours, maxPoints });
  const cloneT = useEntitySeries("sensor.dsc_hub_clone_temperature", { hours, maxPoints });
  const cloneRh = useEntitySeries("sensor.dsc_hub_clone_humidity", { hours, maxPoints });

  const outAllocId = available("sensor.dsc_cfm_exhaust_out_allocated")
    ? "sensor.dsc_cfm_exhaust_out_allocated"
    : "sensor.dsc_cfm_exhaust_out";
  const recircAllocId = available("sensor.dsc_cfm_exhaust_recirc_allocated")
    ? "sensor.dsc_cfm_exhaust_recirc_allocated"
    : "sensor.dsc_cfm_exhaust_recirc";
  const outCfm = useEntitySeries(outAllocId, { hours, maxPoints });
  const recircCfm = useEntitySeries(recircAllocId, { hours, maxPoints });
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
  const outNameplate = outReading.nameplate ?? num("sensor.dsc_cfm_exhaust_out");
  const outAlloc = outReading.value;
  const recircNameplate = recReading.nameplate ?? num("sensor.dsc_cfm_exhaust_recirc");
  const recircAlloc = recReading.value;
  const roomAh = absoluteHumidity(num("sensor.dsc_hub_room_temperature"), num("sensor.dsc_hub_room_humidity"));
  const showRoom = focus === "room" || focus === "compare";

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

  const tentTempExt = useMemo(() => seriesExtrema(tentT.series), [tentT.series]);
  const tentRhExt = useMemo(() => seriesExtrema(tentRh.series), [tentRh.series]);

  const showMain = focus === "main" || focus === "compare";
  const showClone = focus === "clone" || focus === "compare";

  return (
    <div className="dsc-page">
      <PageHeader
        icon="climate"
        title="Climate"
        subtitle="Command, Want targets, zone traces, VPD, airflow honesty."
        actions={
          <OverflowMenu
            label="Climate settings"
            items={[
              { id: "mission", label: "Mission", onSelect: () => navigate("/live/mission") },
              { id: "main", label: "Main cockpit", onSelect: () => navigate("/live/main") },
              { id: "clone", label: "Clone cockpit", onSelect: () => navigate("/live/clone") },
              { id: "fleet", label: "Fleet kit", onSelect: () => navigate("/fleet") },
            ]}
          />
        }
      />

      <div className="dsc-chip-row" style={{ marginBottom: 14 }} role="group" aria-label="Tent focus">
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
              <EntityToggle
                entityId="switch.dsc_hub_humidifier_intake_routing"
                label="Hum intake routing"
                icon="climate"
              />
              <EntityToggle
                entityId="switch.dsc_hub_recirc_de_strat_pulse"
                label="RECIRC de-strat"
                icon="climate"
              />
            </div>
            <div className="dsc-mode-selects">
              <EntitySelect entityId="select.dsc_hub_control_strategy" label="Strategy" icon="climate" />
              <EntitySelect entityId="select.dsc_hub_priority_tent" label="Priority tent" icon="tent" />
            </div>
            {fullAuto ? (
              <p className="dsc-honesty">
                <StatusChip
                  icon="alert"
                  label={state("binary_sensor.dsc_reduced_kit") === "on" ? "Reduced kit" : "Full Auto"}
                  tone={state("binary_sensor.dsc_reduced_kit") === "on" ? "warn" : "ok"}
                />{" "}
                {honesty || "Hub owns fans + appliance Autos when Full Auto is on."}
              </p>
            ) : null}
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Targets" icon="gauge">
            <TentTargetPanel emphasize={focus === "clone" ? "clone" : "main"} />
          </Card>
        </div>

        {showMain ? (
          <>
            <div className="dsc-col-3">
              <Kpi
                label="Tent °C"
                value={fmt(tentTHeld.value)}
                unit="°C"
                stale={tentTHeld.stale}
                onClick={() =>
                  setHist({ id: "sensor.dsc_hub_tent_temperature", label: "Tent T", unit: "°C" })
                }
              />
            </div>
            <div className="dsc-col-3">
              <Kpi
                label="Tent RH"
                value={fmt(tentRhHeld.value, 0)}
                unit="%"
                stale={tentRhHeld.stale}
                onClick={() =>
                  setHist({ id: "sensor.dsc_hub_tent_humidity", label: "Tent RH", unit: "%" })
                }
              />
            </div>
            <div className="dsc-col-3">
              <Kpi
                label="VPD"
                value={fmt(vpdHeld.value, 2)}
                unit="kPa"
                stale={vpdHeld.stale}
                onClick={() =>
                  setHist({ id: "sensor.dsc_hub_vpd_kpa", label: "VPD", unit: "kPa" })
                }
              />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Room °C" value={fmt(num("sensor.dsc_hub_room_temperature"))} unit="°C" />
            </div>
          </>
        ) : null}

        {showClone ? (
          <>
            <div className="dsc-col-3">
              <Kpi
                label="Clone °C"
                value={fmt(cloneTHeld.value)}
                unit="°C"
                stale={cloneTHeld.stale}
              />
            </div>
            <div className="dsc-col-3">
              <Kpi
                label="Clone RH"
                value={fmt(cloneRhHeld.value, 0)}
                unit="%"
                stale={cloneRhHeld.stale}
              />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Clone VPD" value={fmt(num("sensor.dsc_hub_clone_vpd_kpa"), 2)} unit="kPa" />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Room °C" value={fmt(num("sensor.dsc_hub_room_temperature"))} unit="°C" />
            </div>
          </>
        ) : null}

        {showRoom ? (
          <>
            <div className="dsc-col-3">
              <Kpi label="Room °C" value={fmt(num("sensor.dsc_hub_room_temperature"))} unit="°C" />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Room RH" value={fmt(num("sensor.dsc_hub_room_humidity"), 0)} unit="%" />
            </div>
            <div className="dsc-col-3">
              <Kpi
                label="Room AH"
                value={Number.isFinite(roomAh) ? roomAh.toFixed(1) : "—"}
                unit="g/m³"
                sub={!Number.isFinite(roomAh) ? "Need T+RH" : undefined}
              />
            </div>
          </>
        ) : null}

        {focus === "compare" ? (
          <div className="dsc-col-12">
            <Card className="dsc-glass" title="Compare T + RH" icon="tent">
              <p className="dsc-honesty" style={{ marginTop: 0 }}>
                One chart: 4×8 solid, 2×4 ghost. Not two dashboards.
              </p>
              <MultiLineChart
                lastSyncAt={
                  Math.max(
                    tentT.lastSyncAt ?? 0,
                    tentRh.lastSyncAt ?? 0,
                    cloneT.lastSyncAt ?? 0,
                    cloneRh.lastSyncAt ?? 0,
                  ) || undefined
                }
                series={[
                  {
                    id: "t",
                    label: "4×8 T",
                    series: tentT.series,
                    color: "var(--dsc-blue)",
                    axis: "left",
                    unit: "°C",
                  },
                  {
                    id: "rh",
                    label: "4×8 RH",
                    series: tentRh.series,
                    color: "var(--dsc-teal)",
                    axis: "right",
                    unit: "%",
                  },
                  {
                    id: "t-ghost",
                    label: "2×4 T",
                    series: cloneT.series,
                    color: "var(--dsc-blue)",
                    axis: "left",
                    unit: "°C",
                    ghost: true,
                  },
                  {
                    id: "rh-ghost",
                    label: "2×4 RH",
                    series: cloneRh.series,
                    color: "var(--dsc-teal)",
                    axis: "right",
                    unit: "%",
                    ghost: true,
                  },
                ]}
                targets={[
                  { axis: "left", value: targetTemp, color: "var(--dsc-amber)", label: "Want T" },
                  { axis: "right", min: rhMin, max: rhMax, color: "var(--dsc-teal)" },
                ]}
              />
            </Card>
          </div>
        ) : null}

        {showMain && focus !== "compare" ? (
          <div className={showClone ? "dsc-col-6" : "dsc-col-12"}>
            <Card className="dsc-glass" title="Main tent T + RH" icon="tent">
              <MultiLineChart
                lastSyncAt={Math.max(tentT.lastSyncAt ?? 0, tentRh.lastSyncAt ?? 0) || undefined}
                series={[
                  {
                    id: "t",
                    label: "Temp °C",
                    series: tentT.series,
                    color: "var(--dsc-blue)",
                    axis: "left",
                    unit: "°C",
                  },
                  {
                    id: "rh",
                    label: "RH %",
                    series: tentRh.series,
                    color: "var(--dsc-teal)",
                    axis: "right",
                    unit: "%",
                  },
                ]}
                targets={[
                  { axis: "left", value: targetTemp, color: "var(--dsc-amber)", label: "Want T" },
                  { axis: "right", min: rhMin, max: rhMax, color: "var(--dsc-teal)" },
                ]}
              />
            </Card>
          </div>
        ) : null}

        {showClone && focus !== "compare" ? (
          <div className={showMain ? "dsc-col-6" : "dsc-col-12"}>
            <Card className="dsc-glass" title="Clone tent T + RH" icon="clone">
              <MultiLineChart
                lastSyncAt={Math.max(cloneT.lastSyncAt ?? 0, cloneRh.lastSyncAt ?? 0) || undefined}
                series={[
                  {
                    id: "t",
                    label: "Temp °C",
                    series: cloneT.series,
                    color: "var(--dsc-blue)",
                    axis: "left",
                    unit: "°C",
                  },
                  {
                    id: "rh",
                    label: "RH %",
                    series: cloneRh.series,
                    color: "var(--dsc-teal)",
                    axis: "right",
                    unit: "%",
                  },
                ]}
                targets={[
                  {
                    axis: "left",
                    value: cloneTargetTemp,
                    color: "var(--dsc-amber)",
                    label: "Want T",
                  },
                  { axis: "right", min: cloneRhMin, max: cloneRhMax, color: "var(--dsc-teal)" },
                ]}
              />
            </Card>
          </div>
        ) : null}

        <div className="dsc-col-3">
          <Kpi
            label="CFM OUT"
            value={fmt(outAlloc, 0)}
            unit="cfm"
            sub={`Nameplate ${fmt(outNameplate, 0)}`}
          />
          <CfmProvenanceBadge reading={outReading} />
        </div>
        <div className="dsc-col-3">
          <Kpi
            label="CFM RECIRC"
            value={fmt(recircAlloc, 0)}
            unit="cfm"
            sub={`Alloc · nameplate ${fmt(recircNameplate, 0)}`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Intake main" value={fmt(num("sensor.dsc_cfm_intake_main"), 0)} unit="cfm" />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Intake 2×4" value={fmt(num("sensor.dsc_cfm_intake_2x4"), 0)} unit="cfm" />
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Airflow honesty" icon="climate">
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              <CfmProvenanceBadge reading={outReading} /> <CfmProvenanceBadge reading={recReading} />{" "}
              Lung loop is mass-balance, not a second isometric tent. 4×8 light = window proxy until GPIO lamp.
            </p>
            <LungLoop
              intakeClone={num("sensor.dsc_cfm_intake_2x4")}
              intakeMain={num("sensor.dsc_cfm_intake_main")}
              outCfm={outAlloc}
              recircCfm={recircAlloc}
              kind={outReading.kind}
            />
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Exhaust CFM (allocated)" icon="climate">
            <MultiLineChart
              unit="cfm"
              lastSyncAt={Math.max(outCfm.lastSyncAt ?? 0, recircCfm.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "out",
                  label: "OUT",
                  series: outCfm.series,
                  color: "var(--dsc-blue)",
                  unit: "cfm",
                },
                {
                  id: "recirc",
                  label: "RECIRC",
                  series: recircCfm.series,
                  color: "var(--dsc-purple)",
                  unit: "cfm",
                },
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Fan duty %" icon="climate">
            <MultiLineChart
              unit="%"
              lastSyncAt={Math.max(fanOut.lastSyncAt ?? 0, fanRecirc.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "fout",
                  label: "OUT %",
                  series: fanOut.series,
                  color: "var(--dsc-teal)",
                  unit: "%",
                },
                {
                  id: "frec",
                  label: "RECIRC %",
                  series: fanRecirc.series,
                  color: "var(--dsc-amber)",
                  unit: "%",
                },
              ]}
            />
            <div className="dsc-fan-stack" style={{ marginTop: 12 }}>
              <EntityFanSlider
                entityId="fan.dsc_hub_4_inch_intake_fan_main"
                label="Intake Main"
                disabled={!fanOverride}
              />
              <EntityFanSlider
                entityId="fan.dsc_hub_4_inch_intake_fan_2x4"
                label="Intake 2×4"
                disabled={!fanOverride}
              />
              <EntityFanSlider
                entityId="fan.dsc_hub_6_inch_exhaust_room"
                label="Exhaust room"
                disabled={!fanOverride}
              />
              <EntityFanSlider
                entityId="fan.dsc_hub_6_inch_exhaust_outside"
                label="Exhaust outside"
                disabled={!fanOverride}
              />
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Zone gauges" icon="gauge">
            <div className="dsc-gauge-row">
              {showMain ? (
                <>
                  <ArcGauge
                    label="Tent T"
                    value={tentTHeld.value}
                    min={15}
                    max={35}
                    unit="°C"
                    target={targetTemp}
                    extrema={tentTempExt}
                    stale={tentTHeld.stale}
                    onClick={() =>
                      setHist({
                        id: "sensor.dsc_hub_tent_temperature",
                        label: "Tent T",
                        unit: "°C",
                      })
                    }
                  />
                  <ArcGauge
                    label="Tent RH"
                    value={tentRhHeld.value}
                    min={0}
                    max={100}
                    unit="%"
                    band={{ min: rhMin, max: rhMax }}
                    extrema={tentRhExt}
                    stale={tentRhHeld.stale}
                  />
                  <ArcGauge
                    label="VPD"
                    value={vpdHeld.value}
                    min={0}
                    max={2.5}
                    unit="kPa"
                    band={{ min: vpdMin, max: vpdMax }}
                    stale={vpdHeld.stale}
                  />
                </>
              ) : null}
              {showClone ? (
                <>
                  <ArcGauge
                    label="Clone T"
                    value={cloneTHeld.value}
                    min={15}
                    max={35}
                    unit="°C"
                    target={cloneTargetTemp}
                    stale={cloneTHeld.stale}
                  />
                  <ArcGauge
                    label="Clone RH"
                    value={cloneRhHeld.value}
                    min={0}
                    max={100}
                    unit="%"
                    band={{ min: cloneRhMin, max: cloneRhMax }}
                    stale={cloneRhHeld.stale}
                  />
                  <ArcGauge
                    label="Clone VPD"
                    value={num("sensor.dsc_hub_clone_vpd_kpa")}
                    min={0}
                    max={2.5}
                    unit="kPa"
                    band={{ min: cloneVpdMin, max: cloneVpdMax }}
                  />
                </>
              ) : null}
            </div>
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Efficacy" icon="alert">
            <div className="dsc-chip-row">
              <StatusChip
                label={
                  state("binary_sensor.dsc_humidifier_ineffective_suspect") === "on"
                    ? "Hum ineffective"
                    : "Hum ok"
                }
                tone={state("binary_sensor.dsc_humidifier_ineffective_suspect") === "on" ? "warn" : "muted"}
              />
              <StatusChip
                label={
                  state("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "Heat ineffective" : "Heat ok"
                }
                tone={state("binary_sensor.dsc_heater_ineffective_suspect") === "on" ? "warn" : "muted"}
              />
              <StatusChip
                label={`Hum on ${fmt(num("sensor.dsc_humidifier_relay_on_time"), 0)}s`}
                tone="muted"
              />
              <StatusChip
                label={
                  state("binary_sensor.dsc_plant_specs_hum_rate_zero") === "on" ? "Hum rate 0" : "Hum rate"
                }
                tone={state("binary_sensor.dsc_plant_specs_hum_rate_zero") === "on" ? "warn" : "muted"}
              />
              <StatusChip
                label={
                  state("binary_sensor.dsc_plant_specs_dehum_rate_zero") === "on" ? "Dehum rate 0" : "Dehum rate"
                }
                tone={state("binary_sensor.dsc_plant_specs_dehum_rate_zero") === "on" ? "warn" : "muted"}
              />
            </div>
          </Card>
        </div>
      </div>

      <HistoryDrawer
        open={hist != null}
        onClose={() => setHist(null)}
        entityId={hist?.id ?? null}
        label={hist?.label ?? ""}
        unit={hist?.unit}
      />
    </div>
  );
}

function TentCockpitPage({ tent }: { tent: Exclude<TentId, "unassigned"> }) {
  const { state, entity, num, tick, callWS } = useHass();
  const navigate = useNavigate();
  const { setFocus } = useZoneFocus();
  const [params, setParams] = useSearchParams();
  const [log, setLog] = useState<string[]>([]);
  void tick;

  useEffect(() => {
    setFocus(tent);
  }, [tent, setFocus]);

  const seats = potsInTent(tent, state, entity);
  const raw = Number(params.get("pot") || 0);
  const pot =
    raw >= 1 && raw <= 4 && isPotInService(raw, state) && seats.some((s) => s.pot === raw)
      ? raw
      : null;

  const tId =
    tent === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature";
  const rhId = tent === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity";
  const vpdId = tent === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa";
  const tSeries = useEntitySeries(tId, { hours: 6 });
  const rhSeries = useEntitySeries(rhId, { hours: 6 });
  const tHeld = useHeldReading(tId);
  const rhHeld = useHeldReading(rhId);
  const vpdHeld = useHeldReading(vpdId);
  const windowOpen =
    state(
      tent === "main"
        ? "binary_sensor.dsc_hub_4x8_window_open"
        : "binary_sensor.dsc_hub_2x4_window_open",
    ) === "on";
  const cloneLampOn = state("light.dsc_hub_sf1000_dimmer") === "on";
  const lit = tent === "clone" ? cloneLampOn : windowOpen;
  const intakeCfm =
    tent === "main" ? num("sensor.dsc_cfm_intake_main") : num("sensor.dsc_cfm_intake_2x4");
  const outCfm =
    num("sensor.dsc_cfm_exhaust_out_allocated") || num("sensor.dsc_cfm_exhaust_out");
  const recircCfm =
    num("sensor.dsc_cfm_exhaust_recirc_allocated") || num("sensor.dsc_cfm_exhaust_recirc");
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";

  useEffect(() => {
    let cancelled = false;
    async function loadLog() {
      if (!callWS || seats.length === 0) {
        setLog([]);
        return;
      }
      const ids = seats.flatMap((s) => [
        `text.dsc_pot${s.pot}_plant_name`,
        `input_select.dsc_pot${s.pot}_tent`,
        `select.dsc_pot${s.pot}_growth_stage`,
      ]);
      const end = new Date();
      const start = new Date(end.getTime() - 48 * 3600 * 1000);
      try {
        const rawHist = await callWS<Record<string, { s?: string; state?: string; lu?: number; last_changed?: string }[]>>({
          type: "history/history_during_period",
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          significant_changes_only: true,
          minimal_response: true,
          no_attributes: true,
          entity_ids: ids.slice(0, 8),
        });
        if (cancelled || !rawHist) return;
        const lines: { t: number; text: string }[] = [];
        for (const [eid, rows] of Object.entries(rawHist)) {
          for (const row of rows || []) {
            const t =
              typeof row.lu === "number"
                ? row.lu * 1000
                : row.last_changed
                  ? Date.parse(row.last_changed)
                  : NaN;
            const v = String(row.s ?? row.state ?? "");
            if (!Number.isFinite(t) || !v || v === "unavailable") continue;
            lines.push({ t, text: `${new Date(t).toLocaleString()} · ${eid.split(".").pop()} → ${v}` });
          }
        }
        lines.sort((a, b) => b.t - a.t);
        setLog(lines.slice(0, 40).map((l) => l.text));
      } catch {
        if (!cancelled) setLog([]);
      }
    }
    void loadLog();
    return () => {
      cancelled = true;
    };
  }, [callWS, seats, tent]);

  const title = tent === "main" ? "Main 4×8" : "Clone 2×4";
  const pathNote =
    tent === "main"
      ? "Intake main + cascade in · OUT / RECIRC"
      : "Intake 2×4 + cascade out · clone mister path";

  return (
    <div className="dsc-page">
      <PageHeader
        icon={tent === "main" ? "tent" : "clone"}
        title={title}
        subtitle={`Tent cockpit — ${seats.length} seat(s). ${pathNote}`}
        primaryAction={
          <Button teal onClick={() => navigate("/live/twin")}>
            Both tents
          </Button>
        }
        actions={
          <Button primary onClick={() => navigate(`/live/climate?tent=${tent}`)}>
            Climate Want
          </Button>
        }
      />

      <div className="dsc-tent-cockpit-strip">
        <StatusChip label={`${seats.length} plants`} tone="ok" />
        <StatusChip
          label={`T ${fmt(tHeld.value)}°C`}
          tone={tHeld.stale ? "warn" : "ok"}
        />
        <StatusChip
          label={`RH ${fmt(rhHeld.value, 0)}%`}
          tone={rhHeld.stale ? "warn" : "ok"}
        />
        <StatusChip
          label={`VPD ${fmt(vpdHeld.value, 2)}`}
          tone={vpdHeld.stale ? "warn" : "ok"}
        />
        <StatusChip
          label={
            tent === "clone"
              ? lit
                ? "SF1000 ON"
                : "SF1000 OFF"
              : windowOpen
                ? "PHOTO ON"
                : "PHOTO OFF"
          }
          tone={lit ? "ok" : "muted"}
        />
        <StatusChip label={`IN ${fmt(intakeCfm, 0)} cfm`} tone="muted" />
        {tent === "main" ? (
          <>
            <StatusChip label={`OUT ${fmt(outCfm, 0)}`} tone="muted" />
            <StatusChip label={`RECIRC ${fmt(recircCfm, 0)}`} tone="muted" />
          </>
        ) : (
          <StatusChip label={`CFM OUT ${fmt(outCfm, 0)}`} tone="muted" />
        )}
      </div>

      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Want targets" icon="climate">
            <TentTargetPanel only={tent} compact />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Seat strip" icon="seat">
            <div className="dsc-chip-row">
              {seats.length === 0 ? (
                <div className="dsc-empty">No pots assigned — Apply to tent from a seat.</div>
              ) : (
                seats.map((s) => {
                  const db = Number(state(`sensor.dsc_pot${s.pot}_dryback_pct`));
                  const drybackWarn = Number.isFinite(db) && db > 45;
                  return (
                  <button
                    key={s.pot}
                    type="button"
                    className={`dsc-chip dsc-chip--ok${drybackWarn ? " dsc-chip--pulse" : ""}`}
                    onClick={() => {
                      const next = new URLSearchParams(params);
                      next.set("pot", String(s.pot));
                      setParams(next, { replace: true });
                    }}
                  >
                    P{s.pot} {s.plantName} · M {s.moisture} · Need {s.need}
                    {drybackWarn ? " · dryback warn" : ""}
                  </button>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Tent history" icon="climate">
            <MultiLineChart
              live
              lastSyncAt={Math.max(tSeries.lastSyncAt ?? 0, rhSeries.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "t",
                  label: "Temp",
                  series: tSeries.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "°C",
                },
                {
                  id: "rh",
                  label: "RH",
                  series: rhSeries.series,
                  color: "var(--dsc-teal)",
                  axis: "right",
                  unit: "%",
                },
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Fans (this tent)" icon="climate">
            {!fanOverride ? (
              <p className="dsc-honesty" style={{ marginTop: 0 }}>
                Fan sliders locked until Fan override is on (Climate → Command).
              </p>
            ) : null}
            <div className="dsc-fan-stack">
              {tent === "main" ? (
                <>
                  <EntityFanSlider
                    entityId="fan.dsc_hub_4_inch_intake_fan_main"
                    label="Intake Main"
                    disabled={!fanOverride}
                  />
                  <EntityFanSlider
                    entityId="fan.dsc_hub_6_inch_exhaust_room"
                    label="Exhaust room (RECIRC)"
                    disabled={!fanOverride}
                  />
                  <EntityFanSlider
                    entityId="fan.dsc_hub_6_inch_exhaust_outside"
                    label="Exhaust outside (OUT)"
                    disabled={!fanOverride}
                  />
                </>
              ) : (
                <>
                  <EntityFanSlider
                    entityId="fan.dsc_hub_4_inch_intake_fan_2x4"
                    label="Intake 2×4"
                    disabled={!fanOverride}
                  />
                  <EntityToggle
                    entityId="light.dsc_hub_sf1000_dimmer"
                    label="SF1000"
                    icon="lighting"
                  />
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Plant log (48h)" icon="roster">
            {log.length === 0 ? (
              <p className="dsc-muted" style={{ margin: 0 }}>
                Thin recorder / no recent identity changes — honesty empty, not invented.
              </p>
            ) : (
              <ul className="dsc-fault-list">
                {log.map((line) => (
                  <li key={line}>
                    <span className="dsc-muted" style={{ fontFamily: "var(--dsc-mono)", fontSize: 12 }}>
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <SlideDrawer
        open={pot != null}
        onClose={() => {
          const next = new URLSearchParams(params);
          next.delete("pot");
          setParams(next, { replace: true });
        }}
        title={pot != null ? `Plant seat · POT${pot}` : "Plant seat"}
      >
        {pot != null ? (
          <PlantSeatPanel
            pot={pot}
            onSelectPot={(n) => {
              const next = new URLSearchParams(params);
              next.set("pot", String(n));
              setParams(next, { replace: true });
            }}
          />
        ) : null}
      </SlideDrawer>
    </div>
  );
}

export function LiveMainPage() {
  return <TentCockpitPage tent="main" />;
}

export function LiveClonePage() {
  return <TentCockpitPage tent="clone" />;
}

export function LiveRootPage() {
  const { state, entity, tick, num } = useHass();
  const [params, setParams] = useSearchParams();
  const [showNpk, setShowNpk] = useState(false);
  void tick;
  const pots = ALL_POT_NUMBERS.map((n) => buildPlantSeat(n, { state, entity }));
  const svc = inServiceCount(state);
  const raw = Number(params.get("pot") || 0);
  const pot = raw >= 1 && raw <= 4 && isPotInService(raw, state) ? raw : null;

  const openPot = (n: number) => {
    const next = new URLSearchParams(params);
    next.set("pot", String(n));
    setParams(next, { replace: true });
  };

  const closePot = () => {
    const next = new URLSearchParams(params);
    next.delete("pot");
    setParams(next, { replace: true });
  };

  return (
    <div className="dsc-page">
      <PageHeader
        icon="root"
        title="Root"
        subtitle={`${svc.inService} of ${svc.total} in service — OOS labeled, never fake Got.`}
      />
      <div className="dsc-grid">
        <div className="dsc-col-4">
          <Kpi label="Coldest root" value={fmt(num("sensor.dsc_coldest_root_zone_temp"))} unit="°C" />
        </div>
        <div className="dsc-col-4">
          <Kpi label="Heat mat on time" value={fmt(num("sensor.dsc_heatmat_relay_on_time"), 0)} unit="s" />
        </div>
        <div className="dsc-col-4">
          <Card title="Notes">
            <p className="dsc-muted" style={{ margin: 0 }}>
              Mat loop uses per-pot sense with plausibility filter.
            </p>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Dryback strip" icon="gauge">
            <div className="dsc-gauge-row">
              {activePotNumbers(state).map((n) => (
                <RootDrybackGauge key={n} pot={n} onOpen={() => openPot(n)} />
              ))}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass dsc-root-matrix" title="Fleet matrix" icon="root">
            <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
              <Button onClick={() => setShowNpk((v) => !v)}>{showNpk ? "Hide NPK" : "Show NPK"}</Button>
            </div>
            <table className="dsc-table">
              <thead>
                <tr>
                  <th>Pot</th>
                  <th>Name</th>
                  <th>Tent</th>
                  <th>M%</th>
                  <th>Soil °C</th>
                  <th>Dryback</th>
                  <th>EC</th>
                  <th>pH</th>
                  {showNpk ? (
                    <>
                      <th>N</th>
                      <th>P</th>
                      <th>K</th>
                    </>
                  ) : null}
                  <th>Need</th>
                  <th>Rate</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {pots.map((p) => (
                  <RootMatrixRow key={p.pot} pot={p.pot} showNpk={showNpk} onOpen={() => openPot(p.pot)} />
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <SlideDrawer
        open={pot != null}
        onClose={closePot}
        title={pot != null ? `Plant seat · POT${pot}` : "Plant seat"}
      >
        {pot != null ? <PlantSeatPanel pot={pot} onSelectPot={openPot} /> : null}
      </SlideDrawer>
    </div>
  );
}

function RootDrybackGauge({ pot, onOpen }: { pot: number; onOpen: () => void }) {
  const held = useHeldReading(`sensor.dsc_pot${pot}_dryback_pct`);
  return (
    <ArcGauge
      label={`P${pot}`}
      value={held.value}
      min={0}
      max={100}
      unit="%"
      stale={held.stale}
      band={{ min: 0, max: 45 }}
      onClick={onOpen}
    />
  );
}

function RootMatrixRow({
  pot,
  onOpen,
  showNpk,
}: {
  pot: number;
  onOpen: () => void;
  showNpk?: boolean;
}) {
  const { state, entity, available } = useHass();
  const seat = buildPlantSeat(pot, { state, entity });
  const oos = !isPotInService(pot, state);
  const trust = readPotTrust(pot, state);
  const moistId = potGotEntity(pot, "moisture", state);
  const series = useEntitySeries(moistId, { hours: 6, maxPoints: 48 });
  const dry = useHeldReading(`sensor.dsc_pot${pot}_dryback_pct`);
  const rateId = `sensor.dsc_pot${pot}_soil_moisture_rate`;
  const rateHeld = useHeldReading(rateId);
  const rate = available(rateId) || rateHeld.stale ? rateHeld.value : NaN;
  const tone =
    oos || trust.untrusted
      ? "dsc-tone-stale"
      : dry.stale
        ? "dsc-tone-stale"
        : Number.isFinite(dry.value) && dry.value > 55
          ? "dsc-tone-bad"
          : Number.isFinite(dry.value) && dry.value > 40
            ? "dsc-tone-warn"
            : "dsc-tone-ok";
  const needGlow = !oos && !trust.blockNeedAct && seat.need && seat.need !== "—" && seat.need !== "ok";

  return (
    <tr onClick={onOpen} style={{ cursor: "pointer" }} className={trust.untrusted ? "dsc-tone-stale" : undefined}>
      <td>
        <VesselGlyph spec={readPotVessel(pot, state, entity)} size={18} /> P{pot}
        {oos ? " OOS" : ""}
      </td>
      <td>{oos ? "—" : seat.plantName}</td>
      <td>
        <StatusChip label={tentLabel(seat.tent)} tone={seat.tent === "unassigned" || oos ? "muted" : "ok"} />
      </td>
      <td>{oos ? "—" : seat.moisture}</td>
      <td>{oos ? "—" : seat.soilTemp}</td>
      <td className={tone}>{oos ? "—" : fmt(dry.value, 0)}</td>
      <td>{oos ? "—" : seat.ec}</td>
      <td>{oos ? "—" : seat.ph}</td>
      {showNpk ? (
        <>
          <td>{oos ? "—" : seat.n}</td>
          <td>{oos ? "—" : seat.p}</td>
          <td>{oos ? "—" : seat.k}</td>
        </>
      ) : null}
      <td className={needGlow ? "dsc-tone-warn" : undefined}>
        {oos ? "OOS" : trust.blockNeedAct ? `${seat.need} (no act)` : seat.need}
      </td>
      <td className={rateHeld.stale ? "dsc-tone-stale" : undefined}>
        {Number.isFinite(rate) ? rate.toFixed(2) : "—"}
      </td>
      <td>
        <Sparkline series={series.series} color="var(--dsc-blue)" width={90} height={24} />
      </td>
    </tr>
  );
}

export function LiveLightPage() {
  const { available, state, num } = useHass();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const darkViolation = state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const lightOn = state("light.dsc_hub_sf1000_dimmer") === "on";
  const windowOpen = state("binary_sensor.dsc_hub_4x8_window_open") === "on";
  const mainLamp = available("light.dsc_hub_4x8_dimmer") || available("light.dsc_hub_main_light");
  const hours = num("sensor.dsc_expected_light_hours");
  const cloneHours = num("sensor.dsc_clone_expected_light_hours");
  const spark = useEntitySeries("binary_sensor.dsc_hub_4x8_window_open", { hours: 24, maxPoints: 96 });

  return (
    <div className="dsc-page">
      <PageHeader
        icon="lighting"
        title="Light"
        subtitle="Photoperiod, SF1000, expected hours — 4×8 is window proxy until GPIO lamp."
        primaryAction={
          <Button teal onClick={() => navigate("/live/climate")}>
            Climate Want
          </Button>
        }
      />
      <div className="dsc-status-strip">
        <StatusChip
          icon={darkViolation ? "alert" : "ok"}
          label={darkViolation ? "CLONE DARK VIOLATION" : "Dark period OK"}
          tone={darkViolation ? "bad" : "ok"}
          pulse={darkViolation}
        />
        <StatusChip label={lightOn ? "SF1000 ON" : "SF1000 OFF"} tone={lightOn ? "ok" : "muted"} />
        <StatusChip
          label={mainLamp ? "4×8 lamp" : windowOpen ? "4×8 Window proxy ON" : "4×8 Window proxy OFF"}
          tone={mainLamp ? "ok" : "warn"}
        />
        {state("binary_sensor.dsc_hub_light_catchup_active") === "on" ? (
          <StatusChip label="Catch-up" tone="warn" />
        ) : null}
        {state("binary_sensor.dsc_clone_light_missing_in_window") === "on" ? (
          <StatusChip label="Missing in window" tone="bad" />
        ) : null}
      </div>
      <div className="dsc-grid">
        <div className="dsc-col-3">
          <Kpi label="Next event" value={state("sensor.dsc_next_light_event", "—")} />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Expected hours" value={fmt(hours, 1)} unit="h" />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Clone expected" value={fmt(cloneHours, 1)} unit="h" />
        </div>
        <div className="dsc-col-3">
          <ArcGauge label="Hours" value={hours} min={0} max={24} unit="h" />
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Photoperiod spark" icon="lighting">
            <Sparkline series={spark.series} color="var(--dsc-amber)" width={280} height={36} />
            <p className="dsc-muted" style={{ fontSize: 12 }}>
              Window binary is the 4×8 schedule Got until entities.main_light exists.
            </p>
          </Card>
        </div>
        <div className="dsc-col-8">
          <Card className="dsc-glass" title="SF1000" icon="lighting">
            <div className="dsc-demand-row">
              <EntityToggle
                entityId="light.dsc_hub_sf1000_dimmer"
                label="SF1000"
                icon="lighting"
                showBrightness
              />
              <EntityToggle entityId="switch.dsc_hub_auto_photoperiod" label="Auto photoperiod" />
              <EntityToggle entityId="switch.dsc_hub_manual_light_hold" label="Manual light hold" />
            </div>
            <Button onClick={() => setEdit(true)}>Edit schedule (DecisionLayer)</Button>
          </Card>
        </div>
      </div>
      <DecisionLayer open={edit} onDismiss={() => setEdit(false)} title="Light schedule" help={null}>
        <p className="dsc-muted">
          Same helpers as Lovelace lighting. 4×8 window is the schedule Got until a GPIO lamp exists.
        </p>
        <EntityToggle entityId="switch.dsc_hub_auto_photoperiod" label="Auto photoperiod" />
        <EntitySelect entityId="select.dsc_hub_clone_photoperiod" label="Window source" icon="clone" />
        <div className="dsc-target-grid">
          <EntityTime entityId="time.dsc_hub_lights_on_time" label="4×8 opens" />
          <TargetNumber entityId="number.dsc_hub_sunrise_duration" label="Sunrise min" />
          <TargetNumber entityId="number.dsc_hub_sunset_duration" label="Sunset min" />
          <TargetNumber entityId="number.dsc_hub_min_dark_hours" label="Min dark h" />
        </div>
        {state("select.dsc_hub_clone_photoperiod") === "Independent" ? (
          <div className="dsc-target-grid">
            <EntityTime entityId="time.dsc_hub_clone_lights_on_time" label="Clone lights-on" />
            <TargetNumber entityId="number.dsc_hub_clone_light_hours" label="Clone hours" />
          </div>
        ) : (
          <p className="dsc-honesty">
            Clone follows 4×8 ({state("time.dsc_hub_lights_on_time", "—")}). Switch Window source to Independent
            to unlock clone start/hours.
          </p>
        )}
        <EntityToggle entityId="light.dsc_hub_sf1000_dimmer" label="SF1000" showBrightness />
        <EntityToggle entityId="switch.dsc_hub_manual_light_hold" label="Manual light hold" />
      </DecisionLayer>
    </div>
  );
}
