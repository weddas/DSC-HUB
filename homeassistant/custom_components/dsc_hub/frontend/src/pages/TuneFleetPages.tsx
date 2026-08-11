import { Card, EntityToggle, Kpi, PageHeader, StatusChip } from "../components/ui";
import { LegacyCardHost } from "../components/LegacyCardHost";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { MultiLineChart } from "../viz/charts";

function fmt(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export function TuneLearningPage() {
  const { state, num } = useHass();
  return (
    <div className="dsc-page">
      <PageHeader
        icon="learning"
        title="Learning"
        subtitle="Densify stub — CFM KPIs and kit honesty. Durable math lives in brain/."
      />
      <div className="dsc-grid">
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
          <Card className="dsc-glass" title="Status" icon="learning">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              Surface: {state("sensor.dsc_ha_surface_version", "7.0.0")}. Hub beat:{" "}
              {state("sensor.dsc_hub_heartbeat", "—")}.
            </p>
            <p className="dsc-honesty" style={{ marginBottom: 0 }}>
              <StatusChip icon="alert" label="Nameplate" tone="warn" /> CFM figures are nameplate /
              model estimates unless a calibrated flow sensor is in kit — treat as relative, not lab
              truth.
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
  const tSeries = useEntitySeries("sensor.dsc_hub_tent_temperature", { maxPoints: 96 });
  const rhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity", { maxPoints: 96 });
  const outCfm = useEntitySeries("sensor.dsc_cfm_exhaust_out", { maxPoints: 96 });
  const recircCfm = useEntitySeries("sensor.dsc_cfm_exhaust_recirc", { maxPoints: 96 });

  return (
    <div className="dsc-page">
      <PageHeader
        icon="analytics"
        title="Analytics"
        subtitle="History-seeded trends with live append — MultiLine traces."
      />
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
            />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Exhaust CFM" icon="climate">
            <MultiLineChart
              live
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
            value={state("sensor.dsc_ha_surface_version", "7.0.0")}
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
