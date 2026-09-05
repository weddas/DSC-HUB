/** Canonical 2×4 Climate Mode — mirrors brain `climate_mode.py` / hub firmware policy. */
export const CLIMATE_MODE_OPTIONS = [
  "Follow 4x8",
  "Follow Plants",
  "Custom",
  "Off",
] as const;

export type ClimateMode = (typeof CLIMATE_MODE_OPTIONS)[number];

const LEGACY: Record<string, ClimateMode> = {
  "Clones & Seedlings": "Follow Plants",
  Clones: "Follow Plants",
  Mother: "Custom",
};

export function migrateLegacyCloneMode(raw: string): string {
  const s = (raw || "").trim();
  if ((CLIMATE_MODE_OPTIONS as readonly string[]).includes(s)) return s;
  return LEGACY[s] ?? s;
}

export function isFollowPlantsMode(raw: string): boolean {
  return migrateLegacyCloneMode(raw) === "Follow Plants";
}

export function isExternalTargetsMode(raw: string): boolean {
  const m = migrateLegacyCloneMode(raw);
  return m === "Follow 4x8" || m === "Follow Plants";
}

/** Operator tip — Follow Plants vs Follow 4x8 vs Custom. */
export const CLIMATE_MODE_TIP =
  "Follow 4x8 mirrors the main tent stage targets. Follow Plants intersects Want for plants assigned to 2×4 probes (Pi, ~12h). Custom leaves sliders alone. Off parks the 2×4.";
