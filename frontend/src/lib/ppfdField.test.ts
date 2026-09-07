import assert from "node:assert/strict";
import type { PpfdLayer } from "./lightCatalog";
import { dliFromPpfd, fieldAtHeight, fieldStats, fitHeightExponent, resampleLayer, scaleDim, superpose } from "./ppfdField";

const prov = { method: "manual", status: "unverified" } as const;

function grid(id: string, h: number, values: number[][]): PpfdLayer {
  return {
    id,
    conditions: { height_cm: h, footprint: { width_cm: 60, depth_cm: 60 }, dim_pct: 100, mode: null },
    unit: "umol_m2_s",
    layout: "grid",
    grid: { rows: values.length, cols: values[0].length, values },
    provenance: prov,
  };
}

// 2x2 grid: bilinear resample keeps the cell centres and interpolates between them
const g30 = grid("g30", 30, [
  [100, 200],
  [300, 400],
]);
const f = resampleLayer(g30, 4, 4);
assert.equal(f.derived, "bilinear");
assert.equal(f.estimated, false);
const st = fieldStats(f);
assert.ok(st.min >= 100 && st.max <= 400, `range clamps to measured cells: ${st.min}-${st.max}`);
assert.ok(Math.abs(st.avg - 250) < 1e-9, `mean preserved: ${st.avg}`);
assert.equal(f.values[0], 100); // top-left sample sits inside the top-left cell
assert.equal(f.values[15], 400);

// unreadable cell borrows its neighbours instead of reading as zero
const holes = grid("holes", 30, [
  [100, null as unknown as number],
  [300, 400],
]);
const fh = resampleLayer(holes, 2, 2);
assert.ok(fh.values[1] > 100 && fh.values[1] < 400, `hole filled from neighbours: ${fh.values[1]}`);

// sparse points: IDW hits the readings exactly and stays inside their range
const pts: PpfdLayer = {
  id: "p",
  conditions: { height_cm: 30, footprint: { width_cm: 61, depth_cm: 61 }, dim_pct: 100, mode: null },
  unit: "umol_m2_s",
  layout: "points",
  points: [
    { x_frac: 0, y_frac: 0, value: 350 },
    { x_frac: 1, y_frac: 0, value: 350 },
    { x_frac: 0, y_frac: 1, value: 350 },
    { x_frac: 1, y_frac: 1, value: 350 },
    { x_frac: 0.5, y_frac: 0.5, value: 900 },
  ],
  provenance: prov,
};
const fp = resampleLayer(pts, 9, 9);
assert.equal(fp.derived, "idw");
const sp = fieldStats(fp);
assert.ok(sp.max <= 900 && sp.min >= 350, `idw stays within readings: ${sp.min}-${sp.max}`);
assert.ok(fp.values[4 * 9 + 4] > 800, "centre sample near the centre reading");

// height exponent: halving PPFD from 30 to 42.4 cm is inverse square (k≈2)
const g42 = grid("g42", 30 * Math.SQRT2, [
  [50, 100],
  [150, 200],
]);
const fit = fitHeightExponent([g30, g42]);
assert.ok(fit.fitted && Math.abs(fit.k - 2) < 0.01, `k fitted ${fit.k}`);
assert.deepEqual(fitHeightExponent([g30]), { k: 2, fitted: false });

// exact height returns the measured layer, not an estimate
assert.equal(fieldAtHeight([g30, g42], 30)!.estimated, false);
// between layers: monotone and flagged
const mid = fieldAtHeight([g30, g42], 36)!;
assert.equal(mid.estimated, true);
assert.match(mid.note, /blend/);
const a30 = fieldStats(resampleLayer(g30)).avg;
const a42 = fieldStats(resampleLayer(g42)).avg;
assert.ok(fieldStats(mid).avg < a30 && fieldStats(mid).avg > a42, "between the two measured averages");
// extrapolation: farther is dimmer, flagged, uses fitted k
const far = fieldAtHeight([g30, g42], 60)!;
assert.equal(far.estimated, true);
assert.match(far.note, /extrapolated/);
assert.ok(Math.abs(fieldStats(far).avg - a42 * Math.pow(30 * Math.SQRT2 / 60, Math.max(fit.k, 2))) < 1, "scaled from the nearest layer");
// a gentle in-footprint fit never softens extrapolation below inverse square
const gentle = grid("gentle", 40, [
  [90, 180],
  [270, 360],
]);
assert.ok(fitHeightExponent([g30, gentle]).k < 1);
const beyond = fieldAtHeight([g30, gentle], 60)!;
assert.match(beyond.note, /inverse-square floor/);
assert.ok(Math.abs(fieldStats(beyond).avg - fieldStats(resampleLayer(gentle)).avg * Math.pow(40 / 60, 2)) < 1e-6);
assert.equal(fieldAtHeight([], 30), null);

// dimming is linear and flagged
const dim = scaleDim(resampleLayer(g30), 50);
assert.ok(Math.abs(fieldStats(dim).avg - 125) < 1e-9);
assert.equal(dim.estimated, true);

// superposition: two identical fixtures side by side in a 120x60 tent
const one = resampleLayer(g30, 6, 6);
const tent = superpose({ width_cm: 120, depth_cm: 60, nx: 12, ny: 6 }, [
  { field: one, x_cm: 30, y_cm: 30 },
  { field: one, x_cm: 90, y_cm: 30 },
]);
assert.equal(tent.gapCells, 0);
assert.equal(tent.coveredFraction, 1);
assert.ok(Math.abs(fieldStats(tent).avg - 250) < 1e-9, "two non-overlapping copies keep the mean");
// overlapping fixtures add
const overlap = superpose({ width_cm: 60, depth_cm: 60, nx: 6, ny: 6 }, [
  { field: one, x_cm: 30, y_cm: 30 },
  { field: one, x_cm: 30, y_cm: 30 },
]);
assert.ok(Math.abs(fieldStats(overlap).avg - 500) < 1e-9, "stacked fixtures sum");
// uncovered canopy is a flagged gap, never filled
const partial = superpose({ width_cm: 120, depth_cm: 60, nx: 12, ny: 6 }, [{ field: one, x_cm: 30, y_cm: 30 }]);
assert.equal(partial.gapCells, 36);
assert.equal(partial.estimated, true);

// DLI: 500 µmol over 12 h = 21.6 mol/m²/d
assert.ok(Math.abs(dliFromPpfd(500, 12) - 21.6) < 1e-9);

console.log("ppfdField ok");
