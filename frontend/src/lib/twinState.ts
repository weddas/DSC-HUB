/**
 * Twin state — the one object the 3D twin draws from.
 *
 * Pure: built from the Zone view-model, the entity bus and the fleet snapshot by
 * `hooks/useTwinState.ts`; nothing here reads the DOM or three.js. Every field is
 * either a live reading, a held reading (flagged on the ZoneReading), a roster fact,
 * or a *what-if override* the operator set on the Twin page — and overrides are
 * marked so the stage can label them SIMULATED (plan § 3D twin rule 1: no demo
 * motion; a what-if is opt-in and never written to a device).
 */
import type { ZoneModel, ZoneReading } from "../hooks/useZones";
import type { RosterSlot } from "./probeModel";
import { daysSinceSproutIso } from "./probeModel";
import { railForStage } from "./tentWant";
import { resolveVesselSpec, type VesselSpec } from "./vesselSpec";
import { dewPointC } from "./derived/climate";
import type { ZoneTone } from "./zoneTone";

export type TwinZoneId = "main" | "clone" | "room";

/** Which model a roster plant is drawn with, from its growth stage. */
export type PlantVariant = "seedling" | "veg" | "flower" | "empty";

export interface TwinFan {
  /** Stable id used for duct paths: intake_main · intake_2x4 · exhaust_room · exhaust_outside. */
  id: "intake_main" | "intake_2x4" | "exhaust_room" | "exhaust_outside";
  label: string;
  /** Duty % 0–100; NaN when the fan is not reporting. */
  pct: number;
  /** Learned / allocated CFM; NaN when unknown. */
  cfm: number;
  cfmEntity: string;
  pctEntity: string;
  live: boolean;
  simulated: boolean;
}

export interface TwinLamp {
  zone: TwinZoneId;
  entityId: string;
  label: string;
  on: boolean;
  /** 0–100; null when the driver does not report one. */
  brightnessPct: number | null;
  available: boolean;
  simulated: boolean;
}

export type TwinApplianceId =
  | "heater"
  | "ac"
  | "humidifier"
  | "dehumidifier"
  | "heatmat"
  | "clone_humidifier"
  | "mister";

export interface TwinAppliance {
  id: TwinApplianceId;
  zone: TwinZoneId;
  label: string;
  state: "on" | "off" | "oos" | "offline";
  entityId?: string;
  simulated: boolean;
}

export interface TwinPlant {
  slot: number;
  /** Probe / pot number the plant is assigned to, or null when detached. */
  pot: number | null;
  zone: "main" | "clone" | "unassigned";
  name: string;
  strain: string;
  stage: string;
  variant: PlantVariant;
  /** Pack-3 plant model for the stage; null draws the vessel alone. */
  stageSlug: PlantStageSlug | null;
  /** 0–1 progression inside the variant (drives canopy scale). */
  progress: number;
  day: number | null;
  vessel: VesselSpec;
  /** Estimated pot diameter and height in metres from the vessel volume. */
  potDiameterM: number;
  potHeightM: number;
  /** Soil moisture % from the bound probe, NaN when none / OOS. */
  moisture: number;
  moistureTone: ZoneTone;
  probeOos: boolean;
}

export interface TwinZone {
  id: TwinZoneId;
  label: string;
  role: ZoneModel["role"];
  stage: string | null;
  temp: ZoneReading;
  rh: ZoneReading;
  vpd: ZoneReading;
  /** °C, NaN when temp/RH unknown. */
  dewPoint: number;
  /** Signed °C outside the want band (0 inside). Positive = too warm. */
  tempDelta: number;
  /** Signed % outside the RH want band (0 inside). Positive = too humid. */
  rhDelta: number;
  tone: ZoneTone;
  lightHours: number | null;
}

export interface TwinOverrides {
  fans?: Partial<Record<TwinFan["id"], number>>;
  lamps?: Partial<Record<TwinZoneId, number>>; // brightness % (0 = off)
  appliances?: Partial<Record<TwinApplianceId, boolean>>;
}

export interface TwinState {
  zones: Record<TwinZoneId, TwinZone>;
  fans: TwinFan[];
  lamps: TwinLamp[];
  appliances: TwinAppliance[];
  plants: TwinPlant[];
  /** 2×4 → 4×8 cascade CFM (its own sensor — never an alias of intake 2×4). NaN when unknown. */
  cascadeCfm: number;
  cascadeEntity: string;
  hubOnline: boolean;
  /** The wall control-panel seat (CYD) is online. */
  panelOnline: boolean;
  /** True when any field carries an operator what-if override. */
  simulated: boolean;
  updatedAt: number;
}

