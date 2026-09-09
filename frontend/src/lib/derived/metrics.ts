/**
 * The derived-metrics layer: every value the kit computes rather than measures,
 * wrapped in a `DerivedValue` that carries its provenance and its honest
 * unavailable state.
 *
 * Rules this module holds to, without exception:
 *  1. A missing input yields `unavailable` with the missing input named — never a number.
 *  2. A number that rests on an assumption carries that assumption in the value itself,
 *     so the widget cannot show the number without also being able to show the caveat.
 *  3. A value that a real sensor could measure carries `possibleWith`, so a device-only
 *     reading appears as a labelled slot rather than as silence.
 *
 * Control-driving values are mirrored brain-side in `brain/dsc_brain/derived_metrics.py`.
 * This module is the DISPLAY side; it must not be the source of truth for a demand.
 */

import type { SeriesPoint } from "../../viz/charts";
import {
  absoluteHumidityGm3,
  dewPointC,
  inBandFraction,
  leafVpdKpa,
  vpdKpa,
  DEFAULT_LEAF_OFFSET_C,
} from "./climate";
import { dliFromPpfdHours } from "../dliEstimate";
import { resolvedValue, unavailableValue, isResolved, type DerivedValue } from "./types";

/** Sensors that would upgrade a derived or absent value — the "possible with" catalogue. */
export const SENSOR_SLOTS = {
  leafIr: "an IR leaf-temperature sensor at the canopy",
  par: "a PAR sensor at the canopy",
  co2: "an NDIR CO₂ sensor",
  surface: "a surface-temperature probe on the coldest wall",
  volume: "the tent's internal volume (not modelled yet)",
} as const;

function finite(v: number | null | undefined): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** Names the missing half of a T/RH pair so the reason is specific, not "no data". */
function missingTempRh(tempC: number | null, rhPct: number | null): string | null {
  if (tempC == null && rhPct == null) return "needs air temperature and relative humidity";
  if (tempC == null) return "needs air temperature";
  if (rhPct == null) return "needs relative humidity";
  return null;
}

export interface ClimateInputs {
  tempC: number | null | undefined;
  rhPct: number | null | undefined;
  /** Measured leaf temperature, when an IR leaf sensor is bound. */
  leafTempC?: number | null;
  /**
   * Signed leaf-minus-air offset in °C used when there is no leaf sensor.
   * Negative means leaves run cooler than air (the usual case under lights).
   */
  leafOffsetC?: number;
}

export interface Band {
  min: number;
  max: number;
}

/* ------------------------------------------------------------------ air VPD */

export function airVpdMetric(inputs: ClimateInputs): DerivedValue {
  const tempC = finite(inputs.tempC);
  const rhPct = finite(inputs.rhPct);
  const missing = missingTempRh(tempC, rhPct);
  const base = { key: "air_vpd", label: "Air VPD", unit: "kPa", precision: 2 };
  if (missing) return unavailableValue({ ...base, reason: missing });
  return resolvedValue({
    ...base,
    value: vpdKpa(tempC as number, rhPct as number),
    provenance: "from T + RH (Tetens saturation curve)",
  });
}

/* ----------------------------------------------------------------- leaf VPD */

/**
 * Leaf VPD: saturation pressure at LEAF temperature minus the air's actual vapour
 * pressure. With an IR sensor bound this is a measurement-backed derivation; without
 * one the leaf temperature is an assumption and says so.
 */
export function leafVpdMetric(inputs: ClimateInputs): DerivedValue {
  const tempC = finite(inputs.tempC);
  const rhPct = finite(inputs.rhPct);
  const leafTempC = finite(inputs.leafTempC);
  const base = { key: "leaf_vpd", label: "Leaf VPD", unit: "kPa", precision: 2 };
  const missing = missingTempRh(tempC, rhPct);
  if (missing) return unavailableValue({ ...base, reason: missing, possibleWith: SENSOR_SLOTS.leafIr });

  if (leafTempC != null) {
    const offset = leafTempC - (tempC as number);
    return resolvedValue({
      ...base,
      value: leafVpdKpa(tempC as number, rhPct as number, offset),
      provenance: "from leaf T + air T + RH (leaf sensor bound)",
    });
  }
  const offset = finite(inputs.leafOffsetC) ?? DEFAULT_LEAF_OFFSET_C;
  const sign = offset < 0 ? "−" : "+";
  return resolvedValue({
    ...base,
    value: leafVpdKpa(tempC as number, rhPct as number, offset),
    provenance: "from T + RH",
    assumption: `leaf = air ${sign} ${Math.abs(offset).toFixed(1)} °C (assumed — no leaf sensor)`,
    possibleWith: SENSOR_SLOTS.leafIr,
  });
}

/* ---------------------------------------------------------------- dew point */

