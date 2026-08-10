import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LegacyCardHost } from "../components/LegacyCardHost";
import {
  Card,
  EntityFanSlider,
  EntitySelect,
  EntityToggle,
  Kpi,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { IconButton, OverflowMenu } from "../components/chrome";
import { TentTargetPanel, type TentKind } from "../components/TentTargets";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { ArcGauge, LiveLineChart, MultiLineChart, seriesExtrema } from "../viz/charts";
import { buildPlantSeat, tentLabel } from "../lib/seatModel";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export function OpsDashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const onSelect = (ev: Event) => {
      const detail = (ev as CustomEvent<{ pot?: number | string }>).detail;
      const pot = Number(detail?.pot);
      if (pot >= 1 && pot <= 4) {
        navigate(`/ops/plant-seat?pot=${pot}`);
      }
    };
    window.addEventListener("dsc-dash-select-pot", onSelect);
    return () => window.removeEventListener("dsc-dash-select-pot", onSelect);
  }, [navigate]);

  return (
    <div className="dsc-page">
      <PageHeader
        icon="dash"
        title="Ops · Dash"
        subtitle="Cinematic digital twin — pick a pot to open Plant Seat."
        actions={
          <IconButton label="Climate editors" icon="settings" onClick={() => navigate("/ops/climate")} />
        }
      />
      <LegacyCardHost tag="dsc-the-dash-card" config={{}} />
    </div>
  );
}

