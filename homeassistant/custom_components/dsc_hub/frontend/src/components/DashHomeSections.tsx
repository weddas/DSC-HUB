import { Card, Kpi, StatusChip } from "./ui";
import { ArcGauge, Sparkline } from "../viz/charts";
import { rhSegments, rootSegments, tempSegments, vpdSegments, moistureSegments } from "../viz/gaugeTheme";
import type { BandChartKind } from "./BandChartHost";
import { useHistory } from "../hooks/useHistory";
import { useZoneFocus, type ZoneFocus } from "../hooks/useZoneFocus";
import { get_grow_log, type GrowLogEvent } from "../lib/fleetApi";
import { useEffect, useState, type ReactNode } from "react";
import { ALERT_ENTITY_IDS } from "../lib/alertPlaybook";
import type { RosterSlot } from "../lib/seatModel";
import type { CfmReading } from "../lib/cfmProvenance";

type Bus = {
  state: (id: string, fb?: string) => string;
  num: (id: string, fb?: number) => number;
  available: (id: string) => boolean;
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined;
};

export function fmtUptime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  if (seconds >= 86400) return `${(seconds / 86400).toFixed(1)}d`;
  if (seconds >= 3600) return `${(seconds / 3600).toFixed(1)}h`;
  return `${Math.round(seconds / 60)}m`;
}

function bandDelta(val: number, lo: number, hi: number): string {
  if (!Number.isFinite(val) || !Number.isFinite(lo) || !Number.isFinite(hi)) return "?—";
  if (val < lo) return `↓ low ${(val - lo).toFixed(2)}`;
  if (val > hi) return `↑ high +${(val - hi).toFixed(2)}`;
  return "→ on target";
}

export function DashNowStrip({
  hubOnline,
  panelOk,
  panelHaOnly,
  panelOffline,
  heartbeat,
  beatOk,
  uptimeSec,
  alerts,
  fleetStatus,
  fleetExpected,
  cannalibOnline,
  cannalibHits,
  cannalibSummary,
  inServiceLabel,
  activeFaultCount,
  onChip,
}: {
  hubOnline: boolean;
  panelOk: boolean;
  panelHaOnly: boolean;
  panelOffline: boolean;
  heartbeat: string;
  beatOk: boolean;
  uptimeSec: number;
  alerts: number;
  fleetStatus: string;
  fleetExpected: string;
  cannalibOnline: boolean;
  cannalibHits: number;
  cannalibSummary: string;
  inServiceLabel: string;
  activeFaultCount: number;
  onChip?: (entityId: string, label: string) => void;
}) {
  return (
    <div className="dsc-status-strip">
      <StatusChip icon={hubOnline ? "ok" : "alert"} label={hubOnline ? "HUB ONLINE" : "HUB OFFLINE"} tone={hubOnline ? "ok" : "bad"} onClick={() => onChip?.("sensor.dsc_hub_uptime", "Hub")} />
      <StatusChip
        label={panelOk ? "PANEL ESP-NOW" : panelHaOnly ? "PANEL HA-ONLY" : panelOffline ? "PANEL OFFLINE" : "PANEL…"}
        tone={panelOk ? "ok" : panelHaOnly ? "warn" : "bad"}
        onClick={() => onChip?.("binary_sensor.dsc_hub_panel_link", "Panel")}
      />
      <StatusChip icon={beatOk ? "ok" : "alert"} label={beatOk ? `BEAT ${heartbeat}` : "NO BEAT"} tone={beatOk ? "ok" : "bad"} onClick={() => onChip?.("sensor.dsc_hub_heartbeat", "Beat")} />
      <StatusChip label={fmtUptime(uptimeSec)} tone={hubOnline ? "ok" : "muted"} />
      <StatusChip
        icon={activeFaultCount === 0 ? "ok" : "alert"}
        label={activeFaultCount === 0 ? "All clear" : `${activeFaultCount} alert(s)`}
        tone={activeFaultCount === 0 ? "ok" : "bad"}
        pulse={activeFaultCount > 0}
        onClick={() => onChip?.("sensor.dsc_active_alert_count", "Alerts")}
      />
      <StatusChip
        label={fleetStatus === "ok" ? `FLEET ${fleetExpected}` : "FLEET DRIFT"}
        tone={fleetStatus === "ok" ? "ok" : "warn"}
        onClick={() => onChip?.("sensor.dsc_fleet_version_status", "Fleet")}
      />
      <StatusChip
        label={cannalibOnline ? `CANNALIB ${cannalibHits} hits` : "CANNALIB OFF"}
        tone={cannalibOnline ? "ok" : "bad"}
        onClick={() => onChip?.("sensor.dsc_cannalib_api_hits", "Cannalib")}
      />
      <StatusChip label={cannalibOnline ? cannalibSummary : "— MB"} tone={cannalibOnline ? "muted" : "muted"} />
      <StatusChip label={inServiceLabel} tone="muted" />
    </div>
  );
}