export function dewPointMetric(inputs: ClimateInputs): DerivedValue {
  const tempC = finite(inputs.tempC);
  const rhPct = finite(inputs.rhPct);
  const base = { key: "dew_point", label: "Dew point", unit: "°C", precision: 1 };
  const missing = missingTempRh(tempC, rhPct);
  if (missing) return unavailableValue({ ...base, reason: missing });
  if ((rhPct as number) <= 0) {
    return unavailableValue({ ...base, reason: "RH reads 0 % — the Magnus form has no solution there" });
  }
  return resolvedValue({
    ...base,
    value: dewPointC(tempC as number, rhPct as number),
    provenance: "from T + RH (Magnus)",
  });
}

/* -------------------------------------------------------- absolute humidity */

export function absoluteHumidityMetric(inputs: ClimateInputs): DerivedValue {
  const tempC = finite(inputs.tempC);
  const rhPct = finite(inputs.rhPct);
  const base = { key: "absolute_humidity", label: "Absolute humidity", unit: "g/m³", precision: 1 };
  const missing = missingTempRh(tempC, rhPct);
  if (missing) return unavailableValue({ ...base, reason: missing });
  return resolvedValue({
    ...base,
    value: absoluteHumidityGm3(tempC as number, rhPct as number),
    provenance: "from T + RH (moisture mass per m³ of air)",
  });
}

/* ----------------------------------------------------- condensation margin */

/**
 * How many °C of headroom there is before water forms. With no surface probe the
 * coldest surface is ASSUMED to be at air temperature, which makes this an upper
 * bound — the real margin is smaller. That caveat rides on the value.
 */
export function condensationMarginMetric(
  inputs: ClimateInputs & { surfaceTempC?: number | null },
): DerivedValue {
  const base = { key: "condensation_margin", label: "Condensation margin", unit: "°C", precision: 1 };
  const dew = dewPointMetric(inputs);
  if (!isResolved(dew)) {
    return unavailableValue({ ...base, reason: dew.unavailable ?? "dew point unavailable", possibleWith: SENSOR_SLOTS.surface });
  }
  const surfaceTempC = finite(inputs.surfaceTempC);
  if (surfaceTempC != null) {
    return resolvedValue({
      ...base,
      value: surfaceTempC - dew.value,
      provenance: "from surface T − dew point",
    });
  }
  const tempC = finite(inputs.tempC) as number;
  return resolvedValue({
    ...base,
    value: tempC - dew.value,
    provenance: "from air T − dew point",
    assumption: "coldest surface assumed at air temperature — the true margin is smaller",
    possibleWith: SENSOR_SLOTS.surface,
  });
}

/* --------------------------------------------------------------- VPD deficit */

/**
 * Signed distance from the live VPD to the nearest edge of the want band.
 * Negative = below the band (too humid), positive = above (too dry), 0 = inside.
 * This is the number a control law would act on, which is why the brain owns its
 * counterpart; here it is display only.
 */
export function vpdDeficitMetric(vpd: number | null | undefined, band: Band | undefined): DerivedValue {
  const base = { key: "vpd_deficit", label: "VPD vs band", unit: "kPa", precision: 2 };
  const v = finite(vpd);
  if (v == null) return unavailableValue({ ...base, reason: "needs a VPD reading" });
  if (!band || !Number.isFinite(band.min) || !Number.isFinite(band.max) || band.min > band.max) {
    return unavailableValue({ ...base, reason: "needs a VPD band — no plant or stage rail for this zone" });
  }
  const delta = v < band.min ? v - band.min : v > band.max ? v - band.max : 0;
  return resolvedValue({
    ...base,
    value: delta,
    provenance: `from VPD − nearest band edge (${band.min.toFixed(1)}–${band.max.toFixed(1)})`,
  });
}

/* ---------------------------------------------------------------- PPFD / DLI */

export type PpfdSource = "calibrated" | "measured" | null;

/** Canopy PPFD: measured by a PAR sensor, or read off the fixture calibration curve. */
export function ppfdMetric(ppfd: number | null | undefined, source: PpfdSource, dimPct?: number | null): DerivedValue {
  const base = { key: "ppfd", label: "PPFD", unit: "µmol/m²/s", precision: 0 };
  const v = finite(ppfd);
  if (v == null || source == null) {
    return unavailableValue({
      ...base,
      reason: "no PAR sensor and no fixture calibration for this zone",
      possibleWith: SENSOR_SLOTS.par,
    });
  }
  if (source === "measured") {
    return resolvedValue({ ...base, value: v, provenance: "measured at the canopy" });
  }
  const at = finite(dimPct) != null ? ` at ${Math.round(dimPct as number)} % dim` : "";
  return resolvedValue({
    ...base,
    value: v,
    provenance: `from the fixture calibration curve${at}`,
    assumption: "calibration curve, not a live canopy reading — height and placement are assumed unchanged",
    possibleWith: SENSOR_SLOTS.par,
  });
}

