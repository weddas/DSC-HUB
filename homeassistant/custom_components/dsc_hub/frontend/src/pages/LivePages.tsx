import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { OverflowMenu, SlideDrawer } from "../components/chrome";
import { TentTargetPanel } from "../components/TentTargets";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useZoneFocus, type ZoneFocus } from "../hooks/useZoneFocus";
import { ArcGauge, MultiLineChart, seriesExtrema } from "../viz/charts";
import { buildPlantSeat, tentLabel } from "../lib/seatModel";
import { PlantSeatPanel } from "./GrowPages";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

const FOCUS_OPTIONS: { id: ZoneFocus; label: string }[] = [
  { id: "main", label: "Main" },
  { id: "clone", label: "Clone" },
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
      />
      <p className="dsc-honesty dsc-muted" style={{ marginTop: 0 }}>
        Pick a pot in the twin to open its seat. Twin stays warm across tabs (keep-alive).
      </p>
    </div>
  );
}

export function LiveClimatePage() {
  const { num, state, entity } = useHass();
  const navigate = useNavigate();
  const { focus, setFocus } = useZoneFocus();
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

  const showMain = focus === "main" || focus === "compare" || focus === "room";
  const showClone = focus === "clone" || focus === "compare";

  return (
    <div className="dsc-page">
      <PageHeader
        icon="climate"
        title="Climate"
        subtitle="Command, Want targets, zone traces, VPD, airflow."
        actions={
          <OverflowMenu
            label="Climate settings"
            items={[
              { id: "mission", label: "Mission", onSelect: () => navigate("/live/mission") },
              { id: "fleet", label: "Fleet kit", onSelect: () => navigate("/fleet") },
              { id: "twin", label: "Twin", onSelect: () => navigate("/live/twin") },
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
            <TentTargetPanel
              emphasize={focus === "clone" ? "clone" : "main"}
            />
          </Card>
        </div>

        {showMain ? (
          <>
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
          </>
        ) : null}

        {showClone ? (
          <>
            <div className="dsc-col-3">
              <Kpi label="Clone °C" value={fmt(num("sensor.dsc_hub_clone_temperature"))} unit="°C" />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Clone RH" value={fmt(num("sensor.dsc_hub_clone_humidity"), 0)} unit="%" />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Clone VPD" value={fmt(num("sensor.dsc_hub_clone_vpd_kpa"), 2)} unit="kPa" />
            </div>
            <div className="dsc-col-3">
              <Kpi label="Room °C" value={fmt(num("sensor.dsc_hub_room_temperature"))} unit="°C" />
            </div>
          </>
        ) : null}

        {showMain ? (
          <div className={showClone ? "dsc-col-6" : "dsc-col-12"}>
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
        ) : null}

        {showClone ? (
          <div className={showMain ? "dsc-col-6" : "dsc-col-12"}>
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
        ) : null}

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
              {showMain ? (
                <>
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
                </>
              ) : null}
              {showClone ? (
                <>
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
                </>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function LiveRootPage() {
  const { num, state, entity, tick } = useHass();
  const [params, setParams] = useSearchParams();
  void tick;
  const pots = [1, 2, 3, 4].map((n) => buildPlantSeat(n, { state, entity }));
  const raw = Number(params.get("pot") || 0);
  const pot = raw >= 1 && raw <= 4 ? raw : null;

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
        subtitle="Per-pot soil Got + roster blend — click a row for seat drawer."
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
                  <tr key={p.pot} onClick={() => openPot(p.pot)} style={{ cursor: "pointer" }}>
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

export function LiveLightPage() {
  const { state, num } = useHass();
  const navigate = useNavigate();
  const darkViolation = state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const lightOn = state("light.dsc_hub_sf1000_dimmer") === "on";

  return (
    <div className="dsc-page">
      <PageHeader
        icon="lighting"
        title="Light"
        subtitle="Photoperiod, SF1000, expected hours — Want stays on Climate."
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
        <StatusChip
          label={lightOn ? "SF1000 ON" : "SF1000 OFF"}
          tone={lightOn ? "ok" : "muted"}
        />
      </div>
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
              Expected: {state("sensor.dsc_expected_light_hours", "—")}. Clone dark violation is binary
              — schedule edits belong on Climate / packages, not invented here.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
