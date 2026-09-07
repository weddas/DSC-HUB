import { useEntityBus } from "../hooks/useEntityBus";
import { useFleet } from "../hooks/useFleet";
import { useHistory } from "../hooks/useHistory";
import type { ZoneModel } from "../hooks/useZones";
import { resolveCfm } from "../lib/cfmProvenance";
import { slopePerHour } from "../lib/derived/climate";
import { inventoryInService } from "../lib/fleetModel";
import { FanGlyph } from "./DutyBars";
import { Icon } from "./ui";
import { Tooltip, TipRow } from "./Tooltip";
import { applianceIcon } from "../lib/deviceIcons";

type TileState = "on" | "idle" | "armed" | "oos" | "offline";

interface Tile {
  id: string;
  name: string;
  state: TileState;
  stateLabel: string;
  /** The big line: `↓ RH`, `86 %`, `184 CFM`, `↑ ROOT`. */
  big: string;
  sub: string;
  tone: "ok" | "muted" | "warn" | "bad" | "lamp" | "teal";
  entityId: string;
  kind: "binary" | "numeric";
  glyph?: "fan" | "heat";
  fanPct?: number;
}

/** Three wavy strokes rising off the mat — only while the mat is on. */
export function HeatLines({ on, size = 22 }: { on: boolean; size?: number }) {
  return (
    <svg className={`dsc-heat${on ? " is-on" : ""}`} width={size} height={size} viewBox="0 0 22 22" aria-hidden="true">
      {[4, 11, 18].map((x, i) => (
        <path
          key={x}
          className="dsc-heat-line"
          style={{ animationDelay: `${i * 0.5}s` }}
          d={`M${x} 20 C ${x - 2} 16, ${x + 2} 12, ${x} 8 S ${x - 2} 2, ${x} 0`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function minutesToTarget(value: number, target: number, slope: number | null): string | null {
  if (slope == null || !Number.isFinite(value) || !Number.isFinite(target)) return null;
  const gap = target - value;
  if (Math.abs(gap) < 0.05) return "there";
  if ((gap < 0 && slope >= 0) || (gap > 0 && slope <= 0)) return null; // not moving the right way
  const mins = Math.round((Math.abs(gap) / Math.abs(slope)) * 60);
  if (mins > 24 * 60) return null;
  return mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`;
}

/**
 * Equipment · pulling toward setpoint (frame 1d): each appliance shows state, the
 * direction it pulls, and what it is doing right now (`pulling 61 → 58 · 14 min` from the
 * observed slope; `arms below 56 %` when idle). Out-of-service tiles stay dashed.
 */
export function EquipmentTiles({
  zone,
  onOpen,
}: {
  zone: ZoneModel;
  onOpen: (entityId: string, label: string, kind: "binary" | "numeric", unit?: string) => void;
}) {
  const { state, num, available } = useEntityBus();
  const fleet = useFleet();
  const rhHist = useHistory(zone.rh.entityId, 2, 48);
  const tHist = useHistory(zone.temp.entityId, 2, 48);
  const rhSlope = slopePerHour(rhHist.points, 3600);
  const tSlope = slopePerHour(tHist.points, 3600);
  const on = (id: string) => state(id) === "on";
  const rhMin = zone.rh.band?.min;
  const rhMax = zone.rh.band?.max;
  const tMin = zone.temp.band?.min;
  const tiles: Tile[] = [];

  // Lights
  if (zone.lamp) {
    const l = zone.lamp;
    const name = l.kind === "twin" ? "Twin SF1000" : l.kind === "window" ? "Photoperiod" : "Lights";
    tiles.push({
      id: "lights",
      name,
      state: !l.available ? "offline" : l.on ? "on" : "idle",
      stateLabel: !l.available ? "—" : l.on ? "ON" : "OFF",
      big: l.on ? (l.brightnessPct != null ? `${l.brightnessPct} %` : "ON") : "OFF",
      sub:
        l.kind === "window"
          ? "schedule window — no lamp is bound to the 4×8"
          : l.ppfd != null
            ? `${Math.round(l.ppfd)} PPFD from calibration${zone.lightHours != null ? ` · ${zone.lightHours} h rail` : ""}`
            : zone.lightHours != null
              ? `${zone.lightHours} h rail`
              : "no rail",
      tone: l.on ? "lamp" : "muted",
      entityId: l.entityId,
      kind: "binary",
    });
  }

  if (zone.id === "main") {
    const dehumOffline = !available("switch.dsc_de_humidifier_main_relay");
    const dehumOn = on("switch.dsc_hub_dehumidifier_demand");
    const eta = rhMax != null ? minutesToTarget(zone.rh.value, rhMax, rhSlope) : null;
    tiles.push({
      id: "dehum",
      name: "Dehumidifier",
      state: dehumOffline ? "offline" : dehumOn ? "on" : "idle",
      stateLabel: dehumOffline ? "OFFLINE" : dehumOn ? "ON" : "IDLE",
      big: "↓ RH",
      sub: dehumOffline
        ? "relay not reporting"
        : dehumOn
          ? rhMax != null && zone.rh.available
            ? `pulling ${zone.rh.value.toFixed(0)} → ${Math.round(rhMax)}${eta ? ` · ${eta}` : rhSlope != null && rhSlope >= 0 ? " · not falling yet" : ""}`
            : "demand on"
          : rhMax != null
            ? `arms above ${Math.round(rhMax)} %`
            : "no RH rail",
      tone: dehumOffline ? "bad" : dehumOn ? "ok" : "muted",
      entityId: "switch.dsc_hub_dehumidifier_demand",
      kind: "binary",
    });
    const humOn = on("switch.dsc_hub_humidifier_demand");
    const humEta = rhMin != null ? minutesToTarget(zone.rh.value, rhMin, rhSlope) : null;
    tiles.push({
      id: "hum",
      name: "Humidifier",
      state: humOn ? "on" : "idle",
      stateLabel: humOn ? "ON" : "IDLE",
      big: "↑ RH",
      sub: humOn
        ? rhMin != null && zone.rh.available
          ? `pushing ${zone.rh.value.toFixed(0)} → ${Math.round(rhMin)}${humEta ? ` · ${humEta}` : ""}`
          : "demand on"
        : rhMin != null
          ? `arms below ${Math.round(rhMin)} %`
          : "no RH rail",
      tone: humOn ? "ok" : "muted",
      entityId: "switch.dsc_hub_humidifier_demand",
      kind: "binary",
    });
    const heatOn = on("switch.dsc_hub_heater_demand");
    const heatEta = tMin != null ? minutesToTarget(zone.temp.value, tMin, tSlope) : null;
    tiles.push({
      id: "heat",
      name: "Heater",
      state: heatOn ? "on" : "idle",
      stateLabel: heatOn ? "ON" : "IDLE",
      big: "↑ T",
      sub: heatOn
        ? tMin != null && zone.temp.available
          ? `pushing ${zone.temp.value.toFixed(1)} → ${tMin.toFixed(1)}${heatEta ? ` · ${heatEta}` : ""}`
          : "demand on"
        : tMin != null
          ? `arms below ${tMin.toFixed(1)} °C`
          : "no T rail",
      tone: heatOn ? "ok" : "muted",
      entityId: "switch.dsc_hub_heater_demand",
      kind: "binary",
      glyph: heatOn ? "heat" : undefined,
    });
    const acIn = inventoryInService(fleet, "ac");
    tiles.push({
      id: "cool",
      name: "Cool",
      state: acIn ? (on("switch.dsc_hub_ac_demand") ? "on" : "idle") : "oos",
      stateLabel: acIn ? (on("switch.dsc_hub_ac_demand") ? "ON" : "IDLE") : "OOS",
      big: acIn ? "↓ T" : "—",
      sub: acIn ? "room AC relay" : "out of service (F-001 on hold)",
      tone: "muted",
      entityId: "switch.dsc_hub_ac_demand",
      kind: "binary",
    });
    const exhaust = num("sensor.dsc_fan_exhaust_outside_pct", NaN);
    const cfm = resolveCfm("sensor.dsc_cfm_exhaust_out_allocated", "sensor.dsc_cfm_exhaust_out", { available, num });
    tiles.push({
      id: "fans",
      name: "Fans",
      state: Number.isFinite(exhaust) && exhaust > 0 ? "on" : "idle",
      stateLabel: Number.isFinite(exhaust) ? `${Math.round(exhaust)} %` : "—",
      big: Number.isFinite(cfm.value) ? `${Math.round(cfm.value)} CFM` : "—",
      sub: Number.isFinite(cfm.value) ? `exhaust · ${cfm.kind === "allocated" ? "learned curve" : cfm.kind}` : "exhaust · not learned",
      tone: Number.isFinite(exhaust) && exhaust > 0 ? "teal" : "muted",
      entityId: "sensor.dsc_fan_exhaust_outside_pct",
      kind: "numeric",
      glyph: "fan",
      fanPct: exhaust,
    });
  } else if (zone.id === "clone") {
    const matOn = on("switch.dsc_hub_grow_mat_demand");
    const matT = num("sensor.dsc_coldest_root_zone_temp", NaN);
    const rootFault = state("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on";
    const matLo = num("number.dsc_hub_mat_root_zone_low", NaN);
    const matHi = num("number.dsc_hub_mat_root_zone_high", NaN);
    tiles.push({
      id: "mat",
      name: "Heat mat",
      state: matOn ? "on" : "idle",
      stateLabel: matOn ? "ON" : "IDLE",
      big: Number.isFinite(matT) ? `${matT.toFixed(1)} °C` : "↑ ROOT",
      sub: rootFault
        ? "root probe fault — reading withheld"
        : Number.isFinite(matLo) && Number.isFinite(matHi)
          ? `${matOn ? "warming root zone to" : "arms below"} ${matLo.toFixed(0)}–${matHi.toFixed(0)} °C`
          : matOn
            ? "warming the root zone"
            : "idle",
      tone: rootFault ? "bad" : matOn ? "ok" : "muted",
      entityId: "switch.dsc_hub_grow_mat_demand",
      kind: "binary",
      glyph: matOn ? "heat" : undefined,
    });
    const chumOos = state("binary_sensor.dsc_clone_humidifier_capacity_offline") === "on";
    const chumOn = on("switch.dsc_hub_clone_humidifier_demand");
    tiles.push({
      id: "chum",
      name: "Clone humidifier",
      state: chumOos ? "oos" : chumOn ? "on" : "idle",
      stateLabel: chumOos ? "OOS" : chumOn ? "ON" : "IDLE",
      big: chumOos ? "—" : "↑ RH",
      sub: chumOos ? "capacity offline" : chumOn ? "pushing RH up" : rhMin != null ? `arms below ${Math.round(rhMin)} %` : "no RH rail",
      tone: chumOos ? "muted" : chumOn ? "ok" : "muted",
      entityId: "switch.dsc_hub_clone_humidifier_demand",
      kind: "binary",
    });
    const misterIn = inventoryInService(fleet, "mister");
    tiles.push({
      id: "mister",
      name: "Mister",
      state: misterIn ? "idle" : "oos",
      stateLabel: misterIn ? "IDLE" : "OOS",
      big: "—",
      sub: misterIn ? "in service" : "out of service (F-002 on hold)",
      tone: "muted",
      entityId: "input_boolean.dsc_clone_humidifier_in_service",
      kind: "binary",
    });
    const intake = num("sensor.dsc_fan_intake_2x4_pct", NaN);
    tiles.push({
      id: "intake",
      name: "Intake fan",
      state: Number.isFinite(intake) && intake > 0 ? "on" : "idle",
      stateLabel: Number.isFinite(intake) ? `${Math.round(intake)} %` : "—",
      big: Number.isFinite(intake) ? `${Math.round(intake)} %` : "—",
      sub: "2×4 intake duty",
      tone: Number.isFinite(intake) && intake > 0 ? "teal" : "muted",
      entityId: "sensor.dsc_fan_intake_2x4_pct",
      kind: "numeric",
      glyph: "fan",
      fanPct: intake,
    });
  } else {
    const room = num("sensor.dsc_fan_exhaust_room_pct", NaN);
    const out = num("sensor.dsc_fan_exhaust_outside_pct", NaN);
    tiles.push({
      id: "ex-room",
      name: "Exhaust room",
      state: Number.isFinite(room) && room > 0 ? "on" : "idle",
      stateLabel: Number.isFinite(room) ? `${Math.round(room)} %` : "—",
      big: Number.isFinite(room) ? `${Math.round(room)} %` : "—",
      sub: "recirculating the lung",
      tone: Number.isFinite(room) && room > 0 ? "teal" : "muted",
      entityId: "sensor.dsc_fan_exhaust_room_pct",
      kind: "numeric",
      glyph: "fan",
      fanPct: room,
    });
    tiles.push({
      id: "ex-out",
      name: "Exhaust outside",
      state: Number.isFinite(out) && out > 0 ? "on" : "idle",
      stateLabel: Number.isFinite(out) ? `${Math.round(out)} %` : "—",
      big: Number.isFinite(out) ? `${Math.round(out)} %` : "—",
      sub: "dumping heat and moisture",
      tone: Number.isFinite(out) && out > 0 ? "teal" : "muted",
      entityId: "sensor.dsc_fan_exhaust_outside_pct",
      kind: "numeric",
      glyph: "fan",
      fanPct: out,
    });
  }

  return (
    <div className="dsc-equip">
      {tiles.map((t) => (
        <Tooltip
          key={t.id}
          content={
            <>
              <TipRow k={t.name} v={t.stateLabel} tone={t.state === "oos" || t.state === "offline" ? "muted" : t.state === "on" ? "ok" : undefined} />
              <TipRow k={t.kind === "numeric" ? "duty" : "pull"} v={t.big} />
              <TipRow k="why" v={t.sub} tone="muted" />
              <TipRow k={t.state === "oos" ? "out of service" : "entity"} v={t.entityId} tone="muted" />
            </>
          }
        >
        <button
          type="button"
          className={`dsc-equip-tile dsc-equip-tile--${t.tone}${t.state === "oos" ? " is-dashed" : ""}${t.state === "on" ? " is-on" : ""}`}
          onClick={() => onOpen(t.entityId, t.name, t.kind, t.kind === "numeric" ? "%" : undefined)}
          aria-label={`${t.name}, ${t.stateLabel.toLowerCase()}, ${t.big}, ${t.sub} — open inspector`}
        >
          <span className="dsc-equip-head">
            <span className="dsc-equip-name">
              {t.glyph === "fan" ? <FanGlyph pct={t.fanPct ?? NaN} size={12} /> : null}
              {t.glyph === "heat" ? <HeatLines on size={14} /> : null}
              {t.glyph !== "fan" && applianceIcon(`${t.id} ${t.name}`, zone.lamp?.kind) ? (
                <Icon
                  name={applianceIcon(`${t.id} ${t.name}`, zone.lamp?.kind)!}
                  size={12}
                  className={t.state === "oos" ? "is-oos" : t.state === "on" ? `dsc-icon--${t.tone === "lamp" ? "lamp" : "ok"}` : "dsc-icon--muted"}
                />
              ) : null}
              {t.name}
            </span>
            <span className="dsc-equip-state">{t.stateLabel}</span>
          </span>
          <span className="dsc-equip-big">{t.big}</span>
          <span className="dsc-equip-sub">{t.sub}</span>
        </button>
        </Tooltip>
      ))}
    </div>
  );
}