/** DLI = PPFD × photoperiod. Unavailable, with the missing half named, when either is absent. */
export function dliMetric(
  ppfd: number | null | undefined,
  photoperiodHours: number | null | undefined,
  source: PpfdSource = "calibrated",
): DerivedValue {
  const base = { key: "dli", label: "DLI", unit: "mol/m²/d", precision: 1 };
  const p = finite(ppfd);
  const h = finite(photoperiodHours);
  if (p == null && h == null) {
    return unavailableValue({
      ...base,
      reason: "needs canopy PPFD and a photoperiod rail",
      possibleWith: SENSOR_SLOTS.par,
    });
  }
  if (p == null) {
    return unavailableValue({
      ...base,
      reason: "needs canopy PPFD — no PAR sensor and no fixture calibration",
      possibleWith: SENSOR_SLOTS.par,
    });
  }
  if (h == null) {
    return unavailableValue({ ...base, reason: "needs a photoperiod rail — no stage light-hours for this zone" });
  }
  const dli = dliFromPpfdHours(p, h);
  if (dli == null) {
    return unavailableValue({ ...base, reason: "PPFD or photoperiod is not a positive number" });
  }
  return resolvedValue({
    ...base,
    value: dli,
    provenance: `from PPFD ${Math.round(p)} × ${h} h photoperiod`,
    ...(source === "calibrated"
      ? {
          assumption: "PPFD comes from the fixture calibration curve, not a live PAR reading",
          possibleWith: SENSOR_SLOTS.par,
        }
      : {}),
  });
}

/* -------------------------------------------------------------- moisture load */

/**
 * The moisture a dehumidifier actually has to pull: absolute humidity now minus the
 * absolute humidity the band's RH ceiling allows at the target temperature.
 * Positive = there is water to remove. Needs BOTH an RH ceiling and a temperature
 * target; without a rail there is no target, so there is no number.
 */
export function moistureLoadMetric(
  inputs: ClimateInputs,
  rhBand: Band | undefined,
  tempBand: Band | undefined,
): DerivedValue {
  const base = { key: "moisture_load", label: "Moisture to remove", unit: "g/m³", precision: 1 };
  const now = absoluteHumidityMetric(inputs);
  if (!isResolved(now)) {
    return unavailableValue({ ...base, reason: now.unavailable ?? "absolute humidity unavailable" });
  }
  if (!rhBand || !Number.isFinite(rhBand.max)) {
    return unavailableValue({ ...base, reason: "needs an RH band — no plant or stage rail for this zone" });
  }
  const targetT =
    tempBand && Number.isFinite(tempBand.min) && Number.isFinite(tempBand.max)
      ? (tempBand.min + tempBand.max) / 2
      : finite(inputs.tempC);
  if (targetT == null) {
    return unavailableValue({ ...base, reason: "needs a temperature target or a live air temperature" });
  }
  const ceiling = absoluteHumidityGm3(targetT, rhBand.max);
  if (!Number.isFinite(ceiling)) {
    return unavailableValue({ ...base, reason: "the RH ceiling did not produce a finite target" });
  }
  const usedBandTarget = tempBand != null && Number.isFinite(tempBand.min) && Number.isFinite(tempBand.max);
  return resolvedValue({
    ...base,
    value: now.value - ceiling,
    provenance: `from absolute humidity now − the ${Math.round(rhBand.max)} % ceiling at ${targetT.toFixed(1)} °C`,
    assumption: usedBandTarget
      ? undefined
      : "no temperature band — the ceiling is taken at the CURRENT air temperature",
    possibleWith: SENSOR_SLOTS.volume,
  });
}

/** Grams of water for a known tent volume. Volume is not modelled yet, so this is a slot. */
export function moistureRemovalGrams(load: DerivedValue, volumeM3: number | null | undefined): DerivedValue {
  const base = { key: "moisture_grams", label: "Water to remove", unit: "g", precision: 0 };
  if (!isResolved(load)) {
    return unavailableValue({ ...base, reason: load.unavailable ?? "moisture load unavailable", possibleWith: SENSOR_SLOTS.volume });
  }
  const v = finite(volumeM3);
  if (v == null || v <= 0) {
    return unavailableValue({
      ...base,
      reason: "needs the zone's internal volume — not modelled yet",
      possibleWith: SENSOR_SLOTS.volume,
    });
  }
  return resolvedValue({ ...base, value: load.value * v, provenance: `from moisture load × ${v} m³` });
}

/* -------------------------------------------------------------- device slots */

