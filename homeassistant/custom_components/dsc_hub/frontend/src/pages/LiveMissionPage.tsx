import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Kpi,
  PageHeader,
  StatusChip,
} from "../components/ui";
import { IconButton, OverflowMenu, SlideDrawer } from "../components/chrome";
import { HistoryDrawer } from "../components/HistoryDrawer";
import { NextRecommendedCard } from "../components/Honesty";
import { useHass } from "../hooks/useHass";
import { useHeldReading, useHubOfflineMs, useBeatOfflineMs, usePanelOfflineMs } from "../hooks/useHeldReading";
import { useEntitySeries } from "../hooks/useEntitySeries";
import { useChartHours } from "../hooks/useChartHours";
import { fmtDurationMs, fmtUptimeSeconds } from "../lib/formatDuration";
import { buildPlantSeat, ALL_POT_NUMBERS, inServiceCount, isPotInService, activePotNumbers } from "../lib/seatModel";
import { HubLinkLine } from "../components/HubLinkLine";
import { VesselGlyph } from "../components/VesselGlyph";
import { readPotVessel } from "../lib/vesselSpec";
import { readPotTrust } from "../lib/potTrust";
import { resolveCfm } from "../lib/cfmProvenance";
import { CfmProvenanceBadge } from "../components/CfmBadge";
import { KitPulse, type KitNode } from "../components/KitPulse";
import { ArcGauge, GotWantBars, Sparkline, seriesExtrema } from "../viz/charts";

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
  const { hours, maxPoints } = useChartHours(6);
  void tick;

  const hubOnline = available("sensor.dsc_hub_uptime");
  const offlineMs = useHubOfflineMs();
  const beatOfflineMs = useBeatOfflineMs();
  const panelOfflineMs = usePanelOfflineMs();
  const alerts = num("sensor.dsc_active_alert_count", 0);

  const tentT = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRh = useHeldReading("sensor.dsc_hub_tent_humidity");
  const tentVpd = useHeldReading("sensor.dsc_hub_vpd_kpa");
  const roomT = useHeldReading("sensor.dsc_hub_room_temperature");
  const cloneT = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRh = useHeldReading("sensor.dsc_hub_clone_humidity");
  const cloneVpd = useHeldReading("sensor.dsc_hub_clone_vpd_kpa");

  const tentTSeries = useEntitySeries("sensor.dsc_hub_tent_temperature", { hours, maxPoints });
  const tentRhSeries = useEntitySeries("sensor.dsc_hub_tent_humidity", { hours, maxPoints });
  const tentVpdSeries = useEntitySeries("sensor.dsc_hub_vpd_kpa", {
    hours,
    maxPoints: Math.min(maxPoints, 64),
  });
  const cloneTSeries = useEntitySeries("sensor.dsc_hub_clone_temperature", {
    hours,
    maxPoints: Math.min(maxPoints, 64),
  });
  const cloneRhSeries = useEntitySeries("sensor.dsc_hub_clone_humidity", {
    hours,
    maxPoints: Math.min(maxPoints, 64),
  });
  const cloneVpdSeries = useEntitySeries("sensor.dsc_hub_clone_vpd_kpa", {
    hours,
    maxPoints: Math.min(maxPoints, 64),
  });

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
  const tentTempExt = useMemo(() => seriesExtrema(tentTSeries.series), [tentTSeries.series]);
  const tentRhExt = useMemo(() => seriesExtrema(tentRhSeries.series), [tentRhSeries.series]);
  const cloneLit = state("light.dsc_hub_sf1000_dimmer") === "on";
  // No 4×8 PWM lamp yet — photoperiod window is the honest schedule/heat proxy.
  const mainLit = state("binary_sensor.dsc_hub_4x8_window_open") === "on";

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
  const seats = ALL_POT_NUMBERS.map((n) => buildPlantSeat(n, { state, entity }));
  const svc = inServiceCount(state);
  const outCfm = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", {
    available,
    num,
  });
  const kitNodes: KitNode[] = [
    { id: "hub", label: "Hub", status: available("binary_sensor.dsc_hub_link") ? (state("binary_sensor.dsc_hub_link") === "on" ? "ok" : "dark") : "missing" },
    { id: "ac", label: "AC", status: state("input_boolean.dsc_ac_in_service") === "on" ? "ok" : "oos" },
    { id: "mister", label: "Mister", status: state("input_boolean.dsc_clone_humidifier_in_service") === "on" ? "ok" : "oos" },
    ...ALL_POT_NUMBERS.map((n) => ({
      id: `pot${n}`,
      label: `Pot ${n}`,
      status: (isPotInService(n, state) ? "ok" : "oos") as KitNode["status"],
    })),
  ];
  const anyHeld = tentT.stale || tentRh.stale || tentVpd.stale || cloneT.stale || cloneRh.stale || cloneVpd.stale;

  const openHist = (entityId: string, label: string, unit: string, color?: string) =>
    setHist({ entityId, label, unit, color });

  return (
    <div className="dsc-page">
      <PageHeader
        icon="mission"
        title="Mission"
        subtitle="Triage glance — Next, faults, seats, lung. Command lives on Climate."
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
        <StatusChip label={`${svc.inService} of ${svc.total} in service`} tone={svc.inService === svc.total ? "ok" : "warn"} />
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
        {!panelOk && !available("sensor.dsc_control_wifi_rssi") ? (
          <StatusChip
            label={`PANEL OFF ${panelOfflineMs != null ? fmtDurationMs(panelOfflineMs) : "—"}`}
            tone="bad"
            pulse
          />
        ) : null}
        <StatusChip
          icon={beatOk ? "ok" : "alert"}
          label={beatOk ? `BEAT ${heartbeat}` : "NO BEAT"}
          tone={beatOk ? "ok" : "bad"}
        />
        {!beatOk ? (
          <StatusChip label={`BEAT OFF ${beatOfflineMs != null ? fmtDurationMs(beatOfflineMs) : "—"}`} tone="bad" pulse />
        ) : null}
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
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Hub link" icon="fleet">
            <HubLinkLine />
          </Card>
        </div>
        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Kit pulse" icon="ok">
            <KitPulse nodes={kitNodes} />
          </Card>
        </div>

        <div className="dsc-col-4">
          <Card className="dsc-glass" title="Live gauges" icon="gauge">
            <div className="dsc-gauge-matrix">
              <div className={`dsc-gauge-row-3${cloneLit ? " is-lit" : ""}`}>
                <div className="dsc-gauge-row-tag">2×4</div>
                <div className="dsc-gauge-cell">
                  <ArcGauge
                    label="Temp"
                    value={cloneT.value}
                    min={15}
                    max={35}
                    unit="°C"
                    target={cloneTargetTemp}
                    stale={cloneT.stale}
                    onClick={() =>
                      openHist("sensor.dsc_hub_clone_temperature", "2×4 Temp", "°C", "var(--dsc-teal)")
                    }
                  />
                  <Sparkline series={cloneTSeries.series} color="var(--dsc-teal)" width={88} height={18} />
                </div>
                <div className="dsc-gauge-cell">
                  <ArcGauge
                    label="RH"
                    value={cloneRh.value}
                    min={0}
                    max={100}
                    unit="%"
                    band={{ min: cloneRhMin, max: cloneRhMax }}
                    stale={cloneRh.stale}
                    onClick={() =>
                      openHist("sensor.dsc_hub_clone_humidity", "2×4 Humidity", "%", "var(--dsc-teal)")
                    }
                  />
                  <Sparkline series={cloneRhSeries.series} color="var(--dsc-teal)" width={88} height={18} />
                </div>
                <div className="dsc-gauge-cell">
                  <ArcGauge
                    label="VPD"
                    value={cloneVpd.value}
                    min={0}
                    max={2.5}
                    unit="kPa"
                    band={{ min: cloneVpdMin, max: cloneVpdMax }}
                    stale={cloneVpd.stale}
                    onClick={() =>
                      openHist("sensor.dsc_hub_clone_vpd_kpa", "2×4 VPD", "kPa", "var(--dsc-teal)")
                    }
                  />
                  <Sparkline series={cloneVpdSeries.series} color="var(--dsc-teal)" width={88} height={18} />
                </div>
              </div>
              <div className={`dsc-gauge-row-3${mainLit ? " is-lit" : ""}`}>
                <div className="dsc-gauge-row-tag">4×8</div>
                <div className="dsc-gauge-cell">
                  <ArcGauge
                    label="Temp"
                    value={tentT.value}
                    min={15}
                    max={35}
                    unit="°C"
                    target={targetTemp}
                    extrema={tentTempExt}
                    stale={tentT.stale}
                    onClick={() =>
                      openHist("sensor.dsc_hub_tent_temperature", "4×8 Temp", "°C", "var(--dsc-blue)")
                    }
                  />
                  <Sparkline series={tentTSeries.series} color="var(--dsc-blue)" width={88} height={18} />
                </div>
                <div className="dsc-gauge-cell">
                  <ArcGauge
                    label="RH"
                    value={tentRh.value}
                    min={0}
                    max={100}
                    unit="%"
                    band={{ min: rhMin, max: rhMax }}
                    extrema={tentRhExt}
                    stale={tentRh.stale}
                    onClick={() =>
                      openHist("sensor.dsc_hub_tent_humidity", "4×8 Humidity", "%", "var(--dsc-blue)")
                    }
                  />
                  <Sparkline series={tentRhSeries.series} color="var(--dsc-blue)" width={88} height={18} />
                </div>
                <div className="dsc-gauge-cell">
                  <ArcGauge
                    label="VPD"
                    value={tentVpd.value}
                    min={0}
                    max={2.5}
                    unit="kPa"
                    band={{ min: vpdMin, max: vpdMax }}
                    stale={tentVpd.stale}
                    onClick={() =>
                      openHist("sensor.dsc_hub_vpd_kpa", "4×8 VPD", "kPa", "var(--dsc-blue)")
                    }
                  />
                  <Sparkline series={tentVpdSeries.series} color="var(--dsc-blue)" width={88} height={18} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="dsc-col-4">
          <Card className={`dsc-glass${autoDriven ? " is-auto" : ""}`} title="Mode glance" icon="climate">
            <div className="dsc-chip-row">
              <StatusChip label={fullAuto ? "FULL AUTO" : "MANUAL"} tone={fullAuto ? "ok" : "muted"} />
              {takeover ? <StatusChip label="TAKEOVER" tone="warn" /> : null}
              {fanOverride ? <StatusChip label="FAN OVERRIDE" tone="warn" /> : null}
            </div>
            <p className="dsc-muted" style={{ margin: "8px 0 0" }}>
              Command lives on Climate.
            </p>
            <Button teal onClick={() => navigate("/live/climate")}>
              Open Climate command
            </Button>
            {climateFault ? (
              <p className="dsc-honesty">
                <StatusChip label="Climate fault" tone="bad" /> Do not invent Got.
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
              Room {fmtHeld(roomT.value)} °C · VPD {fmtHeld(tentVpd.value, 2)} kPa
              {tentVpd.stale || roomT.stale ? " · HELD" : ""}
            </div>
            <Kpi
              label="Surface"
              value={state("sensor.dsc_ha_surface_version", "7.1.1")}
              sub={`Fleet ${fleet}`}
              tone="ok"
            />
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Lung CFM" icon="climate">
            <div className="dsc-chip-row">
              <CfmProvenanceBadge reading={outCfm} />
              <button type="button" className="dsc-chip" onClick={() => navigate("/live/climate")}>
                OUT {Number.isFinite(outCfm.value) ? Math.round(outCfm.value) : "—"} cfm → Climate
              </button>
            </div>
          </Card>
        </div>

        <div className="dsc-col-12">
          <Card className="dsc-glass" title="Plant seats" icon="seat">
            <div className="dsc-chip-row">
              {seats.map((s) => {
                const oos = !isPotInService(s.pot, state);
                const trust = readPotTrust(s.pot, state);
                const glow = !oos && !trust.blockNeedAct && s.need && s.need !== "—" && s.need !== "ok";
                return (
                  <button
                    key={s.pot}
                    type="button"
                    className={`dsc-chip${oos ? "" : " dsc-chip--ok"}${glow ? " dsc-chip--pulse" : ""}`}
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("dsc-dash-select-pot", { detail: { pot: s.pot } }))
                    }
                    title={oos ? "OOS — no fake Got" : s.need}
                  >
                    <VesselGlyph spec={readPotVessel(s.pot, state, entity)} size={18} />
                    P{s.pot} {s.plantName !== "—" ? s.plantName : "—"} · Got M {oos ? "—" : s.moisture}
                    {oos ? " · OOS" : ` · Need ${s.need}`}
                    {trust.labels.length ? ` · ${trust.labels.join("/")}` : ""}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className={`dsc-glass${autoDriven ? " is-auto" : ""}`} title="Command" icon="climate">
            <p className="dsc-honesty" style={{ marginTop: 0 }}>
              Full Auto, strategy, fans, and demands live on Climate — Mission is triage.
            </p>
            <Button primary onClick={() => navigate("/live/climate")}>
              Open Climate
            </Button>
          </Card>
        </div>

        <div className="dsc-col-6">
          <Card className="dsc-glass" title="Pot ESP-NOW" icon="root">
            <div className="dsc-chip-row">
              {activePotNumbers(state).map((n) => {
                const id = `binary_sensor.dsc_hub_pot${n}_esp_now_link`;
                const on = state(id) === "on";
                return (
                  <StatusChip key={n} label={`P${n} ${on ? "ON" : "OFF"}`} tone={on ? "ok" : "muted"} />
                );
              })}
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
