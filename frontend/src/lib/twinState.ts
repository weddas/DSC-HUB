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
  /** The panel seat exists in the fleet at all (false → the scene draws it unbound). */
  panelKnown: boolean;
  /** True when any field carries an operator what-if override. */
  simulated: boolean;
  /** Scene instance id → what drives it, and whether anything actually does. */
  bindings: TwinBindingIndex;
  bindingSummary: TwinBindingSummary;
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

/* ------------------------------------------------------------------ honest bindings ----
 * Every instance the scene draws declares what drives it. Nothing in the twin may move,
 * glow or take a colour that is not a live reading: an instance whose entity is absent,
 * unavailable or simply does not exist yet is drawn in the dead look and says so. The
 * declaration lives here (pure, testable) and the scene looks itself up by instance id,
 * so a model placed without a declaration shows up as unbound instead of quietly faking.
 */

export type TwinBindStatus =
  /** A live reading is driving it right now. */
  | "live"
  /** A what-if override is driving it — never written to a device. */
  | "simulated"
  /** The last reading is being held (the brain stopped publishing but the value stands). */
  | "held"
  /** The entity exists but has no usable value (unavailable / unknown / out of service). */
  | "no-data"
  /** The entity is named here but the brain has never published it. */
  | "missing"
  /** Nothing drives this instance — it is scenery, and is drawn as scenery. */
  | "unbound";

export interface TwinBinding {
  /** Scene instance id — the `Placed` id. */
  id: string;
  label: string;
  group: TwinZoneId | "plants";
  /** What the reading moves in the scene ("blade spin", "emitter glow", …). */
  drives: string;
  entityId: string | null;
  status: TwinBindStatus;
  /** The reading as text when there is one — the audit row quotes it, never invents it. */
  value: string | null;
  note: string;
}

export type TwinBindingIndex = Record<string, TwinBinding>;

export interface TwinBindingSummary {
  total: number;
  live: number;
  simulated: number;
  held: number;
  noData: number;
  missing: number;
  unbound: number;
}

/** True when the status means "this instance has a number behind it". */
export function bindingIsLive(s: TwinBindStatus): boolean {
  return s === "live" || s === "simulated" || s === "held";
}

export type TwinNodeSource =
  | { kind: "zone"; zone: TwinZoneId; reading?: "temp" | "rh" | "vpd" }
  | { kind: "fan"; fan: TwinFan["id"] }
  | { kind: "lamp"; zone: TwinZoneId }
  | { kind: "appliance"; app: TwinApplianceId }
  | { kind: "entity"; entityId: string }
  | { kind: "fleet"; seat: "hub" | "panel" }
  | { kind: "roster" }
  | { kind: "none"; why: string };

export interface TwinNodeDecl {
  id: string;
  label: string;
  group: TwinZoneId | "plants";
  drives: string;
  source: TwinNodeSource;
}

/**
 * Every fixed instance `RigScene` places, and what drives it. Roster instances (vessels,
 * plants, probe stakes) are generated per plant in `buildBindings`.
 */
