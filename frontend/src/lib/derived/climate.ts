/**
 * Derived climate values — relationships between sensors the kit already has.
 * Pure functions; every consumer shows the provenance ("from T + RH").
 * See docs/design/plan-v2-dashboard-2026-09-06.md § Derived metrics layer.
 */

import type { SeriesPoint } from "../../viz/charts";

/** Saturation vapour pressure, kPa (Tetens, over water). */
export function saturationVapourPressureKpa(tempC: number): number {
  return 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

/** Air VPD in kPa from dry-bulb temperature and relative humidity. NaN when inputs are not finite. */
export function vpdKpa(tempC: number, rhPct: number): number {
  if (!Number.isFinite(tempC) || !Number.isFinite(rhPct)) return NaN;
  const es = saturationVapourPressureKpa(tempC);
  return Math.max(0, es * (1 - Math.min(100, Math.max(0, rhPct)) / 100));
}

/** Default leaf-to-air offset when no IR leaf sensor is bound. Leaves run cooler than air under lights. */
export const DEFAULT_LEAF_OFFSET_C = -1.5;

/**
 * Leaf VPD: vapour pressure at leaf temperature minus the air's actual vapour pressure.
 * The offset is an assumption (documented in the provenance line) until a leaf sensor exists.
 */
export function leafVpdKpa(airTempC: number, rhPct: number, leafOffsetC: number = DEFAULT_LEAF_OFFSET_C): number {
  if (!Number.isFinite(airTempC) || !Number.isFinite(rhPct)) return NaN;
  const esLeaf = saturationVapourPressureKpa(airTempC + leafOffsetC);
  const eaAir = saturationVapourPressureKpa(airTempC) * (Math.min(100, Math.max(0, rhPct)) / 100);
  return Math.max(0, esLeaf - eaAir);
}

/** Dew point °C (Magnus). */
export function dewPointC(tempC: number, rhPct: number): number {
  if (!Number.isFinite(tempC) || !Number.isFinite(rhPct) || rhPct <= 0) return NaN;
  const a = 17.27;
  const b = 237.3;
  const gamma = (a * tempC) / (b + tempC) + Math.log(rhPct / 100);
  return (b * gamma) / (a - gamma);
}

/** Absolute humidity g/m³ — the moisture a dehumidifier actually has to pull. */
export function absoluteHumidityGm3(tempC: number, rhPct: number): number {
  if (!Number.isFinite(tempC) || !Number.isFinite(rhPct)) return NaN;
  const es = saturationVapourPressureKpa(tempC) * 1000; // Pa
  const e = es * (Math.min(100, Math.max(0, rhPct)) / 100);
  return (2.16679 * e) / (tempC + 273.15);
}

/**
 * Fraction of a series that sits inside a band, weighted by the time each sample
 * represents (gap to the next sample). `null` when the series is empty or the band is
 * not a real band. This is the "in band 22 h 40" number.
 */
export function inBandFraction(
  points: SeriesPoint[],
  band: { min: number; max: number } | undefined,
): number | null {
  if (!band || !Number.isFinite(band.min) || !Number.isFinite(band.max) || band.min > band.max) return null;
  const pts = points.filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));
  if (pts.length < 2) return null;
  let total = 0;
  let inside = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const dt = Math.max(0, pts[i + 1].t - pts[i].t);
    total += dt;
    if (pts[i].v >= band.min && pts[i].v <= band.max) inside += dt;
  }
  if (total <= 0) return null;
  return inside / total;
}

/** Simple slope over the last `windowSec` of a series, in value units per hour. */
export function slopePerHour(points: SeriesPoint[], windowSec = 3600): number | null {
  const pts = points.filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));
  if (pts.length < 2) return null;
  const last = pts[pts.length - 1];
  const cutoff = last.t - windowSec;
  const window = pts.filter((p) => p.t >= cutoff);
  if (window.length < 2) return null;
  const first = window[0];
  const dt = last.t - first.t;
  if (dt <= 0) return null;
  return ((last.v - first.v) / dt) * 3600;
}

/** `22h 40m` style, from a fraction of `hours`. */
export function fmtFractionOfHours(fraction: number | null, hours: number): string {
  if (fraction == null || !Number.isFinite(fraction)) return "—";
  const mins = Math.round(fraction * hours * 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  return m ? `${h}h ${String(m).padStart(2, "0")}` : `${h}h`;
}
