import { parseBlendLayers, type SoilLayer } from "../components/chrome";
import type { FleetSnapshot } from "./fleetModel";
import { inventoryInService } from "./fleetModel";
import { fmtReading } from "./formatReading";

export { fmtReading } from "./formatReading";

export type TentId = "unassigned" | "clone" | "main";

export interface RosterSlot {
  slot: number;
  nickname?: string;
  strain?: string;
  blend?: string;
  recipe?: string;
  sprout?: string;
  pot?: string;
  status?: string;
  notes?: string;
  seed_count?: number;
  tent?: string;
}

export interface PlantProbeModel {
  probe: number;
  plantName: string;
  strainDisplay: string;
  sprout: string;
  days: string;
  stage: string;
  growthStage: string;
  tent: TentId;
  blend: string;
  recipe: string;
  notes: string;
  layers: SoilLayer[];
  moisture: string;
  soilTemp: string;
  ec: string;
  ph: string;
  n: string;
  p: string;
  k: string;
  need: string;
  rosterSlot: number | null;
}

function clean(v: string | undefined, fallback = "—"): string {
  if (!v || v === "unknown" || v === "unavailable" || v === "none") return fallback;
  return v;
}

/** Days since ISO sprout date — shared by roster rail and CropScheduler. */
export function daysSinceSproutIso(sprout: string | undefined): number | null {
  if (!sprout || sprout.length < 8 || sprout === "—") return null;
  const d = new Date(`${sprout.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}

function preferReading(
  primary: string,
  fallback: string,
  digits: number,
): string {
  const a = clean(primary, "—");
  if (a !== "—") return fmtReading(a, digits);
  return fmtReading(clean(fallback, "—"), digits);
}

export function normalizeTent(raw: string | undefined): TentId {
  const v = String(raw || "").trim().toLowerCase();
  if (v === "clone" || v === "2x4" || v === "2×4") return "clone";
  if (v === "main" || v === "4x8" || v === "4×8") return "main";
  return "unassigned";
}

export function readTent(
  state: (id: string, fallback?: string) => string,
  probe: number,
): TentId {
  return normalizeTent(state(`input_select.dsc_probe${probe}_tent`, "unassigned"));
}

export function tentLabel(tent: TentId): string {
  switch (tent) {
    case "clone":
      return "2×4";
    case "main":
      return "4×8";
    case "unassigned":
      return "Unassigned";
    default: {
      const _exhaustive: never = tent;
      return _exhaustive;
    }
  }
}

export function buildPlantProbe(
  probe: number,
  opts: {
    state: (id: string, fallback?: string) => string;
    entity: (id: string) => { attributes?: Record<string, unknown> } | undefined;
  },
): PlantProbeModel {
  const { state, entity } = opts;
  const slots = (entity("sensor.dsc_plant_roster_summary")?.attributes?.slots ||
    []) as RosterSlot[];
  const roster = Array.isArray(slots)
    ? slots.find((s) => String(s.pot) === String(probe))
    : undefined;

  const prefer = (primary: string, fallback: string, digits = 1) =>
    preferReading(state(primary, ""), state(fallback, ""), digits);

  const blend = clean(roster?.blend, "");
  let sprout = clean(state(`datetime.dsc_probe${probe}_sprout_date`, ""), "—").slice(0, 10);
  if (sprout === "—" && roster?.sprout) {
    sprout = roster.sprout.slice(0, 10);
  }
  let days = clean(state(`sensor.dsc_probe${probe}_days_since_sprout`, ""));
  if (!days && sprout !== "—") {
    const derived = daysSinceSproutIso(sprout);
    if (derived != null) days = String(derived);
  }
  let stage = clean(state(`sensor.dsc_probe${probe}_expected_stage`, ""));
  const growthStage = clean(state(`select.dsc_probe${probe}_growth_stage`, ""));
  if (!stage && growthStage && growthStage !== "—") {
    stage = growthStage;
  }
  return {
    probe,
    plantName: clean(state(`text.dsc_probe${probe}_plant_name`, "")),
    strainDisplay: clean(state(`sensor.dsc_probe${probe}_strain_display`, "")),
    sprout,
    days,
    stage,
    growthStage,
    tent: readTent(state, probe),
    blend,
    recipe: clean(roster?.recipe, ""),
    notes: clean(roster?.notes, ""),
    layers: parseBlendLayers(blend),
    moisture: prefer(`sensor.dsc_probe${probe}_got_moisture`, `sensor.dsc_probe${probe}_soil_moisture`, 0),
    soilTemp: fmtReading(clean(state(`sensor.dsc_probe${probe}_soil_temperature`, "")), 1),
    ec: prefer(`sensor.dsc_probe${probe}_got_ec`, `sensor.dsc_probe${probe}_soil_ec`, 0),
    ph: prefer(`sensor.dsc_probe${probe}_got_ph`, `sensor.dsc_probe${probe}_soil_ph`, 2),
    n: fmtReading(clean(state(`sensor.dsc_probe${probe}_soil_nitrogen`, "")), 0),
    p: fmtReading(clean(state(`sensor.dsc_probe${probe}_soil_phosphorus`, "")), 0),
    k: fmtReading(clean(state(`sensor.dsc_probe${probe}_soil_potassium`, "")), 0),
    need: clean(state(`sensor.dsc_probe${probe}_need_summary`, "")),
    rosterSlot: roster?.slot ?? null,
  };
}

function entityLive(
  state: (id: string, fallback?: string) => string,
  id: string,
): boolean {
  const raw = state(id, "");
  return !!raw && raw !== "unavailable" && raw !== "unknown";
}

/** Entity id helpers for Got / dryback history. */
export function probeGotEntity(
  probe: number,
  kind: "moisture" | "ec" | "ph",
  state: (id: string, fallback?: string) => string,
): string {
  const got = `sensor.dsc_probe${probe}_got_${kind}`;
  if (entityLive(state, got)) return got;
  if (kind === "moisture") return `sensor.dsc_probe${probe}_soil_moisture`;
  if (kind === "ph") return `sensor.dsc_probe${probe}_soil_ph`;
  // EC: Pi fleet map keys soil_ec; conductivity/got_ec are aliases.
  const soilEc = `sensor.dsc_probe${probe}_soil_ec`;
  if (entityLive(state, soilEc)) return soilEc;
  const cond = `sensor.dsc_probe${probe}_soil_conductivity`;
  if (entityLive(state, cond)) return cond;
  return soilEc;
}

export function probesInTent(
  tent: TentId,
  state: (id: string, fallback?: string) => string,
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): PlantProbeModel[] {
  return activeProbeNumbers(state)
    .map((n) => buildPlantProbe(n, { state, entity }))
    .filter((s) => s.tent === tent && s.plantName !== "—" && s.plantName.trim() !== "");
}

/** Full entity universe (Device restore / maps). Not the Live kit. */
export const ALL_PROBE_NUMBERS = [1, 2, 3, 4] as const;

/** Operator kit — Live Root, honesty, Fleet pulse, idle-home defaults. */
export const KIT_PROBE_NUMBERS = [1, 2] as const;

export function probeLabel(n: number): string {
  return `Probe ${n}`;
}

/** Probe is shown when inventory in_service is on; off = OOS hole (never fake Got). */
export function isProbeInService(
  probe: number,
  state: (id: string, fallback?: string) => string,
): boolean {
  const id = `input_boolean.dsc_probe${probe}_in_service`;
  const raw = state(id, "off");
  if (raw === "unavailable" || raw === "unknown" || raw === "") return false;
  return raw === "on";
}

/** Prefer fleet inventory when present; fall back to HA helper state. */
export function isProbeInServiceWithFleet(
  probe: number,
  state: (id: string, fallback?: string) => string,
  fleet?: FleetSnapshot | null,
): boolean {
  if (fleet?.inventory?.length) {
    return inventoryInService(fleet, `pot${probe}`, false);
  }
  return isProbeInService(probe, state);
}

export function activeProbeNumbers(
  state: (id: string, fallback?: string) => string,
  probes: number[] = [...KIT_PROBE_NUMBERS],
): number[] {
  return probes.filter((n) => isProbeInService(n, state));
}

export function inServiceCount(
  state: (id: string, fallback?: string) => string,
  probes: number[] = [...KIT_PROBE_NUMBERS],
): { inService: number; total: number } {
  return { inService: activeProbeNumbers(state, probes).length, total: probes.length };
}

export function inServiceCountWithFleet(
  state: (id: string, fallback?: string) => string,
  fleet?: FleetSnapshot | null,
  probes: number[] = [...KIT_PROBE_NUMBERS],
): { inService: number; total: number } {
  return {
    inService: probes.filter((n) => isProbeInServiceWithFleet(n, state, fleet)).length,
    total: probes.length,
  };
}

export function rosterSlots(
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): RosterSlot[] {
  const slots = entity("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(slots) ? (slots as RosterSlot[]) : [];
}
