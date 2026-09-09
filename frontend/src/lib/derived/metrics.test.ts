/**
 * Derived-metrics contract test — run with `npx --yes tsx src/lib/derived/metrics.test.ts`.
 * The point of every case here is the same: a missing input must produce `unavailable`
 * with a reason, never a number.
 */
import assert from "node:assert/strict";
import {
  absoluteHumidityMetric,
  airVpdMetric,
  condensationMarginMetric,
  co2Slot,
  derivedNote,
  dewPointMetric,
  dliMetric,
  fmtDerived,
  inBandMetric,
  isResolved,
  leafVpdMetric,
  moistureLoadMetric,
  moistureRemovalGrams,
  ppfdMetric,
  vpdDeficitMetric,
  zoneDerived,
} from "./index";

const T = 24;
const RH = 60;

// --- resolved values carry provenance -------------------------------------
const vpd = airVpdMetric({ tempC: T, rhPct: RH });
assert.ok(isResolved(vpd));
assert.ok(vpd.value! > 1.1 && vpd.value! < 1.3, `air VPD ${vpd.value}`);
assert.match(vpd.provenance, /T \+ RH/);
assert.equal(vpd.unavailable, undefined);

const dew = dewPointMetric({ tempC: T, rhPct: RH });
assert.ok(isResolved(dew));
assert.ok(dew.value! > 15 && dew.value! < 17, `dew point ${dew.value}`);

const ah = absoluteHumidityMetric({ tempC: T, rhPct: RH });
assert.ok(isResolved(ah));
assert.ok(ah.value! > 12 && ah.value! < 14, `AH ${ah.value}`);

// --- missing inputs are honest, never fabricated ---------------------------
for (const [inputs, expect] of [
  [{ tempC: null, rhPct: RH }, /air temperature/],
  [{ tempC: T, rhPct: null }, /relative humidity/],
  [{ tempC: null, rhPct: null }, /air temperature and relative humidity/],
  [{ tempC: NaN, rhPct: RH }, /air temperature/],
] as const) {
  for (const m of [airVpdMetric(inputs), dewPointMetric(inputs), absoluteHumidityMetric(inputs)]) {
    assert.equal(m.value, null, `${m.key} fabricated a value from ${JSON.stringify(inputs)}`);
    assert.match(m.unavailable ?? "", expect);
    assert.equal(m.provenance, "");
    assert.equal(fmtDerived(m), "—");
    assert.match(derivedNote(m), /^unavailable — /);
  }
}

// RH 0 has no Magnus solution — say so rather than return a number.
const dryDew = dewPointMetric({ tempC: T, rhPct: 0 });
assert.equal(dryDew.value, null);
assert.match(dryDew.unavailable ?? "", /0 %/);

// --- leaf VPD: the assumption is part of the value -------------------------
const leafAssumed = leafVpdMetric({ tempC: T, rhPct: RH, leafOffsetC: -1.5 });
assert.ok(isResolved(leafAssumed));
assert.match(leafAssumed.assumption ?? "", /assumed/);
assert.match(leafAssumed.possibleWith ?? "", /IR leaf/);

const leafMeasured = leafVpdMetric({ tempC: T, rhPct: RH, leafTempC: 22.5 });
assert.ok(isResolved(leafMeasured));
assert.equal(leafMeasured.assumption, undefined, "a bound leaf sensor must drop the assumption");
assert.match(leafMeasured.provenance, /leaf sensor bound/);
// Same physical offset → same number whether assumed or measured.
assert.ok(Math.abs(leafMeasured.value! - leafAssumed.value!) < 1e-9);

// --- condensation margin: no surface probe means an upper bound ------------
const margin = condensationMarginMetric({ tempC: T, rhPct: RH });
assert.ok(isResolved(margin));
assert.match(margin.assumption ?? "", /coldest surface assumed/);
const marginProbed = condensationMarginMetric({ tempC: T, rhPct: RH, surfaceTempC: 18 });
assert.equal(marginProbed.assumption, undefined);
assert.ok(marginProbed.value! < margin.value!);
assert.equal(condensationMarginMetric({ tempC: null, rhPct: RH }).value, null);

// --- VPD deficit ------------------------------------------------------------
const band = { min: 1.0, max: 1.4 };
assert.equal(vpdDeficitMetric(1.2, band).value, 0);
assert.ok(Math.abs(vpdDeficitMetric(0.8, band).value! + 0.2) < 1e-9);
assert.ok(Math.abs(vpdDeficitMetric(1.6, band).value! - 0.2) < 1e-9);
assert.match(vpdDeficitMetric(1.2, undefined).unavailable ?? "", /needs a VPD band/);
assert.equal(vpdDeficitMetric(null, band).value, null);
assert.match(vpdDeficitMetric(1.2, { min: 1.4, max: 1.0 }).unavailable ?? "", /needs a VPD band/);