export const FAN_DEFS: ReadonlyArray<{
  id: TwinFan["id"];
  label: string;
  pctEntity: string;
  ctrlEntity: string;
  cfmAllocated: string;
  cfmNameplate: string;
}> = [
  {
    id: "intake_main",
    label: "Intake 4×8",
    pctEntity: "sensor.dsc_fan_intake_main_pct",
    ctrlEntity: "fan.dsc_hub_4_inch_intake_fan_main",
    cfmAllocated: "sensor.dsc_cfm_intake_main_allocated",
    cfmNameplate: "sensor.dsc_cfm_intake_main",
  },
  {
    id: "intake_2x4",
    label: "Intake 2×4",
    pctEntity: "sensor.dsc_fan_intake_2x4_pct",
    ctrlEntity: "fan.dsc_hub_4_inch_intake_fan_2x4",
    cfmAllocated: "sensor.dsc_cfm_intake_2x4_allocated",
    cfmNameplate: "sensor.dsc_cfm_intake_2x4",
  },
  {
    id: "exhaust_room",
    label: "Exhaust → room",
    pctEntity: "sensor.dsc_fan_exhaust_room_pct",
    ctrlEntity: "fan.dsc_hub_6_inch_exhaust_room",
    cfmAllocated: "sensor.dsc_cfm_exhaust_recirc_allocated",
    cfmNameplate: "sensor.dsc_cfm_exhaust_recirc",
  },
  {
    id: "exhaust_outside",
    label: "Exhaust → outside",
    pctEntity: "sensor.dsc_fan_exhaust_outside_pct",
    ctrlEntity: "fan.dsc_hub_6_inch_exhaust_outside",
    cfmAllocated: "sensor.dsc_cfm_exhaust_out_allocated",
    cfmNameplate: "sensor.dsc_cfm_exhaust_out",
  },
];

/** Pack-3 `plant-stage--<variant>` slugs, one per hub growth stage. */
export type PlantStageSlug =
  | "germination"
  | "seedling"
  | "early-veg"
  | "veg"
  | "push-veg"
  | "early-flower"
  | "flower"
  | "late-flower"
  | "flush";

/** Hub growth stage → pack-3 plant-stage variant; null when nothing should be drawn (empty / dry / cure). */
export function plantStageSlug(stage: string | undefined | null): PlantStageSlug | null {
  const s = (stage ?? "").toLowerCase();
  if (!s || s === "—" || s.includes("dry") || s.includes("cure") || s.includes("harvest")) return null;
  if (s.includes("germ")) return "germination";
  if (s.includes("seedling") || s.includes("clone")) return "seedling";
  if (s.includes("early veg")) return "early-veg";
  if (s.includes("push") || (s.includes("late") && s.includes("veg"))) return "push-veg";
  if (s.includes("veg")) return "veg";
  if (s.includes("early flower")) return "early-flower";
  if (s.includes("final") || s.includes("flush")) return "flush";
  if (s.includes("late flower")) return "late-flower";
  if (s.includes("flower")) return "flower";
  return "veg";
}

/** Growth stage (hub preset name) → drawn variant + progression inside it. */
export function plantVariantFor(stage: string | undefined | null): { variant: PlantVariant; progress: number } {
  const s = (stage ?? "").toLowerCase();
  if (!s || s === "—") return { variant: "empty", progress: 0 };
  if (s.includes("germ")) return { variant: "seedling", progress: 0.2 };
  if (s.includes("seedling") || s.includes("clone")) return { variant: "seedling", progress: 0.7 };
  if (s.includes("early veg")) return { variant: "veg", progress: 0.35 };
  if (s.includes("push") || s.includes("late") && s.includes("veg")) return { variant: "veg", progress: 1 };
  if (s.includes("veg")) return { variant: "veg", progress: 0.7 };
  if (s.includes("early flower")) return { variant: "flower", progress: 0.3 };
  if (s.includes("final") || s.includes("flush")) return { variant: "flower", progress: 1 };
  if (s.includes("late flower")) return { variant: "flower", progress: 0.9 };
  if (s.includes("flower")) return { variant: "flower", progress: 0.65 };
  if (s.includes("dry") || s.includes("cure") || s.includes("harvest")) return { variant: "empty", progress: 0 };
  return { variant: "veg", progress: 0.6 };
}

/**
 * Pot footprint from vessel volume. Fabric bags are wider than tall; tall PET and
 * air-pots are taller than wide. Honest geometry, not a catalogue fact — the manifest
 * pot is 3 gal (Ø 25 × 22 cm) and is scaled to this.
 */
export function potFootprint(v: VesselSpec): { diameterM: number; heightM: number } {
  const litres = Math.max(1, v.volumeL);
  const m3 = litres / 1000;
  // aspect = height / diameter
  const aspect = v.silhouette === "tall" ? 1.25 : v.silhouette === "airpot" ? 1.15 : v.silhouette === "taper" ? 0.95 : 0.85;
  // volume of a cylinder: π/4 · d² · (aspect · d) → d = cbrt(4V / (π · aspect))
  const d = Math.cbrt((4 * m3) / (Math.PI * aspect));
  return { diameterM: d, heightM: d * aspect };
}

function signedDelta(r: ZoneReading): number {
  if (!r.available || !r.band) return 0;
  if (r.value > r.band.max) return r.value - r.band.max;
  if (r.value < r.band.min) return r.value - r.band.min;
  return 0;
}

