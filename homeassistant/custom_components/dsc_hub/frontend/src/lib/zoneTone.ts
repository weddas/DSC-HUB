export type ZoneTone = "ok" | "warn" | "critical" | "muted" | "stale";

export function zoneTone(opts: {
  value: number;
  band?: { min: number; max: number };
  margin?: number;
  fault?: boolean;
  stale?: boolean;
  available?: boolean;
}): ZoneTone {
  if (opts.stale) return "stale";
  if (opts.available === false || !Number.isFinite(opts.value)) return "muted";
  if (opts.fault) return "critical";
  if (opts.band) {
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
