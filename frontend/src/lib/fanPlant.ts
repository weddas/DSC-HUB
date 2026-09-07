/** Shared-duct fan plant — the four duty-% sensors Climate, Overview and the brain agree on. */

export interface FanBus {
  available: (id: string) => boolean;
  num: (id: string, fb?: number) => number;
}

export const SHARED_AIR_FAN_PCT: readonly { label: string; id: string }[] = [
  { label: "IN 4×8", id: "sensor.dsc_fan_intake_main_pct" },
  { label: "IN 2×4", id: "sensor.dsc_fan_intake_2x4_pct" },
  { label: "EX ROOM", id: "sensor.dsc_fan_exhaust_room_pct" },
  { label: "EX OUT", id: "sensor.dsc_fan_exhaust_outside_pct" },
];

/** Live duty % for one fan sensor, or `live: false` when the entity is absent / non-numeric. */
export function fanPctChip(bus: FanBus, id: string): { live: boolean; pct: number } {
  if (!bus.available(id)) return { live: false, pct: NaN };
  const pct = Math.round(bus.num(id, NaN));
  return { live: Number.isFinite(pct), pct };
}
