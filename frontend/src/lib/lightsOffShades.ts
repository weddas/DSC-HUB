import { parseTimeToMinutes, type LightScheduleInput } from "./lightSchedule";

const DAY_MS = 24 * 3600 * 1000;

/**
 * Lights-off windows for a tent over [fromMs, toMs], from its schedule (lights-on clock +
 * expected hours). Used to shade charts so a VPD swing at 20:00 reads as "sunset", not drift.
 * Returns [] when the schedule is invalid — no shade is drawn rather than a guessed one.
 */
export function darkIntervals(
  input: LightScheduleInput,
  fromMs: number,
  toMs: number,
): { from: number; to: number }[] {
  const onMin = parseTimeToMinutes(input.lightsOnTime);
  const hours =
    Number.isFinite(input.expectedHours) && input.expectedHours > 0 ? input.expectedHours : null;
  if (onMin == null || hours == null || toMs <= fromMs) return [];
  if (hours >= 24) return [];
  if (hours <= 0) return [{ from: fromMs, to: toMs }];

  // Lit windows for every local day touching the range (one day of slack each side).
  const lit: { from: number; to: number }[] = [];
  const start = new Date(fromMs);
  start.setHours(0, 0, 0, 0);
  for (let day = start.getTime() - DAY_MS; day <= toMs + DAY_MS; day += DAY_MS) {
    const d = new Date(day);
    d.setHours(0, 0, 0, 0); // re-anchor after DST steps
    const litFrom = d.getTime() + onMin * 60 * 1000;
    lit.push({ from: litFrom, to: litFrom + hours * 3600 * 1000 });
  }
  lit.sort((a, b) => a.from - b.from);

  // Invert within the range.
  const dark: { from: number; to: number }[] = [];
  let cursor = fromMs;
  for (const w of lit) {
    if (w.to <= cursor) continue;
    if (w.from > cursor) dark.push({ from: cursor, to: Math.min(w.from, toMs) });
    cursor = Math.max(cursor, w.to);
    if (cursor >= toMs) break;
  }
  if (cursor < toMs) dark.push({ from: cursor, to: toMs });
  return dark.filter((d) => d.to > d.from);
}
