/**
 * Unified gauge color semantics (design pass 2).
 *
 * One rule everywhere — same thresholds as lib/zoneTone.ts:
 *   green = in band (± one grace margin)
 *   amber = drifting (out of band by up to 3 margins, or reading held/stale)
 *   red   = out of band beyond 3 margins (alert territory)
 *   grey  = no data / no band configured
 * Margin = 12% of band span (min 0.05, or 1 °C for temperature).
 */
export type GaugeSegment = { from: number; color: string };

const OK = "#66bb6a";
const WARN = "#ffb74d";
const BAD = "#ef5350";
const MUTED = "#8b95a8";

/** Sentinel low bound — segmentArcs clamps to the gauge min. */
const LOW = -1e9;

/** Grace margin identical to the one ArcGauge feeds zoneTone. */
export function bandMargin(lo: number, hi: number, unit?: string): number {
  const floor = unit === "°C" ? 1 : 0.05;
  return Math.max((hi - lo) * 0.12, floor);
}

/** Scale guide: red | amber | green | amber | red around a band. */
export function bandGuideSegments(lo: number, hi: number, unit?: string): GaugeSegment[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi <= lo) {
    return [{ from: LOW, color: MUTED }];
  }
  const m = bandMargin(lo, hi, unit);
  return [
    { from: LOW, color: BAD },
    { from: lo - 3 * m, color: WARN },
    { from: lo - m, color: OK },
    { from: hi + m, color: WARN },
    { from: hi + 3 * m, color: BAD },
  ];
}

/** Temp band is the ±2 °C appliance deadband around the target. */
export function tempSegments(target: number): GaugeSegment[] {
  const t = Number.isFinite(target) ? target : 25;
  return bandGuideSegments(t - 2, t + 2, "°C");
}

export function rhSegments(lo: number, hi: number): GaugeSegment[] {
  return bandGuideSegments(lo, hi);
}

export function vpdSegments(lo: number, hi: number): GaugeSegment[] {
  return bandGuideSegments(lo, hi);
}

export function rootSegments(lo: number, hi: number): GaugeSegment[] {
  return bandGuideSegments(lo, hi, "°C");
}

/** Pot moisture — dry below 30% is the narrator warning threshold on HA Home. */
export function moistureSegments(dry = 30, wet = 75): GaugeSegment[] {
  return bandGuideSegments(dry, wet);
}