// --- PPFD / DLI -------------------------------------------------------------
assert.match(ppfdMetric(null, null).possibleWith ?? "", /PAR sensor/);
const ppfdCal = ppfdMetric(420, "calibrated", 75);
assert.match(ppfdCal.provenance, /calibration curve at 75 % dim/);
assert.match(ppfdCal.assumption ?? "", /not a live canopy reading/);
assert.equal(ppfdMetric(420, "measured").assumption, undefined);

const dli = dliMetric(420, 18, "calibrated");
assert.ok(isResolved(dli));
assert.ok(Math.abs(dli.value! - 27.216) < 1e-3, `DLI ${dli.value}`);
assert.match(dli.provenance, /18 h photoperiod/);
assert.match(dliMetric(null, 18).unavailable ?? "", /needs canopy PPFD/);
assert.match(dliMetric(420, null).unavailable ?? "", /needs a photoperiod rail/);
assert.match(dliMetric(null, null).unavailable ?? "", /needs canopy PPFD and a photoperiod rail/);
assert.equal(dliMetric(0, 18).value, null, "zero PPFD is not a DLI of zero — it is no reading");

// --- moisture load ----------------------------------------------------------
const load = moistureLoadMetric({ tempC: T, rhPct: RH }, { min: 45, max: 55 }, { min: 22, max: 26 });
assert.ok(isResolved(load));
assert.ok(load.value! > 0, "60 % RH against a 55 % ceiling is water to remove");
assert.match(load.provenance, /55 % ceiling at 24.0 °C/);
assert.match(moistureLoadMetric({ tempC: T, rhPct: RH }, undefined, undefined).unavailable ?? "", /needs an RH band/);
assert.equal(moistureLoadMetric({ tempC: null, rhPct: RH }, { min: 45, max: 55 }, undefined).value, null);
// No temperature band → the ceiling is taken at the live temperature and says so.
assert.match(
  moistureLoadMetric({ tempC: T, rhPct: RH }, { min: 45, max: 55 }, undefined).assumption ?? "",
  /CURRENT air temperature/,
);
assert.match(moistureRemovalGrams(load, null).unavailable ?? "", /internal volume/);
assert.ok(Math.abs(moistureRemovalGrams(load, 4).value! - load.value! * 4) < 1e-9);

// --- device-only slots ------------------------------------------------------
const co2 = co2Slot(null);
assert.equal(co2.value, null);
assert.match(co2.possibleWith ?? "", /NDIR/);
assert.equal(co2Slot(900).value, 900);

// --- history-backed ---------------------------------------------------------
// The sample at t carries the interval that follows it: in band for the first hour,
// out for the second → half the window.
const pts = [
  { t: 0, v: 1.2 },
  { t: 3600, v: 0.5 },
  { t: 7200, v: 0.5 },
];
const inBand = inBandMetric(pts, band, 24);
assert.ok(isResolved(inBand));
assert.ok(Math.abs(inBand.value! - 0.5) < 1e-9);
assert.match(inBandMetric(pts, undefined, 24).unavailable ?? "", /needs a band/);
assert.match(inBandMetric(pts, band, 24, false).unavailable ?? "", /not recorded/);
assert.match(inBandMetric([], band, 24, true).unavailable ?? "", /two history samples/);

// --- aggregate: a dark zone with no sensors yields ZERO numbers -------------
const blind = zoneDerived({ tempC: null, rhPct: null, vpd: null });
for (const d of blind.all) {
  assert.equal(d.value, null, `${d.key} produced a number with no inputs at all`);
  assert.ok((d.unavailable ?? "").length > 0, `${d.key} has no reason`);
}

const live = zoneDerived({
  tempC: T,
  rhPct: RH,
  vpd: 1.2,
  vpdBand: band,
  rhBand: { min: 45, max: 55 },
  tempBand: { min: 22, max: 26 },
  ppfd: 420,
  ppfdSource: "calibrated",
  photoperiodHours: 18,
  leafOffsetC: -1.5,
});
for (const d of live.all) {
  if (isResolved(d)) assert.ok(d.provenance.length > 0, `${d.key} resolved without provenance`);
  else assert.ok((d.unavailable ?? "").length > 0, `${d.key} unavailable without a reason`);
}
assert.ok(isResolved(live.dli) && isResolved(live.dewPoint) && isResolved(live.leafVpd));
// Still device-only even in the fully-lit zone.
assert.equal(live.co2.value, null);
assert.equal(live.leafTemp.value, null);
assert.equal(live.strip.length, 4);

console.log("derived/metrics.test.ts OK");
