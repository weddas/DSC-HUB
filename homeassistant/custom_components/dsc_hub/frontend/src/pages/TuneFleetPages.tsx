import { Card, EntityToggle, Kpi, PageHeader, StatusChip } from "../components/ui";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { TimespanControl } from "../components/HistoryDrawer";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours } from "../hooks/useChartHours";
import { MultiLineChart } from "../viz/charts";
import { potGotEntity } from "../lib/seatModel";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export function TuneLearningPage() {
  const { state, num, available, entity } = useHass();
  const outAlloc = available("sensor.dsc_cfm_exhaust_out_allocated")
    ? num("sensor.dsc_cfm_exhaust_out_allocated")
    : num("sensor.dsc_cfm_exhaust_out");
  const recircAlloc = available("sensor.dsc_cfm_exhaust_recirc_allocated")
    ? num("sensor.dsc_cfm_exhaust_recirc_allocated")
    : num("sensor.dsc_cfm_exhaust_recirc");
  const learnStatus = state("sensor.dsc_learn_status", "—");
  const learnGate = state("binary_sensor.dsc_learn_gate", state("sensor.dsc_learn_gate", "—"));
  const curves = String(entity("sensor.dsc_cfm_exhaust_out")?.attributes?.cal_curve ?? "");

  return (
    <div className="dsc-page">
      <PageHeader
        icon="learning"
        title="Learning"
        subtitle="Learn status, CFM honesty, kit — wizard math stays in Lovelace/brain."
      />
      <div className="dsc-grid">
        <div className="dsc-col-3">
          <Kpi
            label="CFM OUT alloc"
            value={fmt(outAlloc, 0)}
            unit="cfm"
            sub={`Nameplate ${fmt(num("sensor.dsc_cfm_exhaust_out"), 0)}`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi
            label="CFM RECIRC alloc"
            value={fmt(recircAlloc, 0)}
            unit="cfm"
            sub={`Nameplate ${fmt(num("sensor.dsc_cfm_exhaust_recirc"), 0)}`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Intake main" value={fmt(num("sensor.dsc_cfm_intake_main"), 0)} unit="cfm" />
        </div>
        <div className="dsc-col-3">
          <Kpi label="Intake 2×4" value={fmt(num("sensor.dsc_cfm_intake_2x4"), 0)} unit="cfm" />
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Learn status" icon="learning">
            <div className="dsc-chip-row">
              <StatusChip label={`Status ${learnStatus}`} tone={learnStatus === "—" ? "muted" : "ok"} />
              <StatusChip label={`Gate ${learnGate}`} tone="muted" />
              <StatusChip
                label={`Beat ${state("sensor.dsc_hub_heartbeat", "—")}`}
                tone={available("sensor.dsc_hub_heartbeat") ? "ok" : "bad"}
              />
            </div>
            <p className="dsc-honesty" style={{ marginBottom: 0 }}>
              <StatusChip icon="alert" label="Nameplate" tone="warn" /> CFM figures are allocated /
              nameplate proxies unless cal curves exist
              {curves ? ` (${curves})` : " (no curve attrs)"}.
            </p>
            <p className="dsc-muted" style={{ marginBottom: 0 }}>
              Surface: {state("sensor.dsc_ha_surface_version", "7.1.1")}. Full anemometer wizard remains
              on Lovelace Learning — open dsc-hub-pro Learning for unported steps.
            </p>
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Kit / In service" icon="settings">
            <div className="dsc-mode-row">
              <EntityToggle entityId="input_boolean.dsc_ac_in_service" label="AC in service" icon="climate" />
              <EntityToggle
                entityId="input_boolean.dsc_clone_humidifier_in_service"
                label="Clone mister"
                icon="clone"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TuneAnalyticsPage() {
  const { state, num, available } = useHass();
  const { hours, setHours, maxPoints } = useChartHours(6);
  const tSeries = useEntitySeries("sensor.dsc_hub_tent_temperature", { maxPoints, hours });
  const rhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity", { maxPoints, hours });
  const outCfm = useEntitySeries(
    "sensor.dsc_cfm_exhaust_out_allocated",
    { maxPoints, hours },
  );
  const recircCfm = useEntitySeries(
    "sensor.dsc_cfm_exhaust_recirc_allocated",
    { maxPoints, hours },
  );
  const p1m = useEntitySeries(potGotEntity(1, "moisture", state), { maxPoints, hours });
  const p1db = useEntitySeries("sensor.dsc_pot1_dryback_pct", { maxPoints, hours });
  const p2m = useEntitySeries(potGotEntity(2, "moisture", state), { maxPoints, hours });
  const p4m = useEntitySeries(potGotEntity(4, "moisture", state), { maxPoints, hours });
  const p1Ec = useEntitySeries(potGotEntity(1, "ec", state), { maxPoints, hours });
  const learnedEcRaw = num("input_number.dsc_pot1_learned_ec_per_moisture");
  const learnedEc =
    available("input_number.dsc_pot1_learned_ec_per_moisture") &&
    Number.isFinite(learnedEcRaw) &&
    learnedEcRaw !== 0
      ? learnedEcRaw
      : NaN;

  return (
    <div className="dsc-page">
      <PageHeader
        icon="analytics"
        title="Analytics"
        subtitle="History-seeded trends — climate + root pack. Change timespan to zoom."
      />
      <div className="dsc-chip-row" style={{ marginBottom: 12 }}>
        <TimespanControl hours={hours} setHours={setHours} />
      </div>
      <div className="dsc-grid">
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Tent T + RH" icon="climate">
            <MultiLineChart
              live
              lastSyncAt={Math.max(tSeries.lastSyncAt ?? 0, rhSeries.lastSyncAt ?? 0) || undefined}
              series={[
                {
                  id: "t",
                  label: "Temp °C",
                  series: tSeries.series,
                  color: "var(--dsc-blue)",
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
            />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Exhaust CFM (allocated)" icon="climate">
            <MultiLineChart
              live
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
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Root pack — moisture" icon="root">
            <MultiLineChart
              live
              unit="%"
              lastSyncAt={
                Math.max(p1m.lastSyncAt ?? 0, p2m.lastSyncAt ?? 0, p4m.lastSyncAt ?? 0) || undefined
              }
              series={[
                { id: "p1", label: "P1", series: p1m.series, color: "var(--dsc-blue)", unit: "%" },
                { id: "p2", label: "P2", series: p2m.series, color: "var(--dsc-teal)", unit: "%" },
                { id: "p4", label: "P4", series: p4m.series, color: "var(--dsc-purple)", unit: "%" },
              ]}
            />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="P1 dryback" icon="root">
            <MultiLineChart
              live
              unit="%"
              lastSyncAt={p1db.lastSyncAt}
              series={[
                {
                  id: "db",
                  label: "Dryback",
                  series: p1db.series,
                  color: "var(--dsc-amber)",
                  unit: "%",
                },
              ]}
            />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="P1 EC" icon="root">
            <MultiLineChart
              live
              lastSyncAt={p1Ec.lastSyncAt}
              series={[
                {
                  id: "ec",
                  label: "EC",
                  series: p1Ec.series,
                  color: "var(--dsc-amber)",
                  unit: "",
                },
              ]}
            />
            <p className="dsc-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
              {Number.isFinite(learnedEc)
                ? `EC consumption honesty: learned ${learnedEc.toFixed(3)} EC per moisture (not feed invent).`
                : "EC over time shown — no learned_ec_per_moisture yet (not invented)."}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function FleetOverviewPage() {
  const { state, available, num } = useHass();
  const hubOk = available("sensor.dsc_hub_uptime");
  return (
    <div className="dsc-page">
      <PageHeader
        icon="fleet"
        title="Fleet"
        subtitle="Diagnostics, versions, kit densify, system map, tank note."
      />
      <div className="dsc-grid">
        <div className="dsc-col-4">
          <Kpi
            label="Hub link"
            value={hubOk ? "OK" : "DOWN"}
            tone={hubOk ? "ok" : "bad"}
            sub={`Uptime raw ${state("sensor.dsc_hub_uptime", "—")}`}
          />
        </div>
        <div className="dsc-col-4">
          <Kpi
            label="Surface"
            value={state("sensor.dsc_ha_surface_version", "7.1.1")}
            sub="Panel product shell"
          />
        </div>
        <div className="dsc-col-4">
          <Kpi
            label="Alerts"
            value={
              Number.isFinite(num("sensor.dsc_active_alert_count"))
                ? num("sensor.dsc_active_alert_count")
                : "—"
            }
            tone={num("sensor.dsc_active_alert_count", 0) === 0 ? "ok" : "bad"}
          />
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

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="System map" icon="system">
            <LegacyCardHost tag="dsc-system-map-card" config={{}} />
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Fleet version" icon="fleet">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              {state("sensor.dsc_fleet_version_status", "—")}
            </p>
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Tank" icon="tank">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              Reservoir / tank vitals land here as hardware comes online. Map above stays the
              topology view; do not invent tank sensors.
            </p>
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Panel" icon="system">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              Custom panel <code>/dsc-hub</code> · React + Vite · assets under{" "}
              <code>/dsc_hub/assets</code>.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
