import type { SettingsSectionId } from "../../routes";

/**
 * Search index for Settings — one entry per row or card that exists today. Static on
 * purpose: search must work before any section has loaded, and it doubles as the list of
 * deep-link anchors the desks may target. Add an entry when you add a row.
 */
export interface SettingsIndexEntry {
  section: SettingsSectionId;
  anchor: string;
  label: string;
  /** Extra words the operator might type (keys, entity ids, synonyms). */
  keywords?: string[];
  description?: string;
}

export const SETTINGS_INDEX: SettingsIndexEntry[] = [
  // Preferences
  { section: "preferences", anchor: "pref-showAdvanced", label: "Show advanced rows", keywords: ["power user", "hysteresis"] },
  { section: "preferences", anchor: "pref-gridWash", label: "Grid wash", keywords: ["background", "grid"] },
  { section: "preferences", anchor: "pref-motion", label: "Motion", keywords: ["animation", "reduced motion", "fan spin"] },
  { section: "preferences", anchor: "pref-freshPulse", label: "Fresh pulse on new readings", keywords: ["animation", "pulse"] },
  { section: "preferences", anchor: "pref-depth", label: "Depth and glow", keywords: ["glass", "flat", "projector"] },
  { section: "preferences", anchor: "pref-textScale", label: "Text scale", keywords: ["font size", "zoom", "wall display"] },
  { section: "preferences", anchor: "pref-highContrast", label: "High contrast", keywords: ["accessibility", "contrast"] },
  { section: "preferences", anchor: "pref-stateColors", label: "State colour set", keywords: ["colour blind", "color blind", "deuteranopia", "mono"] },
  { section: "preferences", anchor: "pref-density", label: "Density", keywords: ["compact", "comfortable", "spacing"] },
  { section: "preferences", anchor: "unit-temperature", label: "Temperature unit", keywords: ["celsius", "fahrenheit", "°C", "metric"] },
  { section: "preferences", anchor: "unit-vpd", label: "VPD unit", keywords: ["kPa"] },
  { section: "preferences", anchor: "pref-conductivity", label: "Conductivity scale", keywords: ["EC", "mS/cm", "µS/cm", "ppm"] },
  { section: "preferences", anchor: "pref-airflow", label: "Airflow scale", keywords: ["CFM", "m³/h", "fan"] },
  { section: "preferences", anchor: "pref-currency", label: "Currency symbol", keywords: ["cost", "tariff", "$"] },
  { section: "preferences", anchor: "pref-timeFormat", label: "Clock format", keywords: ["24h", "12h", "time"] },
  { section: "preferences", anchor: "pref-landingDesk", label: "Landing desk", keywords: ["home", "start page", "default desk"] },
  { section: "preferences", anchor: "pref-defaultZone", label: "Default zone", keywords: ["4x8", "2x4", "room", "tent"] },
  { section: "preferences", anchor: "pref-deskOrder", label: "Desk order and visibility", keywords: ["hide desk", "reorder", "navigation", "menu"] },
  { section: "preferences", anchor: "pref-bottomBar", label: "Phone bottom bar", keywords: ["mobile", "navigation"] },
  { section: "preferences", anchor: "pref-missionLine", label: "Mission line on Overview", keywords: ["overview", "story"] },
  { section: "preferences", anchor: "pref-tooltipDelayMs", label: "Tooltip open delay", keywords: ["hover", "tooltip"] },
  { section: "preferences", anchor: "pref-cameraThumbRefreshS", label: "Camera thumbnail refresh", keywords: ["camera", "live view", "thumbnail", "bandwidth", "phone"] },
  { section: "preferences", anchor: "pref-chartHours", label: "Default chart range", keywords: ["chart", "hours", "range", "24h"] },
  { section: "preferences", anchor: "pref-chartBands", label: "Band shading", keywords: ["chart", "want band"] },
  { section: "preferences", anchor: "pref-chartLightsOff", label: "Lights-off shading", keywords: ["chart", "photoperiod", "dark"] },
  { section: "preferences", anchor: "pref-chartMarkers", label: "Stage and alert markers", keywords: ["chart", "markers", "phase"] },
  { section: "preferences", anchor: "pref-holdGapMs", label: "Hold gap", keywords: ["chart", "gap", "advanced"] },
  { section: "preferences", anchor: "pref-maxHoldToNowMs", label: "Hold to now", keywords: ["chart", "advanced"] },
  { section: "preferences", anchor: "pref-staleMs", label: "Reading stale horizon", keywords: ["held", "stale", "advanced"] },
  { section: "preferences", anchor: "pref-offlineCooldownMs", label: "Offline cooldown", keywords: ["offline", "flap", "advanced"] },
  { section: "preferences", anchor: "pref-trendsHalfWindowH", label: "Trends window around an event", keywords: ["logs", "trends", "advanced"] },
  { section: "preferences", anchor: "pref-reset-all", label: "Reset this browser's preferences", keywords: ["reset", "defaults"] },
  // Alerts
  { section: "alerts", anchor: "pref-alertToast", label: "Toast on a new alert", keywords: ["notification", "toast", "popup"] },
  { section: "alerts", anchor: "pref-alertSound", label: "Alert sound", keywords: ["sound", "beep", "tone", "audio", "mute"] },
  { section: "alerts", anchor: "alert-quiet-hours", label: "Quiet hours", keywords: ["quiet", "night", "silence", "do not disturb"] },
  { section: "alerts", anchor: "alert-push", label: "Push to phone", keywords: ["push", "phone", "notification", "relay"] },
  { section: "alerts", anchor: "catalogue", label: "Alert catalogue — enable and severity", keywords: ["alert", "disable", "severity", "critical", "warn", "failsafe", "sensor fault", "dark violation", "heartbeat"] },
  // Automation defaults
  { section: "automation", anchor: "rule-defaults", label: "New-rule defaults (debounce, release, window)", keywords: ["debounce", "release", "window", "default"] },
  // Journals
  { section: "system", anchor: "journals", label: "Journals & storage — retention, sizes, downloads", keywords: ["journal", "retention", "days", "storage", "size", "database", "export", "download", "csv", "json", "prune"] },
  { section: "system", anchor: "archive", label: "Grow records (archive)", keywords: ["archive", "grow record", "harvest", "retire", "bundle"] },
  // Zones
  { section: "zones", anchor: "zones", label: "Zones — names and roles", keywords: ["tent", "room", "role", "grow", "dry", "cure", "empty", "rename", "flip"] },
  // Climate
  { section: "climate", anchor: "fan-demand-scale", label: "Fan demand scale", keywords: ["fan", "global modifiers", "fan_demand_scale"] },
  { section: "climate", anchor: "targets-desk", label: "Temperature, RH and VPD targets", keywords: ["target", "setpoint", "hub", "hysteresis", "ladder"] },
  { section: "climate", anchor: "hub-dsc_hub_target_temp", label: "4x8 target temperature", keywords: ["target", "setpoint", "temp", "hub"] },
  { section: "climate", anchor: "hub-dsc_hub_rh_target_min", label: "4x8 RH targets", keywords: ["humidity", "rh", "target", "setpoint"] },
  { section: "climate", anchor: "hub-dsc_hub_vpd_target_min", label: "4x8 VPD targets", keywords: ["vpd", "band", "target"] },
  { section: "climate", anchor: "hub-dsc_hub_clone_target_temp", label: "2x4 targets", keywords: ["clone", "2x4", "target", "setpoint"] },
  { section: "climate", anchor: "presets", label: "Stage presets", keywords: ["stage", "preset", "rail", "apply_stage", "germination", "flowering", "brain owns"] },
  { section: "climate", anchor: "hub-dsc_hub_control_strategy", label: "Control strategy", keywords: ["strategy", "ladder", "chase"] },
  { section: "climate", anchor: "hub-dsc_hub_priority_tent", label: "Priority tent", keywords: ["priority", "arbitration"] },
  { section: "climate", anchor: "hub-dsc_hub_vpd_band_target_hours", label: "VPD in-band target hours", keywords: ["vpd", "band", "hours"] },
  { section: "climate", anchor: "hub-dsc_hub_humidifier_intake_routing", label: "Humidifier intake routing", keywords: ["humidifier", "intake", "routing"] },
  { section: "climate", anchor: "hub-dsc_hub_clone_hum_hysteresis", label: "Humidifier hysteresis", keywords: ["hysteresis", "advanced"] },
  { section: "climate", anchor: "hub-dsc_hub_heater_min_off_time", label: "Min off-times (heater, humidifier, clone)", keywords: ["min off", "cooldown", "advanced", "compressor"] },
  { section: "climate", anchor: "hub-dsc_hub_ladder_wait_heat", label: "Ladder waits", keywords: ["ladder", "wait", "escalation", "advanced"] },
  { section: "climate", anchor: "hub-dsc_hub_recirc_de_strat_pulse", label: "De-stratification pulse", keywords: ["destrat", "de-strat", "pulse", "recirc", "advanced"] },
  { section: "climate", anchor: "hub-dsc_hub_mister_target_hours", label: "Mister hours (on hold)", keywords: ["mister", "clone", "oos"] },
  // Light
  { section: "light", anchor: "hub-dsc_hub_auto_photoperiod", label: "Automatic photoperiod", keywords: ["photoperiod", "schedule", "auto", "lamp"] },
  { section: "light", anchor: "hub-dsc_hub_clone_light_hours", label: "2x4 photoperiod hours", keywords: ["clone", "hours", "light"] },
  { section: "light", anchor: "hub-dsc_hub_min_dark_hours", label: "Minimum dark hours", keywords: ["dark", "violation", "night"] },
  { section: "light", anchor: "hub-dsc_hub_sunrise_duration", label: "Sunrise and sunset ramps", keywords: ["sunrise", "sunset", "ramp", "dimming"] },
  { section: "light", anchor: "hub-dsc_hub_sf1000_target_brightness", label: "SF1000 target brightness", keywords: ["sf1000", "brightness", "lamp"] },
  { section: "light", anchor: "hub-dsc_hub_sf1000_ramp_floor", label: "SF1000 ramp floor", keywords: ["sf1000", "ramp", "floor", "advanced"] },
  { section: "light", anchor: "light-brightness-scale", label: "Light brightness scale", keywords: ["lamp", "brightness", "light_brightness_scale"] },
  { section: "light", anchor: "fixtures-desk", label: "Fixtures and nameplate watts", keywords: ["fixture", "watts", "lamp"] },
  { section: "light", anchor: "tariff", label: "Tariff bands", keywords: ["energy", "cost", "kWh", "rate", "off-peak"] },
  // Root
  { section: "root", anchor: "steer-dryback_p1_max_pct", label: "Crop steering dry-back thresholds (P1-P3)", keywords: ["steering", "dryback", "dry-back", "p1", "p2", "p3", "phase"] },
  { section: "root", anchor: "steer-vwc_target_day_pct", label: "VWC targets day / night", keywords: ["vwc", "moisture", "target"] },
  { section: "root", anchor: "steer-ec_target_ms", label: "EC target", keywords: ["ec", "feed", "target"] },
  { section: "root", anchor: "hub-dsc_hub_mat_root_zone_low", label: "Heat-mat root-zone band", keywords: ["mat", "heat mat", "root zone", "low", "high"] },
  { section: "root", anchor: "hub-dsc_hub_mat_vote_pot_1", label: "Probe mat votes", keywords: ["mat", "vote", "probe"] },
  { section: "root", anchor: "hub-dsc_hub_mat_min_off_time", label: "Heat-mat min off-time and ladder wait", keywords: ["mat", "min off", "ladder", "advanced"] },
  { section: "root", anchor: "moisture-dry-line", label: "Probe dry reference line", keywords: ["moisture", "dry", "root", "moisture_dry_pct"] },
  // Sensors
  { section: "sensors", anchor: "leaf-offset", label: "Leaf-to-air offset", keywords: ["leaf", "vpd", "leaf_offset_c", "leaf temperature"] },
  { section: "sensors", anchor: "offset-room", label: "Room sensor offsets", keywords: ["offset", "calibration", "temp_offset_c", "rh_offset_pct"] },
  { section: "sensors", anchor: "offset-main", label: "4×8 sensor offsets", keywords: ["offset", "calibration", "4x8"] },
  { section: "sensors", anchor: "offset-clone", label: "2×4 sensor offsets", keywords: ["offset", "calibration", "2x4"] },
  { section: "sensors", anchor: "sensor-clamps", label: "Sensor clamps", keywords: ["clamp", "bounds", "advanced"] },
  { section: "sensors", anchor: "helper-dsc_dht_delta_t_c", label: "DHT disagreement thresholds", keywords: ["dht", "disagree", "fault", "trust", "delta"] },
  { section: "sensors", anchor: "helper-dsc_trust_mad_ph", label: "Peer drift thresholds (pH, EC, moisture)", keywords: ["mad", "median", "drift", "trust", "probe"] },
  { section: "sensors", anchor: "stale-control", label: "Control-side stale horizon", keywords: ["stale", "appliance driver", "45 s"] },
  // Automation
  { section: "automation", anchor: "automation", label: "Automation rules", keywords: ["rule", "trigger", "debounce", "release", "window", "relay", "setpoint"] },
  // Devices
  { section: "devices", anchor: "inventory", label: "Fleet inventory", keywords: ["seat", "in service", "add device", "probe", "sonoff", "advanced restore"] },
  { section: "devices", anchor: "assignment", label: "Device assignment", keywords: ["function", "placement", "capability", "max %"] },
  { section: "devices", anchor: "probe-stations", label: "Probe stations", keywords: ["idle home", "soil test", "thereabouts"] },
  { section: "devices", anchor: "zigbee", label: "Zigbee (SkyConnect)", keywords: ["permit join", "pair", "role", "task", "leak", "canopy", "z2m", "mqtt"] },
  { section: "devices", anchor: "cameras", label: "Cameras", keywords: ["camera", "webcam", "usb", "ip camera", "rtsp", "mjpeg", "snapshot", "motioneye", "timelapse", "vision", "frames", "retention"] },
  { section: "devices", anchor: "firmware", label: "Firmware (ESPHome)", keywords: ["OTA", "compile", "toolchain", "job history", "esphome", "reflash"] },
  { section: "devices", anchor: "firmware-advanced", label: "Toolchain & drivers — ESPHome paths, fleet OTA prompt, Sonoff driver", keywords: ["esphome_bin", "project dir", "dashboard api", "fleet ota", "sonoff", "poll", "stale"] },
  { section: "devices", anchor: "add-seat", label: "Add device / seat", keywords: ["register", "extra seat", "new sensor", "appliance"] },
  // Integrations
  { section: "integrations", anchor: "ollama-url", label: "Ollama URL", keywords: ["ollama", "ai", "llm", "ollama_base_url"] },
  { section: "integrations", anchor: "ollama-model", label: "Ollama model", keywords: ["ollama", "model"] },
  { section: "integrations", anchor: "cannalib-url", label: "CannaLib API URL", keywords: ["cannalib", "strain", "catalog", "cannalib_api_url"] },
  { section: "integrations", anchor: "cannalib-key", label: "CannaLib API key", keywords: ["cannalib", "key", "secret"] },
  { section: "integrations", anchor: "cannalib-fallback", label: "Local catalog fallback", keywords: ["sqlite", "offline", "cannalib_use_local_fallback"] },
  { section: "integrations", anchor: "catalog", label: "Catalog status and reload", keywords: ["catalog", "reload", "ppfd"] },
  // Network
  { section: "network", anchor: "ap-ssid", label: "AP SSID", keywords: ["wifi", "softap", "ssid", "ap_ssid"] },
  { section: "network", anchor: "ap-psk", label: "AP passphrase", keywords: ["wifi", "password", "psk", "ap_psk"] },
  { section: "network", anchor: "ap-channel", label: "AP channel", keywords: ["wifi", "channel", "ap_channel"] },
  { section: "network", anchor: "hub-dsc_hub_lock_wifi_ap", label: "Lock Wi-Fi AP (hub)", keywords: ["wifi", "bssid", "roam", "lock", "hub"] },
  { section: "network", anchor: "softap", label: "Apply network", keywords: ["restart wifi", "dhcp", "mac"] },
  // System
  { section: "system", anchor: "backup", label: "Backup export and import", keywords: ["backup", "restore", "zip", "export", "import"] },
  { section: "system", anchor: "storage", label: "Logs, verbosity, power and history retention", keywords: ["logs", "reboot", "restart", "shutdown", "retention", "prune", "verbosity", "storage"] },
  { section: "system", anchor: "failover-ttl", label: "Hub override TTL", keywords: ["failover", "takeover", "reassert"] },
  { section: "system", anchor: "failover-state", label: "Failover — override now", keywords: ["override", "takeover", "pending reassert", "brain driving"] },
  { section: "system", anchor: "time", label: "Time — brain clock, NTP, hub clock drift", keywords: ["timezone", "ntp", "clock", "drift", "photoperiod", "sntp", "sydney"] },
  { section: "system", anchor: "about-routes", label: "Brain routes — which optional features this brain serves", keywords: ["routes", "predates", "hotpatch", "health", "served", "missing"] },
  { section: "system", anchor: "about-setup", label: "Kit setup state — re-run setup", keywords: ["commissioned", "setup", "wizard", "flash debt"] },
  { section: "system", anchor: "developer", label: "Developer — entity ids, provenance, INVENTED rows, force 3D, raw snapshot", keywords: ["debug", "entity id", "provenance", "formula", "raw", "fleet", "snapshot", "feature flag", "force3d", "twin"] },
  { section: "system", anchor: "dev-tunables", label: "Hub tunables sync table", keywords: ["desired", "hub", "synced", "differs", "pending"] },
  { section: "system", anchor: "dev-changelog", label: "Settings change log", keywords: ["journal", "history", "who changed"] },
  { section: "system", anchor: "profile", label: "Setup profile — export / import", keywords: ["profile", "export", "import", "share", "second device", "community", "json", "presets"] },
  { section: "system", anchor: "reset", label: "Reset — browser preferences, factory reset", keywords: ["reset", "factory", "erase", "defaults", "wipe", "first boot"] },
  { section: "system", anchor: "about", label: "About — versions", keywords: ["version", "surface", "firmware", "bundle", "sha", "manifest"] },
];

export function searchSettings(query: string, limit = 12): SettingsIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = SETTINGS_INDEX.map((e) => {
    const hay = [e.label, e.section, e.anchor, ...(e.keywords ?? []), e.description ?? ""].join(" ").toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (e.label.toLowerCase().startsWith(t)) score += 4;
      else if (e.label.toLowerCase().includes(t)) score += 3;
      else if (hay.includes(t)) score += 1;
      else return { e, score: -1 };
    }
    return { e, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.e);
}
