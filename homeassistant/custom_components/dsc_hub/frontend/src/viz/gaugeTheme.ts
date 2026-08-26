/** Segment colors aligned with HA Dash palette on view_home. */
export type GaugeSegment = { from: number; color: string };

const OK = "#66bb6a";
const WARN = "#ffb74d";
const BAD = "#ef5350";
const ACCENT = "#26c6da";
const MUTED = "#8b95a8";
const ORANGE = "#ff8a65";

export function tempSegments(target: number): GaugeSegment[] {
  const t = Number.isFinite(target) ? target : 25;
  return [
    { from: 10, color: ACCENT },
    { from: t - 2, color: OK },
    { from: t + 2, color: BAD },
  ];
}

export function rhSegments(lo: number, hi: number): GaugeSegment[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    return [{ from: 0, color: MUTED }];
  }
  return [
    { from: 0, color: WARN },
    { from: lo, color: OK },
    { from: hi, color: BAD },
  ];
}

export function vpdSegments(lo: number, hi: number): GaugeSegment[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    return [{ from: 0, color: MUTED }];
  }
  return [
    { from: 0, color: ACCENT },
    { from: lo, color: OK },
    { from: hi, color: BAD },
  ];
}

export function rootSegments(lo: number, hi: number): GaugeSegment[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    return [{ from: 10, color: MUTED }];
  }
  return [
    { from: 10, color: ACCENT },
    { from: lo, color: OK },
    { from: hi, color: BAD },
  ];
}

/** Pot moisture bands — dry below 30% is the narrator warning threshold on HA Home. */
export function moistureSegments(dry = 30, wet = 75): GaugeSegment[] {
  return [
    { from: 0, color: BAD },
    { from: dry, color: WARN },
    { from: 45, color: OK },
    { from: wet, color: ACCENT },
    { from: 90, color: BAD },
  ];
}

export function colorAtValue(
  segments: GaugeSegment[],
  value: number,
  fallback: string,
): string {
  if (!segments.length) return fallback;
  const sorted = [...segments].sort((a, b) => a.from - b.from);
  let color = sorted[0].color;
  for (const seg of sorted) {
    if (value >= seg.from) color = seg.color;
  }
  return color;
}

export const GAUGE_THEME = { OK, WARN, BAD, ACCENT, MUTED, ORANGE } as const;
