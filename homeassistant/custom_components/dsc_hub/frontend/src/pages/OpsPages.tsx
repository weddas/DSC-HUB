import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { Card, Kpi, PageHeader, StatusChip } from "../components/ui";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { ArcGauge, LiveLineChart, MultiLineChart } from "../viz/charts";
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
        title="Ops · Dash"
        subtitle="Cinematic digital twin — pick a pot to open Plant Seat."
      />
      <LegacyCardHost tag="dsc-the-dash-card" config={{}} />
    </div>
  );
}

export function OpsClimatePage() {
  const { num } = useHass();
  const tentT = useEntitySeries("sensor.dsc_hub_tent_temperature");
  const tentRh = useEntitySeries("sensor.dsc_hub_tent_humidity");
  const outCfm = useEntitySeries("sensor.dsc_cfm_exhaust_out");
  const recircCfm = useEntitySeries("sensor.dsc_cfm_exhaust_recirc");
  const fanOut = useEntitySeries("sensor.dsc_fan_exhaust_outside_pct");
  const fanRecirc = useEntitySeries("sensor.dsc_fan_exhaust_room_pct");

  return (
    <div className="dsc-page">
      <PageHeader title="Ops · Climate" subtitle="Zones, VPD, airflow CFM / fan duty." />
      <div className="dsc-grid">
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
          <Card title="Tent temperature + RH">
            <MultiLineChart
              series={[
                { id: "t", label: "Temp °C", series: tentT, color: "var(--dsc-neon)" },
                { id: "rh", label: "RH %", series: tentRh, color: "#7dd3fc" },
              ]}
            />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card title="Exhaust CFM">
            <MultiLineChart
              unit="cfm"
              series={[
                { id: "out", label: "OUT", series: outCfm, color: "var(--dsc-neon)" },
                { id: "recirc", label: "RECIRC", series: recircCfm, color: "#fbbf24" },
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card title="Fan duty %">
            <MultiLineChart
              unit="%"
              series={[
                { id: "fout", label: "OUT %", series: fanOut, color: "#7dd3fc" },
                { id: "frec", label: "RECIRC %", series: fanRecirc, color: "#f472b6" },
              ]}
            />
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card title="Zone gauges">
            <div className="dsc-gauge-row">
              <ArcGauge label="Tent T" value={num("sensor.dsc_hub_tent_temperature")} min={15} max={35} unit="°C" />
              <ArcGauge label="Tent RH" value={num("sensor.dsc_hub_tent_humidity")} min={0} max={100} unit="%" />
              <ArcGauge label="VPD×10" value={num("sensor.dsc_hub_vpd_kpa") * 10} min={0} max={20} unit="" />
              <ArcGauge label="Clone T" value={num("sensor.dsc_hub_clone_temperature")} min={15} max={35} unit="°C" />
              <ArcGauge label="Clone RH" value={num("sensor.dsc_hub_clone_humidity")} min={0} max={100} unit="%" />
              <ArcGauge label="Room T" value={num("sensor.dsc_hub_room_temperature")} min={10} max={40} unit="°C" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ZoneBoard({
  title,
  tempId,
  rhId,
  vpdId,
}: {
  title: string;
  tempId: string;
  rhId: string;
  vpdId?: string;
}) {
  const { num } = useHass();
  const tSeries = useEntitySeries(tempId);
  const rhSeries = useEntitySeries(rhId);
  return (
    <div className="dsc-page">
      <PageHeader title={title} />
      <div className="dsc-grid">
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
        <div className="dsc-col-6">
          <Card title="Temp trace">
            <LiveLineChart series={tSeries} unit="°C" />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card title="RH trace">
            <LiveLineChart series={rhSeries} unit="%" />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card title="Gauges">
            <div className="dsc-gauge-row">
              <ArcGauge label="Temp" value={num(tempId)} min={15} max={35} unit="°C" />
              <ArcGauge label="RH" value={num(rhId)} min={0} max={100} unit="%" />
              {vpdId ? (
                <ArcGauge label="VPD×10" value={num(vpdId) * 10} min={0} max={20} unit="" />
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
      tempId="sensor.dsc_hub_tent_temperature"
      rhId="sensor.dsc_hub_tent_humidity"
      vpdId="sensor.dsc_hub_vpd_kpa"
    />
  );
}

export function OpsClone2x4Page() {
  return (
    <ZoneBoard
      title="Ops · Clone 2×4"
      tempId="sensor.dsc_hub_clone_temperature"
      rhId="sensor.dsc_hub_clone_humidity"
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
      <PageHeader title="Ops · Root zone" subtitle="Per-pot soil Got + roster blend — click a row for Plant Seat." />
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
          <Card className="dsc-glass" title="Pots">
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
                      <StatusChip label={tentLabel(p.tent)} tone={p.tent === "unassigned" ? "muted" : "ok"} />
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
      <PageHeader title="Ops · Tank" subtitle="Reservoir / tank vitals + system map." />
      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card title="System map">
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
      <PageHeader title="Ops · Lighting" subtitle="Photoperiod and expected light hours." />
      <div className="dsc-grid">
        <div className="dsc-col-4">
          <Kpi label="Expected light hours" value={fmt(num("sensor.dsc_expected_light_hours"), 1)} unit="h" />
        </div>
        <div className="dsc-col-8">
          <Card title="Notes">
            <p className="dsc-muted" style={{ margin: 0 }}>
              Expected: {state("sensor.dsc_expected_light_hours", "—")}. Fixture detail remains on firmware / packages.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
