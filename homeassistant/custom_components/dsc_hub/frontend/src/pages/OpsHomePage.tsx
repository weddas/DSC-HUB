import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  EntityFanSlider,
  EntitySelect,
  EntityToggle,
  Kpi,
  LinkChip,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { IconButton, OverflowMenu, SlideDrawer } from "../components/chrome";
import { TentTargetPanel } from "../components/TentTargets";
import { useHass } from "../hooks/useHass";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { ArcGauge, MultiLineChart, seriesExtrema } from "../viz/charts";
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
  const [searchOpen, setSearchOpen] = useState(false);
  void tick;
  const hubOnline = available("sensor.dsc_hub_uptime");
  const alerts = num("sensor.dsc_active_alert_count", 0);
  const tentT = num("sensor.dsc_hub_tent_temperature");
  const tentRh = num("sensor.dsc_hub_tent_humidity");
  const vpd = num("sensor.dsc_hub_vpd_kpa");
  const roomT = num("sensor.dsc_hub_room_temperature");
  const cloneT = num("sensor.dsc_hub_clone_temperature");
  const cloneRh = num("sensor.dsc_hub_clone_humidity");

  const { series: tempSeries, lastSyncAt: tempSync } = useEntitySeries(
    "sensor.dsc_hub_tent_temperature",
  );
  const { series: rhSeries, lastSyncAt: rhSync } = useEntitySeries(
    "sensor.dsc_hub_tent_humidity",
  );
  const chartSync = Math.max(tempSync ?? 0, rhSync ?? 0) || undefined;

  const targetTemp = num("number.dsc_hub_target_temp");
  const rhMin = num("number.dsc_hub_rh_target_min");
  const rhMax = num("number.dsc_hub_rh_target_max");
  const vpdMin = num("number.dsc_hub_vpd_target_min");
  const vpdMax = num("number.dsc_hub_vpd_target_max");

  const tempExt = useMemo(() => seriesExtrema(tempSeries), [tempSeries]);
  const rhExt = useMemo(() => seriesExtrema(rhSeries), [rhSeries]);

  const panelLink = state("binary_sensor.dsc_hub_panel_link");
  const panelOk = panelLink === "on";
  const heartbeat = state("sensor.dsc_hub_heartbeat", "NO BEAT");
  const beatOk = available("sensor.dsc_hub_heartbeat");
  const fleet = state("sensor.dsc_fleet_version_status", "—");
  const takeover = state("switch.dsc_hub_manual_takeover") === "on";
  const fanOverride = state("switch.dsc_hub_tent_manual_override") === "on";
  const fullAuto = state("switch.dsc_hub_tent_full_auto_mode") === "on";
  const reducedKit = state("binary_sensor.dsc_reduced_kit") === "on";
  const honesty = String(entity("sensor.dsc_keepup_gaps")?.attributes?.full_auto_honesty ?? "");
  const autoDriven = fullAuto && !takeover;

  const activeFaults = FAULTS.filter((f) => state(f.id) === "on");
  const seats = [1, 2, 3, 4].map((n) => buildPlantSeat(n, { state, entity }));

  return (
    <div className="dsc-page">
      <PageHeader
        icon="home"
        title="Ops · Home"
        subtitle="Live vitals — mode, targets, faults, demands, climate."
        actions={
          <>
            <IconButton label="Search" icon="search" onClick={() => setSearchOpen(true)} />
            <OverflowMenu
              label="Home settings"
              items={[
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => navigate("/ops/climate"),
                },
                {
                  id: "system",
                  label: "Open System",
                  onSelect: () => navigate("/system"),
                },
              ]}
            />
            <IconButton label="Settings" icon="settings" onClick={() => navigate("/ops/climate")} />
          </>
        }
      />

      <div className="dsc-status-strip">
        <StatusChip
          icon={hubOnline ? "ok" : "alert"}
          label={hubOnline ? "HUB ONLINE" : "HUB OFFLINE"}
          tone={hubOnline ? "ok" : "bad"}
        />
        <StatusChip
          label={panelOk ? "PANEL ESP-NOW" : available("sensor.dsc_control_wifi_rssi") ? "PANEL HA-ONLY" : "PANEL OFFLINE"}
          tone={panelOk ? "ok" : available("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"}
        />
        <StatusChip
          icon={beatOk ? "ok" : "alert"}
          label={beatOk ? `BEAT ${heartbeat}` : "NO BEAT"}
          tone={beatOk ? "ok" : "bad"}
        />
        <StatusChip
          label={`UP ${fmtUptime(num("sensor.dsc_hub_uptime"))}`}
          tone={hubOnline ? "ok" : "muted"}
        />
        <StatusChip
          icon={alerts === 0 ? "ok" : "alert"}
          label={alerts === 0 ? "All clear" : `${alerts} alert(s)`}
          tone={alerts === 0 ? "ok" : "bad"}
          pulse={alerts > 0}
        />
        <StatusChip
          label={fleet === "ok" ? "FLEET OK" : fleet === "warn" ? "FLEET WARN" : "FLEET DRIFT"}
          tone={fleet === "ok" ? "ok" : fleet === "warn" ? "warn" : "bad"}
        />
        {fullAuto ? <StatusChip icon="ok" label="FULL AUTO" tone="ok" pulse /> : null}
        {autoDriven ? <StatusChip label="AUTO-DRIVEN" tone="ok" /> : null}
        {takeover ? <StatusChip icon="alert" label="MANUAL TAKEOVER" tone="warn" pulse /> : null}
        {fanOverride ? <StatusChip icon="alert" label="FAN OVERRIDE" tone="warn" pulse /> : null}
        {fullAuto && reducedKit ? (
          <StatusChip icon="alert" label={honesty || "REDUCED KIT"} tone="warn" pulse />
        ) : null}
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
            value={state("sensor.dsc_ha_surface_version", "6.3.0")}
            sub={`Fleet ${fleet}`}
            tone="ok"
          />
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Mode" icon="climate">
            <div className="dsc-mode-row">
              <EntityToggle
                entityId="switch.dsc_hub_tent_full_auto_mode"
                label="Full Auto"
                icon="ok"
              />
              <EntityToggle
                entityId="switch.dsc_hub_manual_takeover"
                label="Manual takeover"
                icon="alert"
              />
              <EntityToggle
                entityId="switch.dsc_hub_tent_manual_override"
                label="Fan override"
                icon="climate"
              />
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
              <EntitySelect
                entityId="select.dsc_hub_control_strategy"
                label="Strategy"
                icon="climate"
              />
              <EntitySelect
                entityId="select.dsc_hub_priority_tent"
                label="Priority tent"
                icon="tent"
              />
            </div>
            {fullAuto && (reducedKit || honesty) ? (
              <p className="dsc-honesty">
                <StatusChip icon="alert" label="Honesty" tone="warn" />{" "}
                {honesty || "Full Auto armed on reduced kit — capacity offline paths apply."}
              </p>
            ) : null}
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Targets" icon="gauge">
            <TentTargetPanel compact />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Plant seats" icon="seat">
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
          <Card className="dsc-glass" title="Live climate — tent T + RH" icon="climate">
            <MultiLineChart
              live
              lastSyncAt={chartSync}
              series={[
                {
                  id: "temp",
                  label: "Temp °C",
                  series: tempSeries,
                  color: "var(--dsc-neon)",
                  axis: "left",
                  unit: "°C",
                },
                {
                  id: "rh",
                  label: "RH %",
                  series: rhSeries,
                  color: "var(--dsc-teal)",
                  axis: "right",
                  unit: "%",
                },
              ]}
              targets={[
                {
                  axis: "left",
                  value: targetTemp,
                  color: "var(--dsc-amber)",
                  label: "Want T",
                },
                {
                  axis: "right",
                  min: rhMin,
                  max: rhMax,
                  color: "var(--dsc-teal)",
                  label: "RH band",
                },
              ]}
            />
          </Card>
        </div>
        <div className="dsc-col-4">
          <Card className="dsc-glass" title="Gauges" icon="gauge">
            <div className="dsc-gauge-row">
              <ArcGauge
                label="Temp"
                value={tentT}
                min={10}
                max={40}
                unit="°C"
                target={targetTemp}
                band={
                  Number.isFinite(targetTemp)
                    ? { min: targetTemp - 2, max: targetTemp + 2 }
                    : undefined
                }
                extrema={tempExt}
              />
              <ArcGauge
                label="RH"
                value={tentRh}
                min={0}
                max={100}
                unit="%"
                band={{ min: rhMin, max: rhMax }}
                extrema={rhExt}
              />
              <ArcGauge
                label="VPD"
                value={vpd}
                min={0}
                max={2.5}
                unit="kPa"
                band={{ min: vpdMin, max: vpdMax }}
                target={(vpdMin + vpdMax) / 2}
              />
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className={`dsc-glass${autoDriven ? " is-auto" : ""}`} title="Demands" icon="climate">
            {autoDriven ? (
              <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
                <StatusChip label="AUTO" tone="ok" icon="ok" />
              </div>
            ) : null}
            <div className="dsc-demand-row">
              <EntityToggle entityId="switch.dsc_hub_heater_demand" label="Heat" icon="climate" />
              <EntityToggle
                entityId="switch.dsc_hub_ac_demand"
                label="Cool"
                icon="climate"
                warnWhenMissing={
                  state("binary_sensor.dsc_ac_capacity_offline") === "on" ? "AC ○" : undefined
                }
              />
              <EntityToggle entityId="switch.dsc_hub_humidifier_demand" label="Hum" icon="climate" />
              <EntityToggle
                entityId="switch.dsc_hub_dehumidifier_demand"
                label="Dehum"
                icon="climate"
              />
              <EntityToggle entityId="switch.dsc_hub_grow_mat_demand" label="Mat" icon="root" />
              <EntityToggle
                entityId="switch.dsc_hub_clone_humidifier_demand"
                label="C-Hum"
                icon="clone"
              />
              <EntityToggle
                entityId="light.dsc_hub_sf1000_dimmer"
                label="SF1000"
                icon="lighting"
                showBrightness
              />
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Fans" icon="climate">
            <p className="dsc-muted" style={{ margin: "0 0 8px" }}>
              {fanOverride
                ? "Fan override ON — sliders write percentage."
                : "Enable Fan override to set duty."}
            </p>
            <div className="dsc-fan-stack">
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

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Pot ESP-NOW" icon="root">
            <div className="dsc-chip-row">
              <LinkChip entityId="binary_sensor.dsc_hub_pot1_esp_now_link" label="P1" icon="ok" />
              <LinkChip entityId="binary_sensor.dsc_hub_pot2_esp_now_link" label="P2" icon="ok" />
              <LinkChip entityId="binary_sensor.dsc_hub_pot3_esp_now_link" label="P3" icon="ok" />
              <LinkChip entityId="binary_sensor.dsc_hub_pot4_esp_now_link" label="P4" icon="ok" />
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Faults / alerts" icon="alert">
            {activeFaults.length === 0 && alerts === 0 ? (
              <div className="dsc-empty dsc-empty--ok">No active faults — all clear.</div>
            ) : (
              <ul className="dsc-fault-list">
                {activeFaults.map((f) => (
                  <li key={f.id}>
                    <StatusChip label={f.label} tone="bad" pulse icon="alert" />
                    <span className="dsc-muted">{f.id}</span>
                  </li>
                ))}
                {alerts > 0 && activeFaults.length === 0 ? (
                  <li>
                    <StatusChip label={`${alerts} system alert(s)`} tone="bad" pulse icon="alert" />
                    <span className="dsc-muted">See System for entity detail</span>
                  </li>
                ) : null}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <SlideDrawer open={searchOpen} onClose={() => setSearchOpen(false)} title="Quick jump">
        <div className="dsc-chip-row">
          {[
            { path: "/ops/climate", label: "Climate" },
            { path: "/ops/dash", label: "Dash" },
            { path: "/ops/main-4x8", label: "Main 4×8" },
            { path: "/ops/clone-2x4", label: "Clone 2×4" },
            { path: "/ops/plant-seat", label: "Plant seat" },
            { path: "/plant/build", label: "Build" },
            { path: "/system", label: "System" },
          ].map((l) => (
            <button
              key={l.path}
              type="button"
              className="dsc-btn teal"
              onClick={() => {
                setSearchOpen(false);
                navigate(l.path);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </SlideDrawer>
    </div>
  );
}