export function OpsClimatePage() {
  const { num, state, entity } = useHass();
  const navigate = useNavigate();
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const fullAuto = state("switch.dsc_hub_tent_full_auto_mode") === "on";
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");

  const tentT = useEntitySeries("sensor.dsc_hub_tent_temperature");
  const tentRh = useEntitySeries("sensor.dsc_hub_tent_humidity");
  const cloneT = useEntitySeries("sensor.dsc_hub_clone_temperature");
  const cloneRh = useEntitySeries("sensor.dsc_hub_clone_humidity");
  const outCfm = useEntitySeries("sensor.dsc_cfm_exhaust_out");
  const recircCfm = useEntitySeries("sensor.dsc_cfm_exhaust_recirc");
  const fanOut = useEntitySeries("sensor.dsc_fan_exhaust_outside_pct");
  const fanRecirc = useEntitySeries("sensor.dsc_fan_exhaust_room_pct");

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

  return (
    <div className="dsc-page">
      <PageHeader
        icon="climate"
        title="Ops · Climate"
        subtitle="Command, Want targets, zones, VPD, airflow."
        actions={
          <OverflowMenu
            label="Climate settings"
            items={[
              { id: "main", label: "Main 4×8", onSelect: () => navigate("/ops/main-4x8") },
              { id: "clone", label: "Clone 2×4", onSelect: () => navigate("/ops/clone-2x4") },
              { id: "home", label: "Ops Home", onSelect: () => navigate("/ops/home") },
            ]}
          />
        }
      />
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
            <TentTargetPanel />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit / In service" icon="settings">
            <div className="dsc-mode-row">
              <EntityToggle entityId="input_boolean.dsc_ac_in_service" label="AC in service" icon="climate" />
              <EntityToggle
                entityId="input_boolean.dsc_clone_humidifier_in_service"
                label="Clone mister"
                icon="clone"
              />
              <EntityToggle entityId="input_boolean.dsc_pot1_in_service" label="Pot 1" icon="root" />
              <EntityToggle entityId="input_boolean.dsc_pot2_in_service" label="Pot 2" icon="root" />
              <EntityToggle entityId="input_boolean.dsc_pot3_in_service" label="Pot 3" icon="root" />
              <EntityToggle entityId="input_boolean.dsc_pot4_in_service" label="Pot 4" icon="root" />
            </div>
          </Card>
        </div>

        <div className="dsc-col-3">
          <Kpi label="Tent °C" value={fmt(num("sensor.dsc_hub_tent_temperature"))} unit="°C" />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Tent RH" value={fmt(num("sensor.dsc_hub_tent_humidity"), 0)} unit="%" />
        </div>
        <div className="dsc-col-3">
          <Kpi label="VPD" value={fmt(num("sensor.dsc_hub_vpd_kpa"), 2)} unit="kPa" />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Room °C" value={fmt(num("sensor.dsc_hub_room_temperature"))} unit="°C" />
        </div>

        <div className="dsc-col-3">
          <Kpi
            label="CFM OUT"
            value={fmt(num("sensor.dsc_cfm_exhaust_out"), 0)}
            unit="cfm"
            sub={`Fan ${fmt(num("sensor.dsc_fan_exhaust_outside_pct"), 0)}%`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi
            label="CFM RECIRC"
            value={fmt(num("sensor.dsc_cfm_exhaust_recirc"), 0)}
            unit="cfm"
            sub={`Fan ${fmt(num("sensor.dsc_fan_exhaust_room_pct"), 0)}%`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Intake main" value={fmt(num("sensor.dsc_cfm_intake_main"), 0)} unit="cfm" />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Intake 2×4" value={fmt(num("sensor.dsc_cfm_intake_2x4"), 0)} unit="cfm" />
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Main tent T + RH" icon="tent">
            <MultiLineChart
              lastSyncAt={Math.max(tentT.lastSyncAt ?? 0, tentRh.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "t",
                  label: "Temp °C",
                  series: tentT.series,
                  color: "var(--dsc-neon)",
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
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Clone tent T + RH" icon="clone">
            <MultiLineChart
              lastSyncAt={Math.max(cloneT.lastSyncAt ?? 0, cloneRh.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "t",
                  label: "Temp °C",
                  series: cloneT.series,
                  color: "var(--dsc-neon)",
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

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Exhaust CFM" icon="climate">
            <MultiLineChart
              unit="cfm"
              lastSyncAt={Math.max(outCfm.lastSyncAt ?? 0, recircCfm.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "out",
                  label: "OUT",
                  series: outCfm.series,
                  color: "var(--dsc-neon)",
                  unit: "cfm",
                },
                {
                  id: "recirc",
                  label: "RECIRC",
                  series: recircCfm.series,
                  color: "var(--dsc-amber)",
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
              <ArcGauge
                label="Tent T"
                value={num("sensor.dsc_hub_tent_temperature")}
                min={15}
                max={35}
                unit="°C"
                target={targetTemp}
                extrema={tentTempExt}
              />
              <ArcGauge
                label="Tent RH"
                value={num("sensor.dsc_hub_tent_humidity")}
                min={0}
                max={100}
                unit="%"
                band={{ min: rhMin, max: rhMax }}
                extrema={tentRhExt}
              />
              <ArcGauge
                label="VPD"
                value={num("sensor.dsc_hub_vpd_kpa")}
                min={0}
                max={2.5}
                unit="kPa"
                band={{ min: vpdMin, max: vpdMax }}
              />
              <ArcGauge
                label="Clone T"
                value={num("sensor.dsc_hub_clone_temperature")}
                min={15}
                max={35}
                unit="°C"
                target={cloneTargetTemp}
              />
              <ArcGauge
                label="Clone RH"
                value={num("sensor.dsc_hub_clone_humidity")}
                min={0}
                max={100}
                unit="%"
                band={{ min: cloneRhMin, max: cloneRhMax }}
              />
              <ArcGauge
                label="Clone VPD"
                value={num("sensor.dsc_hub_clone_vpd_kpa")}
                min={0}
                max={2.5}
                unit="kPa"
                band={{ min: cloneVpdMin, max: cloneVpdMax }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ZoneBoard({
  title,
  icon,
  tempId,
  rhId,
  vpdId,
  tent,
}: {
  title: string;
  icon: "tent" | "clone";
  tempId: string;
  rhId: string;
  vpdId?: string;
  tent: TentKind;
}) {
  const { num } = useHass();
  const tSeries = useEntitySeries(tempId);
  const rhSeries = useEntitySeries(rhId);
  const tempEnt =
    tent === "main" ? "number.dsc_hub_target_temp" : "number.dsc_hub_clone_target_temp";
  const rhMinEnt =
    tent === "main" ? "number.dsc_hub_rh_target_min" : "number.dsc_hub_clone_rh_min";
  const rhMaxEnt =
    tent === "main" ? "number.dsc_hub_rh_target_max" : "number.dsc_hub_clone_rh_max";
  const vpdMinEnt =
    tent === "main" ? "number.dsc_hub_vpd_target_min" : "number.dsc_hub_clone_vpd_min";
  const vpdMaxEnt =
    tent === "main" ? "number.dsc_hub_vpd_target_max" : "number.dsc_hub_clone_vpd_max";
  const wantT = num(tempEnt);
  const rhMin = num(rhMinEnt);
  const rhMax = num(rhMaxEnt);
  const vpdMin = num(vpdMinEnt);
  const vpdMax = num(vpdMaxEnt);
  const tExt = useMemo(() => seriesExtrema(tSeries.series), [tSeries.series]);
  const rhExt = useMemo(() => seriesExtrema(rhSeries.series), [rhSeries.series]);

  return (
    <div className="dsc-page">
      <PageHeader icon={icon} title={title} />
      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Targets" icon="gauge">
            <TentTargetPanel emphasize={tent} />
          </Card>
        </div>
        <div className="dsc-col-4">
          <Kpi label="Temperature" value={fmt(num(tempId))} unit="°C" />
        </div>
        <div className="dsc-col-4">
          <Kpi label="Humidity" value={fmt(num(rhId), 0)} unit="%" />
        </div>
        <div className="dsc-col-4">
          <Kpi
            label="VPD"
            value={vpdId ? fmt(num(vpdId), 2) : "—"}
            unit="kPa"
            tone={vpdId ? "normal" : "muted"}
          />
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Temp + RH" icon="climate">
            <MultiLineChart
              lastSyncAt={Math.max(tSeries.lastSyncAt ?? 0, rhSeries.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "t",
                  label: "Temp °C",
                  series: tSeries.series,
                  color: "var(--dsc-neon)",
                  axis: "left",
                  unit: "°C",
                },
                {
                  id: "rh",
                  label: "RH %",
                  series: rhSeries.series,
                  color: "var(--dsc-teal)",
                  axis: "right",
                  unit: "%",
                },
              ]}
              targets={[
                { axis: "left", value: wantT, color: "var(--dsc-amber)", label: "Want T" },
                { axis: "right", min: rhMin, max: rhMax, color: "var(--dsc-teal)" },
              ]}
            />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card title="Temp trace">
            <LiveLineChart
              series={tSeries.series}
              unit="°C"
              lastSyncAt={tSeries.lastSyncAt}
              targets={[{ value: wantT, color: "var(--dsc-amber)", label: "Want" }]}
            />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card title="RH trace">
            <LiveLineChart
              series={rhSeries.series}
              unit="%"
              color="var(--dsc-teal)"
              lastSyncAt={rhSeries.lastSyncAt}
              targets={[{ min: rhMin, max: rhMax, color: "var(--dsc-teal)" }]}
            />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Gauges" icon="gauge">
            <div className="dsc-gauge-row">
              <ArcGauge
                label="Temp"
                value={num(tempId)}
                min={15}
                max={35}
                unit="°C"
                target={wantT}
                extrema={tExt}
              />
              <ArcGauge
                label="RH"
                value={num(rhId)}
                min={0}
                max={100}
                unit="%"
                band={{ min: rhMin, max: rhMax }}
                extrema={rhExt}
              />
              {vpdId ? (
                <ArcGauge
                  label="VPD"
                  value={num(vpdId)}
                  min={0}
                  max={2.5}
                  unit="kPa"
                  band={{ min: vpdMin, max: vpdMax }}
                />
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OpsMain4x8Page() {
  return (
    <ZoneBoard
      title="Ops · Main 4×8"
      icon="tent"
      tempId="sensor.dsc_hub_tent_temperature"
      rhId="sensor.dsc_hub_tent_humidity"
      vpdId="sensor.dsc_hub_vpd_kpa"
      tent="main"
    />
  );
}

export function OpsClone2x4Page() {
  return (
    <ZoneBoard
      title="Ops · Clone 2×4"
      icon="clone"
      tempId="sensor.dsc_hub_clone_temperature"
      rhId="sensor.dsc_hub_clone_humidity"
      vpdId="sensor.dsc_hub_clone_vpd_kpa"
      tent="clone"
    />
  );
}

export function OpsRootZonePage() {
  const { num, state, entity, tick } = useHass();
  const navigate = useNavigate();
  void tick;
  const pots = [1, 2, 3, 4].map((n) => buildPlantSeat(n, { state, entity }));

  return (
    <div className="dsc-page">
      <PageHeader
        icon="root"
        title="Ops · Root zone"
        subtitle="Per-pot soil Got + roster blend — click a row for Plant Seat."
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
              Mat loop uses per-pot sense with plausibility filter. State:{" "}
              {state("sensor.dsc_coldest_root_zone_temp", "—")}
            </p>
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Pots" icon="root">
            <table className="dsc-table">
              <thead>
                <tr>
                  <th>Pot</th>
                  <th>Name</th>
                  <th>Tent</th>
                  <th>M</th>
                  <th>T</th>
                  <th>EC</th>
                  <th>pH</th>
                  <th>NPK</th>
                  <th>Blend</th>
                </tr>
              </thead>
              <tbody>
                {pots.map((p) => (
                  <tr key={p.pot} onClick={() => navigate(`/ops/plant-seat?pot=${p.pot}`)}>
                    <td>P{p.pot}</td>
                    <td>{p.plantName}</td>
                    <td>
                      <StatusChip
                        label={tentLabel(p.tent)}
                        tone={p.tent === "unassigned" ? "muted" : "ok"}
                      />
                    </td>
                    <td>{p.moisture}</td>
                    <td>{p.soilTemp}</td>
                    <td>{p.ec}</td>
                    <td>{p.ph}</td>
                    <td>
                      {p.n}/{p.p}/{p.k}
                    </td>
                    <td className="dsc-muted">{p.blend || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OpsTankPage() {
  return (
    <div className="dsc-page">
      <PageHeader icon="tank" title="Ops · Tank" subtitle="Reservoir / tank vitals + system map." />
      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="System map" icon="system">
            <LegacyCardHost tag="dsc-system-map-card" config={{}} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export function OpsLightingPage() {
  const { state, num } = useHass();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="lighting"
        title="Ops · Lighting"
        subtitle="Photoperiod and expected light hours."
      />
      <div className="dsc-grid">
        <div className="dsc-col-4">
          <Kpi
            label="Expected light hours"
            value={fmt(num("sensor.dsc_expected_light_hours"), 1)}
            unit="h"
          />
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
            </div>
            <p className="dsc-muted" style={{ margin: "8px 0 0" }}>
              Expected: {state("sensor.dsc_expected_light_hours", "—")}. Fixture detail remains on
              firmware / packages.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
