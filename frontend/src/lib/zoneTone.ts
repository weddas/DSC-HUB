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
    // A value outside the band the CARD PRINTS must never paint "ok". The margin is an
    // anti-flap tolerance, and on a narrow band it used to swallow a real excursion: the
    // 4x8 VPD band is 1.2-1.4 (0.2 wide) while defaultBandMargin's kPa floor is 0.05, i.e.
    // a quarter of the band — so 1.44 kPa rendered GREEN beside a label reading
    // "want 1.2-1.4" (observed live 2026-09-10). On an honesty-first dashboard the ring
    // and the number it sits next to cannot disagree.
    //
    // The margin keeps its real job: deciding how far out is far enough to be critical,
    // which is where hysteresis actually matters.
    if (opts.value < opts.band.min || opts.value > opts.band.max) {
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
