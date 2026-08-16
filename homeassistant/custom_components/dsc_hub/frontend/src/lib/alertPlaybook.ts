export type PlaybookEntry = {
  title: string;
  what: string;
  fix: string;
};

const FLEET: PlaybookEntry = {
  title: "Fleet version",
  what: "A reporting node is missing firmware or is off the expected major.minor train. Planned OOS nodes (AC, clone mister, POT3) are inventory, not this chip.",
  fix: "Open Fleet. Flash the drifted device. If the hole is unbuilt kit, leave in_service off — do not treat it as fail.",
};

const OOS: PlaybookEntry = {
  title: "Out of service",
  what: "This lever is parked. Planned OOS (unbuilt AC / clone mister / POT3) is inventory. Unexpected OOS is a temp flag or operator lockout.",
  fix: "If the device is built and should run, turn in_service on from Fleet. Temp OOS / lockout: clear the flag after the soak. Unbuilt kit stays OOS — not an alarm.",
};

const HUB: PlaybookEntry = {
  title: "Hub link",
  what: "The hub is not answering ESP-NOW / HA. Mission holds last-good vitals instead of inventing Got.",
  fix: "Check hub power, SoftAP/Nest channel, and Fleet firmware. Wait out a flap (25s cooldown) before chasing ghosts.",
};

const PANEL: PlaybookEntry = {
  title: "Panel link",
  what: "Control panel is not on ESP-NOW. HA-only is a degraded path, not a green wall.",
  fix: "Confirm Control firmware and ESP-NOW age on Fleet. If Wi-Fi RSSI is live, it is HA-only — not offline.",
};

const BEAT: PlaybookEntry = {
  title: "Heartbeat",
  what: "Hub heartbeat sensor is dark. Beat is the liveness pulse, separate from climate Got.",
  fix: "If hub link is also down, fix the hub first. If link is on but beat is dark, check sensor.dsc_hub_heartbeat and reboot the hub.",
};

const KIT: PlaybookEntry = {
  title: "Kit node",
  what: "This spoke is inventory: running, idle, planned OOS, missing helper, or dark after the 25s offline cooldown.",
  fix: "OOS: leave it parked if unbuilt. Dark: wait the cooldown, then Fleet. Missing: the helper is not in HA yet.",
};

const ALERTS: Record<string, PlaybookEntry> = {
  "binary_sensor.dsc_hub_emergency_failsafe": {
    title: "Emergency failsafe",
    what: "Hub failsafe is armed — climate is in a protective path, not Full Auto keep-up.",
    fix: "Open Mission, clear the cause (sensor fault, runaway heat), then cycle failsafe from the hub.",
  },
  "binary_sensor.dsc_hub_climate_sensor_fault": {
    title: "Climate sensor fault",
    what: "Tent/room T or RH is untrusted. Do not invent Got or chase Want.",
    fix: "Check the DHT/probe, hold vitals, then Climate once the sensor is live.",
  },
  "binary_sensor.dsc_hub_aux_sensor_fault": {
    title: "Aux sensor fault",
    what: "An auxiliary climate probe failed. Coupled mix may be incomplete.",
    fix: "Fleet → sensor honesty. Do not turn Full Auto up to compensate.",
  },
  "binary_sensor.dsc_hub_root_zone_sensor_fault": {
    title: "Root-zone probes",
    what: "A pot probe the mat votes on is untrusted or missing.",
    fix: "Open Root. OOS the bad pot if it is hardware. Do not let it vote.",
  },
  "binary_sensor.dsc_clone_dark_period_violation": {
    title: "2×4 dark violation",
    what: "SF1000 is on while the 2×4 window is closed (and catch-up is not covering it). Herm risk.",
    fix: "Open Light. Turn the lamp off or wait catch-up. Manual hold / takeover are intentional dark paths.",
  },
  "binary_sensor.dsc_clone_light_missing_in_window": {
    title: "Light missing in window",
    what: "2×4 window is open but the SF1000 did not deliver. Photoperiod ledger is honest debt, not a fake bar.",
    fix: "Check SF1000, Auto photoperiod, and Light catch-up. Clone Off / takeover / manual hold skip this alert.",
  },
  "binary_sensor.dsc_hub_coherence_mismatch": {
    title: "Coherence mismatch",
    what: "Hub and HA disagree on a commanded lever.",
    fix: "Fleet heal / re-push. Do not double-tap the same switch from two UIs.",
  },
  "binary_sensor.dsc_nest_channel_split": {
    title: "Nest channel split",
    what: "SoftAP preferred BSSID and the associated AP are on different channels (CHX).",
    fix: "This is F-004 — lock is out of scope. SoftAP-primary is the heal path; do not fight the Nest channel.",
  },
  "binary_sensor.dsc_humidifier_vent_conflict": {
    title: "Humidifier vent conflict",
    what: "Buying moisture while dumping outside. Wasteful; newer firmware clamps OUT.",
    fix: "Drop OUT or stop humidifier demand. Check Climate dump/recirc split.",
  },
  "binary_sensor.dsc_heater_vent_conflict": {
    title: "Heater vent conflict",
    what: "Buying heat while dumping outside. Should be rare (heater interlock).",
    fix: "Close OUT or stop heater. Confirm the interlock on Climate.",
  },
  "binary_sensor.dsc_humidifier_ineffective_suspect": {
    title: "Humidifier ineffective",
    what: "Humidifier ran and RH did not move enough to believe the lever.",
    fix: "Check water, fan path, and room lung. Do not leave demand on as theatre.",
  },
  "binary_sensor.dsc_heater_ineffective_suspect": {
    title: "Heater ineffective",
    what: "Heater ran and tent T did not climb.",
    fix: "Check relay, dump CFM, and room lung. Transfer before buying more kW.",
  },
  "binary_sensor.dsc_grow_mat_ineffective_suspect": {
    title: "Heat mat ineffective",
    what: "Mat ran and root T did not climb on in-service pots.",
    fix: "Open Root. Confirm mat demand vs relay, and that voting pots are in service.",
  },
  "binary_sensor.dsc_plant_specs_incomplete": {
    title: "Plant specs incomplete",
    what: "Nameplate or volume helpers the physics budget needs are empty.",
    fix: "Tune → plant specs / Learning. Empty specs are honesty, not default CFM.",
  },
  "binary_sensor.dsc_plant_specs_intake_over_exhaust": {
    title: "Intake over exhaust",
    what: "Nameplate intakes exceed exhaust capacity — mass balance cannot hold.",
    fix: "Lower intake nameplates or raise exhaust. Learning allocated CFM is the Got.",
  },
  "binary_sensor.dsc_plant_specs_ac_capacity_missing": {
    title: "AC capacity missing",
    what: "AC is in service (or assumed) without a capacity number.",
    fix: "If AC is unbuilt, leave in_service off. If built, set the capacity spec.",
  },
  "binary_sensor.dsc_plant_specs_dehum_rate_zero": {
    title: "Dehum rate 0",
    what: "Dehumidifier rate helper is zero — Full Auto cannot budget moisture.",
    fix: "Set the L/day spec, or stop claiming dehum keep-up.",
  },
  "binary_sensor.dsc_plant_specs_hum_rate_zero": {
    title: "Hum rate 0",
    what: "Humidifier rate helper is zero.",
    fix: "Set the rate spec. Do not run demand with a zero budget.",
  },
  "binary_sensor.dsc_plant_specs_heater_zero": {
    title: "Heater spec 0",
    what: "Heater capacity helper is zero.",
    fix: "Set the watt/BTU spec or stop using heater demand as keep-up.",
  },
  "binary_sensor.dsc_tank_ec_out_of_range": {
    title: "Tank EC out of range",
    what: "Tank EC is outside the tank stage band.",
    fix: "Fleet tank tester. Do not invent a mix from a stale probe.",
  },
  "binary_sensor.dsc_tank_ph_out_of_range": {
    title: "Tank pH out of range",
    what: "Tank pH left the stage band.",
    fix: "Correct the tank. Confirm the probe before dosing.",
  },
  "binary_sensor.dsc_tank_water_too_warm": {
    title: "Tank too warm",
    what: "Reservoir temperature is high enough to invite biology you do not want.",
    fix: "Cool the tank / room lung. Do not ignore a live number.",
  },
  "binary_sensor.dsc_hub_light_catchup_active": {
    title: "Light catch-up",
    what: "2×4 is paying photoperiod debt from the hub ledger. Hours gauge is Got.",
    fix: "Let catch-up finish. Do not stack a second fake progress bar.",
  },
  "binary_sensor.dsc_reduced_kit": {
    title: "Unexpected reduced kit",
    what: "A lever that should be in service is temp-OOS or lockout — not the unbuilt AC/mister/POT3 inventory.",
    fix: "Clear temp OOS / operator lockout, or restore the unexpected pot. Planned holes stay OOS and must not pulse this chip.",
  },
};