export const SCENE_NODES: readonly TwinNodeDecl[] = [
  { id: "room", label: "Grow room shell", group: "room", drives: "trim tint by room tone", source: { kind: "zone", zone: "room" } },
  { id: "tent4x8", label: "4×8 tent", group: "main", drives: "trim tint + error pulse by zone tone", source: { kind: "zone", zone: "main" } },
  { id: "tent2x4", label: "2×4 tent", group: "clone", drives: "trim tint + error pulse by zone tone", source: { kind: "zone", zone: "clone" } },

  { id: "lamp4x8", label: "4×8 lamp", group: "main", drives: "emitter glow + light cone", source: { kind: "lamp", zone: "main" } },
  { id: "fanExRoom", label: "Exhaust → room", group: "main", drives: "blade spin + streak count", source: { kind: "fan", fan: "exhaust_room" } },
  { id: "fanExOut", label: "Exhaust → outside", group: "main", drives: "blade spin + streak count", source: { kind: "fan", fan: "exhaust_outside" } },
  { id: "fanIntakeMain", label: "Intake 4×8", group: "main", drives: "blade spin + streak count", source: { kind: "fan", fan: "intake_main" } },
  { id: "filterOut", label: "Carbon filter 4″", group: "main", drives: "—", source: { kind: "none", why: "no sensor on the filter; drawn as kit, never coloured" } },
  { id: "ventPassive", label: "4×8 passive vent", group: "main", drives: "—", source: { kind: "none", why: "a passive mesh port — nothing reports it" } },
  { id: "puck4x8", label: "4×8 T/RH puck", group: "main", drives: "status LED", source: { kind: "zone", zone: "main" } },
  { id: "cam4x8", label: "4×8 camera", group: "main", drives: "—", source: { kind: "none", why: "no camera entity on the brain yet (settings plan § cameras)" } },
  { id: "heater", label: "Heater", group: "main", drives: "element glow + fan spin + shimmer", source: { kind: "appliance", app: "heater" } },
  { id: "humidifier", label: "Humidifier", group: "main", drives: "mist plume", source: { kind: "appliance", app: "humidifier" } },

  { id: "lamp2x4", label: "2×4 lamp", group: "clone", drives: "emitter glow + light cone", source: { kind: "lamp", zone: "clone" } },
  { id: "mat2x4", label: "Heat mat", group: "clone", drives: "element glow + shimmer", source: { kind: "appliance", app: "heatmat" } },
  { id: "fanIntake2x4", label: "Intake 2×4", group: "clone", drives: "blade spin + streak count", source: { kind: "fan", fan: "intake_2x4" } },
  { id: "ventPassive2x4", label: "2×4 passive vent", group: "clone", drives: "—", source: { kind: "none", why: "a passive mesh port — nothing reports it" } },
  { id: "cloneHum", label: "Clone humidifier", group: "clone", drives: "mist plume", source: { kind: "appliance", app: "clone_humidifier" } },
  { id: "mister", label: "Mister", group: "clone", drives: "mist plume", source: { kind: "appliance", app: "mister" } },
  { id: "domeTray", label: "Clone dome tray", group: "clone", drives: "sprouts shown / hidden", source: { kind: "roster" } },
  { id: "puck2x4", label: "2×4 T/RH puck", group: "clone", drives: "status LED", source: { kind: "zone", zone: "clone" } },
  { id: "cam2x4", label: "2×4 camera", group: "clone", drives: "—", source: { kind: "none", why: "no camera entity on the brain yet (settings plan § cameras)" } },

  { id: "dehum", label: "Dehumidifier", group: "room", drives: "fan spin + status LED", source: { kind: "appliance", app: "dehumidifier" } },
  { id: "ac", label: "Portable AC", group: "room", drives: "fan spin + status LED", source: { kind: "appliance", app: "ac" } },
  { id: "tank", label: "Reservoir 60 L", group: "room", drives: "—", source: { kind: "none", why: "no level or temperature sensor in the tank" } },
  { id: "brain", label: "Brain (Pi)", group: "room", drives: "power / activity / Zigbee LEDs", source: { kind: "fleet", seat: "hub" } },
  { id: "panel", label: "Wall panel (CYD)", group: "room", drives: "screen + status LED", source: { kind: "fleet", seat: "panel" } },
  { id: "hub", label: "Hub (CYD)", group: "room", drives: "screen + link LEDs", source: { kind: "fleet", seat: "hub" } },
];

/** What the scene may ask about an entity — supplied by `useTwinState` from the entity bus. */
export interface TwinEntityProbe {
  /** The brain has published this entity at some point. */
  known: (entityId: string) => boolean;
  /** It has a usable value right now. */
  available: (entityId: string) => boolean;
  /** Its state as text, for the audit row. */
  text: (entityId: string) => string | null;
}

function readingOf(z: TwinZone, which: "temp" | "rh" | "vpd"): ZoneReading {
  return which === "rh" ? z.rh : which === "vpd" ? z.vpd : z.temp;
}

function fmtReading(r: ZoneReading): string | null {
  if (!r.available) return null;
  const d = r.unit === "kPa" ? 2 : r.unit === "%" ? 0 : 1;
  return `${r.value.toFixed(d)} ${r.unit}`.trim();
}

