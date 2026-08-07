import { LegacyCardHost } from "../components/LegacyCardHost";
import { Card, Kpi, PageHeader } from "../components/ui";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { ArcGauge, LiveLineChart } from "../viz/charts";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export function OpsDashPage() {
  return (
    <div className="dsc-page">
      <PageHeader
        title="Ops · Dash"
        subtitle="Cinematic digital twin — legacy Three.js card mounted in-panel."
      />
      <LegacyCardHost tag="dsc-the-dash-card" config={{}} />
    </div>
  );
}

export function OpsClimatePage() {
  const { num } = useHass();
  const series = useEntitySeries("sensor.dsc_hub_tent_temperature");
  const rhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity");

  return (
    <div className="dsc-page">
      <PageHeader title="Ops · Climate" subtitle="Environment control readouts and live traces." />
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
        <div className="dsc-col-6">
          <Card title="Temperature">
            <LiveLineChart series={series} unit="°C" />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card title="Humidity">
            <LiveLineChart series={rhSeries} unit="%" />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card title="Targets">
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-around" }}>
              <ArcGauge label="Temp" value={num("sensor.dsc_hub_tent_temperature")} min={15} max={35} unit="°C" />
              <ArcGauge label="RH" value={num("sensor.dsc_hub_tent_humidity")} min={0} max={100} unit="%" />
              <ArcGauge label="VPD×10" value={num("sensor.dsc_hub_vpd_kpa") * 10} min={0} max={20} unit="" />
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
}: {
  title: string;
  tempId: string;
  rhId: string;
}) {
  const { num } = useHass();
  const tSeries = useEntitySeries(tempId);
  const rhSeries = useEntitySeries(rhId);
  return (
    <div className="dsc-page">
      <PageHeader title={title} />
      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Kpi label="Temperature" value={fmt(num(tempId))} unit="°C" />
        </div>
        <div className="dsc-col-6">
          <Kpi label="Humidity" value={fmt(num(rhId), 0)} unit="%" />
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
  const { num, state } = useHass();
  return (
    <div className="dsc-page">
      <PageHeader title="Ops · Root zone" subtitle="Coldest root and heat-mat context." />
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
      </div>
    </div>
  );
}

export function OpsTankPage() {
  return (
    <div className="dsc-page">
      <PageHeader title="Ops · Tank" subtitle="Reservoir / tank vitals." />
      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Kpi label="Status" value="Live" tone="ok" sub="Wire additional tank sensors as they land." />
        </div>
        <div className="dsc-col-6">
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
