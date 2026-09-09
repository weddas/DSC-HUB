import { useMemo } from "react";
import { useEntityBus } from "./useEntityBus";
import { useFleet } from "./useFleet";
import { useHeldReading } from "./useHeldReading";
import {
  daysSinceSproutIso,
  isProbeInServiceWithFleet,
  probeLabel,
  probesInTent,
  type PlantProbeModel,
} from "../lib/probeModel";
import { probeMoistureNum } from "../lib/probeReading";
import { probeWantBand, railForStage, tentWantRail } from "../lib/tentWant";
import { inventoryInService } from "../lib/fleetModel";
import { dliFromPpfdHours, readCalibratedPpfd } from "../lib/dliEstimate";
import { buildCloneLightDesk } from "../lib/lightViewModel";
import { leafVpdKpa, vpdKpa } from "../lib/derived/climate";
import { useBrainNumber } from "./useBrainSettings";
import { defaultBandMargin, zoneTone, type ToneBand, type ZoneTone } from "../lib/zoneTone";
import type { PhaseKey } from "../components/Panel";
import { BRAIN_ZONE_ID, useZoneMeta } from "./useZoneMeta";
import type { ZoneRole } from "../lib/zonesApi";

/**
 * Zone view-model (Pass A, SPA-only): builds the two tents and the room from the
 * entities the kit exposes today. Pass C moves this behind the brain's `/zones`.
 * Every number here is either a live reading, a held reading (flagged), or derived
 * with a provenance string — never a sample.
 */

export type ZoneId = "main" | "clone" | "room";

export interface ZoneReading {
  entityId: string;
  value: number;
  unit: string;
  stale: boolean;
  heldAt?: number;
  available: boolean;
  band?: ToneBand;
  tone: ZoneTone;
  /** Set when the value is computed, not measured — shown as provenance. */
  derived?: string;
}

export interface ZoneAppliance {
  id: string;
  label: string;
  state: "on" | "off" | "oos" | "offline";
  tone: "ok" | "muted" | "warn" | "bad";
  dashed?: boolean;
  entityId?: string;
}

export interface ZoneLamp {
  entityId: string;
  available: boolean;
  on: boolean;
  /** `LAMP`, `TWIN`, or `WINDOW` (schedule window only — no lamp bound). */
  kind: "lamp" | "twin" | "window";
  brightnessPct: number | null;
  ppfd: number | null;
  ppfdSource: "calibrated" | null;
  dli: number | null;
}

export interface ZoneProbe {
  n: number;
  label: string;
  plantName: string;
  moisture: number;
  tone: ZoneTone;
  oos: boolean;
}

export interface ZoneModel {
  id: ZoneId;
  label: string;
  /** Operator name from the brain (defaults to the size label). */
  name: string;
  /** Brain zone role: grow, dry, cure, empty, or room for the lung. Flips in Settings > Zones. */
  role: ZoneRole;
  roleSince: number | null;
  stage: string | null;
  stageShort: string | null;
  /** Where the live climate band came from: the plants' own rail or the stage preset. */
  wantSource: "plant" | "stage" | null;
  /** Hub grow_stage select vs the plants' expected stage, when the brain says they disagree. */
  stageConflict: { hub: string; plant: string; phaseMismatch: boolean } | null;
  phase: PhaseKey | null;
  day: number | null;
  cultivar: string | null;
  temp: ZoneReading;
  rh: ZoneReading;
  vpd: ZoneReading;
  /** Leaf VPD estimate (air VPD with the default leaf offset) — derived. */
  leafVpd: number | null;
  lamp: ZoneLamp | null;
  appliances: ZoneAppliance[];
  probes: ZoneProbe[];
  lightHours: number | null;
  /** Worst reading tone — drives the panel border. */
  tone: ZoneTone;
}

const TONE_RANK: Record<ZoneTone, number> = { critical: 4, warn: 3, stale: 2, ok: 1, muted: 0 };

export function worstTone(tones: ZoneTone[]): ZoneTone {
  return tones.reduce<ZoneTone>((acc, t) => (TONE_RANK[t] > TONE_RANK[acc] ? t : acc), "muted");
}

