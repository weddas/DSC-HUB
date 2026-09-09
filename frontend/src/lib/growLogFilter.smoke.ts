import assert from "node:assert/strict";
import { growLogSeverity, prepareGrowLog, type DisplayGrowLogEvent } from "./growLogFilter";

// The leaf-VPD rebase note is a one-time statement about the SERIES, not a condition of
// the grow. `/\bvpd\b/i` alone tagged it ALERT and `prepareGrowLog` then sorted it above
// real alerts — five copies sat at the top of the 24 h desk on 2026-09-09.
const ADVISORY =
  "Advisory: leaf VPD definition corrected to es(leaf) - es(air)*rh/100 " +
  "(was es(leaf)*(1-rh/100)). sensor.dsc_leaf_vpd_kpa history before this point is " +
  "NOT comparable with points after it.";

assert.equal(growLogSeverity(ADVISORY), "normal", "a one-time advisory must not be an ALERT");

// A real VPD condition still is one.
assert.equal(growLogSeverity("4x8 VPD 1.66 kPa above band 0.8-1.1"), "alert");
// As does a dark-period violation.
assert.equal(growLogSeverity("dark-period light detected in 4x8"), "alert");
// And "advisory" only disarms the VPD rule, never the dark-period one.
assert.equal(growLogSeverity("Advisory: dark-period accounting changed"), "alert");

// Ordering: the advisory must not be lifted above a genuine alert.
const events: DisplayGrowLogEvent[] = [
  { message: ADVISORY, ts: 200 },
  { message: "2x4 VPD 1.90 kPa above band", ts: 100 },
];
const prepared = prepareGrowLog(events);
assert.equal(prepared[0].message, "2x4 VPD 1.90 kPa above band", "a real alert must sort first");

console.log("growLogFilter smoke tests ok");
