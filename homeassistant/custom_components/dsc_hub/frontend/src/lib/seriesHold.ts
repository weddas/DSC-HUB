import type { SeriesPoint } from "../viz/charts";

const HOLD_GAP_MS = 2000;

/** Recorder stores on change. Hold last good across gaps and out to `now`. */
export function stepHoldSeries(points: SeriesPoint[], now = Date.now()): SeriesPoint[] {
  if (!points.length) return [];
  const sorted = [...points].sort((a, b) => a.t - b.t);
  const out: SeriesPoint[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    if (!Number.isFinite(p.v)) continue;
    const prev = out[out.length - 1];
    if (prev && p.t - prev.t > HOLD_GAP_MS) {
      out.push({ t: p.t - 1, v: prev.v });
    }
    out.push(p);
  }
  const last = out[out.length - 1];
  if (last && now - last.t > HOLD_GAP_MS) {
    out.push({ t: now, v: last.v });
  }
  return out;
}

export function isUnavailableState(raw: unknown): boolean {
  if (raw == null) return true;
  const s = String(raw).toLowerCase();
  return s === "" || s === "unavailable" || s === "unknown" || s === "none";
}

/** Binary on/off (+ optional numeric). Never charts unavailable as 0. */
export function stateToNumber(raw: unknown): number | null {
  if (isUnavailableState(raw)) return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  const s = String(raw).toLowerCase();
  if (s === "on" || s === "true" || s === "open") return 1;
  if (s === "off" || s === "false" || s === "closed") return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
