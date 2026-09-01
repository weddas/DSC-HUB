export type PlaybookEntry = {
  title: string;
  what: string;
  fix: string;
};

const FLEET: PlaybookEntry = {
  title: "Fleet version",
  what: "A device is missing firmware or running a different version than expected. Devices deliberately out of service (AC, clone mister, pot 3–4, tank) are not counted here.",
  fix: "Open Fleet and update the outdated device. If the device is not built yet, leave it out of service — that is not a failure.",
};

const OOS: PlaybookEntry = {
  title: "Out of service",
  what: "This device is not running. It may be deliberately out of service (not built yet), temporarily paused, or locked out by an operator.",
  fix: "If the device is built and should run, switch it back in service from Fleet. If it was paused temporarily, clear that once the pause is over. Unbuilt devices stay out of service — not an alarm.",
};

const HUB: PlaybookEntry = {
  title: "Hub link",
  what: "The hub is not responding. The display holds the last good readings instead of showing made-up values.",
  fix: "Check hub power, the Wi-Fi channel, and firmware on Fleet. Brief dropouts recover on their own within about half a minute.",
};

const PANEL: PlaybookEntry = {
  title: "Panel link",
  what: "The control panel has lost its direct radio link. A limited fallback link may still be working — slower, but not offline.",
  fix: "Check the panel's firmware and link age on Fleet. If its Wi-Fi signal is still reporting, the panel is on the fallback link, not offline.",
};

const BEAT: PlaybookEntry = {
  title: "Heartbeat",
  what: "The hub's regular liveness pulse has stopped arriving. This is separate from the climate readings.",
  fix: "If the hub link is also down, fix the hub first. If the link is up but the heartbeat is missing, restart the hub.",
};

const KIT: PlaybookEntry = {
  title: "Device",
  what: "This shows the device's real state: running, idle, deliberately out of service, not set up yet, or offline after a short grace period.",
  fix: "Out of service: leave it if the device is not built. Offline: give it a moment, then check Fleet. Not set up: the device has not been added yet.",
};