function entityStatus(entityId: string, probe: TwinEntityProbe): { status: TwinBindStatus; value: string | null } {
  if (probe.available(entityId)) return { status: "live", value: probe.text(entityId) };
  if (probe.known(entityId)) return { status: "no-data", value: null };
  return { status: "missing", value: null };
}

function bindingFor(decl: TwinNodeDecl, state: TwinState, probe: TwinEntityProbe): TwinBinding {
  const base = { id: decl.id, label: decl.label, group: decl.group, drives: decl.drives };
  const s = decl.source;
  switch (s.kind) {
    case "zone": {
      const r = readingOf(state.zones[s.zone], s.reading ?? "temp");
      const value = fmtReading(r);
      const status: TwinBindStatus = r.available ? (r.stale ? "held" : "live") : probe.known(r.entityId) ? "no-data" : "missing";
      return { ...base, entityId: r.entityId, status, value, note: r.derived ? `derived: ${r.derived}` : "" };
    }
    case "fan": {
      const f = state.fans.find((x) => x.id === s.fan);
      if (!f) return { ...base, entityId: null, status: "unbound", value: null, note: "no fan of this id in the plant" };
      const value = Number.isFinite(f.pct) ? `${Math.round(f.pct)} %` : null;
      if (f.simulated) return { ...base, entityId: f.pctEntity, status: "simulated", value, note: "what-if override — not written" };
      if (f.live) return { ...base, entityId: f.pctEntity, status: "live", value, note: Number.isFinite(f.cfm) ? `${Math.round(f.cfm)} CFM from ${f.cfmEntity}` : "no CFM reading" };
      return { ...base, entityId: f.pctEntity, status: probe.known(f.pctEntity) ? "no-data" : "missing", value: null, note: "not reporting a duty" };
    }
    case "lamp": {
      const l = state.lamps.find((x) => x.zone === s.zone);
      if (!l) return { ...base, entityId: null, status: "unbound", value: null, note: "no lamp entity for this zone" };
      const value = l.brightnessPct != null ? `${Math.round(l.brightnessPct)} %` : l.on ? "on" : "off";
      if (l.simulated) return { ...base, entityId: l.entityId, status: "simulated", value, note: "what-if override — not written" };
      if (l.available) return { ...base, entityId: l.entityId, status: "live", value, note: "" };
      return { ...base, entityId: l.entityId, status: probe.known(l.entityId) ? "no-data" : "missing", value: null, note: "driver not reporting" };
    }
    case "appliance": {
      const a = state.appliances.find((x) => x.id === s.app);
      if (!a) return { ...base, entityId: null, status: "unbound", value: null, note: "this appliance is not in the kit" };
      if (a.simulated) return { ...base, entityId: a.entityId ?? null, status: "simulated", value: a.state, note: "what-if override — not written" };
      if (a.state === "on" || a.state === "off") return { ...base, entityId: a.entityId ?? null, status: "live", value: a.state, note: "" };
      return { ...base, entityId: a.entityId ?? null, status: "no-data", value: null, note: a.state === "oos" ? "out of service" : "offline" };
    }
    case "entity": {
      const r = entityStatus(s.entityId, probe);
      return { ...base, entityId: s.entityId, status: r.status, value: r.value, note: "" };
    }
    case "fleet": {
      if (s.seat === "panel") {
        if (!state.panelKnown) return { ...base, entityId: null, status: "unbound", value: null, note: "no panel seat in the fleet" };
        return { ...base, entityId: "fleet.panel", status: "live", value: state.panelOnline ? "online" : "offline", note: "" };
      }
      return { ...base, entityId: "fleet.hub", status: "live", value: state.hubOnline ? "online" : "offline", note: "" };
    }
    case "roster": {
      const n = state.plants.length;
      return { ...base, entityId: null, status: n ? "live" : "no-data", value: n ? `${n} on roster` : null, note: "driven by the roster, not an entity" };
    }
    case "none":
    default:
      return { ...base, entityId: null, status: "unbound", value: null, note: s.why };
  }
}