export function DashCannalibTiles({ bus }: { bus: Bus }) {
  const { num, available } = bus;
  const online = bus.state("binary_sensor.dsc_cannalib_api_online") === "on";
  const tiles = [
    { label: "Hits", id: "sensor.dsc_cannalib_api_hits", fmt: (v: number) => String(Math.round(v)) },
    { label: "Bandwidth in", id: "sensor.dsc_cannalib_bytes_in", fmt: (v: number) => `${(v / 1024).toFixed(1)} KB` },
    { label: "Bandwidth out", id: "sensor.dsc_cannalib_bytes_out", fmt: (v: number) => `${(v / 1024).toFixed(1)} KB` },
    { label: "Corpus strains", id: "sensor.dsc_cannalib_corpus_strains", fmt: (v: number) => String(Math.round(v)) },
  ];
  return (
    <Card className="dsc-glass" title="Cannalib catalog API" icon="research">
      <div className="dsc-chip-row">
        {tiles.map((t) => (
          <Kpi
            key={t.id}
            label={t.label}
            value={online && available(t.id) ? t.fmt(num(t.id, 0)) : "—"}
            tone={online ? "ok" : "muted"}
          />
        ))}
      </div>
    </Card>
  );
}

export function DashConditionalBanners({ bus, onNavigate }: { bus: Bus; onNavigate: (path: string) => void }) {
  const { state, entity } = bus;
  const banners: { show: boolean; title: string; body: string; tone: "warn" | "bad" | "muted" }[] = [];
  if (state("binary_sensor.dsc_reduced_kit") === "on") {
    const attrs = entity("binary_sensor.dsc_reduced_kit")?.attributes || {};
    banners.push({
      show: true,
      title: "Unexpected OOS — capacity offline",
      body: `${attrs.offline || "a live lever is parked"} — Full Auto uses next-best in-service levers. Planned holes (${attrs.planned_oos || "—"}) are inventory, not this card.`,
      tone: "warn",
    });
  }
  if (state("switch.dsc_hub_manual_takeover") === "on") {
    banners.push({ show: true, title: "MASTER MANUAL TAKEOVER ACTIVE", body: "Automation frozen — hub obeys HA only", tone: "warn" });
  }
  if (state("switch.dsc_hub_tent_manual_override") === "on") {
    banners.push({ show: true, title: "MANUAL FAN OVERRIDE ACTIVE", body: "Fan values held — photoperiod still driving the SF1000", tone: "warn" });
  }
  if (state("binary_sensor.dsc_clone_dark_period_violation") === "on") {
    banners.push({ show: true, title: "LIGHT ON IN 2x4 DARK PERIOD", body: "SF1000 commanded on outside the clone window — herm risk", tone: "bad" });
  }
  if (state("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on") {
    banners.push({ show: true, title: "ROOT-ZONE PROBES OFFLINE", body: "Grow mat fell back to clone-air control (v2.3 behaviour)", tone: "warn" });
  }
  if (!banners.length) return null;
  return (
    <div className="dsc-stack">
      {banners.map((b) => (
        <div key={b.title} className={`dsc-banner dsc-banner--${b.tone}`}>
          <strong>{b.title}</strong>
          <p className="dsc-muted">{b.body}</p>
          {b.title.includes("OOS") ? (
            <button type="button" className="dsc-chip" onClick={() => onNavigate("/live/climate")}>
              Open Climate
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function DashActiveAlerts({ bus, activeIds, onAlert }: { bus: Bus; activeIds: string[]; onAlert: (id: string) => void }) {
  if (!activeIds.length) return null;
  return (
    <Card className="dsc-glass" title="Active system alerts" icon="alert">
      <ul className="dsc-fault-list">
        {activeIds.map((id) => (
          <li key={id}>
            <StatusChip
              label={id.split(".").pop()?.replace(/dsc_/, "").replace(/_/g, " ") || id}
              tone="bad"
              pulse
              icon="alert"
              onClick={() => onAlert(id)}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function DashEspLinkChips({ bus, onNavigate }: { bus: Bus; onNavigate: (path: string) => void }) {
  return (
    <div className="dsc-chip-row">
      {[1, 2, 3, 4].map((n) => {
        const on = bus.state(`binary_sensor.dsc_hub_pot${n}_esp_now_link`) === "on";
        return (
          <StatusChip
            key={n}
            label={`P${n} ${on ? "ESP" : "HA"}`}
            tone={on ? "ok" : "muted"}
            onClick={() => onNavigate("/live/root")}
          />
        );
      })}
    </div>
  );
}

export function DashRunningChips({ bus }: { bus: Bus }) {
  const { state, num } = bus;
  const matT = num("sensor.dsc_coldest_root_zone_temp", NaN);
  const matPot = String(bus.entity("sensor.dsc_coldest_root_zone_temp")?.attributes?.pot || "");
  const sfEntity = bus.entity("light.dsc_hub_sf1000_dimmer");
  const sfBri = Math.round((Number(sfEntity?.attributes?.brightness ?? 0) / 255) * 100);
  const sfOn = state("light.dsc_hub_sf1000_dimmer") === "on" && sfBri >= 1;
  const sfPct = sfBri;
  const acOos = state("binary_sensor.dsc_ac_capacity_offline") === "on";
  const chumOos = state("binary_sensor.dsc_clone_humidifier_capacity_offline") === "on";
  const dehumOffline = !bus.available("switch.dsc_de_humidifier_main_relay");
  const rootFault = state("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on";
  const darkViol = state("binary_sensor.dsc_clone_dark_period_violation") === "on";
  const chips = [
    { label: "Heat", on: state("switch.dsc_hub_heater_demand") === "on", tone: state("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted" },
    { label: acOos ? "Cool ○" : "Cool", on: state("switch.dsc_hub_ac_demand") === "on", tone: acOos ? "warn" : state("switch.dsc_hub_ac_demand") === "on" ? "ok" : "muted" },
    { label: "Hum", on: state("switch.dsc_hub_humidifier_demand") === "on", tone: state("switch.dsc_hub_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: dehumOffline ? "Dehum offline" : "Dehum", on: state("switch.dsc_hub_dehumidifier_demand") === "on", tone: dehumOffline ? "bad" : state("switch.dsc_hub_dehumidifier_demand") === "on" ? "ok" : "muted" },
    {
      label: Number.isFinite(matT) ? `Mat ${matT.toFixed(1)}°C${matPot && matPot !== "none" ? ` P${matPot}` : ""}` : "Mat",
      on: state("switch.dsc_hub_grow_mat_demand") === "on",
      tone: rootFault ? "bad" : state("switch.dsc_hub_grow_mat_demand") === "on" ? "ok" : "muted",
    },
    { label: chumOos ? "C-Hum ○" : "C-Hum", on: state("switch.dsc_hub_clone_humidifier_demand") === "on", tone: chumOos ? "warn" : state("switch.dsc_hub_clone_humidifier_demand") === "on" ? "ok" : "muted" },
    { label: sfOn ? `SF ${sfPct}%` : "SF1000", on: sfOn, tone: darkViol ? "bad" : sfOn ? "ok" : "muted" },
  ];
  return (
    <Card className="dsc-glass" title="Running" icon="lighting">
      <div className="dsc-chip-row">
        {chips.map((c) => (
          <StatusChip key={c.label} label={c.label} tone={c.tone as "ok" | "warn" | "bad" | "muted"} motion={c.on ? "duty" : undefined} />
        ))}
      </div>
    </Card>
  );
}

export function DashFanChips({ bus, onNavigate }: { bus: Bus; onNavigate: (path: string) => void }) {
  const ids = [
    ["IN 4×8", "sensor.dsc_fan_intake_main_pct"],
    ["IN 2×4", "sensor.dsc_fan_intake_2x4_pct"],
    ["EX ROOM", "sensor.dsc_fan_exhaust_room_pct"],
    ["EX OUT", "sensor.dsc_fan_exhaust_outside_pct"],
  ] as const;
  return (
    <div className="dsc-chip-row">
      {ids.map(([label, id]) => {
        const pct = Math.round(bus.num(id, 0));
        return (
          <StatusChip
            key={id}
            label={`${label} ${pct}%`}
            tone={pct > 0 ? "ok" : "muted"}
            motion={pct > 0 ? "fan" : undefined}
            onClick={() => onNavigate("/live/climate")}
          />
        );
      })}
    </div>
  );
}

function fmtReading(raw: string, fb: number): string {
  const n = Number(raw);
  if (Number.isFinite(n)) return n.toFixed(1);
  const f = Number(fb);
  return Number.isFinite(f) ? f.toFixed(1) : raw;
}

export function DashOperationalNow({ bus, onNavigate }: { bus: Bus; onNavigate: (path: string) => void }) {
  const { state, num } = bus;
  const follow = state("select.dsc_hub_clone_mode") === "Follow 4x8";
  const pri = state("select.dsc_hub_priority_tent", "—");
  const mode =
    state("switch.dsc_hub_manual_takeover") === "on"
      ? "Takeover"
      : state("switch.dsc_hub_tent_manual_override") === "on"
        ? "Fan override"
        : state("switch.dsc_hub_tent_full_auto_mode") === "on"
          ? "Full Auto"
          : "Standby";
  const tentT = fmtReading(state("sensor.dsc_hub_tent_temperature", "—"), num("sensor.dsc_hub_tent_temperature", NaN));
  const tentRh = fmtReading(state("sensor.dsc_hub_tent_humidity", "—"), num("sensor.dsc_hub_tent_humidity", NaN));
  const tentVpd = num("sensor.dsc_hub_vpd_kpa", NaN);
  const cloneT = fmtReading(state("sensor.dsc_hub_clone_temperature", "—"), num("sensor.dsc_hub_clone_temperature", NaN));
  const cloneRh = fmtReading(state("sensor.dsc_hub_clone_humidity", "—"), num("sensor.dsc_hub_clone_humidity", NaN));
  const cloneVpd = num("sensor.dsc_hub_clone_vpd_kpa", NaN);
  const vLo = follow ? num("number.dsc_hub_vpd_target_min", 0.8) : num("number.dsc_hub_clone_vpd_min", 0.6);
  const vHi = follow ? num("number.dsc_hub_vpd_target_max", 1.4) : num("number.dsc_hub_clone_vpd_max", 1.2);
  const fire = [
    ["Hum", "sensor.dsc_hub_humidifier_fire_countdown", "switch.dsc_hub_humidifier_demand"],
    ["Dehum", "sensor.dsc_hub_dehumidifier_fire_countdown", "switch.dsc_hub_dehumidifier_demand"],
    ["Heat", "sensor.dsc_hub_heater_fire_countdown", "switch.dsc_hub_heater_demand"],
    ["AC", "sensor.dsc_hub_ac_fire_countdown", "switch.dsc_hub_ac_demand"],
    ["Mat", "sensor.dsc_hub_grow_mat_fire_countdown", "switch.dsc_hub_grow_mat_demand"],
  ] as const;
  const outPct = Math.round(bus.num("sensor.dsc_fan_exhaust_outside_pct", 0));
  const recPct = Math.round(bus.num("sensor.dsc_fan_exhaust_room_pct", 0));
  return (
    <Card className="dsc-glass" title="Operational now" icon="climate">
      <div className="dsc-chip-row" style={{ marginBottom: 10 }}>
        <StatusChip label={state("select.dsc_hub_grow_stage", "—")} tone="ok" />
        <StatusChip label={state("select.dsc_hub_clone_mode", "—")} tone="ok" />
        <StatusChip label={state("select.dsc_hub_control_strategy", "—")} tone="muted" />
        <StatusChip label={`Priority ${pri}`} tone="muted" />
        <StatusChip label={mode} tone={mode === "Full Auto" ? "ok" : mode === "Standby" ? "muted" : "warn"} />
      </div>
      <p className="dsc-muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
        <strong>4×8</strong> {tentT}°C / {tentRh}% / VPD {Number.isFinite(tentVpd) ? tentVpd.toFixed(2) : "—"} (
        {bandDelta(tentVpd, num("number.dsc_hub_vpd_target_min", 0.8), num("number.dsc_hub_vpd_target_max", 1.4))}) · band{" "}
        {state("number.dsc_hub_vpd_target_min")}–{state("number.dsc_hub_vpd_target_max")}
        <br />
        <strong>2×4</strong> {cloneT}°C / {cloneRh}% / VPD {Number.isFinite(cloneVpd) ? cloneVpd.toFixed(2) : "—"}
        {follow ? " (follows 4×8 bands)" : ""} ({bandDelta(cloneVpd, vLo, vHi)})
        <br />
        Room appliances chase <strong>{pri}</strong> bands.
      </p>
      <div className="dsc-chip-row" style={{ marginTop: 10 }}>
        {fire.map(([label, id, demand]) => {
          const live = state(demand) === "on";
          const cd = Math.round(bus.num(id, 0));
          const text = live ? `${label} live` : cd > 0 ? `${label} ${cd}s` : `${label} idle`;
          return (
            <StatusChip
              key={id}
              label={text}
              tone={live ? "ok" : cd > 0 ? "warn" : "muted"}
              motion={live ? "duty" : cd > 0 ? "breathe" : undefined}
              onClick={() => onNavigate("/live/climate")}
            />
          );
        })}
        <StatusChip
          label={`Fans ${outPct}/${recPct}%`}
          tone={outPct > 0 || recPct > 0 ? "ok" : "muted"}
          motion={outPct > 0 || recPct > 0 ? "fan" : undefined}
          onClick={() => onNavigate("/live/climate")}
        />
      </div>
    </Card>
  );
}

function BandGaugeCell({
  entityId,
  sparkColor,
  zone,
  gauge,
}: {
  entityId: string;
  sparkColor: string;
  zone?: "main" | "clone" | "room" | "root";
  gauge: ReactNode;
}) {
  const { points } = useHistory(entityId, 24, 96);
  return (
    <div className={`dsc-band-cell${zone ? ` dsc-band-cell--${zone}` : ""}`}>
      {gauge}
      <Sparkline series={points} color={sparkColor} width={110} height={26} />
    </div>
  );
}

const BAND_FOCUS: { id: ZoneFocus; label: string }[] = [
  { id: "compare", label: "All" },
  { id: "main", label: "4×8" },
  { id: "clone", label: "2×4" },
  { id: "room", label: "Room" },
];

export function DashBandsGrid({
  readings,
  onChartOpen,
}: {
  readings: {
    tentT: number;
    tentRh: number;
    tentVpd: number;
    cloneT: number;
    cloneRh: number;
    cloneVpd: number;
    roomT: number;
    roomRh: number;
    rootT: number;
    targetTemp: number;
    rhMin: number;
    rhMax: number;
    vpdMin: number;
    vpdMax: number;
    cloneTargetTemp: number;
    cloneRhMin: number;
    cloneRhMax: number;
    cloneVpdMin: number;
    cloneVpdMax: number;
    matLo: number;
    matHi: number;
    stale: Record<string, boolean>;
  };
  onChartOpen: (kind: BandChartKind) => void;
}) {
  const r = readings;
  const { focus, setFocus } = useZoneFocus();
  const rowLit = (id: ZoneFocus) =>
    focus === "compare" || focus === id ? "dsc-gauge-row-3 is-lit" : "dsc-gauge-row-3";

  return (
    <Card className="dsc-glass" title="Bands" icon="gauge">
      <div className="dsc-tent-segment" style={{ marginBottom: 10 }}>
        {BAND_FOCUS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={focus === o.id ? "is-active" : ""}
            data-tent={o.id === "main" ? "main" : o.id === "clone" ? "clone" : o.id === "compare" ? "compare" : "room"}
            onClick={() => setFocus(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="dsc-gauge-matrix dsc-gauge-matrix--bands">
        <div className={rowLit("main")}>
          <span className="dsc-gauge-row-tag">4×8</span>
          <BandGaugeCell
            entityId="sensor.dsc_hub_tent_temperature"
            sparkColor="#f97316"
            zone="main"
            gauge={
              <ArcGauge label="4×8 T" value={r.tentT} min={10} max={40} unit="°C" target={r.targetTemp} segments={tempSegments(r.targetTemp)} stale={r.stale.tentT} onClick={() => onChartOpen("temp")} />
            }
          />
          <BandGaugeCell
            entityId="sensor.dsc_hub_tent_humidity"
            sparkColor="#38bdf8"
            zone="main"
            gauge={
              <ArcGauge label="4×8 RH" value={r.tentRh} min={0} max={100} unit="%" band={{ min: r.rhMin, max: r.rhMax }} segments={rhSegments(r.rhMin, r.rhMax)} stale={r.stale.tentRh} onClick={() => onChartOpen("rh")} />
            }
          />
          <BandGaugeCell
            entityId="sensor.dsc_hub_vpd_kpa"
            sparkColor="#a78bfa"
            zone="main"
            gauge={
              <ArcGauge label="4×8 VPD" value={r.tentVpd} min={0} max={2.5} unit="kPa" band={{ min: r.vpdMin, max: r.vpdMax }} segments={vpdSegments(r.vpdMin, r.vpdMax)} stale={r.stale.tentVpd} onClick={() => onChartOpen("vpd")} />
            }
          />
        </div>
        <div className={rowLit("clone")}>
          <span className="dsc-gauge-row-tag">2×4</span>
          <BandGaugeCell
            entityId="sensor.dsc_hub_clone_temperature"
            sparkColor="#22c55e"
            zone="clone"
            gauge={
              <ArcGauge label="2×4 T" value={r.cloneT} min={10} max={40} unit="°C" target={r.cloneTargetTemp} segments={tempSegments(r.cloneTargetTemp)} stale={r.stale.cloneT} onClick={() => onChartOpen("temp")} />
            }
          />
          <BandGaugeCell
            entityId="sensor.dsc_hub_clone_humidity"
            sparkColor="#2dd4bf"
            zone="clone"
            gauge={
              <ArcGauge label="2×4 RH" value={r.cloneRh} min={0} max={100} unit="%" band={{ min: r.cloneRhMin, max: r.cloneRhMax }} segments={rhSegments(r.cloneRhMin, r.cloneRhMax)} stale={r.stale.cloneRh} onClick={() => onChartOpen("rh")} />
            }
          />
          <BandGaugeCell
            entityId="sensor.dsc_hub_clone_vpd_kpa"
            sparkColor="#818cf8"
            zone="clone"
            gauge={
              <ArcGauge label="2×4 VPD" value={r.cloneVpd} min={0} max={2} unit="kPa" band={{ min: r.cloneVpdMin, max: r.cloneVpdMax }} segments={vpdSegments(r.cloneVpdMin, r.cloneVpdMax)} stale={r.stale.cloneVpd} onClick={() => onChartOpen("vpd")} />
            }
          />
        </div>
        <div className={rowLit("room")}>
          <span className="dsc-gauge-row-tag">Room</span>
          <BandGaugeCell
            entityId="sensor.dsc_hub_room_temperature"
            sparkColor="#94a3b8"
            zone="room"
            gauge={
              <ArcGauge label="Room T" value={r.roomT} min={10} max={40} unit="°C" target={r.targetTemp} segments={tempSegments(r.targetTemp)} stale={r.stale.roomT} onClick={() => onChartOpen("temp")} />
            }
          />
          <BandGaugeCell
            entityId="sensor.dsc_hub_room_humidity"
            sparkColor="#64748b"
            zone="room"
            gauge={
              <ArcGauge label="Room RH" value={r.roomRh} min={0} max={100} unit="%" band={{ min: r.rhMin, max: r.rhMax }} segments={rhSegments(r.rhMin, r.rhMax)} stale={r.stale.roomRh} onClick={() => onChartOpen("rh")} />
            }
          />
          <BandGaugeCell
            entityId="sensor.dsc_coldest_root_zone_temp"
            sparkColor="#fbbf24"
            zone="root"
            gauge={
              <ArcGauge label="Root" value={r.rootT} min={10} max={32} unit="°C" band={{ min: r.matLo, max: r.matHi }} segments={rootSegments(r.matLo, r.matHi)} stale={r.stale.rootT} onClick={() => onChartOpen("root")} />
            }
          />
        </div>
      </div>
    </Card>
  );
}

export function DashTodaySection({ bus }: { bus: Bus }) {
  const { num, state } = bus;
  const humCycles = Math.round(num("sensor.dsc_humidifier_cycles_last_hour", 0));
  const humTone = humCycles > 6 ? "bad" : humCycles > 3 ? "warn" : "ok";
  return (
    <Card className="dsc-glass" title="Today" icon="lighting">
      <div className="dsc-chip-row">
        <StatusChip
          label={`4×8 ${num("sensor.dsc_lights_on_today_4x8", 0).toFixed(1)}h / ${Math.round(num("sensor.dsc_expected_light_hours", 12))}h`}
          tone={state("binary_sensor.dsc_hub_4x8_window_open") === "on" ? "ok" : "muted"}
          onClick={() => {}}
        />
        <StatusChip
          label={`2×4 ${num("sensor.dsc_lights_on_today_2x4", 0).toFixed(1)}h / ${Math.round(num("sensor.dsc_clone_expected_light_hours", 12))}h`}
          tone={state("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "bad" : "ok"}
        />
        <StatusChip label={`Heat ${num("sensor.dsc_heater_runtime_today", 0).toFixed(1)}h`} tone={state("switch.dsc_hub_heater_demand") === "on" ? "ok" : "muted"} />
        <StatusChip label={`Hum ${humCycles}/h`} tone={humTone} />
      </div>
    </Card>
  );
}

export function DashRootTankSection({
  bus,
  rosterSlots,
  onNavigate,
  onPot,
  onPotChart,
}: {
  bus: Bus;
  rosterSlots: RosterSlot[];
  onNavigate: (path: string) => void;
  onPot: (n: number) => void;
  onPotChart: (kind: BandChartKind) => void;
}) {
  const { state, num } = bus;
  const moistBand = { min: 30, max: 70 };
  return (
    <Card className="dsc-glass" title="Root & tank" icon="root">
      <div className="dsc-chip-row">
        {[1, 2, 3, 4].map((n) => {
          const name = state(`text.dsc_pot${n}_plant_name`, "—");
          const clean = !name || name === "unknown" || name === "unavailable" ? "—" : name;
          return (
            <StatusChip key={n} label={`P${n} ${clean}`} tone={n === 3 ? "muted" : "ok"} onClick={() => onPot(n)} />
          );
        })}
      </div>
      {rosterSlots.some((s) => s.pot && s.pot !== "none") ? (
        <div className="dsc-muted" style={{ fontSize: 13, margin: "8px 0" }}>
          {["1", "2", "3", "4"].map((p) => {
            const slot = rosterSlots.find((s) => String(s.pot) === p);
            if (!slot) return null;
            return (
              <div key={p}>
                <strong>POT{p} roster:</strong> {slot.nickname || slot.strain || `slot ${slot.slot}`}
                {slot.blend ? ` · ${slot.blend}` : ""}
              </div>
            );
          })}
        </div>
      ) : null}
      <div className="dsc-gauge-matrix dsc-gauge-matrix--pots">
        {[1, 2, 3, 4].map((n) => (
          <ArcGauge
            key={n}
            label={`P${n}`}
            value={num(`sensor.dsc_pot${n}_soil_moisture`, NaN)}
            min={0}
            max={100}
            unit="%"
            band={moistBand}
            segments={moistureSegments()}
            onClick={() => onPotChart(`pot${n}` as BandChartKind)}
          />
        ))}
      </div>
      <div className="dsc-chip-row" style={{ marginTop: 10 }}>
        {bus.available("sensor.water_tester_ph_current") ? (
          <StatusChip label={`pH ${state("sensor.water_tester_ph_current")}`} tone="ok" onClick={() => onNavigate("/fleet")} />
        ) : null}
        <StatusChip label={`EC ${state("sensor.dsc_tank_ec_normalized", "—")}`} tone="muted" />
        {bus.available("sensor.water_tester_temperature") ? (
          <StatusChip
            label={`${state("sensor.water_tester_temperature")}°C${num("sensor.water_tester_temperature", 0) > 24 ? " ⚠ PYTHIUM" : ""}`}
            tone={num("sensor.water_tester_temperature", 0) > 24 ? "bad" : "ok"}
          />
        ) : null}
        <StatusChip label="Open Root Zone" tone="ok" onClick={() => onNavigate("/live/root")} />
      </div>
    </Card>
  );
}

export function DashGrowLog({ bus }: { bus: Bus }) {
  const { state } = bus;
  const [events, setEvents] = useState<GrowLogEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      void get_grow_log(24, 80).then((rows) => {
        if (!cancelled) {
          setEvents(rows);
          setLoading(false);
        }
      });
    };

    load();
    const timer = window.setInterval(load, 45_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [state("select.dsc_hub_grow_stage"), state("switch.dsc_hub_dehumidifier_demand")]);

  const fallback = [
    state("select.dsc_hub_grow_stage") !== "—" ? `Stage · ${state("select.dsc_hub_grow_stage")}` : null,
    state("binary_sensor.dsc_clone_dark_period_violation") === "on" ? "Dark period violation" : null,
  ].filter(Boolean) as string[];

  return (
    <Card className="dsc-glass" title="Grow log" icon="roster">
      {loading && events.length === 0 ? <p className="dsc-muted">Loading…</p> : null}
      {events.length ? (
        <ul className="dsc-grow-log">
          {events.map((ev) => (
            <li key={ev.id}>
              <time className="dsc-muted" dateTime={new Date(ev.ts * 1000).toISOString()}>
                {new Date(ev.ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </time>{" "}
              {ev.message}
            </li>
          ))}
        </ul>
      ) : fallback.length ? (
        <ul className="dsc-grow-log">
          {fallback.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : (
        <p className="dsc-muted">No operational events yet today.</p>
      )}
    </Card>
  );
}

export function activeAlertIds(state: (id: string, fb?: string) => string, isSnoozed: (id: string) => boolean): string[] {
  return ALERT_ENTITY_IDS.filter((id) => state(id) === "on" && !isSnoozed(id));
}

export type { CfmReading };
