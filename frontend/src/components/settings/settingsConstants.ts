import type { ClimateZone } from "../../lib/fleetApi";
import type { SettingsSectionId } from "../../routes";

export const AP_CHANNELS = ["1", "6", "11"];
export const CLIMATE_ZONES: ClimateZone[] = ["room", "clone", "main"];
export const ZONE_LABELS: Record<ClimateZone, string> = {
  room: "Room",
  clone: "2×4",
  main: "4×8",
};
export const IDLE_PROBE_OPTIONS = ["", "pot1", "pot2"] as const;
export const TENT_OPTIONS = ["2x4", "4x8"] as const;

export const SECTION_SUBTITLE: Record<SettingsSectionId, string> = {
  hub: "Appliance backup and restore",
  brain: "Global tuning and catalog",
  device: "Inventory, assignment, probes, Zigbee, ESPHome",
  api: "Ollama and CannaLib integrations",
  network: "SoftAP and DHCP — Apply restarts hub Wi‑Fi",
  server: "ESPHome job queue and host ops",
  system: "Logs, log verbosity, and power actions",
  general: "Kit language and operator notes",
};

export const AP_KEYS = ["ap_ssid", "ap_psk", "ap_channel"] as const;
export const BRAIN_KEYS = ["leaf_offset_c"] as const;
export const INTEGRATION_KEYS = [
  "ollama_base_url",
  "ollama_model",
  "cannalib_api_url",
  "cannalib_api_key",
  "cannalib_use_local_fallback",
] as const;

export const TANK_TASK_ID = "tank_full_appliance";
export const FLOOD_TASK_ID = "floor_flood_alert";
export const TASK_PARAM_IDS = new Set([TANK_TASK_ID, FLOOD_TASK_ID]);
