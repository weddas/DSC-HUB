import type { FleetSnapshot } from "./fleetModel";
import { ENTITY_FLEET_MAP } from "./generated/entityFleetMap.gen";

export type EntityFleetRef = { seatId: string; metric: string; binary?: boolean; text?: boolean };

/**
 * Maps HA entity_id → fleet seat metric (Pi history + held readings).
 *
 * The table is GENERATED from brain/dsc_brain/entity_tables.py into
 * ./generated/entityFleetMap.gen.ts — add or rename ids there and run
 * `npm run gen:entities`.  The resolution helpers below stay hand-written.
 */
export { ENTITY_FLEET_MAP };

function seatValues(fleet: FleetSnapshot, seatId: string): Record<string, unknown> | undefined {
  if (seatId === "hub") return fleet.hub.values;
  if (seatId === "panel") return fleet.panel.values;
  if (seatId.startsWith("pot")) return fleet.pots[seatId]?.values;
  return fleet.sonoffs[seatId]?.values;
}

export function fleetLiveNumber(entityId: string, fleet: FleetSnapshot): number | null {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return null;
  const values = seatValues(fleet, ref.seatId);
  if (!values) return null;
  let raw: unknown = values[ref.metric];
  if (ref.binary && ref.seatId.startsWith("pot") && raw == null) {
    const bins = values.binaries as Record<string, boolean> | undefined;
    raw = bins?.[ref.metric];
  }
  if (raw == null) return null;
  if (ref.binary) return raw === true || raw === "on" || raw === 1 || raw === "1" ? 1 : 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** HA-shaped state string for fleet-mapped entities (binaries → on/off, not 1/0). */
export function fleetLiveState(entityId: string, fleet: FleetSnapshot): string | null {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return null;
  if (ref.text) {
    const raw = seatValues(fleet, ref.seatId)?.[ref.metric];
    return raw == null || raw === "" ? null : String(raw);
  }
  const live = fleetLiveNumber(entityId, fleet);
  if (live == null || !Number.isFinite(live)) return null;
  if (ref.binary) return live > 0 ? "on" : "off";
  return String(live);
}

/** True when the mapped metric is present (finite / binary), not merely seat online. */
export function fleetMetricPresent(entityId: string, fleet: FleetSnapshot): boolean {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return false;
  if (ref.text) return fleetLiveState(entityId, fleet) != null;
  if (ref.binary) {
    const values = seatValues(fleet, ref.seatId);
    if (!values) return false;
    let raw: unknown = values[ref.metric];
    if (raw == null && ref.seatId.startsWith("pot")) {
      const bins = values.binaries as Record<string, boolean> | undefined;
      raw = bins?.[ref.metric];
    }
    return raw != null;
  }
  return fleetLiveNumber(entityId, fleet) != null;
}

export function fleetEntityAvailable(entityId: string, fleet: FleetSnapshot): boolean {
  const ref = ENTITY_FLEET_MAP[entityId];
  if (!ref) return false;
  if (ref.seatId === "hub") return fleet.hub.online;
  if (ref.seatId === "panel") return fleet.panel.online;
  if (ref.seatId.startsWith("pot")) {
    const online = !!fleet.pots[ref.seatId]?.online;
    // Derived soil metrics: available only when produced (avoids lying empty dials).
    if (
      ref.metric === "dryback_pct" ||
      ref.metric === "moisture_rate" ||
      ref.metric === "nitrogen" ||
      ref.metric === "phosphorus" ||
      ref.metric === "potassium"
    ) {
      return online && fleetMetricPresent(entityId, fleet);
    }
    return online;
  }
  return !!fleet.sonoffs[ref.seatId]?.online;
}

export function hubFleetDark(fleet: FleetSnapshot): boolean {
  return !fleet.hub.online;
}
