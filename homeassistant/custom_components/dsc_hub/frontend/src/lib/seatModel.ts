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
      return "Clone 2×4";
    case "main":
      return "Main 4×8";
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
    moisture: clean(state(`sensor.dsc_pot${pot}_soil_moisture`, "")),
    soilTemp: clean(state(`sensor.dsc_pot${pot}_soil_temperature`, "")),
    ec: clean(state(`sensor.dsc_pot${pot}_soil_conductivity`, "")),
    ph: clean(state(`sensor.dsc_pot${pot}_soil_ph`, "")),
    n: clean(state(`sensor.dsc_pot${pot}_soil_nitrogen`, "")),
    p: clean(state(`sensor.dsc_pot${pot}_soil_phosphorus`, "")),
    k: clean(state(`sensor.dsc_pot${pot}_soil_potassium`, "")),
    need: clean(state(`sensor.dsc_pot${pot}_need_summary`, "")),
    rosterSlot: roster?.slot ?? null,
  };
}

export function rosterSlots(
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): RosterSlot[] {
  const slots = entity("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  return Array.isArray(slots) ? (slots as RosterSlot[]) : [];
}
