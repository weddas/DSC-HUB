import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { IconButton, OverflowMenu, SlideDrawer } from "../components/chrome";
import { TentTargetPanel } from "../components/TentTargets";
import { HistoryDrawer } from "../components/HistoryDrawer";
import { NextRecommendedCard } from "../components/Honesty";
import { useHass } from "../hooks/useHass";
import { useHeldReading, useHubOfflineMs } from "../hooks/useHeldReading";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours } from "../hooks/useChartHours";
import { TimespanControl } from "../components/HistoryDrawer";
import { fmtDurationMs, fmtUptimeSeconds } from "../lib/formatDuration";
import { buildPlantSeat, tentLabel } from "../lib/seatModel";
import { ArcGauge, GotWantBars, MultiLineChart, Sparkline, seriesExtrema } from "../viz/charts";

const FAULTS: { id: string; label: string }[] = [
  { id: "binary_sensor.dsc_hub_emergency_failsafe", label: "Emergency failsafe" },
  { id: "binary_sensor.dsc_hub_climate_sensor_fault", label: "Climate sensor fault" },
  { id: "binary_sensor.dsc_hub_aux_sensor_fault", label: "Aux sensor fault" },
  { id: "binary_sensor.dsc_hub_root_zone_sensor_fault", label: "Root-zone probes" },
  { id: "binary_sensor.dsc_clone_dark_period_violation", label: "Clone dark violation" },
  { id: "binary_sensor.dsc_reduced_kit", label: "Reduced kit" },
];

type HistTarget = { entityId: string; label: string; unit: string; color?: string };

