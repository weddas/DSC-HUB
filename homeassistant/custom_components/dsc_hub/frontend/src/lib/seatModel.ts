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

export interface PlantSeatModel {
  pot: number;
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
  pot: number,
): TentId {
  return normalizeTent(state(`input_select.dsc_probe${pot}_tent`, "unassigned"));
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

export function buildPlantSeat(
  pot: number,
  opts: {
    state: (id: string, fallback?: string) => string;
    entity: (id: string) => { attributes?: Record<string, unknown> } | undefined;
  },
): PlantSeatModel {
  const { state, entity } = opts;
  const slots = (entity("sensor.dsc_plant_roster_summary")?.attributes?.slots ||
    []) as RosterSlot[];
  const roster = Array.isArray(slots)
    ? slots.find((s) => String(s.pot) === String(pot))
    : undefined;

  const prefer = (primary: string, fallback: string, digits = 1) =>
    preferReading(state(primary, ""), state(fallback, ""), digits);

  const blend = clean(roster?.blend, "");
  return {
    pot,
    plantName: clean(state(`text.dsc_probe${pot}_plant_name`, "")),
    strainDisplay: clean(state(`sensor.dsc_probe${pot}_strain_display`, "")),
    sprout: clean(state(`datetime.dsc_probe${pot}_sprout_date`, ""), "—").slice(0, 10),
    days: clean(state(`sensor.dsc_probe${pot}_days_since_sprout`, "")),
    stage: clean(state(`sensor.dsc_probe${pot}_expected_stage`, "")),
    growthStage: clean(state(`select.dsc_probe${pot}_growth_stage`, "")),
    tent: readTent(state, pot),
    blend,
    recipe: clean(roster?.recipe, ""),
    notes: clean(roster?.notes, ""),
    layers: parseBlendLayers(blend),
    moisture: prefer(`sensor.dsc_probe${pot}_got_moisture`, `sensor.dsc_probe${pot}_soil_moisture`, 0),
    soilTemp: fmtReading(clean(state(`sensor.dsc_probe${pot}_soil_temperature`, "")), 1),
    ec: prefer(`sensor.dsc_probe${pot}_got_ec`, `sensor.dsc_probe${pot}_soil_conductivity`, 0),
    ph: prefer(`sensor.dsc_probe${pot}_got_ph`, `sensor.dsc_probe${pot}_soil_ph`, 2),
    n: fmtReading(clean(state(`sensor.dsc_probe${pot}_soil_nitrogen`, "")), 0),
    p: fmtReading(clean(state(`sensor.dsc_probe${pot}_soil_phosphorus`, "")), 0),
    k: fmtReading(clean(state(`sensor.dsc_probe${pot}_soil_potassium`, "")), 0),
    need: clean(state(`sensor.dsc_probe${pot}_need_summary`, "")),
    rosterSlot: roster?.slot ?? null,
  };
}

/** Entity id helpers for Got / dryback history. */
export function potGotEntity(
  pot: number,
  kind: "moisture" | "ec" | "ph",
  state: (id: string, fallback?: string) => string,
): string {
  const got = `sensor.dsc_probe${pot}_got_${kind}`;
  const fb =
    kind === "moisture"
      ? `sensor.dsc_probe${pot}_soil_moisture`
      : kind === "ec"
        ? `sensor.dsc_probe${pot}_soil_conductivity`
        : `sensor.dsc_probe${pot}_soil_ph`;
  const raw = state(got, "");
  if (raw && raw !== "unavailable" && raw !== "unknown") return got;
  return fb;
}

export function potsInTent(
  tent: TentId,
  state: (id: string, fallback?: string) => string,
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): PlantSeatModel[] {
  return activePotNumbers(state)
    .map((n) => buildPlantSeat(n, { state, entity }))
    .filter((s) => s.tent === tent && s.plantName !== "—" && s.plantName.trim() !== "");
}

export const ALL_POT_NUMBERS = [1, 2, 3, 4] as const;

/** Pot is shown when inventory in_service is on; off = OOS hole (never fake Got). */
export function isPotInService(
  pot: number,
  state: (id: string, fallback?: string) => string,
): boolean {
  const id = `input_boolean.dsc_probe${pot}_in_service`;
  const raw = state(id, "off");
  if (raw === "unavailable" || raw === "unknown" || raw === "") return false;
  return raw === "on";
}

/** Prefer fleet inventory when present; fall back to HA helper state. */
export function isPotInServiceWithFleet(
  pot: number,
  state: (id: string, fallback?: string) => string,
  fleet?: FleetSnapshot | null,
): boolean {
  if (fleet?.inventory?.length) {
    return inventoryInService(fleet, `pot${pot}`, false);
  }
  return isPotInService(pot, state);
}

export function activePotNumbers(
  state: (id: string, fallback?: string) => string,
  pots: number[] = [...ALL_POT_NUMBERS],
): number[] {
  return pots.filter((n) => isPotInService(n, state));
}

export function inServiceCount(
  state: (id: string, fallback?: string) => string,
  pots: number[] = [...ALL_POT_NUMBERS],
): { inService: number; total: number } {
  return { inService: activePotNumbers(state, pots).length, total: pots.length };
}

export function rosterSlots(
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): RosterSlot[] {
  const slots = entity("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(slots) ? (slots as RosterSlot[]) : [];
}
