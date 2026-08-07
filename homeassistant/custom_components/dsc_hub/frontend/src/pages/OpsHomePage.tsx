import { Card, Kpi, PageHeader } from "../components/ui";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { ArcGauge, LiveLineChart } from "../viz/charts";

function fmtUptime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  if (seconds >= 86400) return `${(seconds / 86400).toFixed(1)}d`;
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)}h`;
  return `${Math.round(seconds / 60)}m`;
}

export function OpsHomePage() {
  const { state, num, available } = useHass();
  const hubOnline = available("sensor.dsc_hub_uptime");
  const alerts = num("sensor.dsc_active_alert_count", 0);
  const tentT = num("sensor.dsc_hub_tent_temperature");
  const tentRh = num("sensor.dsc_hub_tent_humidity");
  const vpd = num("sensor.dsc_hub_vpd_kpa");
  const roomT = num("sensor.dsc_hub_room_temperature");
  const tempSeries = useEntitySeries("sensor.dsc_hub_tent_temperature");

  return (
    <div className="dsc-page">
      <PageHeader
        title="Ops · Home"
        subtitle="Live vitals board — hub health, climate, alerts."
      />
      <div className="dsc-grid">
        <div className="dsc-col-3">
          <Kpi
            label="Hub"
            value={hubOnline ? "ONLINE" : "OFFLINE"}
            tone={hubOnline ? "ok" : "bad"}
            sub={`Uptime ${fmtUptime(num("sensor.dsc_hub_uptime"))}`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi
            label="Alerts"
            value={Number.isFinite(alerts) ? alerts : "—"}
            tone={alerts === 0 ? "ok" : "bad"}
            sub={alerts === 0 ? "All clear" : "Open System for detail"}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi
            label="Tent temp"
            value={Number.isFinite(tentT) ? tentT.toFixed(1) : "—"}
            unit="°C"
            sub={`Room ${Number.isFinite(roomT) ? roomT.toFixed(1) : "—"} °C`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi
            label="Tent RH"
            value={Number.isFinite(tentRh) ? tentRh.toFixed(0) : "—"}
            unit="%"
            sub={`VPD ${Number.isFinite(vpd) ? vpd.toFixed(2) : "—"} kPa`}
          />
        </div>

        <div className="dsc-col-8">
          <Card title="Live tent temperature">
            <LiveLineChart series={tempSeries} unit="°C" live />
          </Card>
        </div>
        <div className="dsc-col-4">
          <Card title="Climate gauges">
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 8 }}>
              <ArcGauge label="Temp" value={tentT} min={10} max={40} unit="°C" />
              <ArcGauge label="RH" value={tentRh} min={0} max={100} unit="%" />
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card title="Heartbeat">
            <div className="dsc-kpi-value" style={{ fontSize: "1.2rem" }}>
              {state("sensor.dsc_hub_heartbeat", "NO BEAT")}
            </div>
            <div className="dsc-kpi-sub">
              Panel link: {state("binary_sensor.dsc_hub_panel_link", "unknown")}
            </div>
          </Card>
        </div>
        <div className="dsc-col-6">
          <Card title="Fleet / surface">
            <div className="dsc-kpi-sub">
              Fleet: {state("sensor.dsc_fleet_version_status", "—")}
            </div>
            <div className="dsc-kpi-sub">
              HA surface: {state("sensor.dsc_ha_surface_version", "6.0.0")}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