/** Hub stage preset → design phase chip (Veg · Gen · Bulk · Finish · Dry · Cure). */
export function phaseFromStage(stage: string | null | undefined): PhaseKey | null {
  if (!stage) return null;
  const s = stage.toLowerCase();
  if (s.includes("dry")) return "dry";
  if (s.includes("cure")) return "cure";
  if (s.includes("final") || s.includes("late flower")) return "finish";
  if (s === "flowering" || s.includes("mid flower")) return "bulk";
  if (s.includes("early flower")) return "gen";
  if (s.includes("veg") || s.includes("seedling") || s.includes("germ") || s.includes("clone") || s.includes("mother"))
    return "veg";
  return null;
}

function band(b: { min: number; max: number } | null | undefined): ToneBand | undefined {
  return b && Number.isFinite(b.min) && Number.isFinite(b.max) ? { min: b.min, max: b.max } : undefined;
}

function reading(
  entityId: string,
  held: { value: number; stale: boolean; heldAt?: number },
  unit: string,
  b?: ToneBand,
  derived?: string,
): ZoneReading {
  const available = Number.isFinite(held.value);
  const tone = zoneTone({
    value: held.value,
    band: b,
    margin: defaultBandMargin(b, unit),
    stale: available && held.stale,
    available,
  });
  return { entityId, value: held.value, unit, stale: held.stale, heldAt: held.heldAt, available, band: b, tone, derived };
}

function cultivarOf(probes: PlantProbeModel[]): string | null {
  const names = Array.from(
    new Set(
      probes
        .map((p) => (p.strainDisplay && p.strainDisplay !== "—" ? p.strainDisplay : p.plantName))
        .filter((n) => n && n !== "—"),
    ),
  );
  return names.length ? names.join(" · ") : null;
}

function dayOf(probes: PlantProbeModel[]): number | null {
  const days = probes.map((p) => daysSinceSproutIso(p.sprout)).filter((d): d is number => d != null);
  return days.length ? Math.max(...days) : null;
}