/** Instance ids for a roster plant — the vessel, the plant on it, and its probe stake. */
export function plantInstanceIds(p: TwinPlant): { vessel: string; plant: string; probe: string | null } {
  const vessel = `plant-${p.slot}`;
  return { vessel, plant: `${vessel}-plant`, probe: p.pot != null ? `probe-${p.pot}` : null };
}

function plantBindings(state: TwinState, probe: TwinEntityProbe): TwinBinding[] {
  const out: TwinBinding[] = [];
  for (const p of state.plants) {
    const ids = plantInstanceIds(p);
    const moistureId = p.pot != null ? `sensor.dsc_probe${p.pot}_got_moisture` : null;
    const stageId = p.pot != null ? `select.dsc_probe${p.pot}_growth_stage` : null;
    const zoneLabel = p.zone === "main" ? "4×8" : p.zone === "clone" ? "2×4" : "unassigned";

    if (!moistureId) {
      out.push({ id: ids.vessel, label: `${p.name} · vessel`, group: "plants", drives: "soil tint", entityId: null, status: "unbound", value: null, note: "no pot assigned — drawn on the waiting bench" });
    } else if (p.probeOos) {
      out.push({ id: ids.vessel, label: `${p.name} · vessel`, group: "plants", drives: "soil tint by probe moisture", entityId: moistureId, status: "no-data", value: null, note: `probe ${p.pot} out of service` });
    } else {
      const r = entityStatus(moistureId, probe);
      out.push({ id: ids.vessel, label: `${p.name} · vessel`, group: "plants", drives: "soil tint by probe moisture", entityId: moistureId, status: r.status, value: Number.isFinite(p.moisture) ? `${Math.round(p.moisture)} %` : r.value, note: `${p.vessel.label} · ${zoneLabel}` });
    }

    if (p.stageSlug) {
      // The stage the plant is *drawn* at comes from the probe's select when there is one
      // and from the roster's expected stage otherwise — say which, rather than greying a
      // plant whose stage is perfectly well known.
      const hasStage = p.stage !== "" && p.stage !== "—";
      const fromSelect = !!stageId && probe.available(stageId);
      const day = p.day != null ? `day ${p.day}` : "no sprout date";
      out.push({
        id: ids.plant,
        label: `${p.name} · plant`,
        group: "plants",
        drives: "stage model + canopy scale + leaf tint",
        entityId: fromSelect ? stageId : null,
        status: hasStage ? "live" : "no-data",
        value: hasStage ? p.stage : null,
        note: hasStage && !fromSelect ? `${day} · stage from the roster, not a probe select` : day,
      });
    }

    if (ids.probe && moistureId) {
      out.push({
        id: ids.probe,
        label: `Probe ${p.pot}`,
        group: "plants",
        drives: "stake LED by moisture tone",
        entityId: moistureId,
        status: p.probeOos ? "no-data" : entityStatus(moistureId, probe).status,
        value: Number.isFinite(p.moisture) ? `${Math.round(p.moisture)} %` : null,
        note: p.probeOos ? "out of service" : "",
      });
    }
  }
  return out;
}

export function summariseBindings(index: TwinBindingIndex): TwinBindingSummary {
  const s: TwinBindingSummary = { total: 0, live: 0, simulated: 0, held: 0, noData: 0, missing: 0, unbound: 0 };
  for (const b of Object.values(index)) {
    s.total += 1;
    if (b.status === "live") s.live += 1;
    else if (b.status === "simulated") s.simulated += 1;
    else if (b.status === "held") s.held += 1;
    else if (b.status === "no-data") s.noData += 1;
    else if (b.status === "missing") s.missing += 1;
    else s.unbound += 1;
  }
  return s;
}

/**
 * Resolve every scene instance against the fleet. Pure — the probe is the only door to
 * live data, so this is the whole honesty contract in one function.
 */
export function withBindings(state: TwinState, probe: TwinEntityProbe): TwinState {
  const index: TwinBindingIndex = {};
  for (const d of SCENE_NODES) index[d.id] = bindingFor(d, state, probe);
  for (const b of plantBindings(state, probe)) index[b.id] = b;
  return { ...state, bindings: index, bindingSummary: summariseBindings(index) };
}