const ALERTS: Record<string, PlaybookEntry> = {
  "binary_sensor.dsc_hub_emergency_failsafe": {
    title: "Emergency failsafe",
    what: "The hub's failsafe is armed — climate is running in a protective mode, not normal automation.",
    fix: "Open Mission, clear the cause (sensor fault, runaway heat), then reset failsafe from the hub.",
  },
  "binary_sensor.dsc_hub_climate_sensor_fault": {
    title: "Climate sensor fault",
    what: "A tent or room temperature/humidity reading cannot be trusted right now.",
    fix: "Check the sensor. Readings are held until it comes back — nothing is guessed.",
  },
  "binary_sensor.dsc_hub_aux_sensor_fault": {
    title: "Aux sensor fault",
    what: "A secondary climate sensor failed, so some readings may be incomplete.",
    fix: "Check sensor health on Fleet. Do not turn automation up to compensate.",
  },
  "binary_sensor.dsc_hub_root_zone_sensor_fault": {
    title: "Root-zone probes",
    what: "A pot probe that heat-mat control relies on is missing or untrusted.",
    fix: "Open Root. If the probe hardware failed, take that pot out of service so it stops influencing control.",
  },
  "binary_sensor.dsc_clone_dark_period_violation": {
    title: "2×4 dark violation",
    what: "The light is on while the 2×4 tent should be dark. This risks stressing the plants.",
    fix: "Open Light. Turn the lamp off or let catch-up finish. Manual hold and manual control are intentional exceptions.",
  },
  "binary_sensor.dsc_clone_light_missing_in_window": {
    title: "Light missing in window",
    what: "The 2×4 light window is open but the lamp has not delivered its hours yet. The shortfall is tracked, not hidden.",
    fix: "Check the lamp, the automatic photoperiod, and light catch-up. This alert is skipped while the clone tent is off or under manual control.",
  },
  "binary_sensor.dsc_hub_coherence_mismatch": {
    title: "Coherence mismatch",
    what: "The hub and the app disagree about a commanded device.",
    fix: "Re-sync from Fleet. Avoid switching the same device from two places at once.",
  },
  "binary_sensor.dsc_nest_channel_split": {
    title: "Wi-Fi channel split",
    what: "The hub's access point and the house Wi-Fi are on different channels.",
    fix: "Known limitation — the hub's own access point takes priority and recovers on its own.",
  },
  "binary_sensor.dsc_humidifier_vent_conflict": {
    title: "Humidifier vent conflict",
    what: "Adding moisture while venting it straight outside — wasteful.",
    fix: "Lower the exhaust or stop the humidifier. Check the vent split on Climate.",
  },
  "binary_sensor.dsc_heater_vent_conflict": {
    title: "Heater vent conflict",
    what: "Adding heat while venting it straight outside. Should be rare.",
    fix: "Close the exhaust or stop the heater. Confirm the interlock on Climate.",
  },
  "binary_sensor.dsc_humidifier_ineffective_suspect": {
    title: "Humidifier ineffective",
    what: "The humidifier ran but humidity did not rise enough to trust it.",
    fix: "Check the water level, the fan path, and room airflow. Do not leave it running for show.",
  },
  "binary_sensor.dsc_heater_ineffective_suspect": {
    title: "Heater ineffective",
    what: "The heater ran but tent temperature did not climb.",
    fix: "Check the relay, the exhaust rate, and room airflow before buying more power.",
  },
  "binary_sensor.dsc_grow_mat_ineffective_suspect": {
    title: "Heat mat ineffective",
    what: "The mat ran but root temperature did not climb on active pots.",
    fix: "Open Root. Confirm the mat is actually switching, and that the right pots are in service.",
  },
  "binary_sensor.dsc_plant_specs_incomplete": {
    title: "Plant specs incomplete",
    what: "Equipment ratings or volumes needed for climate planning are missing.",
    fix: "Fill in the specs under Tune. Missing specs are shown as missing, not defaulted.",
  },
  "binary_sensor.dsc_plant_specs_intake_over_exhaust": {
    title: "Intake over exhaust",
    what: "Rated intake airflow exceeds exhaust capacity — the air budget cannot balance.",
    fix: "Lower the intake ratings or raise the exhaust. Measured airflow from calibration takes priority.",
  },
  "binary_sensor.dsc_plant_specs_ac_capacity_missing": {
    title: "AC capacity missing",
    what: "The AC is marked in service but has no capacity rating.",
    fix: "If the AC is not built, take it out of service. If it is built, enter its capacity.",
  },
  "binary_sensor.dsc_plant_specs_dehum_rate_zero": {
    title: "Dehumidifier rate 0",
    what: "The dehumidifier's rate is set to zero, so moisture removal cannot be planned.",
    fix: "Enter the litres-per-day rating, or take the dehumidifier out of service.",
  },
  "binary_sensor.dsc_plant_specs_hum_rate_zero": {
    title: "Humidifier rate 0",
    what: "The humidifier's rate is set to zero.",
    fix: "Enter the rate. Do not run it with a zero budget.",
  },
  "binary_sensor.dsc_plant_specs_heater_zero": {
    title: "Heater spec 0",
    what: "The heater's capacity is set to zero.",
    fix: "Enter the watt or BTU rating, or stop relying on the heater for keep-up.",
  },
  "binary_sensor.dsc_tank_ec_out_of_range": {
    title: "Tank EC out of range",
    what: "Tank nutrient strength is outside the band for the current stage.",
    fix: "Test the tank. Confirm the probe before changing the mix.",
  },
  "binary_sensor.dsc_tank_ph_out_of_range": {
    title: "Tank pH out of range",
    what: "Tank pH has left the band for the current stage.",
    fix: "Correct the tank. Confirm the probe before dosing.",
  },
  "binary_sensor.dsc_tank_water_too_warm": {
    title: "Tank too warm",
    what: "Reservoir temperature is high enough to encourage unwanted growth.",
    fix: "Cool the tank or improve room airflow.",
  },
  "binary_sensor.dsc_peer_mad_alert": {
    title: "Peer probe divergence",
    what: "In-service pot probes disagree beyond the MAD threshold — one may be stuck or outlier.",
    fix: "Open Root. Check stuck/untrusted pots before trusting mat vote.",
  },
  "binary_sensor.dsc_dht_disagreement": {
    title: "DHT disagreement",
    what: "Tent, room, and clone temperature or humidity spans exceed threshold for 15+ minutes.",
    fix: "Climate cue only — check DHT placement and ventilation. Not a failsafe trip.",
  },
  "binary_sensor.dsc_probe1_sensor_stuck": {
    title: "Pot 1 stuck",
    what: "Pot 1 soil moisture has not moved for the stuck window.",
    fix: "Probe may be wedged or offline. Exclude from mat vote if untrusted.",
  },
  "binary_sensor.dsc_probe2_sensor_stuck": {
    title: "Pot 2 stuck",
    what: "Pot 2 soil moisture has not moved for the stuck window.",
    fix: "Probe may be wedged or offline. Exclude from mat vote if untrusted.",
  },
  "binary_sensor.dsc_probe3_sensor_stuck": {
    title: "Pot 3 stuck",
    what: "Pot 3 soil moisture has not moved for the stuck window.",
    fix: "Probe may be wedged or offline. Exclude from mat vote if untrusted.",
  },
  "binary_sensor.dsc_probe4_sensor_stuck": {
    title: "Pot 4 stuck",
    what: "Pot 4 soil moisture has not moved for the stuck window.",
    fix: "Probe may be wedged or offline. Exclude from mat vote if untrusted.",
  },
  "binary_sensor.dsc_hub_light_catchup_active": {
    title: "Light catch-up",
    what: "The 2×4 is making up missed light hours. The hours gauge shows what was actually delivered.",
    fix: "Let catch-up finish on its own.",
  },
  "binary_sensor.dsc_reduced_kit": {
    title: "Capacity offline",
    what: "A device that should be running is temporarily out of service or locked out — not one of the deliberately unbuilt devices.",
    fix: "Clear the temporary pause or lockout, or bring the affected device back. Deliberately out-of-service devices do not trigger this.",
  },
};

