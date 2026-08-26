export { stepHoldSeries } from "../viz/charts";

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