function potAlerts(n: number): Record<string, PlaybookEntry> {
  return {
    [`binary_sensor.dsc_pot${n}_moisture_out_of_range`]: {
      title: `Pot ${n} moisture`,
      what: `Pot ${n} moisture left the Want/Need band.`,
      fix: "Open Root → that pot's inspector. OOS pots must not fake Got.",
    },
    [`binary_sensor.dsc_pot${n}_ph_out_of_range`]: {
      title: `Pot ${n} pH`,
      what: `Pot ${n} pH left the Want band.`,
      fix: "Root inspector. Confirm the probe before dosing.",
    },
    [`binary_sensor.dsc_pot${n}_root_zone_temp_out_of_range`]: {
      title: `Pot ${n} root T`,
      what: `Pot ${n} soil temperature left the trusted band.`,
      fix: "Mat / lung first. Do not run the mat if this pot is OOS.",
    },
    [`binary_sensor.dsc_pot${n}_ec_salt_build_up`]: {
      title: `Pot ${n} salt build-up`,
      what: `Pot ${n} EC is high vs baseline.`,
      fix: "Root card. Flush vs feed from Need, not from a red chip.",
    },
    [`binary_sensor.dsc_pot${n}_ec_depleted_vs_baseline`]: {
      title: `Pot ${n} EC depleted`,
      what: `Pot ${n} EC is low vs baseline.`,
      fix: "Feed from Need. Confirm the probe is trusted.",
    },
    [`binary_sensor.dsc_pot${n}_nitrogen_below_baseline`]: {
      title: `Pot ${n} N below baseline`,
      what: `Pot ${n} nitrogen is below the rolling baseline.`,
      fix: "Root NPK. Do not act on an untrusted probe.",
    },
    [`binary_sensor.dsc_pot${n}_nitrogen_depleting_fast`]: {
      title: `Pot ${n} N depleting`,
      what: `Pot ${n} nitrogen is falling faster than the rate band.`,
      fix: "Root rate spark. Check irrigation vs Need.",
    },
  };
}

Object.assign(ALERTS, potAlerts(1), potAlerts(2), potAlerts(3), potAlerts(4));

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
    title: entityId.split(".").pop()?.replace(/_/g, " ") || "Entity",
    what: "Got from Home Assistant. Click timespan / ghost in this drawer — do not invent a second dashboard.",
    fix: "If the number is wrong, fix the sensor or the Want. If it is unavailable, that is a hole, not a zero.",
  };
}

export const ALERT_ENTITY_IDS = Object.keys(ALERTS);
