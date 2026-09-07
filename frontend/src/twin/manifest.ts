/**
 * Model manifest for the 3D twin (plan § 3D twin, "Model pipeline").
 *
 * Models are authored in three-d-stage, exported as GLB into `public/models/`, and
 * described in `public/models/manifest.json`. Anchors map a node-name prefix in the
 * model (`vent_port_roof_*`) to a role (`fan_exhaust`) so a zone's bindings can attach
 * live entities to the right place; materials map the model's material names to
 * palette roles so the wire look is token-driven, never baked into the file.
 */

export type ModelKind = "tent" | "room" | "device" | "sensor" | "plant" | "vessel";

/** Anchor roles the app knows an icon / binding for. Any other anchor name is kept as-is. */
export type KnownAnchorRole =
  | "fan_exhaust"
  | "fan_intake"
  | "duct_passive"
  | "cable"
  | "tray"
  | "shelf"
  | "window"
  | "vent_window"
  | "door"
  | "lamp"
  | "mat"
  | "probe"
  | "camera";
export type AnchorRole = KnownAnchorRole | (string & {});

/** How a model material is drawn in the holographic wire look. */
export type MaterialRole = "accent" | "dim" | "glass" | "shell" | "frame" | "emissive" | "wire";

/** Set icon per anchor role — the same glyph on the spike page, the Kit desk and the twin tooltip. */
export const ANCHOR_ICON: Partial<Record<string, string>> = {
  fan_exhaust: "exhaust-fan",
  fan_intake: "intake-fan",
  duct_passive: "ducting",
  cable: "smart-outlet",
  tray: "harvest-tote",
  shelf: "light-hanger",
  window: "observation-window",
  vent_window: "observation-window",
  door: "door",
  lamp: "grow-light",
  camera: "camera-monitor",
  mat: "heater-mat",
  probe: "soil-probe",
  hang: "light-hanger",
  mount: "smart-outlet",
  duct: "ducting",
  canopy: "canopy-top",
  pot: "harvest-tote",
  plug: "smart-outlet",
  hose: "water-pump",
  airflow: "airflow",
};

export interface TwinModel {
  slug: string;
  file: string;
  kind: ModelKind;
  dims_cm: [number, number, number];
  /** Brain zone id this model stands for by default (`2x4`, `4x8`, `grow_room`). */
  zone?: string;
  /** `soil`: y = 0 is the soil surface, not the floor — snaps to a vessel's `plant_base`. */
  origin?: "soil";
  bytes?: number;
  /** Build metadata from scripts/build-twin-models.mjs (absent on hand-authored rows). */
  origin_y?: number;
  meshes?: number;
  triangles?: number;
  anchors: Record<string, AnchorRole>;
  materials: Record<string, MaterialRole>;
}

export interface TwinManifest {
  version: number;
  models: TwinModel[];
}

let cache: Promise<TwinManifest> | null = null;

export function loadManifest(): Promise<TwinManifest> {
  if (!cache) {
    cache = fetch("/models/manifest.json", { cache: "no-store" }).then(async (r) => {
      const ctype = r.headers.get("content-type") || "";
      if (!r.ok || !ctype.includes("json")) throw new Error("model manifest missing from this bundle");
      return (await r.json()) as TwinManifest;
    });
    cache.catch(() => {
      cache = null;
    });
  }
  return cache;
}

export async function findModel(slug: string): Promise<TwinModel | null> {
  const m = await loadManifest();
  return m.models.find((x) => x.slug === slug) ?? null;
}

/** The anchor role a model node belongs to, from its name prefix — or null when unbound. */
export function anchorRoleOf(nodeName: string, model: TwinModel): AnchorRole | null {
  let best: { key: string; role: AnchorRole } | null = null;
  for (const [key, role] of Object.entries(model.anchors)) {
    if (nodeName === key || nodeName.startsWith(`${key}_`)) {
      if (!best || key.length > best.key.length) best = { key, role };
    }
  }
  return best?.role ?? null;
}
