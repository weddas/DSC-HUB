import { useNavigate } from "react-router-dom";
import { Card, EntityToggle, Kpi, LinkChip, PageHeader, StatusChip } from "../components/ui";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { ArcGauge, MultiLineChart } from "../viz/charts";
import { buildPlantSeat, tentLabel } from "../lib/seatModel";

function fmtUptime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  if (seconds >= 86400) return `${(seconds / 86400).toFixed(1)}d`;
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)}h`;
  return `${Math.round(seconds / 60)}m`;
}

const FAULTS: { id: string; label: string }[] = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" },
];

export function OpsHomePage() {
  const { state, num, available, entity, tick } = useHass();
  const navigate = useNavigate();
  void tick;
  const hubOnline = available("sensor.dsc_hub_uptime");
  const alerts = num("sensor.dsc_active_alert_count", 0);
  const tentT = num("sensor.dsc_hub_tent_temperature");
  const tentRh = num("sensor.dsc_hub_tent_humidity");
  const vpd = num("sensor.dsc_hub_vpd_kpa");
  const roomT = num("sensor.dsc_hub_room_temperature");
  const cloneT = num("sensor.dsc_hub_clone_temperature");
  const cloneRh = num("sensor.dsc_hub_clone_humidity");

  const tempSeries = useEntitySeries("sensor.dsc_hub_tent_temperature");
  const rhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity");

  const panelLink = state("binary_sensor.dsc_hub_panel_link");
  const panelOk = panelLink === "on";
  const heartbeat = state("sensor.dsc_hub_heartbeat", "NO BEAT");
  const beatOk = available("sensor.dsc_hub_heartbeat");
  const fleet = state("sensor.dsc_fleet_version_status", "—");
  const takeover = state("switch.dsc_hub_manual_takeover") === "on";
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";

  const activeFaults = FAULTS.filter((f) => state(f.id) === "on");
  const seats = [1, 2, 3, 4].map((n) => buildPlantSeat(n, { state, entity }));

  return (
    <div className="dsc-page">
      <PageHeader
        title="Ops · Home"
        subtitle="Live vitals — status, faults, demands, climate."
      />

      <div className="dsc-status-strip">
        <StatusChip label={hubOnline ? "HUB ONLINE" : "HUB OFFLINE"} tone={hubOnline ? "ok" : "bad"} />
        <StatusChip
          label={panelOk ? "PANEL ESP-NOW" : available("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE"}
          tone={panelOk ? "ok" : available("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"}
        />
        <StatusChip
          label={beatOk ? `BEAT ${heartbeat}` : "NO BEAT"}
          tone={beatOk ? "ok" : "bad"}
        />
        <StatusChip
          label={`UP ${fmtUptime(num("sensor.dsc_hub_uptime"))}`}
          tone={hubOnline ? "ok" : "muted"}
        />
        <StatusChip
          label={alerts === 0 ? "All clear" : `${alerts} alert(s)`}
          tone={alerts === 0 ? "ok" : "bad"}
          pulse={alerts > 0}
        />
        <StatusChip
          label={fleet === "ok" ? "FLEET OK" : fleet === "warn" ? "FLEET WARN" : "FLEET DRIFT"}
          tone={fleet === "ok" ? "ok" : fleet === "warn" ? "warn" : "bad"}
        />
        {takeover ? <StatusChip label="MANUAL TAKEOVER" tone="warn" pulse /> : null}
        {fanOverride ? <StatusChip label="FAN OVERRIDE" tone="warn" pulse /> : null}
      </div>

      <div className="dsc-grid">
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
        <div className="dsc-col-3">
          <Kpi
            label="Clone"
            value={Number.isFinite(cloneT) ? cloneT.toFixed(1) : "—"}
            unit="°C"
            sub={`RH ${Number.isFinite(cloneRh) ? cloneRh.toFixed(0) : "—"}%`}
          />
        </div>
        <div className="dsc-col-3">
          <Kpi
            label="Surface"
            value={state("sensor.dsc_ha_surface_version", "6.2.0")}
            sub={`Fleet ${fleet}`}
            tone="ok"
          />
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Plant seats">
            <div className="dsc-chip-row">
              {seats.map((s) => (
                <button
                  key={s.pot}
                  type="button"
                  className="dsc-chip dsc-chip--ok"
                  onClick={() => navigate(`/ops/plant-seat?pot=${s.pot}`)}
                  title={s.blend || "Open plant seat"}
                >
                  P{s.pot} {s.plantName !== "—" ? s.plantName : "—"} · {tentLabel(s.tent)}
                  {s.blend ? ` · ${s.blend.slice(0, 28)}` : ""}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="dsc-col-8">
          <Card title="Live climate — tent T + RH">
            <MultiLineChart
              live
              unit=""
              series={[
                {
                  id: "temp",
                  label: "Temp °C",
                  series: tempSeries,
                  color: "var(--dsc-neon)",
                },
                {
                  id: "rh",
                  label: "RH %",
                  series: rhSeries,
                  color: "#7dd3fc",
                },
              ]}
            />
          </Card>
        </div>
        <div className="dsc-col-4">
          <Card title="Gauges">
            <div className="dsc-gauge-row">
              <ArcGauge label="Temp" value={tentT} min={10} max={40} unit="°C" />
              <ArcGauge label="RH" value={tentRh} min={0} max={100} unit="%" />
              <ArcGauge label="VPD×10" value={vpd * 10} min={0} max={20} unit="" />
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card title="Demands">
            <div className="dsc-demand-row">
              <EntityToggle entityId="switch.dsc_hub_heater_demand" label="Heat" />
              <EntityToggle
                entityId="switch.dsc_hub_ac_demand"
                label="Cool"
                warnWhenMissing={
                  state("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : undefined
                }
              />
              <EntityToggle entityId="switch.dsc_hub_humidifier_demand" label="Hum" />
              <EntityToggle entityId="switch.dsc_hub_dehumidifier_demand" label="Dehum" />
              <EntityToggle entityId="switch.dsc_hub_grow_mat_demand" label="Mat" />
              <EntityToggle entityId="switch.dsc_hub_clone_humidifier_demand" label="C-Hum" />
              <EntityToggle entityId="light.dsc_hub_sf1000_dimmer" label="SF1000" />
            </div>
          </Card>
        </div>

        <div className="dsc-col-3">
          <Card title="Overrides">
            <div className="dsc-demand-row dsc-demand-row--stack">
              <EntityToggle entityId="switch.dsc_hub_manual_takeover" label="Manual takeover" />
              <EntityToggle entityId="switch.dsc_hub_tent_manual_override" label="Fan override" />
            </div>
          </Card>
        </div>

        <div className="dsc-col-3">
          <Card title="Pot ESP-NOW">
            <div className="dsc-chip-row">
              <LinkChip entityId="binary_sensor.dsc_hub_pot1_esp_now_link" label="P1" />
              <LinkChip entityId="binary_sensor.dsc_hub_pot2_esp_now_link" label="P2" />
              <LinkChip entityId="binary_sensor.dsc_hub_pot3_esp_now_link" label="P3" />
              <LinkChip entityId="binary_sensor.dsc_hub_pot4_esp_now_link" label="P4" />
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card title="Faults / alerts">
            {activeFaults.length === 0 && alerts === 0 ? (
              <div className="dsc-empty dsc-empty--ok">No active faults — all clear.</div>
            ) : (
              <ul className="dsc-fault-list">
                {activeFaults.map((f) => (
                  <li key={f.id}>
                    <StatusChip label={f.label} tone="bad" pulse />
                    <span className="dsc-muted">{f.id}</span>
                  </li>
                ))}
                {alerts > 0 && activeFaults.length === 0 ? (
                  <li>
                    <StatusChip label={`${alerts} system alert(s)`} tone="bad" pulse />
                    <span className="dsc-muted">See System for entity detail</span>
                  </li>
                ) : null}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
