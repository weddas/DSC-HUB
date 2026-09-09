/**
 * computeLightSchedule — the midnight wrap.
 *
 * A photoperiod that runs past midnight (lights-on 15:00 + 12 h ends 03:00 the next day) is
 * still running in the small hours, and the window running then STARTED YESTERDAY. Only
 * today's window was ever checked, so every such schedule flipped to DARK the instant the
 * clock rolled over while the hub correctly held the lamp LIT. Live 2026-09-10 00:04.
 *
 * Run: npx tsx src/lib/lightSchedule.test.ts
 */
import assert from "node:assert/strict";

import { computeLightSchedule } from "./lightSchedule";

const H = 3_600_000;
const at = (iso: string) => new Date(iso).getTime();
const input = (lightsOnTime: string, expectedHours: number) => ({ lightsOnTime, expectedHours }) as never;

// ---- the regression: a wrapped window, just after midnight -----------------------------
{
  const s = computeLightSchedule(input("15:00:00", 12), at("2026-09-10T00:04:00"));
  assert.equal(s.valid, true);
  assert.equal(s.phase, "lit", "00:04 is inside yesterday's 15:00->03:00 window");
  assert.equal(s.untilOffMs, 2 * H + 56 * 60_000, "should read 2h56m to lights-off, not 14h56m to lights-on");
  assert.equal(s.untilOnMs, null);
  assert.equal(s.lightsOnAt?.getDate(), 9, "the running window started YESTERDAY");
}

// ---- the same window before midnight still works ---------------------------------------
{
  const s = computeLightSchedule(input("15:00:00", 12), at("2026-09-09T23:30:00"));
  assert.equal(s.phase, "lit");
  assert.equal(s.lightsOnAt?.getDate(), 9);
}

// ---- genuinely dark: after the wrapped window closes ------------------------------------
{
  const s = computeLightSchedule(input("15:00:00", 12), at("2026-09-10T04:00:00"));
  assert.equal(s.phase, "dark", "03:00 has passed, next on is 15:00 today");
  assert.equal(s.untilOnMs, 11 * H);
}

// ---- exact boundaries -------------------------------------------------------------------
{
  assert.equal(computeLightSchedule(input("15:00:00", 12), at("2026-09-10T02:59:59")).phase, "lit");
  assert.equal(computeLightSchedule(input("15:00:00", 12), at("2026-09-10T03:00:00")).phase, "dark", "off is exclusive");
  assert.equal(computeLightSchedule(input("15:00:00", 12), at("2026-09-10T15:00:00")).phase, "lit", "on is inclusive");
}

// ---- a NON-wrapping window is unaffected ------------------------------------------------
{
  const s = computeLightSchedule(input("06:00:00", 12), at("2026-09-10T00:04:00"));
  assert.equal(s.phase, "dark", "06:00->18:00 does not wrap; 00:04 is genuinely dark");
  assert.equal(s.untilOnMs, 5 * H + 56 * 60_000);
  assert.equal(computeLightSchedule(input("06:00:00", 12), at("2026-09-10T12:00:00")).phase, "lit");
}

// ---- a 24 h window is always lit ---------------------------------------------------------
{
  assert.equal(computeLightSchedule(input("15:00:00", 24), at("2026-09-10T00:04:00")).phase, "lit");
  assert.equal(computeLightSchedule(input("15:00:00", 24), at("2026-09-10T14:59:00")).phase, "lit");
}

// ---- no schedule stays invalid -----------------------------------------------------------
{
  const s = computeLightSchedule(input("", 12), at("2026-09-10T00:04:00"));
  assert.equal(s.valid, false);
  assert.equal(s.phase, "dark");
}

console.log("lightSchedule tests ok — midnight wrap covered");
