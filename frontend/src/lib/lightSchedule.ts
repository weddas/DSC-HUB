import type { TentId } from "./probeModel";

export type TentPhotoperiodId = Exclude<TentId, "unassigned">;

export type LightScheduleInput = {
  lightsOnTime: string;
  expectedHours: number;
};

export type LightSchedulePhase = "lit" | "dark";

export type LightScheduleClocks = {
  valid: boolean;
  phase: LightSchedulePhase;
  /** Elapsed since today's (or yesterday's) lights-on when lit. */
  sinceOnMs: number | null;
  /** Remaining until today's lights-off when lit. */
  untilOffMs: number | null;
  /** Remaining until next lights-on when dark. */
  untilOnMs: number | null;
  /** Elapsed since last lights-off when dark. */
  sinceOffMs: number | null;
  lightsOnAt: Date | null;
  lightsOffAt: Date | null;
};

export function parseTimeToMinutes(val: string): number | null {
  if (!val || val === "unknown" || val === "unavailable") return null;
  const m = String(val).match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function atMinutesFromMidnight(minutes: number, base: Date): Date {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minutes % (24 * 60));
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

export function computeLightSchedule(
  input: LightScheduleInput,
  now = Date.now(),
): LightScheduleClocks {
  const onMin = parseTimeToMinutes(input.lightsOnTime);
  const hours =
    Number.isFinite(input.expectedHours) && input.expectedHours > 0 ? input.expectedHours : 12;
  const empty: LightScheduleClocks = {
    valid: false,
    phase: "dark",
    sinceOnMs: null,
    untilOffMs: null,
    untilOnMs: null,
    sinceOffMs: null,
    lightsOnAt: null,
    lightsOffAt: null,
  };
  if (onMin == null) return empty;

  const nowDate = new Date(now);
  const onToday = atMinutesFromMidnight(onMin, nowDate);
  const offToday = new Date(onToday.getTime() + hours * 3_600_000);

  if (nowDate >= onToday && nowDate < offToday) {
    return {
      valid: true,
      phase: "lit",
      sinceOnMs: nowDate.getTime() - onToday.getTime(),
      untilOffMs: offToday.getTime() - nowDate.getTime(),
      untilOnMs: null,
      sinceOffMs: null,
      lightsOnAt: onToday,
      lightsOffAt: offToday,
    };
  }

  if (nowDate < onToday) {
    const offYesterday = new Date(offToday.getTime() - 86_400_000);
    return {
      valid: true,
      phase: "dark",
      sinceOnMs: null,
      untilOffMs: null,
      untilOnMs: onToday.getTime() - nowDate.getTime(),
      sinceOffMs: nowDate.getTime() - offYesterday.getTime(),
      lightsOnAt: onToday,
      lightsOffAt: offToday,
    };
  }

  const onTomorrow = new Date(onToday.getTime() + 86_400_000);
  return {
    valid: true,
    phase: "dark",
    sinceOnMs: null,
    untilOffMs: null,
    untilOnMs: onTomorrow.getTime() - nowDate.getTime(),
    sinceOffMs: nowDate.getTime() - offToday.getTime(),
    lightsOnAt: onTomorrow,
    lightsOffAt: new Date(onTomorrow.getTime() + hours * 3_600_000),
  };
}

export function tentPhotoperiodFollowsMain(state: (id: string, fb?: string) => string): boolean {
  return state("select.dsc_hub_clone_photoperiod", "Follow 4x8") !== "Independent";
}

/** Prefer time.* helpers; fall back to datetime.* only when it parses as HH:MM. */
export function resolveLightsOnClock(
  state: (id: string, fb?: string) => string,
  timeEntity: string,
  datetimeEntity?: string,
): string {
  const primary = state(timeEntity, "");
  if (parseTimeToMinutes(primary) != null) return primary;
  if (datetimeEntity) {
    const fallback = state(datetimeEntity, "");
    if (parseTimeToMinutes(fallback) != null) return fallback;
  }
  return "";
}

export function readTentPhotoperiodInput(
  tent: TentPhotoperiodId,
  state: (id: string, fb?: string) => string,
  num: (id: string, fb?: number) => number,
): LightScheduleInput {
  if (tent === "main") {
    return {
      lightsOnTime: resolveLightsOnClock(
        state,
        "time.dsc_hub_lights_on_time",
        "datetime.dsc_hub_lights_on_time",
      ),
      expectedHours: num("sensor.dsc_expected_light_hours", 12),
    };
  }
  const follows = tentPhotoperiodFollowsMain(state);
  return {
    lightsOnTime: follows
      ? resolveLightsOnClock(state, "time.dsc_hub_lights_on_time", "datetime.dsc_hub_lights_on_time")
      : resolveLightsOnClock(state, "time.dsc_hub_clone_lights_on_time"),
    expectedHours: follows
      ? num("sensor.dsc_expected_light_hours", 12)
      : num("sensor.dsc_clone_expected_light_hours", 18),
  };
}

export function tentWindowEntity(tent: TentPhotoperiodId): string {
  return tent === "main" ? "binary_sensor.dsc_hub_4x8_window_open" : "binary_sensor.dsc_hub_2x4_window_open";
}

export function tentLiveLitEntity(tent: TentPhotoperiodId): string {
  return tent === "main" ? "light.dsc_hub_twin_sf1000" : "light.dsc_hub_sf1000_dimmer";
}

export type DayScheduleSegment = {
  /** Minutes from local midnight [0, 1440). */
  startMin: number;
  endMin: number;
  kind: LightSchedulePhase;
};

export type DayScheduleView = {
  valid: boolean;
  segments: DayScheduleSegment[];
  /** Minutes from local midnight for the now marker. */
  nowMin: number;
  onMin: number | null;
  offMin: number | null;
  hours: number;
};

/** Scheduled lit/dark bands for one local calendar day (24h strip). */
export function dayScheduleSegments(
  input: LightScheduleInput,
  now = Date.now(),
): DayScheduleView {
  const onMin = parseTimeToMinutes(input.lightsOnTime);
  const hours =
    Number.isFinite(input.expectedHours) && input.expectedHours > 0 ? input.expectedHours : 12;
  const nowDate = new Date(now);
  const nowMin = nowDate.getHours() * 60 + nowDate.getMinutes();
  const empty: DayScheduleView = {
    valid: false,
    segments: [{ startMin: 0, endMin: 1440, kind: "dark" }],
    nowMin,
    onMin: null,
    offMin: null,
    hours,
  };
  if (onMin == null) return empty;

  const litEnd = (onMin + hours * 60) % (24 * 60);
  const segments: DayScheduleSegment[] = [];
  if (litEnd > onMin) {
    if (onMin > 0) segments.push({ startMin: 0, endMin: onMin, kind: "dark" });
    segments.push({ startMin: onMin, endMin: litEnd, kind: "lit" });
    if (litEnd < 1440) segments.push({ startMin: litEnd, endMin: 1440, kind: "dark" });
  } else {
    segments.push({ startMin: 0, endMin: litEnd, kind: "lit" });
    segments.push({ startMin: litEnd, endMin: onMin, kind: "dark" });
    segments.push({ startMin: onMin, endMin: 1440, kind: "lit" });
  }

  return {
    valid: true,
    segments,
    nowMin,
    onMin,
    offMin: litEnd,
    hours,
  };
}

export function fmtMinutesClock(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