/** CO₂ is device-only: there is no relationship between the kit's sensors that yields it. */
export function co2Slot(ppm?: number | null): DerivedValue {
  const base = { key: "co2", label: "CO₂", unit: "ppm", precision: 0 };
  const v = finite(ppm);
  if (v == null) {
    return unavailableValue({ ...base, reason: "not measured — no CO₂ sensor is bound to this zone", possibleWith: SENSOR_SLOTS.co2 });
  }
  return resolvedValue({ ...base, value: v, provenance: "measured by the bound CO₂ sensor" });
}

/** Leaf temperature is device-only; the leaf VPD assumption exists because it is absent. */
export function leafTempSlot(leafTempC?: number | null): DerivedValue {
  const base = { key: "leaf_temp", label: "Leaf temp", unit: "°C", precision: 1 };
  const v = finite(leafTempC);
  if (v == null) {
    return unavailableValue({ ...base, reason: "not measured — leaf VPD uses the assumed offset instead", possibleWith: SENSOR_SLOTS.leafIr });
  }
  return resolvedValue({ ...base, value: v, provenance: "measured by the bound IR leaf sensor" });
}

/* ------------------------------------------------------- history-backed values */

/**
 * Fraction of the last `hours` spent inside the band, as a derived value.
 * `tracked === false` means the brain is not recording that entity, which is a
 * different failure from "no band" and reads as such.
 */
export function inBandMetric(
  points: SeriesPoint[],
  band: Band | undefined,
  hours: number,
  tracked?: boolean | null,
  label = "In band",
): DerivedValue {
  const base = { key: "in_band", label, unit: "", precision: 2 };
  if (!band || !Number.isFinite(band.min) || !Number.isFinite(band.max) || band.min > band.max) {
    return unavailableValue({ ...base, reason: "needs a band — no plant or stage rail for this zone" });
  }
  if (tracked === false) {
    return unavailableValue({ ...base, reason: "this entity is not recorded by the brain, so there is no history to score" });
  }
  const fraction = inBandFraction(points, band);
  if (fraction == null) {
    return unavailableValue({ ...base, reason: `needs at least two history samples in the last ${hours} h` });
  }
  return resolvedValue({
    ...base,
    value: fraction,
    provenance: `from ${points.length} recorded samples over ${hours} h, weighted by sample gap`,
  });
}

/* ----------------------------------------------------------------- aggregate */

export interface ZoneDerivedInputs extends ClimateInputs {
  vpd: number | null | undefined;
  vpdBand?: Band;
  rhBand?: Band;
  tempBand?: Band;
  ppfd?: number | null;
  ppfdSource?: PpfdSource;
  dimPct?: number | null;
  photoperiodHours?: number | null;
  surfaceTempC?: number | null;
  co2Ppm?: number | null;
  volumeM3?: number | null;
}

export interface ZoneDerived {
  airVpd: DerivedValue;
  leafVpd: DerivedValue;
  leafTemp: DerivedValue;
  dewPoint: DerivedValue;
  absoluteHumidity: DerivedValue;
  condensationMargin: DerivedValue;
  vpdDeficit: DerivedValue;
  ppfd: DerivedValue;
  dli: DerivedValue;
  co2: DerivedValue;
  moistureLoad: DerivedValue;
  /** Render order for a compact strip: the four that fit, resolved or not. */
  strip: DerivedValue[];
  /** Everything, for an inspector. */
  all: DerivedValue[];
}

/** One call per zone — every derived value the SPA knows how to make, all provenance-carrying. */
export function zoneDerived(inputs: ZoneDerivedInputs): ZoneDerived {
  const airVpd = airVpdMetric(inputs);
  const leafVpd = leafVpdMetric(inputs);
  const leafTemp = leafTempSlot(inputs.leafTempC);
  const dewPoint = dewPointMetric(inputs);
  const absoluteHumidity = absoluteHumidityMetric(inputs);
  const condensationMargin = condensationMarginMetric(inputs);
  const vpdDeficit = vpdDeficitMetric(inputs.vpd, inputs.vpdBand);
  const ppfd = ppfdMetric(inputs.ppfd, inputs.ppfdSource ?? null, inputs.dimPct);
  const dli = dliMetric(inputs.ppfd, inputs.photoperiodHours, inputs.ppfdSource ?? null);
  const co2 = co2Slot(inputs.co2Ppm);
  const moistureLoad = moistureLoadMetric(inputs, inputs.rhBand, inputs.tempBand);
  return {
    airVpd,
    leafVpd,
    leafTemp,
    dewPoint,
    absoluteHumidity,
    condensationMargin,
    vpdDeficit,
    ppfd,
    dli,
    co2,
    moistureLoad,
    strip: [leafVpd, dewPoint, absoluteHumidity, dli],
    all: [
      airVpd,
      leafVpd,
      leafTemp,
      dewPoint,
      absoluteHumidity,
      condensationMargin,
      vpdDeficit,
      ppfd,
      dli,
      co2,
      moistureLoad,
    ],
  };
}
