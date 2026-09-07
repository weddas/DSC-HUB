/**
 * The scale ladder (design turn 3, frame 3a): density is decided by the number of zones
 * at each level, never by the operator picking a "mode".
 *
 *   1 zone      → the plant is the card
 *   2–6 zones   → the tent is the card, the room is the lung
 *   7–30 zones  → compact cards grouped by lung
 *   30+ zones   → strip table with a heat column
 *
 * The kit today has two grow zones inside one room, so Overview renders the "tents"
 * rung; the function exists so the same page keeps working when zones become data.
 */
export type ScaleRung = "plant" | "tents" | "compact" | "strip";

export function scaleRung(growZoneCount: number): ScaleRung {
  if (growZoneCount <= 1) return "plant";
  if (growZoneCount <= 6) return "tents";
  if (growZoneCount <= 30) return "compact";
  return "strip";
}