function potAlerts(n: number): Record<string, PlaybookEntry> {
  return {
    [`binary_sensor.dsc_probe${n}_moisture_out_of_range`]: {
      title: `Pot ${n} moisture`,
      what: `Pot ${n} moisture has left its target band.`,
      fix: "Open Root and check that pot. Pots out of service never show made-up readings.",
    },
    [`binary_sensor.dsc_probe${n}_ph_out_of_range`]: {
      title: `Pot ${n} pH`,
      what: `Pot ${n} pH has left its target band.`,
      fix: "Check the pot on Root. Confirm the probe before dosing.",
    },
    [`binary_sensor.dsc_probe${n}_root_zone_temp_out_of_range`]: {
      title: `Pot ${n} root T`,
      what: `Pot ${n} soil temperature has left its trusted band.`,
      fix: "Check the heat mat and airflow first. The mat should not run for a pot that is out of service.",
    },
    [`binary_sensor.dsc_probe${n}_ec_salt_build_up`]: {
      title: `Pot ${n} salt build-up`,
      what: `Pot ${n} nutrient strength is high compared with its baseline.`,
      fix: "Check the pot on Root. Decide flush vs feed from the pot's Need reading, not just this alert.",
    },
    [`binary_sensor.dsc_probe${n}_ec_depleted_vs_baseline`]: {
      title: `Pot ${n} EC depleted`,
      what: `Pot ${n} nutrient strength is low compared with its baseline.`,
      fix: "Feed based on the pot's Need reading. Confirm the probe is trusted.",
    },
    [`binary_sensor.dsc_probe${n}_nitrogen_below_baseline`]: {
      title: `Pot ${n} N below baseline`,
      what: `Pot ${n} nitrogen is below its rolling baseline.`,
      fix: "Check the NPK readings on Root. Do not act on an untrusted probe.",
    },
    [`binary_sensor.dsc_probe${n}_nitrogen_depleting_fast`]: {
      title: `Pot ${n} N depleting`,
      what: `Pot ${n} nitrogen is falling faster than expected.`,
      fix: "Check the trend on Root and compare irrigation against the pot's Need.",
    },
  };
}

Object.assign(ALERTS, potAlerts(1), potAlerts(2), potAlerts(3), potAlerts(4));

/** Route an active alert chip to the cockpit that can fix it. */
export function alertRoute(entityId: string): { href: string; cta: string } {
  if (
    entityId.includes("dark") ||
    entityId.includes("light") ||
    entityId.includes("photo") ||
    entityId.includes("catchup")
  ) {
    return { href: "/live/light", cta: "Open Light" };
  }
  if (entityId.includes("vpd")) {
    return { href: "/live/climate", cta: "Open Climate" };
  }
  if (
    entityId.includes("root") ||
    entityId.includes("pot") ||
    entityId.includes("grow_mat") ||
    entityId.includes("tank_")
  ) {
    return { href: "/live/root", cta: "Open Root" };
  }
  if (
    entityId.includes("climate") ||
    entityId.includes("humidifier") ||
    entityId.includes("heater") ||
    entityId.includes("vent") ||
    entityId.includes("coherence") ||
    entityId.includes("plant_specs")
  ) {
    return { href: "/live/climate", cta: "Open Climate" };
  }
  if (entityId.includes("failsafe") || entityId.includes("emergency")) {
    return { href: "/live/mission", cta: "Mission" };
  }
  if (entityId.includes("reduced_kit") || entityId.includes("nest_channel")) {
    return { href: "/fleet", cta: "Open Fleet" };
  }
  return { href: "/live/overview", cta: "Overview" };
}

export function playbookFor(
  entityId: string,
  kind?: "alert" | "kit" | "fleet" | "binary" | "numeric",
): PlaybookEntry {
  if (ALERTS[entityId]) return ALERTS[entityId];
  if (kind === "fleet" || entityId === "sensor.dsc_fleet_version_status") return FLEET;
  if (kind === "kit") return KIT;
  if (entityId.includes("in_service") || entityId.endsWith("_oos")) return OOS;
  if (entityId.includes("hub_link") || entityId.includes("hub_uptime")) return HUB;
  if (entityId.includes("panel_link") || entityId.includes("control_wifi")) return PANEL;
  if (entityId.includes("heartbeat")) return BEAT;
  return {
    title: entityId.split(".").pop()?.replace(/_/g, " ") || "Reading",
    what: "A live reading recorded by the hub. Use the timespan buttons here to explore its history.",
    fix: "If the number looks wrong, check the sensor or its target. If it shows no value, nothing was measured — it is not a zero.",
  };
}

export const ALERT_ENTITY_IDS = Object.keys(ALERTS);
