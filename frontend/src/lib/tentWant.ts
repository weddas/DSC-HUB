import { KIT_PROBE_NUMBERS, isProbeInService, probesInTent, type TentId } from "./probeModel";
import { zoneTone, type ZoneTone } from "./zoneTone";

/** Hub firmware stage presets (dsc-hub-v4_0 apply_stage) — labeled stage rail, not catalog Want. */
export const STAGE_ORDER = [
  "Germination",
  "Seedling",
  "Early Vegetative",
  "Vegetative",
  "Late (Push) Vegetative",
  "Early Flowering",
  "Flowering",
  "Late Flowering",
  "Final 48-72h Flowering",
  "Dry Mode",
] as const;

export type StageName = (typeof STAGE_ORDER)[number];

export type StageRail = {
  temp: number;
  vpdMin: number;
  vpdMax: number;
  rhMin: number;
  rhMax: number;
  lightHours: number;
  short: string;
};

const STAGE_RAIL: Record<string, StageRail> = {
  Germination: { temp: 25, vpdMin: 0.4, vpdMax: 0.8, rhMin: 70, rhMax: 80, lightHours: 18, short: "Germ" },
  Seedling: { temp: 24, vpdMin: 0.5, vpdMax: 0.8, rhMin: 65, rhMax: 75, lightHours: 18, short: "Seedling" },
  "Early Vegetative": { temp: 25, vpdMin: 0.7, vpdMax: 1.0, rhMin: 60, rhMax: 70, lightHours: 18, short: "Early Veg" },
  Vegetative: { temp: 26, vpdMin: 0.8, vpdMax: 1.1, rhMin: 55, rhMax: 65, lightHours: 18, short: "Veg" },
  "Late (Push) Vegetative": { temp: 26, vpdMin: 1.0, vpdMax: 1.2, rhMin: 50, rhMax: 60, lightHours: 18, short: "Push Veg" },
  "Early Flowering": { temp: 25, vpdMin: 1.0, vpdMax: 1.2, rhMin: 50, rhMax: 55, lightHours: 12, short: "Early Flwr" },
  Flowering: { temp: 24, vpdMin: 1.2, vpdMax: 1.4, rhMin: 45, rhMax: 50, lightHours: 12, short: "Flower" },
  "Late Flowering": { temp: 22, vpdMin: 1.3, vpdMax: 1.5, rhMin: 40, rhMax: 45, lightHours: 12, short: "Late Flwr" },
  "Final 48-72h Flowering": { temp: 21, vpdMin: 1.4, vpdMax: 1.6, rhMin: 35, rhMax: 45, lightHours: 12, short: "Flush" },
  "Dry Mode": { temp: 19, vpdMin: 0.8, vpdMax: 1.0, rhMin: 55, rhMax: 62, lightHours: 0, short: "Dry" },
};

export type Band = { min: number; max: number; source: "plant" | "stage"; mixed: boolean };

export type TentWantRail = {
  temp: Band | null;
  rh: Band | null;
  vpd: Band | null;
  lightHours: number | null;
  mixed: boolean;
  stages: string[];
  needs: string[];
  emptyLabel: string | null;
};

