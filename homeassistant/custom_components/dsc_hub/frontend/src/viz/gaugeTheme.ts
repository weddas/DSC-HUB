/** Segment colors aligned with HA gauge-card-pro on view_home. */
export type GaugeSegment = { from: number; color: string };

export function tempSegments(target: number): GaugeSegment[] {
  const t = Number.isFinite(target) ? target : 25;
  return [
    { from: 10, color: "#3b82f6" },
    { from: t - 2, color: "#22c55e" },
    { from: t + 2, color: "#ef4444" },
  ];
}

export function rhSegments(lo: number, hi: number): GaugeSegment[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    return [{ from: 0, color: "#64748b" }];
  }
  return [
    { from: 0, color: "#f59e0b" },
    { from: lo, color: "#22c55e" },
    { from: hi, color: "#ef4444" },
  ];
}

export function vpdSegments(lo: number, hi: number): GaugeSegment[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    return [{ from: 0, color: "#64748b" }];
  }
  return [
    { from: 0, color: "#3b82f6" },
    { from: lo, color: "#22c55e" },
    { from: hi, color: "#ef4444" },
  ];
}

export function rootSegments(lo: number, hi: number): GaugeSegment[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    return [{ from: 10, color: "#64748b" }];
  }
  return [
    { from: 10, color: "#3b82f6" },
    { from: lo, color: "#22c55e" },
    { from: hi, color: "#ef4444" },
  ];
}

/** Pot moisture bands — dry below 30% is the narrator warning threshold on HA Home. */
export function moistureSegments(dry = 30, wet = 75): GaugeSegment[] {
  return [
    { from: 0, color: "#ef4444" },
    { from: dry, color: "#f59e0b" },
    { from: 45, color: "#22c55e" },
    { from: wet, color: "#3b82f6" },
    { from: 90, color: "#ef4444" },
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