export function zoneFromModel(z: ZoneModel): TwinZone {
  return {
    id: z.id,
    label: z.label,
    role: z.role,
    stage: z.stage,
    temp: z.temp,
    rh: z.rh,
    vpd: z.vpd,
    dewPoint: dewPointC(z.temp.value, z.rh.value),
    tempDelta: signedDelta(z.temp),
    rhDelta: signedDelta(z.rh),
    tone: z.tone,
    lightHours: z.lightHours,
  };
}

export type RosterBits = {
  state: (id: string, fallback?: string) => string;
  num: (id: string, fallback?: number) => number;
  probeInService: (n: number) => boolean;
  moistureOf: (n: number) => number;
  moistureTone: (n: number) => ZoneTone;
};

function cleanStr(v: string | undefined, fallback = ""): string {
  if (!v || v === "unknown" || v === "unavailable" || v === "none") return fallback;
  return v;
}

/** Roster slots → drawn plants. Detached plants (no pot) are kept so the twin can show them waiting on the tray. */
export function plantsFromRoster(slots: RosterSlot[], bits: RosterBits): TwinPlant[] {
  const out: TwinPlant[] = [];
  for (const s of slots) {
    const status = cleanStr(s.status);
    if (!status || status === "empty") continue;
    const potN = Number(s.pot);
    const pot = Number.isFinite(potN) && potN >= 1 ? potN : null;
    const tentRaw = pot != null ? bits.state(`input_select.dsc_probe${pot}_tent`, s.tent ?? "") : s.tent ?? "";
    const t = String(tentRaw || "").toLowerCase();
    const zone: TwinPlant["zone"] = t === "main" || t === "4x8" || t === "4×8" ? "main" : t === "clone" || t === "2x4" || t === "2×4" ? "clone" : "unassigned";
    const stage =
      (pot != null ? cleanStr(bits.state(`select.dsc_probe${pot}_growth_stage`, "")) : "") ||
      (pot != null ? cleanStr(bits.state(`sensor.dsc_probe${pot}_expected_stage`, "")) : "") ||
      "";
    const { variant, progress } = plantVariantFor(stage);
    const vesselRaw = pot != null ? bits.state(`input_select.dsc_probe${pot}_vessel`, "") : "";
    const vessel = resolveVesselSpec(vesselRaw || undefined);
    const foot = potFootprint(vessel);
    const sprout = pot != null ? cleanStr(bits.state(`datetime.dsc_probe${pot}_sprout_date`, "")).slice(0, 10) : "";
    const day = daysSinceSproutIso(sprout || s.sprout);
    const probeOos = pot != null ? !bits.probeInService(pot) : true;
    out.push({
      slot: Number(s.slot) || out.length + 1,
      pot,
      zone,
      name: cleanStr(s.nickname) || cleanStr(s.strain) || (pot != null ? cleanStr(bits.state(`text.dsc_probe${pot}_plant_name`, "")) : "") || `Slot ${s.slot}`,
      strain: cleanStr(s.strain),
      stage: stage || "—",
      variant,
      stageSlug: plantStageSlug(stage),
      progress,
      day,
      vessel,
      potDiameterM: foot.diameterM,
      potHeightM: foot.heightM,
      moisture: pot != null && !probeOos ? bits.moistureOf(pot) : NaN,
      moistureTone: pot != null && !probeOos ? bits.moistureTone(pot) : "muted",
      probeOos,
    });
  }
  return out;
}

/** Light hours for a stage (for the photoperiod ring) — from the hub stage rail, else null. */
export function lightHoursFor(stage: string | null): number | null {
  const rail = railForStage(stage ?? "");
  return rail ? rail.lightHours : null;
}

/** Apply the operator's what-if overrides. Pure; marks every touched field `simulated`. */
export function applyOverrides(base: TwinState, o: TwinOverrides | null | undefined): TwinState {
  if (!o) return base;
  let touched = false;
  const fans = base.fans.map((f) => {
    const v = o.fans?.[f.id];
    if (v == null) return f;
    touched = true;
    // CFM scales with duty on an EC fan; keep the learned ratio when we have one.
    const ratio = Number.isFinite(f.cfm) && Number.isFinite(f.pct) && f.pct > 0 ? f.cfm / f.pct : NaN;
    return { ...f, pct: v, cfm: Number.isFinite(ratio) ? ratio * v : f.cfm, live: true, simulated: true };
  });
  const lamps = base.lamps.map((l) => {
    const v = o.lamps?.[l.zone];
    if (v == null) return l;
    touched = true;
    return { ...l, on: v > 0, brightnessPct: v, available: true, simulated: true };
  });
  const appliances = base.appliances.map((a) => {
    const v = o.appliances?.[a.id];
    if (v == null) return a;
    touched = true;
    return { ...a, state: v ? "on" : "off", simulated: true } as TwinAppliance;
  });
  return touched ? { ...base, fans, lamps, appliances, simulated: true } : base;
}

/** Fan blade period in seconds for a duty % — the plan's rule: 2.2 s − duty × 1.9 s, stopped at 0 / offline. */
export function fanPeriodSec(pct: number): number | null {
  if (!Number.isFinite(pct) || pct <= 0) return null;
  return 2.2 - Math.min(100, pct) / 100 * 1.9;
}
