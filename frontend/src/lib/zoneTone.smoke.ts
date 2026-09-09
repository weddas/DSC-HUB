import assert from "node:assert/strict";
import { defaultBandMargin, zoneTone } from "./zoneTone";

// The live case that exposed it (2026-09-10): the 4x8 VPD ring painted green at 1.44 kPa
// beside its own label "want 1.2-1.4". The band is 0.2 wide; defaultBandMargin's kPa floor
// is 0.05, a quarter of the band, so the excursion sat inside the anti-flap tolerance.
const vpdBand = { min: 1.2, max: 1.4 };
const vpdMargin = defaultBandMargin(vpdBand, "kPa");
assert.equal(vpdMargin, 0.05, "the kPa floor is what made this band forgiving");
assert.equal(
  zoneTone({ value: 1.44, band: vpdBand, margin: vpdMargin, available: true }),
  "warn",
  "a value the label shows as out of band must not paint ok",
);

// Inside the band is still ok — the change must not make every gauge shout.
assert.equal(zoneTone({ value: 1.3, band: vpdBand, margin: vpdMargin, available: true }), "ok");
assert.equal(zoneTone({ value: 1.4, band: vpdBand, margin: vpdMargin, available: true }), "ok", "the max is in band");
assert.equal(zoneTone({ value: 1.2, band: vpdBand, margin: vpdMargin, available: true }), "ok", "the min is in band");

// Far out is still critical, and the margin still sets how far "far" is.
assert.equal(
  zoneTone({ value: 1.66, band: { min: 0.8, max: 1.1 }, margin: defaultBandMargin({ min: 0.8, max: 1.1 }, "kPa"), available: true }),
  "critical",
);

// RH behaved correctly before and must be unchanged: 48.5 against 55-65.
const rhBand = { min: 55, max: 65 };
assert.equal(
  zoneTone({ value: 48.5, band: rhBand, margin: defaultBandMargin(rhBand, "%"), available: true }),
  "critical",
);
assert.equal(zoneTone({ value: 60, band: rhBand, margin: defaultBandMargin(rhBand, "%"), available: true }), "ok");

// Precedence is untouched: absent beats stale beats fault beats band.
assert.equal(zoneTone({ value: 99, band: vpdBand, available: false }), "muted");
assert.equal(zoneTone({ value: NaN, band: vpdBand, available: true }), "muted");
assert.equal(zoneTone({ value: 99, band: vpdBand, stale: true, available: true }), "stale");
assert.equal(zoneTone({ value: 1.3, band: vpdBand, fault: true, available: true }), "critical");

// No band means nothing to contradict.
assert.equal(zoneTone({ value: 1.44, available: true }), "ok");

console.log("zoneTone smoke tests ok");