function fmtHeld(n: number, digits = 1): string {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

export function LiveMissionPage() {
  const { state, num, available, entity, tick } = useHass();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [hist, setHist] = useState<HistTarget | null>(null);
  const { hours, setHours, maxPoints } = useChartHours(6);
  void tick;

  const hubOnline = available("sensor.dsc_hub_uptime");
  const offlineMs = useHubOfflineMs();
  const alerts = num("sensor.dsc_active_alert_count", 0);

  const tentT = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRh = useHeldReading("sensor.dsc_hub_tent_humidity");
  const vpd = useHeldReading("sensor.dsc_hub_vpd_kpa");
  const roomT = useHeldReading("sensor.dsc_hub_room_temperature");
  const cloneT = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRh = useHeldReading("sensor.dsc_hub_clone_humidity");

  const tentTSeries = useEntitySeries("sensor.dsc_hub_tent_temperature", { hours, maxPoints });
  const tentRhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity", { hours, maxPoints });
  const cloneTSeries = useEntitySeries("sensor.dsc_hub_clone_temperature", {
    hours,
    maxPoints: Math.min(maxPoints, 96),
  });

  const targetTemp = num("number.dsc_hub_target_temp");
  const rhMin = num("number.dsc_hub_rh_target_min");
  const rhMax = num("number.dsc_hub_rh_target_max");
  const cloneTargetTemp = num("number.dsc_hub_clone_target_temp");
  const cloneRhMin = num("number.dsc_hub_clone_rh_min");
  const cloneRhMax = num("number.dsc_hub_clone_rh_max");
  const tentTempExt = useMemo(() => seriesExtrema(tentTSeries.series), [tentTSeries.series]);
  const tentRhExt = useMemo(() => seriesExtrema(tentRhSeries.series), [tentRhSeries.series]);

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
  const climateFault = state("binary_sensor.dsc_hub_climate_sensor_fault") === "on";

  const activeFaults = FAULTS.filter((f) => state(f.id) === "on");
  const seats = [1, 2, 3, 4].map((n) => buildPlantSeat(n, { state, entity }));
  const anyHeld = tentT.stale || tentRh.stale || cloneT.stale;

  const openHist = (entityId: string, label: string, unit: string, color?: string) =>
    setHist({ entityId, label, unit, color });

  return (
    <div className="dsc-page">
      <PageHeader
        icon="mission"
        title="Mission"
        subtitle="Job line — mode, vitals, seats, demands. Click a gauge for history."
        primaryAction={
          <Button teal onClick={() => navigate("/live/twin")}>
            Open Twin
          </Button>
        }
        actions={
          <>
            <Button primary onClick={() => navigate("/live/climate")}>
              Climate Want
            </Button>
            <IconButton label="Search" icon="search" onClick={() => setSearchOpen(true)} />
            <OverflowMenu
              label="Mission settings"
              items={[
                {
                  id: "climate",
                  label: "Open Climate",
                  onSelect: () => navigate("/live/climate"),
                },
                { id: "main", label: "Main cockpit", onSelect: () => navigate("/live/main") },
                { id: "clone", label: "Clone cockpit", onSelect: () => navigate("/live/clone") },
                { id: "fleet", label: "Open Fleet", onSelect: () => navigate("/fleet") },
              ]}
            />
          </>
        }
      />

      <div className="dsc-status-strip">
        <StatusChip
          icon={hubOnline ? "ok" : "alert"}
          label={hubOnline ? "HUB ONLINE" : "HUB OFFLINE"}
          tone={hubOnline ? "ok" : "bad"}
        />
        {!hubOnline ? (
          <StatusChip
            label={`OFF ${offlineMs != null ? fmtDurationMs(offlineMs) : "—"}`}
            tone="bad"
            pulse
          />
        ) : null}
        {anyHeld ? <StatusChip label="HELD VITALS" tone="warn" /> : null}
        <StatusChip
          label={
            panelOk
              ? "PANEL ESP-NOW"
              : available("sensor.dsc_control_wifi_rssi")
                ? "PANEL HA-ONLY"
                : "PANEL OFFLINE"
          }
          tone={panelOk ? "ok" : available("sensor.dsc_control_wifi_rssi") ? "warn" : "bad"}
        />
        <StatusChip
          icon={beatOk ? "ok" : "alert"}
          label={beatOk ? `BEAT ${heartbeat}` : "NO BEAT"}
          tone={beatOk ? "ok" : "bad"}
        />
        <StatusChip
          label={`UP ${fmtUptimeSeconds(num("sensor.dsc_hub_uptime"))}`}
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

      <div className="dsc-grid dsc-mission-modern">
        <div className="dsc-col-12">
          <NextRecommendedCard />
        </div>

        <div className="dsc-col-4">
          <Card className="dsc-glass" title="Live gauges" icon="gauge">
            <div className="dsc-gauge-row">
              <ArcGauge
                label="Tent T"
                value={tentT.value}
                min={15}
                max={35}
                unit="°C"
                target={targetTemp}
                extrema={tentTempExt}
                stale={tentT.stale}
                onClick={() =>
                  openHist("sensor.dsc_hub_tent_temperature", "Tent T", "°C", "var(--dsc-blue)")
                }
              />
              <ArcGauge
                label="Tent RH"
                value={tentRh.value}
                min={0}
                max={100}
                unit="%"
                band={{ min: rhMin, max: rhMax }}
                extrema={tentRhExt}
                stale={tentRh.stale}
                onClick={() =>
                  openHist("sensor.dsc_hub_tent_humidity", "Tent RH", "%", "var(--dsc-teal)")
                }
              />
              <ArcGauge
                label="Clone T"
                value={cloneT.value}
                min={15}
                max={35}
                unit="°C"
                target={cloneTargetTemp}
                stale={cloneT.stale}
                onClick={() =>
                  openHist("sensor.dsc_hub_clone_temperature", "Clone T", "°C", "var(--dsc-purple)")
                }
              />
            </div>
            <div className="dsc-spark-row">
              <div>
                <span className="dsc-muted">Tent T</span>
                <Sparkline series={tentTSeries.series} color="var(--dsc-blue)" />
              </div>
              <div>
                <span className="dsc-muted">Tent RH</span>
                <Sparkline series={tentRhSeries.series} color="var(--dsc-teal)" />
              </div>
              <div>
                <span className="dsc-muted">Clone T</span>
                <Sparkline series={cloneTSeries.series} color="var(--dsc-purple)" />
              </div>
            </div>
          </Card>
        </div>

        <div className="dsc-col-4">
          <Card className={`dsc-glass${autoDriven ? " is-auto" : ""}`} title="Control Center" icon="climate">
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
            {climateFault ? (
              <p className="dsc-honesty">
                <StatusChip label="Climate fault" tone="bad" /> Do not invent Got — trust held/—.
              </p>
            ) : null}
          </Card>
        </div>

        <div className="dsc-col-4">
          <Card className="dsc-glass" title="Got vs Want" icon="gauge">
            <GotWantBars
              rows={[
                {
                  label: "Main T",
                  got: tentT.value,
                  want: targetTemp,
                  unit: "°C",
                },
                {
                  label: "Main RH",
                  got: tentRh.value,
                  wantMin: rhMin,
                  wantMax: rhMax,
                  unit: "%",
                },
                {
                  label: "Clone T",
                  got: cloneT.value,
                  want: cloneTargetTemp,
                  unit: "°C",
                },
                {
                  label: "Clone RH",
                  got: cloneRh.value,
                  wantMin: cloneRhMin,
                  wantMax: cloneRhMax,
                  unit: "%",
                },
              ]}
            />
            <div className="dsc-kpi-sub" style={{ marginTop: 8 }}>
              Room {fmtHeld(roomT.value)} °C · VPD {fmtHeld(vpd.value, 2)} kPa
              {vpd.stale || roomT.stale ? " · HELD" : ""}
            </div>
            <Kpi
              label="Surface"
              value={state("sensor.dsc_ha_surface_version", "7.1.0")}
              sub={`Fleet ${fleet}`}
              tone="ok"
            />
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
                  onClick={() => navigate(`/live/root?pot=${s.pot}`)}
                  title={s.blend || "Open plant seat"}
                >
                  P{s.pot} {s.plantName !== "—" ? s.plantName : "—"} · {tentLabel(s.tent)}
                  {s.blend ? ` · ${s.blend.slice(0, 28)}` : ""}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Live climate trend" icon="climate">
            <div className="dsc-chip-row" style={{ marginBottom: 8 }}>
              <TimespanControl hours={hours} setHours={setHours} />
              <Button onClick={() => navigate("/live/climate")}>Open Climate</Button>
            </div>
            <MultiLineChart
              live
              lastSyncAt={
                Math.max(tentTSeries.lastSyncAt ?? 0, tentRhSeries.lastSyncAt ?? 0) || undefined
              }
              series={[
                {
                  id: "t",
                  label: "Temp °C",
                  series: tentTSeries.series,
                  color: "var(--dsc-blue)",
                  axis: "left",
                  unit: "°C",
                },
                {
                  id: "rh",
                  label: "RH %",
                  series: tentRhSeries.series,
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
              <StatusChip
                label={`P1 ${state("binary_sensor.dsc_hub_pot1_esp_now_link") === "on" ? "ON" : "OFF"}`}
                tone={state("binary_sensor.dsc_hub_pot1_esp_now_link") === "on" ? "ok" : "muted"}
              />
              <StatusChip
                label={`P2 ${state("binary_sensor.dsc_hub_pot2_esp_now_link") === "on" ? "ON" : "OFF"}`}
                tone={state("binary_sensor.dsc_hub_pot2_esp_now_link") === "on" ? "ok" : "muted"}
              />
              <StatusChip
                label={`P3 ${state("binary_sensor.dsc_hub_pot3_esp_now_link") === "on" ? "ON" : "OFF"}`}
                tone={state("binary_sensor.dsc_hub_pot3_esp_now_link") === "on" ? "ok" : "muted"}
              />
              <StatusChip
                label={`P4 ${state("binary_sensor.dsc_hub_pot4_esp_now_link") === "on" ? "ON" : "OFF"}`}
                tone={state("binary_sensor.dsc_hub_pot4_esp_now_link") === "on" ? "ok" : "muted"}
              />
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
                    <span className="dsc-muted">See Fleet for entity detail</span>
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
            { path: "/live/climate", label: "Climate" },
            { path: "/live/twin", label: "Twin" },
            { path: "/live/main", label: "Main" },
            { path: "/live/clone", label: "Clone" },
            { path: "/live/root", label: "Root" },
            { path: "/live/light", label: "Light" },
            { path: "/grow/compose", label: "Compose" },
            { path: "/fleet", label: "Fleet" },
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

      <HistoryDrawer
        open={hist != null}
        onClose={() => setHist(null)}
        entityId={hist?.entityId ?? null}
        label={hist?.label ?? ""}
        unit={hist?.unit}
        color={hist?.color}
      />
    </div>
  );
}
