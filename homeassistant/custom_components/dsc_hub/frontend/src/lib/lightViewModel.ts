import { parseTimeToMinutes, resolveLightsOnClock, tentPhotoperiodFollowsMain } from "./lightSchedule";

/** Bus slice used by the clone light desk (HA or Pi fleet). */
export type LightDeskBus = {
  state: (id: string, fb?: string) => string;
  num: (id: string, fb?: number) => number;
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined;
};

export type LightDeskModel = {
  sfOn: boolean;
  sfBrightness: number | null;
  headerLabel: string;
  scheduleValid: boolean;
  scheduleHonesty: string;
  wantHours: number | null;
  gotHours: number | null;
  deviationHours: number | null;
  followsMain: boolean;
  autoPhotoperiod: boolean;
  manualHold: boolean;
};

/**
 * SF header chip: ON only when on and brightness is null or >0;
 * "ON · 0%" when on at zero; OFF when not on.
 */
export function headerSfLabel({
  sfOn,
  sfBrightness,
}: {
  sfOn: boolean;
  sfBrightness: number | null;
}): string {
  if (!sfOn) return "SF1000 OFF";
  if (sfBrightness === 0) return "SF1000 ON · 0%";
  return "SF1000 ON";
}

function finiteOrNull(n: number): number | null {
  return Number.isFinite(n) ? n : null;
}

/** HA brightness is 0–255; fleet may already be 0–1 or 0–100. Normalize to percent. */
export function readSfBrightnessPct(
  entity: { attributes?: Record<string, unknown> } | undefined,
): number | null {
  const raw = entity?.attributes?.brightness;
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  if (n > 0 && n <= 1) return Math.round(n * 100);
  if (n > 100) return Math.round((n / 255) * 100);
  return Math.round(n);
}

function timeUnset(val: string): boolean {
  const t = String(val || "").trim();
  if (!t || t === "—" || t === "unknown" || t === "unavailable" || t === "none") return true;
  // Date-only helpers (YYYY-MM-DD) must not count as a lights-on clock.
  return parseTimeToMinutes(t) == null;
}

/**
 * Single clone-light story for Light page + Overview SF chip.
 * Schedule validity mirrors brain light_loop: Follow + missing main on-time → invalid.
 */
export function buildCloneLightDesk(bus: LightDeskBus): LightDeskModel {
  const { state, num, entity } = bus;
  const sfEntity = entity("light.dsc_hub_sf1000_dimmer");
  const sfOn = state("light.dsc_hub_sf1000_dimmer") === "on";
  const sfBrightness = readSfBrightnessPct(sfEntity);

  const followsMain = tentPhotoperiodFollowsMain(state);
  const mainOnTime = resolveLightsOnClock(
    state,
    "time.dsc_hub_lights_on_time",
    "datetime.dsc_hub_lights_on_time",
  );
  const cloneOnTime = resolveLightsOnClock(state, "time.dsc_hub_clone_lights_on_time");

  const honestyFrom =
    entity("sensor.dsc_clone_expected_light_hours")?.attributes?.honesty ??
    entity("sensor.dsc_expected_light_hours")?.attributes?.honesty ??
    entity("time.dsc_hub_lights_on_time")?.attributes?.honesty;
  const honestyAttr = String(honestyFrom ?? "").trim();

  let scheduleValid: boolean;
  let scheduleHonesty: string;
  if (followsMain && timeUnset(mainOnTime)) {
    scheduleValid = false;
    scheduleHonesty =
      honestyAttr && /no schedule|unset/i.test(honestyAttr)
        ? honestyAttr
        : "no schedule: main on-time unset";
  } else if (!followsMain && timeUnset(cloneOnTime)) {
    // Independent still needs its own on-time for clocks/timeline.
    scheduleValid = false;
    scheduleHonesty = honestyAttr && honestyAttr !== "ok" ? honestyAttr : "no schedule: clone on-time unset";
  } else {
    scheduleValid = true;
    scheduleHonesty = honestyAttr || "ok";
  }

  // Brain rule: never claim invalid while Follow + valid — clamp.
  if (followsMain && scheduleValid === false && !timeUnset(mainOnTime)) {
    scheduleValid = true;
    scheduleHonesty = honestyAttr || "ok";
  }

  return {
    sfOn,
    sfBrightness,
    headerLabel: headerSfLabel({ sfOn, sfBrightness }),
    scheduleValid,
    scheduleHonesty,
    wantHours: finiteOrNull(num("sensor.dsc_clone_expected_light_hours")),
    gotHours: finiteOrNull(num("sensor.dsc_lights_on_today_2x4")),
    deviationHours: finiteOrNull(num("sensor.dsc_lights_deviation_today")),
    followsMain,
    autoPhotoperiod: state("switch.dsc_hub_auto_photoperiod") === "on",
    manualHold: state("switch.dsc_hub_manual_light_hold") === "on",
  };
}
