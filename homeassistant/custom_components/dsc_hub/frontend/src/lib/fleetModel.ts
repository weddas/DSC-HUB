/** Typed FleetState — mirrors brain/dsc_brain/fleet_state.py to_dict(). */

export type SonoffSeatId = "heater" | "heatmat" | "humidifier" | "dehumidifier";
export type PotSeatId = "pot1" | "pot2" | "pot3" | "pot4";
export type FleetSeatId = "hub" | "panel" | PotSeatId | SonoffSeatId | "tank" | "ac" | "mister";

export interface SeatSnapshot {
  seat_id: string;
  online: boolean;
  firmware: string | null;
  values: Record<string, unknown>;
  last_seen: number | null;
}

export interface InventoryRow {
  seat_id: string;
  host?: string | null;
  mac?: string | null;
  api_key?: string | null;
  in_service?: boolean;
  extra?: Record<string, unknown>;
}

export interface FleetSnapshot {
  version: string;
  surface: string;
  expected_firmware: string;
  hub: SeatSnapshot;
  panel: SeatSnapshot;
  pots: Record<string, SeatSnapshot>;
  sonoffs: Record<string, SeatSnapshot>;
  canopy: Record<string, unknown>;
  system: Record<string, unknown>;
  updated_at: number;
  inventory?: InventoryRow[];
}

export const EMPTY_SEAT = (seat_id: string): SeatSnapshot => ({
  seat_id,
  online: false,
  firmware: null,
  values: {},
  last_seen: null,
});

export const EMPTY_FLEET: FleetSnapshot = {
  version: "7.0.0.0",
  surface: "7.0.0",
  expected_firmware: "7.0.0.0",
  hub: EMPTY_SEAT("hub"),
  panel: EMPTY_SEAT("panel"),
  pots: {},
  sonoffs: {},
  canopy: {},
  system: {},
  updated_at: 0,
};

function parseSeat(raw: unknown, seat_id: string): SeatSnapshot {
  if (!raw || typeof raw !== "object") return EMPTY_SEAT(seat_id);
  const o = raw as Record<string, unknown>;
  return {
    seat_id: String(o.seat_id ?? seat_id),
    online: !!o.online,
    firmware: o.firmware != null ? String(o.firmware) : null,
    values: (o.values as Record<string, unknown>) ?? {},
    last_seen: typeof o.last_seen === "number" ? o.last_seen : null,
  };
}

export function parseFleetSnapshot(raw: Record<string, unknown> | null | undefined): FleetSnapshot {
  if (!raw) return { ...EMPTY_FLEET };
  const pots: Record<string, SeatSnapshot> = {};
  const potRaw = raw.pots as Record<string, unknown> | undefined;
  if (potRaw) {
    for (const [id, seat] of Object.entries(potRaw)) {
      pots[id] = parseSeat(seat, id);
    }
  }
  const sonoffs: Record<string, SeatSnapshot> = {};
  const sonoffRaw = raw.sonoffs as Record<string, unknown> | undefined;
  if (sonoffRaw) {
    for (const [id, seat] of Object.entries(sonoffRaw)) {
      sonoffs[id] = parseSeat(seat, id);
    }
  }
  const inventory = Array.isArray(raw.inventory)
    ? (raw.inventory as InventoryRow[])
    : undefined;
  return {
    version: String(raw.version ?? EMPTY_FLEET.version),
    surface: String(raw.surface ?? EMPTY_FLEET.surface),
    expected_firmware: String(raw.expected_firmware ?? EMPTY_FLEET.expected_firmware),
    hub: parseSeat(raw.hub, "hub"),
    panel: parseSeat(raw.panel, "panel"),
    pots,
    sonoffs,
    canopy: (raw.canopy as Record<string, unknown>) ?? {},
    system: (raw.system as Record<string, unknown>) ?? {},
    updated_at: typeof raw.updated_at === "number" ? raw.updated_at : 0,
    inventory,
  };
}

export function hubVitals(fleet: FleetSnapshot): {
  temp_c: number | null;
  rh_pct: number | null;
  vpd_kpa: number | null;
  heartbeat: unknown;
  uptime: unknown;
} {
  const v = fleet.hub.values;
  return {
    temp_c: v.temp_c != null ? Number(v.temp_c) : null,
    rh_pct: v.rh_pct != null ? Number(v.rh_pct) : null,
    vpd_kpa: v.vpd_kpa != null ? Number(v.vpd_kpa) : v.vd_kpa != null ? Number(v.vd_kpa) : null,
    heartbeat: v.heartbeat ?? null,
    uptime: v.uptime ?? null,
  };
}

/** Per-tent climate from fleet hub.values (4×8 main vs 2×4 clone). */
export function tentVitals(
  fleet: FleetSnapshot,
  tent: "main" | "clone",
): { temp_c: number | null; rh_pct: number | null; vpd_kpa: number | null } {
  const v = fleet.hub.values;
  if (tent === "clone") {
    return {
      temp_c: v.clone_temp_c != null ? Number(v.clone_temp_c) : null,
      rh_pct: v.clone_rh_pct != null ? Number(v.clone_rh_pct) : null,
      vpd_kpa:
        v.clone_vpd_kpa != null
          ? Number(v.clone_vpd_kpa)
          : v.clone_vd_kpa != null
            ? Number(v.clone_vd_kpa)
            : null,
    };
  }
  return {
    temp_c: v.temp_c != null ? Number(v.temp_c) : null,
    rh_pct: v.rh_pct != null ? Number(v.rh_pct) : null,
    vpd_kpa: v.vpd_kpa != null ? Number(v.vpd_kpa) : v.vd_kpa != null ? Number(v.vd_kpa) : null,
  };
}

export function inventoryInService(
  fleet: FleetSnapshot,
  seatId: string,
  defaultInService = true,
): boolean {
  const row = fleet.inventory?.find((r) => r.seat_id === seatId);
  if (row && row.in_service != null) return !!row.in_service;
  if (seatId === "ac" || seatId === "mister" || seatId === "tank") return false;
  if (seatId === "pot3") return false;
  return defaultInService;
}

export function applianceLinkOk(fleet: FleetSnapshot): boolean {
  return !!fleet.system.appliance_link || !!fleet.system.appliance_hub_ok;
}
