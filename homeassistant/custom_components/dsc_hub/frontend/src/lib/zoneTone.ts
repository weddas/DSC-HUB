export type ZoneTone = "ok" | "warn" | "critical" | "muted" | "stale";

export type ToneBand = { min: number; max: number };

export function isValidBand(band?: ToneBand): band is ToneBand {
  return !!band && Number.isFinite(band.min) && Number.isFinite(band.max) && band.max > band.min;
}

export function zoneTone(opts: {
  value: number;
  band?: ToneBand;
  margin?: number;
  fault?: boolean;
  stale?: boolean;
  available?: boolean;
}): ZoneTone {
  // Empty / unavailable wins over stale — never paint "HELD" on a dash.
  if (opts.available === false || !Number.isFinite(opts.value)) return "muted";
  if (opts.stale) return "stale";
  if (opts.fault) return "critical";
  if (isValidBand(opts.band)) {
    const m = opts.margin ?? 0;
    if (opts.value < opts.band.min - m || opts.value > opts.band.max + m) {
      const far =
        opts.value < opts.band.min - m * 3 || opts.value > opts.band.max + m * 3;
      return far ? "critical" : "warn";
    }
  }
  return "ok";
}

export function toneClass(tone: ZoneTone): string {
  switch (tone) {
    case "ok":
      return "is-ok";
    case "warn":
      return "is-warn";
    case "critical":
      return "is-bad";
    case "stale":
      return "is-stale";
    case "muted":
      return "is-muted";
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

/** CSS token for the unified gauge/spark/bar semantic. */
export function toneCssColor(tone: ZoneTone): string {
  switch (tone) {
    case "ok":
      return "var(--dsc-neon)";
    case "warn":
    case "stale":
      return "var(--dsc-amber)";
    case "critical":
      return "var(--dsc-bad)";
    case "muted":
      return "var(--dsc-gray-5)";
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
}

/** Same 12% grace margin ArcGauge / band guides use. °C floor is 1° so a 2° band is not instantly red. */
export function defaultBandMargin(band?: ToneBand, unit?: string): number | undefined {
  if (!isValidBand(band)) return undefined;
  const floor = unit === "°C" ? 1 : 0.05;
  return Math.max((band.max - band.min) * 0.12, floor);
}
