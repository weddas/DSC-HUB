/**
 * Unit and format helpers that read the operator's preferences (tier B).
 * Everything is metric; these only pick a scale or a symbol. Pure functions that
 * read the store at call time, so they work in render paths and in memoised code.
 */

import { getPreference } from "./preferences";

/** EC from the probes' native µS/cm to the preferred scale. */
export function formatEc(us: number | null | undefined, digits?: number): string {
  if (us == null || !Number.isFinite(us)) return "—";
  const pref = getPreference("conductivity");
  if (pref === "µS/cm") return `${Math.round(us)} µS/cm`;
  return `${(us / 1000).toFixed(digits ?? 2)} mS/cm`;
}

export function ecUnitLabel(): string {
  return getPreference("conductivity");
}

/** Airflow from the fans' native CFM to the preferred scale. */
export function formatAirflow(cfm: number | null | undefined): string {
  if (cfm == null || !Number.isFinite(cfm)) return "—";
  const pref = getPreference("airflow");
  if (pref === "cfm") return `${Math.round(cfm)} CFM`;
  return `${Math.round(cfm * 1.699)} m³/h`;
}

export function airflowUnitLabel(): string {
  return getPreference("airflow") === "cfm" ? "CFM" : "m³/h";
}

export function formatCost(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return `${getPreference("currency") || "$"}${amount.toFixed(2)}`;
}

export function clockHour12(): boolean {
  return getPreference("timeFormat") === "12h";
}

/** `HH:MM` (or `h:MM AM`) in the preferred clock format. */
export function formatClock(ts: number | Date): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: clockHour12() });
}

/** `Sep 7, 14:02` style stamp in the preferred clock format. */
export function formatStamp(ts: number | Date): string {
  const d = ts instanceof Date ? ts : new Date(ts);
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: clockHour12(),
  });
}