export function useZones(): { main: ZoneModel; clone: ZoneModel; room: ZoneModel } {
  const leafOffsetC = useBrainNumber("leaf_offset_c", 2);
  const bus = useEntityBus();
  const { state, num, entity, available, tick } = bus;
  const fleet = useFleet();

  const tentT = useHeldReading("sensor.dsc_hub_tent_temperature");
  const tentRh = useHeldReading("sensor.dsc_hub_tent_humidity");
  const tentVpd = useHeldReading("sensor.dsc_hub_vpd_kpa");
  const cloneT = useHeldReading("sensor.dsc_hub_clone_temperature");
  const cloneRh = useHeldReading("sensor.dsc_hub_clone_humidity");
  const cloneVpd = useHeldReading("sensor.dsc_hub_clone_vpd_kpa");
  const roomT = useHeldReading("sensor.dsc_hub_room_temperature");
  const roomRh = useHeldReading("sensor.dsc_hub_room_humidity");
  const roomVpdEntity = available("sensor.dsc_hub_room_vpd_kpa") ? "sensor.dsc_hub_room_vpd_kpa" : "";
  const roomVpdHeld = useHeldReading(roomVpdEntity);
  const zoneMeta = useZoneMeta();
  const metaById = zoneMeta.byId;

  return useMemo(() => {
    const hass = { state, entity };

    const buildTent = (
      tent: "main" | "clone",
      t: typeof tentT,
      rh: typeof tentRh,
      vpd: typeof tentVpd,
    ): ZoneModel => {
      const meta = metaById[BRAIN_ZONE_ID[tent]];
      const role: ZoneRole = meta?.role && meta.role !== "room" ? meta.role : "grow";
      let rail = tentWantRail(tent, hass);
      const probes = probesInTent(tent, state, entity);
      // A non-grow role overrides the plant/stage rail: Dry uses the hub's Dry Mode preset,
      // Cure and Empty carry no climate band at all (grey, never a guessed target).
      if (role === "dry") {
        const dry = railForStage("Dry Mode");
        if (dry) {
          rail = {
            ...rail,
            temp: { min: dry.temp - 1.5, max: dry.temp + 1.5, source: "stage", mixed: false },
            rh: { min: dry.rhMin, max: dry.rhMax, source: "stage", mixed: false },
            vpd: { min: dry.vpdMin, max: dry.vpdMax, source: "stage", mixed: false },
            lightHours: 0,
            stages: ["Dry Mode"],
          };
        }
      } else if (role === "cure" || role === "empty") {
        rail = { ...rail, temp: null, rh: null, vpd: null, lightHours: null, stages: [] };
      }
      // 4×8 stage is the hub preset; the 2×4 has a climate *mode* (Follow 4x8 · Follow Plants ·
      // Custom · Off), which is policy, not a growth phase — it rides in the tag row instead.
      const stageRaw = tent === "main" ? state("select.dsc_hub_grow_stage", "") : "";
      const stage =
        rail.stages[0] ?? (stageRaw && stageRaw !== "—" ? stageRaw : tent === "clone" ? "Clone & veg" : null);
      const stageRail = railForStage(stage ?? "");
      const cloneMode = tent === "clone" ? state("select.dsc_hub_clone_mode", "") : "";
      const tempR = reading(
        tent === "main" ? "sensor.dsc_hub_tent_temperature" : "sensor.dsc_hub_clone_temperature",
        t,
        "°C",
        band(rail.temp),
      );
      const rhR = reading(
        tent === "main" ? "sensor.dsc_hub_tent_humidity" : "sensor.dsc_hub_clone_humidity",
        rh,
        "%",
        band(rail.rh),
      );
      const vpdR = reading(
        tent === "main" ? "sensor.dsc_hub_vpd_kpa" : "sensor.dsc_hub_clone_vpd_kpa",
        vpd,
        "kPa",
        band(rail.vpd),
      );
      // Same assumption the brain uses (leaf = air - leaf_offset_c), read from the brain.
      const leaf = leafVpdKpa(t.value, rh.value, -leafOffsetC);

      // Lamp — 2×4 has the dimmable SF1000; 4×8 has the Twin SF1000 when wired, else only
      // the schedule window is known (that is not a lamp, and is labelled as such).
      let lamp: ZoneLamp | null = null;
      const lightHours = rail.lightHours ?? stageRail?.lightHours ?? null;
      if (tent === "clone") {
        const desk = buildCloneLightDesk({ state, num, entity });
        const on = desk.sfOn && (desk.sfBrightness == null || desk.sfBrightness > 0);
        const ppfd = on ? readCalibratedPpfd(num, entity) : null;
        lamp = {
          entityId: "light.dsc_hub_sf1000_dimmer",
          available: available("light.dsc_hub_sf1000_dimmer"),
          on,
          kind: "lamp",
          brightnessPct: desk.sfBrightness,
          ppfd,
          ppfdSource: ppfd != null ? "calibrated" : null,
          dli: ppfd != null && lightHours != null ? dliFromPpfdHours(ppfd, lightHours) : null,
        };
      } else {
        const twinState = state("light.dsc_hub_twin_sf1000", "");
        const twinAvailable =
          available("light.dsc_hub_twin_sf1000") &&
          twinState !== "unavailable" &&
          twinState !== "unknown" &&
          twinState !== "";
        if (twinAvailable) {
          const bri = Number(entity("light.dsc_hub_twin_sf1000")?.attributes?.brightness ?? NaN);
          lamp = {
            entityId: "light.dsc_hub_twin_sf1000",
            available: true,
            on: twinState === "on",
            kind: "twin",
            brightnessPct: Number.isFinite(bri) ? Math.round(bri > 100 ? (bri / 255) * 100 : bri) : null,
            ppfd: null,
            ppfdSource: null,
            dli: null,
          };
        } else {
          lamp = {
            entityId: "binary_sensor.dsc_hub_4x8_window_open",
            available: available("binary_sensor.dsc_hub_4x8_window_open"),
            on: state("binary_sensor.dsc_hub_4x8_window_open") === "on",
            kind: "window",
            brightnessPct: null,
            ppfd: null,
            ppfdSource: null,
            dli: null,
          };
        }
      }

      const on = (id: string) => state(id) === "on";
      const appliances: ZoneAppliance[] = [];
      if (tent === "main") {
        appliances.push({
          id: "heater",
          label: on("switch.dsc_hub_heater_demand") ? "HEAT ON" : "HEAT",
          state: on("switch.dsc_hub_heater_demand") ? "on" : "off",
          tone: on("switch.dsc_hub_heater_demand") ? "ok" : "muted",
          entityId: "switch.dsc_hub_heater_demand",
        });
        const acOos = state("binary_sensor.dsc_ac_capacity_offline") === "on";
        appliances.push({
          id: "ac",
          label: acOos ? "COOL OUT" : on("switch.dsc_hub_ac_demand") ? "COOL ON" : "COOL",
          state: acOos ? "oos" : on("switch.dsc_hub_ac_demand") ? "on" : "off",
          tone: acOos ? "muted" : on("switch.dsc_hub_ac_demand") ? "ok" : "muted",
          dashed: acOos,
          entityId: "switch.dsc_hub_ac_demand",
        });
        appliances.push({
          id: "humidifier",
          label: on("switch.dsc_hub_humidifier_demand") ? "HUM ON" : "HUM",
          state: on("switch.dsc_hub_humidifier_demand") ? "on" : "off",
          tone: on("switch.dsc_hub_humidifier_demand") ? "ok" : "muted",
          entityId: "switch.dsc_hub_humidifier_demand",
        });
        const dehumOffline = !available("switch.dsc_de_humidifier_main_relay");
        appliances.push({
          id: "dehumidifier",
          label: dehumOffline ? "DEHUM OFFLINE" : on("switch.dsc_hub_dehumidifier_demand") ? "DEHUM ON" : "DEHUM",
          state: dehumOffline ? "offline" : on("switch.dsc_hub_dehumidifier_demand") ? "on" : "off",
          tone: dehumOffline ? "bad" : on("switch.dsc_hub_dehumidifier_demand") ? "ok" : "muted",
          entityId: "switch.dsc_hub_dehumidifier_demand",
        });
      } else {
        const matT = num("sensor.dsc_coldest_root_zone_temp", NaN);
        const rootFault = state("binary_sensor.dsc_hub_root_zone_sensor_fault") === "on";
        const matOn = on("switch.dsc_hub_grow_mat_demand");
        appliances.push({
          id: "heatmat",
          label: `MAT${matOn ? " ON" : ""}${Number.isFinite(matT) ? ` · ${matT.toFixed(1)} °C` : ""}`,
          state: matOn ? "on" : "off",
          tone: rootFault ? "bad" : matOn ? "ok" : "muted",
          entityId: "switch.dsc_hub_grow_mat_demand",
        });
        const chumOos = state("binary_sensor.dsc_clone_humidifier_capacity_offline") === "on";
        appliances.push({
          id: "clone_humidifier",
          label: chumOos ? "C-HUM OUT" : on("switch.dsc_hub_clone_humidifier_demand") ? "C-HUM ON" : "C-HUM",
          state: chumOos ? "oos" : on("switch.dsc_hub_clone_humidifier_demand") ? "on" : "off",
          tone: chumOos ? "muted" : on("switch.dsc_hub_clone_humidifier_demand") ? "ok" : "muted",
          dashed: chumOos,
          entityId: "switch.dsc_hub_clone_humidifier_demand",
        });
        if (cloneMode && cloneMode !== "—" && cloneMode !== "unknown") {
          appliances.push({
            id: "clone_mode",
            label: `CLIMATE · ${cloneMode.toUpperCase().replace("4X8", "4×8")}`,
            state: "off",
            tone: "muted",
            entityId: "select.dsc_hub_clone_mode",
          });
        }
        const misterIn = inventoryInService(fleet, "mister");
        appliances.push({
          id: "mister",
          label: misterIn ? "MISTER" : "MISTER OUT",
          state: misterIn ? "off" : "oos",
          tone: "muted",
          dashed: !misterIn,
        });
      }

      const zoneProbes: ZoneProbe[] = probes.map((p) => {
        const oos = !isProbeInServiceWithFleet(p.probe, state, fleet);
        const moisture = oos ? NaN : probeMoistureNum(num, state, p.probe);
        const mb = oos ? undefined : probeWantBand(p.probe, "moisture", state);
        return {
          n: p.probe,
          label: probeLabel(p.probe),
          plantName: p.plantName,
          moisture,
          tone: zoneTone({ value: moisture, band: mb, margin: defaultBandMargin(mb, "%"), available: !oos }),
          oos,
        };
      });

      const roleDay =
        meta?.role_since != null ? Math.max(1, Math.floor((Date.now() / 1000 - meta.role_since) / 86400) + 1) : null;
      return {
        id: tent,
        label: tent === "main" ? "4×8" : "2×4",
        name: meta?.name ?? (tent === "main" ? "4×8" : "2×4"),
        role,
        roleSince: meta?.role_since ?? null,
        stage: role === "grow" ? stage : role === "dry" ? "Dry Mode" : null,
        stageShort: role === "grow" ? (stageRail?.short ?? stage) : role.toUpperCase(),
        wantSource: rail.temp?.source ?? rail.rh?.source ?? rail.vpd?.source ?? null,
        stageConflict: (() => {
          if (tent !== "main" || role !== "grow") return null;
          const e = entity("binary_sensor.dsc_stage_disagreement");
          const a = (e?.attributes ?? {}) as { hub_stage?: string; plant_stage?: string; stages_differ?: boolean };
          if (!a.stages_differ || !a.hub_stage || !a.plant_stage) return null;
          return { hub: a.hub_stage, plant: a.plant_stage, phaseMismatch: e?.state === "on" };
        })(),
        phase:
          role === "grow"
            ? (phaseFromStage(stage) ?? (tent === "clone" ? "veg" : null))
            : role === "dry"
              ? "dry"
              : role === "cure"
                ? "cure"
                : null,
        day: role === "grow" ? dayOf(probes) : roleDay,
        cultivar: cultivarOf(probes),
        temp: tempR,
        rh: rhR,
        vpd: vpdR,
        leafVpd: Number.isFinite(leaf) ? leaf : null,
        lamp,
        appliances,
        probes: zoneProbes,
        lightHours,
        tone: worstTone([tempR.tone, rhR.tone, vpdR.tone]),
      };
    };

    const main = buildTent("main", tentT, tentRh, tentVpd);
    const clone = buildTent("clone", cloneT, cloneRh, cloneVpd);

    // Room: T/RH are measured; VPD is the hub's if it publishes one, else derived here.
    const roomTempR = reading("sensor.dsc_hub_room_temperature", roomT, "°C");
    const roomRhR = reading("sensor.dsc_hub_room_humidity", roomRh, "%");
    const roomVpdDerived = vpdKpa(roomT.value, roomRh.value);
    const roomVpdR = roomVpdEntity
      ? reading(roomVpdEntity, roomVpdHeld, "kPa")
      : reading(
          "",
          { value: roomVpdDerived, stale: roomT.stale || roomRh.stale, heldAt: roomT.heldAt ?? roomRh.heldAt },
          "kPa",
          undefined,
          "from room T + RH",
        );
    const roomMeta = metaById[BRAIN_ZONE_ID.room];
    const room: ZoneModel = {
      id: "room",
      label: "ROOM",
      name: roomMeta?.name ?? "Grow room",
      role: "room",
      roleSince: null,
      stage: null,
      stageShort: null,
      wantSource: null,
      stageConflict: null,
      phase: null,
      day: null,
      cultivar: null,
      temp: roomTempR,
      rh: roomRhR,
      vpd: roomVpdR,
      leafVpd: null,
      lamp: null,
      appliances: [],
      probes: [],
      lightHours: null,
      tone: worstTone([roomTempR.tone, roomRhR.tone, roomVpdR.tone]),
    };

    return { main, clone, room };
    // tick: the bus re-renders us when a tracked entity changes; held readings carry their own identity.
  }, [
    leafOffsetC,
    state,
    num,
    entity,
    available,
    tick,
    fleet,
    tentT,
    tentRh,
    tentVpd,
    cloneT,
    cloneRh,
    cloneVpd,
    roomT,
    roomRh,
    roomVpdEntity,
    roomVpdHeld,
    metaById,
  ]);
}
