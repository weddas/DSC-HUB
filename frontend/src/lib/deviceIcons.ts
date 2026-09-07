import type { IconName } from "../iconSvg";

/**
 * Device / appliance → cultivation-set icon. Keyword based so the zone model, the
 * equipment tiles and the Kit desk agree without a second registry. Order matters:
 * the more specific words come first.
 */
export function applianceIcon(idOrName: string, lampKind?: "lamp" | "twin" | "window"): IconName | undefined {
  const k = idOrName.toLowerCase();
  if (k.includes("dehum")) return "dehumidifier";
  if (k.includes("mist")) return "mister";
  if (k.includes("humid")) return "humidifier";
  if (k.includes("heatmat") || k.includes("heat mat") || k.includes("grow_mat") || k === "mat" || k.startsWith("mat ") || k.includes(" mat")) return "heater-mat";
  if (k.includes("heater") || k.includes("heat")) return "space-heater";
  if (k.includes("minisplit")) return "hvac-minisplit";
  if (k.includes("cool") || k.includes("ac ") || k === "ac" || k.includes("air con") || k.includes("aircon")) return "air-conditioner";
  if (k.includes("chiller")) return "water-chiller";
  if (k.includes("exhaust")) return "exhaust-fan";
  if (k.includes("intake")) return "intake-fan";
  if (k.includes("6in") || k.includes("6\"")) return "inline-fan-6in";
  if (k.includes("4in") || k.includes("4\"")) return "inline-fan-4in";
  if (k.includes("oscillat") || k.includes("clip fan") || k.includes("circulation")) return "oscillating-fan";
  if (k.includes("fan")) return "inline-fan";
  if (k.includes("filter")) return "carbon-filter";
  if (k.includes("duct")) return "ducting";
  if (k.includes("drip") || k.includes("irrigation")) return "drip-irrigation";
  if (k.includes("pump")) return "water-pump";
  if (k.includes("tank") || k.includes("reservoir")) return "reservoir-tank";
  if (k.includes("plug") || k.includes("outlet") || k.includes("sonoff")) return "smart-outlet";
  if (k.includes("co2") || k.includes("co\u2082")) return k.includes("sensor") ? "co2-sensor" : k.includes("tank") ? "co2-tank" : "co2-level";
  if (k.includes("ppfd") || k.includes("par")) return "par-intensity";
  if (k.includes("light") || k.includes("lamp") || k.includes("twin") || k.includes("photoperiod") || k.includes("sf1000"))
    return lampKind === "twin" ? "grow-light-led-panel" : lampKind === "window" ? "light-schedule" : "grow-light";
  if (k.includes("leak")) return "leak-sensor";
  if (k.includes("canopy") || k.includes("temp_humidity") || k.includes("climate sensor")) return "temp-humidity-sensor";
  if (k.includes("substrate")) return "substrate-sensor";
  if (k.includes("probe") || k.includes("pot")) return "soil-probe";
  if (k.includes("zigbee")) return "zigbee";
  if (k.includes("wifi")) return "wifi";
  if (k.includes("hub") || k.includes("controller")) return "controller-hub";
  if (k.includes("camera")) return "camera-monitor";
  return undefined;
}

/** Growth phase → icon (frame 1o phase chips). */
export const PHASE_ICON = {
  veg: "veg-stage",
  gen: "flower-stage",
  bulk: "bud",
  finish: "trichome",
  dry: "drying-rack",
  cure: "curing-jar",
} as const satisfies Record<string, IconName>;
