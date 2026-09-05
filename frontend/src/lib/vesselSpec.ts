export type VesselMaterial = "fabric" | "pet" | "plastic" | "airpot" | "felt";
export type VesselSilhouette = "bag" | "taper" | "tall" | "airpot";

export interface VesselSpec {
  id: string;
  label: string;
  volumeL: number;
  material: VesselMaterial;
  silhouette: VesselSilhouette;
}

export const VESSEL_CATALOG: VesselSpec[] = [
  {
    id: "generic_fabric_25l",
    label: "25L Generic Fabric Grow Bag",
    volumeL: 25,
    material: "fabric",
    silhouette: "bag",
  },
  {
    id: "generic_tall_pet_20l",
    label: "20L Generic Tall PET",
    volumeL: 20,
    material: "pet",
    silhouette: "tall",
  },
  {
    id: "generic_fabric_20l",
    label: "20L Generic Fabric Grow Bag",
    volumeL: 20,
    material: "fabric",
    silhouette: "bag",
  },
  {
    id: "airpot_20l",
    label: "20L Air-Pot",
    volumeL: 20,
    material: "airpot",
    silhouette: "airpot",
  },
  {
    id: "felt_15l",
    label: "15L Felt Pot",
    volumeL: 15,
    material: "felt",
    silhouette: "bag",
  },
  {
    id: "plastic_taper_15l",
    label: "15L Taper Plastic",
    volumeL: 15,
    material: "plastic",
    silhouette: "taper",
  },
];

const CATALOG_BY_ID = new Map(VESSEL_CATALOG.map((v) => [v.id, v]));

export const DEFAULT_VESSEL: VesselSpec = VESSEL_CATALOG[2];

export function vesselEntityId(pot: number): string {
  return `input_select.dsc_probe${pot}_vessel`;
}

export function parseVesselId(raw: string | undefined | null): string {
  const id = String(raw || "").trim();
  if (CATALOG_BY_ID.has(id)) return id;
  return DEFAULT_VESSEL.id;
}

export function resolveVesselSpec(
  raw: string | undefined | null,
  fallbackVolumeL?: number,
): VesselSpec {
  const spec = CATALOG_BY_ID.get(parseVesselId(raw)) ?? DEFAULT_VESSEL;
  if (Number.isFinite(fallbackVolumeL) && (fallbackVolumeL as number) > 0) {
    return { ...spec, volumeL: fallbackVolumeL as number };
  }
  return spec;
}

export function readPotVessel(
  pot: number,
  state: (id: string, fallback?: string) => string,
  entity?: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): VesselSpec {
  const id = vesselEntityId(pot);
  const fromSelect = state(id, "");
  if (fromSelect && fromSelect !== "unknown" && fromSelect !== "unavailable") {
    return resolveVesselSpec(fromSelect);
  }
  const roster = entity?.("sensor.dsc_plant_roster_summary")?.attributes?.slots;
  if (Array.isArray(roster)) {
    const slot = roster.find((s) => {
      const rec = s as { pot?: string | number; vessel?: string };
      return String(rec.pot) === String(pot);
    }) as { vessel?: string } | undefined;
    if (slot?.vessel) return resolveVesselSpec(slot.vessel);
  }
  return DEFAULT_VESSEL;
}

export function materialStroke(material: VesselMaterial): string {
  switch (material) {
    case "fabric":
      return "rgba(180, 210, 190, 0.85)";
    case "felt":
      return "rgba(160, 190, 170, 0.9)";
    case "pet":
      return "rgba(120, 210, 230, 0.95)";
    case "plastic":
      return "rgba(170, 200, 220, 0.9)";
    case "airpot":
      return "rgba(90, 200, 170, 0.95)";
    default: {
      const _exhaustive: never = material;
      return _exhaustive;
    }
  }
}
