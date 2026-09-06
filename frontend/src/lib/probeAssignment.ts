import type { FleetSnapshot } from "./fleetModel";
import { rosterSlots } from "./probeModel";

/** Short plant id for chips (plant:uuid… → plant:abcd…). */
export function shortPlantId(raw: string): string {
  const s = raw.trim();
  if (!s) return "";
  if (s.startsWith("plant:") && s.length > 14) {
    return `plant:${s.slice(6, 14)}…`;
  }
  return s.length > 28 ? `${s.slice(0, 26)}…` : s;
}

/**
 * Resolve assigned plant for kit probe N from fleet inventory, HA text helper, then roster.
 * Returns empty string when unassigned.
 */
export function probeAssignedPlantId(
  probe: number,
  fleet: FleetSnapshot | null | undefined,
  state: (id: string, fallback?: string) => string,
): string {
  const row = fleet?.inventory?.find((r) => r.seat_id === `pot${probe}`);
  const fromInv = String((row?.extra as Record<string, unknown> | undefined)?.assigned_plant_id ?? "").trim();
  if (fromInv) return fromInv;
  const fromHelper = state(`text.dsc_probe${probe}_assigned_plant_id`, "").trim();
  if (fromHelper && fromHelper !== "unknown" && fromHelper !== "unavailable") return fromHelper;
  return "";
}

/** Display label: nickname / plant name / short id, or empty when unassigned. */
export function probeAssignmentDisplay(
  probe: number,
  fleet: FleetSnapshot | null | undefined,
  state: (id: string, fallback?: string) => string,
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): string {
  const plantId = probeAssignedPlantId(probe, fleet, state);
  if (!plantId) return "";

  const plantName = state(`text.dsc_probe${probe}_plant_name`, "").trim();
  if (plantName && plantName !== "unknown" && plantName !== "unavailable") return plantName;

  const slots = rosterSlots(entity);
  const match = slots.find((s) => String(s.pot) === `pot${probe}` || String(s.pot) === String(probe));
  const nick = String(match?.nickname || match?.strain || "").trim();
  if (nick) return nick;

  return shortPlantId(plantId);
}

/** SoftCal / Soil / lab chip body after Probe N · */
export function softCalAssignmentChipLabel(
  probe: number,
  fleet: FleetSnapshot | null | undefined,
  state: (id: string, fallback?: string) => string,
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): string {
  const label = probeAssignmentDisplay(probe, fleet, state, entity);
  return label ? `${label} · SoftCal OK` : "Unassigned · SoftCal OK";
}

export const ASSIGNED_PROBE_BANNER =
  "Probe has a plant — SoftCal OK; detach before Soil Test move if relocating the probe.";