function numWant(state: (id: string, fb?: string) => string, id: string): number {
  const n = Number(state(id, ""));
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

export function railForStage(stage: string): StageRail | null {
  if (!stage || stage === "—" || stage === "Off" || stage === "Custom") return null;
  const hit = STAGE_RAIL[stage];
  if (hit) return hit;
  const key = Object.keys(STAGE_RAIL).find((k) => stage.indexOf(k) >= 0);
  return key ? STAGE_RAIL[key] : null;
}

function intersect(a: Band | null, b: { min: number; max: number; source: Band["source"] }): Band | null {
  if (!Number.isFinite(b.min) || !Number.isFinite(b.max)) return a;
  if (!a) return { ...b, mixed: false };
  return {
    min: Math.max(a.min, b.min),
    max: Math.min(a.max, b.max),
    source: a.source === "plant" || b.source === "plant" ? "plant" : "stage",
    mixed: a.source !== b.source || a.mixed,
  };
}

type HassBits = {
  state: (id: string, fallback?: string) => string;
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined;
};

export function tentWantRail(tent: Exclude<TentId, "unassigned">, hass: HassBits): TentWantRail {
  const probes = probesInTent(tent, hass.state, hass.entity).filter((s) => isProbeInService(s.probe, hass.state));
  let temp: Band | null = null;
  let rh: Band | null = null;
  let vpd: Band | null = null;
  let lightHours: number | null = null;
  const stages: string[] = [];
  const needs: string[] = [];
  let mixed = false;

  for (const s of probes) {
    if (s.stage && s.stage !== "—") {
      if (stages.length && !stages.includes(s.stage)) mixed = true;
      if (!stages.includes(s.stage)) stages.push(s.stage);
    }
    if (s.need && s.need !== "—" && s.need !== "ok" && !needs.includes(s.need)) needs.push(s.need);

    const tMin = numWant(hass.state, `sensor.dsc_probe${s.probe}_want_temp_min`);
    const tMax = numWant(hass.state, `sensor.dsc_probe${s.probe}_want_temp_max`);
    if (Number.isFinite(tMin) && Number.isFinite(tMax)) {
      temp = intersect(temp, { min: tMin, max: tMax, source: "plant" });
    }
    const rMin = numWant(hass.state, `sensor.dsc_probe${s.probe}_want_rh_min`);
    const rMax = numWant(hass.state, `sensor.dsc_probe${s.probe}_want_rh_max`);
    if (Number.isFinite(rMin) && Number.isFinite(rMax)) {
      rh = intersect(rh, { min: rMin, max: rMax, source: "plant" });
    }

    const rail = railForStage(s.stage);
    if (rail) {
      if (!temp) temp = { min: rail.temp - 1.5, max: rail.temp + 1.5, source: "stage", mixed: false };
      if (!rh) rh = { min: rail.rhMin, max: rail.rhMax, source: "stage", mixed: false };
      vpd = intersect(vpd, { min: rail.vpdMin, max: rail.vpdMax, source: "stage" });
      lightHours =
        lightHours == null ? rail.lightHours : Math.min(lightHours, rail.lightHours);
    }
  }

  const tentStage =
    tent === "main"
      ? hass.state("select.dsc_hub_grow_stage", "")
      : hass.state("select.dsc_hub_clone_mode", "");
  if (!probes.length || (!temp && !rh && !vpd)) {
    const fallbackStage =
      tent === "clone"
        ? tentStage === "Follow Plants" || tentStage === "Clones & Seedlings"
          ? "Seedling"
          : tentStage === "Custom" || tentStage === "Mother"
            ? "Vegetative"
            : ""
        : tentStage;
    const rail = railForStage(fallbackStage);
    if (rail) {
      if (!temp) temp = { min: rail.temp - 1.5, max: rail.temp + 1.5, source: "stage", mixed: false };
      if (!rh) rh = { min: rail.rhMin, max: rail.rhMax, source: "stage", mixed: false };
      if (!vpd) vpd = { min: rail.vpdMin, max: rail.vpdMax, source: "stage", mixed: false };
      if (lightHours == null) lightHours = rail.lightHours;
      if (fallbackStage && !stages.includes(fallbackStage)) stages.push(fallbackStage);
    }
  }

  if (temp && temp.min > temp.max) temp = { ...temp, min: temp.max, max: temp.min, mixed: true };
  if (rh && rh.min > rh.max) rh = { ...rh, min: rh.max, max: rh.min, mixed: true };
  if (vpd && vpd.min > vpd.max) vpd = { ...vpd, min: vpd.max, max: vpd.min, mixed: true };

  const empty = !temp && !rh && !vpd;
  return {
    temp,
    rh,
    vpd,
    lightHours,
    mixed,
    stages,
    needs,
    emptyLabel: empty ? "no plant/stage rail" : null,
  };
}

function stageRailName(rail: Pick<TentWantRail, "stages" | "lightHours">): string | null {
  if (rail.stages.length === 1) {
    const stage = rail.stages[0];
    if (rail.lightHours != null) return `${stage} · ${rail.lightHours}h rail`;
    return `${stage} · stage rail`;
  }
  return null;
}

/** Stage-named chip copy for Want bands (L-04). */
export function wantChipLabel(
  rail: Pick<TentWantRail, "stages" | "lightHours" | "emptyLabel">,
  tone: ZoneTone,
  fallback: string,
): string {
  const named = stageRailName(rail);
  if (!named) return fallback;
  switch (tone) {
    case "ok":
      return named;
    case "warn":
    case "stale":
      return `approaching · ${named}`;
    case "critical":
      return `outside · ${named}`;
    case "muted":
      return rail.emptyLabel ?? named;
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

export function draftTone(
  value: number,
  band: Band | null,
  pairBad?: boolean,
  rail?: Pick<TentWantRail, "stages" | "lightHours" | "emptyLabel">,
): { tone: ZoneTone; label: string } {
  if (pairBad) return { tone: "critical", label: "min > max" };
  if (!band) return { tone: "muted", label: rail?.emptyLabel ?? "no plant/stage rail" };
  const tone = zoneTone({ value, band, margin: (band.max - band.min) * 0.12 });
  const source = band.source === "plant" ? "plant Want" : "stage rail";
  const base =
    tone === "ok"
      ? `in-band · ${source}`
      : tone === "warn" || tone === "stale"
        ? `approaching · ${source}`
        : tone === "critical"
          ? `outside · ${source}`
          : source;
  if (rail && band.source === "stage") {
    return { tone, label: wantChipLabel(rail, tone, base) };
  }
  switch (tone) {
    case "ok":
      return { tone, label: base };
    case "warn":
    case "stale":
      return { tone: "warn", label: base };
    case "critical":
      return { tone, label: base };
    case "muted":
      return { tone, label: base };
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

export function probeWantBand(
  probe: number,
  kind: "moisture" | "ec" | "ph",
  state: (id: string, fb?: string) => string,
): { min: number; max: number } | undefined {
  const lo = Number(state(`sensor.dsc_probe${probe}_want_${kind}_min`, ""));
  const hi = Number(state(`sensor.dsc_probe${probe}_want_${kind}_max`, ""));
  // Do not invent a theater band when Want sensors are absent (Need — / NO TARGET).
  if (Number.isFinite(lo) && Number.isFinite(hi) && hi >= lo) return { min: lo, max: hi };
  return undefined;
}

export function inServiceProbes(state: (id: string, fb?: string) => string): number[] {
  return [...KIT_PROBE_NUMBERS].filter((n) => isProbeInService(n, state));
}

/** Stage rail label for a single tent's Want chips. */
export function tentStageRailLabel(rail: TentWantRail, tent?: "main" | "clone"): string {
  if (rail.stages.length === 1) {
    const h = rail.lightHours != null ? `${rail.lightHours}h rail` : "stage rail";
    return `${rail.stages[0]} · ${h}`;
  }
  if (rail.stages.length > 1) return `Mixed stages · ${rail.stages.join(", ")}`;
  if (tent === "clone") return "2×4 empty · assign probes or set clone mode";
  if (tent === "main") return "4×8 empty · assign probes or grow stage";
  return rail.emptyLabel ?? "no plant/stage rail";
}
