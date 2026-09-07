/**
 * Operator preferences — tier B ("this browser") of the settings model.
 * See docs/design/plan-settings-2026-09-07.md § Part 2 / § 3.1–3.4.
 *
 * One namespaced localStorage key holds a partial object; anything missing falls back
 * to PREFERENCE_DEFAULTS, so adding a key never needs a migration. The store is a tiny
 * external store (subscribe/get/set) so hooks use useSyncExternalStore and non-React
 * code (chart helpers, default params) can call getPreference() at call time.
 *
 * Units stay metric by operator decision (2026-09-07); the only unit choices are the
 * conductivity scale, the airflow scale, the currency symbol and the clock format.
 */

import type { DeskId } from "../routes";

export const PREFS_STORAGE_KEY = "dsc.prefs.v1";

export type MotionPref = "full" | "reduced" | "off";
export type StateColorsPref = "default" | "deuteranopia" | "mono";
export type DensityPref = "auto" | "comfortable" | "compact";
export type TextScalePref = 90 | 100 | 110 | 125;
export type ConductivityPref = "mS/cm" | "µS/cm";
export type AirflowPref = "m3h" | "cfm";
export type TimeFormatPref = "24h" | "12h";
export type LandingDeskPref = DeskId | "last";
export type DefaultZonePref = "main" | "clone" | "room" | "last";

export interface Preferences {
  // Appearance
  showAdvanced: boolean;
  gridWash: boolean;
  motion: MotionPref;
  freshPulse: boolean;
  depth: boolean;
  textScale: TextScalePref;
  highContrast: boolean;
  stateColors: StateColorsPref;
  density: DensityPref;
  // Units & formats (metric only — see decisions)
  conductivity: ConductivityPref;
  airflow: AirflowPref;
  currency: string;
  timeFormat: TimeFormatPref;
  // Home & navigation
  landingDesk: LandingDeskPref;
  defaultZone: DefaultZonePref;
  deskOrder: DeskId[];
  hiddenDesks: DeskId[];
  bottomBar: DeskId[];
  missionLine: boolean;
  tooltipDelayMs: number;
  // Alerts delivery (this browser)
  alertToast: boolean;
  alertSound: "off" | "critical" | "all";
  /** Seconds between refreshes of a zone card's camera thumbnail (0 = only when the brain reports a new frame). */
  cameraThumbRefreshS: number;
  // Charts & history
  chartHours: number;
  chartBands: boolean;
  chartLightsOff: boolean;
  chartMarkers: boolean;
  holdGapMs: number;
  maxHoldToNowMs: number;
  staleMs: number;
  offlineCooldownMs: number;
  trendsHalfWindowH: number;
  // Internal memory for the "last" choices above — never shown as rows.
  lastDesk: DeskId | null;
  lastZone: "main" | "clone" | "room" | null;
}

export const PREFERENCE_DEFAULTS: Preferences = {
  showAdvanced: false,
  gridWash: true,
  motion: "full",
  freshPulse: true,
  depth: true,
  textScale: 100,
  highContrast: false,
  stateColors: "default",
  density: "auto",
  conductivity: "mS/cm",
  airflow: "m3h",
  currency: "$",
  timeFormat: "24h",
  landingDesk: "overview",
  defaultZone: "main",
  deskOrder: [],
  hiddenDesks: [],
  bottomBar: [],
  missionLine: true,
  tooltipDelayMs: 300,
  alertToast: true,
  alertSound: "critical",
  cameraThumbRefreshS: 30,
  chartHours: 6,
  chartBands: true,
  chartLightsOff: true,
  chartMarkers: true,
  holdGapMs: 2000,
  maxHoldToNowMs: 5 * 60 * 1000,
  staleMs: 10 * 60 * 1000,
  offlineCooldownMs: 25_000,
  trendsHalfWindowH: 6,
  lastDesk: null,
  lastZone: null,
};

export type PreferenceKey = keyof Preferences;

/** Keys that are internal memory, not operator-facing rows. */
export const INTERNAL_PREFERENCE_KEYS: ReadonlySet<PreferenceKey> = new Set(["lastDesk", "lastZone"]);

type Listener = () => void;

let current: Preferences = load();
const listeners = new Set<Listener>();

function load(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return { ...PREFERENCE_DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    if (!parsed || typeof parsed !== "object") return { ...PREFERENCE_DEFAULTS };
    const out: Preferences = { ...PREFERENCE_DEFAULTS };
    for (const key of Object.keys(PREFERENCE_DEFAULTS) as PreferenceKey[]) {
      const v = parsed[key];
      if (v === undefined) continue;
      if (typeof v !== typeof PREFERENCE_DEFAULTS[key] && PREFERENCE_DEFAULTS[key] !== null) continue;
      (out as unknown as Record<string, unknown>)[key] = v;
    }
    return out;
  } catch {
    return { ...PREFERENCE_DEFAULTS };
  }
}

function persist(): void {
  try {
    // Store only what differs from the default so a future default change reaches
    // every browser that never touched that row.
    const diff: Partial<Preferences> = {};
    for (const key of Object.keys(PREFERENCE_DEFAULTS) as PreferenceKey[]) {
      const v = current[key];
      const d = PREFERENCE_DEFAULTS[key];
      if (JSON.stringify(v) !== JSON.stringify(d)) (diff as Record<string, unknown>)[key] = v;
    }
    if (Object.keys(diff).length) localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(diff));
    else localStorage.removeItem(PREFS_STORAGE_KEY);
  } catch {
    /* private mode, blocked storage — preferences live for the session only */
  }
}

function emit(): void {
  for (const l of listeners) l();
}

export function getPreferences(): Preferences {
  return current;
}

export function getPreference<K extends PreferenceKey>(key: K): Preferences[K] {
  return current[key];
}

export function setPreference<K extends PreferenceKey>(key: K, value: Preferences[K]): void {
  if (Object.is(current[key], value)) return;
  current = { ...current, [key]: value };
  persist();
  emit();
}

export function setPreferences(patch: Partial<Preferences>): void {
  current = { ...current, ...patch };
  persist();
  emit();
}

export function resetPreference(key: PreferenceKey): void {
  setPreference(key, PREFERENCE_DEFAULTS[key]);
}

export function resetAllPreferences(): void {
  current = { ...PREFERENCE_DEFAULTS };
  persist();
  emit();
}

export function isPreferenceDefault(key: PreferenceKey): boolean {
  return JSON.stringify(current[key]) === JSON.stringify(PREFERENCE_DEFAULTS[key]);
}

/** Operator-facing keys that differ from their default — drives the rail count. */
export function changedPreferenceKeys(): PreferenceKey[] {
  return (Object.keys(PREFERENCE_DEFAULTS) as PreferenceKey[]).filter(
    (k) => !INTERNAL_PREFERENCE_KEYS.has(k) && !isPreferenceDefault(k),
  );
}

export function subscribePreferences(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Another tab of the same origin changed the store — pick it up.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== PREFS_STORAGE_KEY) return;
    current = load();
    emit();
  });
}
