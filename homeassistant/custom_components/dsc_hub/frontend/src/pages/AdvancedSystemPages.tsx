import { Card, EntityToggle, Kpi, PageHeader } from "../components/ui";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { LiveLineChart } from "../viz/charts";

export function AdvancedLearningPage() {
  const { state } = useHass();
  return (
    <div className="dsc-page">
      <PageHeader icon="learning" title="Advanced · Learning" subtitle="Learning loop status and notes." />
      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Status" icon="learning">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              Surface: {state("sensor.dsc_ha_surface_version", "6.3.0")}. Durable learning math belongs in brain/.
            </p>
          </Card>
        </div>
        <div className="dsc-col-6">
          <Kpi label="Hub beat" value={state("sensor.dsc_hub_heartbeat", "—")} />
        </div>
      </div>
    </div>
  );
}

export function AdvancedTrendsPage() {
  const tSeries = useEntitySeries("sensor.dsc_hub_tent_temperature", { maxPoints: 96 });
  const rhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity", { maxPoints: 96 });
  return (
    <div className="dsc-page">
      <PageHeader icon="trends" title="Advanced · Trends" subtitle="History-seeded trends with live append." />
      <div className="dsc-grid">
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Tent temperature" icon="climate">
            <LiveLineChart
              series={tSeries.series}
              unit="°C"
              live
              lastSyncAt={tSeries.lastSyncAt}
            />
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Tent humidity" icon="climate">
            <LiveLineChart
              series={rhSeries.series}
              unit="%"
              color="var(--dsc-teal)"
              live
              lastSyncAt={rhSeries.lastSyncAt}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AdvancedHistoryPage() {
  return (
    <div className="dsc-page">
      <PageHeader
        icon="history"
        title="Advanced · History"
        subtitle="HA Recorder remains the lab history store for now."
      />
      <Card className="dsc-glass" title="History" icon="history">
        <p className="dsc-muted" style={{ marginTop: 0 }}>
          Deep history charts stay on HA recorder / Trends while brain history matures. Use Trends for live session traces.
        </p>
      </Card>
    </div>
  );
}

export function SystemOverviewPage() {
  const { state, available, num } = useHass();
  const hubOk = available("sensor.dsc_hub_uptime");
  return (
    <div className="dsc-page">
      <PageHeader icon="system" title="System" subtitle="Diagnostics, versions, kit, and panel health." />
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
          <Kpi label="Surface" value={state("sensor.dsc_ha_surface_version", "6.3.0")} sub="Panel product shell" />
        </div>
        <div className="dsc-col-4">
          <Kpi
            label="Alerts"
            value={Number.isFinite(num("sensor.dsc_active_alert_count")) ? num("sensor.dsc_active_alert_count") : "—"}
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
        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Fleet" icon="system">
            <p className="dsc-muted" style={{ marginTop: 0 }}>
              {state("sensor.dsc_fleet_version_status", "—")}
            </p>
          </Card>
        </div>
        <div className="dsc-col-6">
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
