import type { IconName } from "../ui";
import {
  zigbeeBannerTemplate,
  zigbeeFloodBannerTemplate,
  type ZigbeeRecipe,
} from "../../lib/fleetApi";
import type { FleetSnapshot, SeatSnapshot } from "../../lib/fleetModel";
import { FLOOD_TASK_ID } from "./settingsConstants";

export function pickSettings(settings: Record<string, string>, keys: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    if (settings[key] != null) out[key] = settings[key];
  }
  return out;
}

export function inventoryGroup(seatId: string): string {
  const id = seatId.toLowerCase();
  if (id === "hub" || id === "control" || id === "panel") return "Brain & panel";
  if (id === "pot1" || id === "pot2") return "Kit probes";
  if (id === "pot3" || id === "pot4") return "Advanced restore (Probe 3–4)";
  if (id.startsWith("pot")) return "Probes";
  return "Appliances";
}

/** Per-device glyph — seat_id → icon. */
export function seatIcon(seatId: string): IconName {
  const id = seatId.toLowerCase();
  if (id === "hub") return "system";
  if (id === "panel" || id.includes("control")) return "dash";
  if (id.startsWith("pot")) return "root";
  if (id.includes("tank")) return "tank";
  if (id.includes("mister") || id.includes("clone")) return "clone";
  if (id.includes("hum") || id.includes("heater") || id.includes("ac")) return "climate";
  if (id.includes("fan") || id.includes("intake") || id.includes("exhaust")) return "fan";
  if (id.includes("light") || id.includes("sf1000")) return "lighting";
  if (id.includes("mat")) return "root";
  return "fleet";
}

/** Zigbee device type → icon. */
export function zigbeeIcon(type: string): IconName {
  return type === "Router" ? "system" : "gauge";
}

export function parseZigbeePlacements(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (key && value) out[String(key)] = String(value);
    }
    return out;
  } catch {
    return {};
  }
}

export function effectiveZigbeeClass(inferred: string, override?: string): string {
  return String(override || inferred || "other").toLowerCase();
}

export function taskParamDefaults(
  recipeId: string,
  recipe: ZigbeeRecipe | undefined,
): Record<string, unknown> {
  const defaults = recipe?.default_params ?? {};
  if (recipeId === FLOOD_TASK_ID) {
    const problem_when = String(defaults.problem_when ?? "active");
    return {
      problem_when,
      banner: String(defaults.banner ?? zigbeeFloodBannerTemplate(problem_when)),
      banner_tone: String(defaults.banner_tone ?? "critical"),
    };
  }
  return {
    seat_id: String(defaults.seat_id ?? "dehumidifier"),
    problem_when: String(defaults.problem_when ?? "active"),
    force_relay: String(defaults.force_relay ?? "off"),
    banner: String(
      defaults.banner ??
        zigbeeBannerTemplate(
          String(defaults.seat_id ?? "dehumidifier"),
          String(defaults.problem_when ?? "active"),
        ),
    ),
    banner_tone: String(defaults.banner_tone ?? "critical"),
  };
}

export function resolveSeat(fleet: FleetSnapshot, seatId: string): SeatSnapshot | null {
  if (seatId === "hub") return fleet.hub;
  if (seatId === "panel" || seatId === "control") return fleet.panel;
  if (fleet.pots[seatId]) return fleet.pots[seatId];
  if (fleet.sonoffs[seatId]) return fleet.sonoffs[seatId];
  return null;
}

export function fmtLastSeen(ts: number | null | undefined): string {
  if (ts == null || !Number.isFinite(ts)) return "—";
  const d = new Date(ts * 1000);
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function extraField(row: Record<string, unknown>, key: string): string {
  const extra = row.extra;
  if (extra && typeof extra === "object") {
    return String((extra as Record<string, unknown>)[key] ?? "");
  }
  if (typeof extra === "string" && extra) {
    try {
      const parsed = JSON.parse(extra) as Record<string, unknown>;
      return String(parsed[key] ?? "");
    } catch {
      return "";
    }
  }
  return "";
}
