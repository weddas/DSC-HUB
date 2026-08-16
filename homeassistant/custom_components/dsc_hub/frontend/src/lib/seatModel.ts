import { parseBlendLayers, type SoilLayer } from "../components/chrome";

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

export function readTent(
  state: (id: string, fallback?: string) => string,
  pot: number,
): TentId {
  const raw = state(`input_select.dsc_pot${pot}_tent`, "unassigned");
  if (raw === "clone" || raw === "main" || raw === "unassigned") return raw;
  return "unassigned";
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

  const prefer = (primary: string, fallback: string) => {
    const a = clean(state(primary, ""));
    if (a !== "—") return a;
    return clean(state(fallback, ""));
  };

  const blend = clean(roster?.blend, "");
  return {
    pot,
    plantName: clean(state(`text.dsc_pot${pot}_plant_name`, "")),
    strainDisplay: clean(state(`sensor.dsc_pot${pot}_strain_display`, "")),
    sprout: clean(state(`datetime.dsc_pot${pot}_sprout_date`, ""), "—").slice(0, 10),
    days: clean(state(`sensor.dsc_pot${pot}_days_since_sprout`, "")),
    stage: clean(state(`sensor.dsc_pot${pot}_expected_stage`, "")),
    growthStage: clean(state(`select.dsc_pot${pot}_growth_stage`, "")),
    tent: readTent(state, pot),
    blend,
    recipe: clean(roster?.recipe, ""),
    notes: clean(roster?.notes, ""),
    layers: parseBlendLayers(blend),
    moisture: prefer(`sensor.dsc_pot${pot}_got_moisture`, `sensor.dsc_pot${pot}_soil_moisture`),
    soilTemp: clean(state(`sensor.dsc_pot${pot}_soil_temperature`, "")),
    ec: prefer(`sensor.dsc_pot${pot}_got_ec`, `sensor.dsc_pot${pot}_soil_conductivity`),
    ph: prefer(`sensor.dsc_pot${pot}_got_ph`, `sensor.dsc_pot${pot}_soil_ph`),
    n: clean(state(`sensor.dsc_pot${pot}_soil_nitrogen`, "")),
    p: clean(state(`sensor.dsc_pot${pot}_soil_phosphorus`, "")),
    k: clean(state(`sensor.dsc_pot${pot}_soil_potassium`, "")),
    need: clean(state(`sensor.dsc_pot${pot}_need_summary`, "")),
    rosterSlot: roster?.slot ?? null,
  };
}

/** Entity id helpers for Got / dryback history. */
export function potGotEntity(
  pot: number,
  kind: "moisture" | "ec" | "ph",
  state: (id: string, fallback?: string) => string,
): string {
  const got = `sensor.dsc_pot${pot}_got_${kind}`;
  const fb =
    kind === "moisture"
      ? `sensor.dsc_pot${pot}_soil_moisture`
      : kind === "ec"
        ? `sensor.dsc_pot${pot}_soil_conductivity`
        : `sensor.dsc_pot${pot}_soil_ph`;
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
    .filter((s) => s.tent === tent);
}

export const ALL_POT_NUMBERS = [1, 2, 3, 4] as const;

/** Pot is shown when in_service is on/missing; off = OOS hole (never fake Got). */
export function isPotInService(
  pot: number,
  state: (id: string, fallback?: string) => string,
): boolean {
  const id = `input_boolean.dsc_pot${pot}_in_service`;
  const raw = state(id, "on");
  if (raw === "unavailable" || raw === "unknown" || raw === "") return true;
  return raw === "on";
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
