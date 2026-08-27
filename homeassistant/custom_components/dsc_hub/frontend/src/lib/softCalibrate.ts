/** Soft calibrate — tap-water + after-water captures → HA Got offsets (not lab ESP). */

export const SOFT_CAL_POTS = [1, 2, 3, 4] as const;
export type SoftCalPot = (typeof SOFT_CAL_POTS)[number];
export type SoftCalPhase = "water" | "after_water";

export type SoftCalChannels = {
  moisture: number | null;
  soilTemp: number | null;
  ec: number | null;
  ph: number | null;
  n: number | null;
  p: number | null;
  k: number | null;
};

export type SoftCalSample = SoftCalChannels & { pot: SoftCalPot; at: number };

export type SoftCalOffsets = {
  ph: number;
  moisture: number;
  ec: number;
};

const SAMPLE_MS = 1000;
const SAMPLE_COUNT = 15;
const WATER_MOISTURE_TARGET = 100;

export function softCalEntityIds(pot: SoftCalPot): {
  moisture: string;
  soilTemp: string;
  ec: string;
  ph: string;
  n: string;
  p: string;
  k: string;
  offsetPh: string;
  offsetEc: string;
  offsetMoisture: string;
} {
  return {
    moisture: `sensor.dsc_pot${pot}_soil_moisture`,
    soilTemp: `sensor.dsc_pot${pot}_soil_temperature`,
    ec: `sensor.dsc_pot${pot}_soil_conductivity`,
    ph: `sensor.dsc_pot${pot}_soil_ph`,
    n: `sensor.dsc_pot${pot}_soil_nitrogen`,
    p: `sensor.dsc_pot${pot}_soil_phosphorus`,
    k: `sensor.dsc_pot${pot}_soil_potassium`,
    offsetPh: `input_number.dsc_pot${pot}_offset_ph`,
    offsetEc: `input_number.dsc_pot${pot}_offset_ec_us`,
    offsetMoisture: `input_number.dsc_pot${pot}_offset_moisture`,
  };
}

function finiteOrNull(n: number): number | null {
  return Number.isFinite(n) ? n : null;
}

export function readSoftCalChannels(
  pot: SoftCalPot,
  num: (id: string, fb?: number) => number,
): SoftCalChannels {
  const ids = softCalEntityIds(pot);
  return {
    moisture: finiteOrNull(num(ids.moisture, NaN)),
    soilTemp: finiteOrNull(num(ids.soilTemp, NaN)),
    ec: finiteOrNull(num(ids.ec, NaN)),
    ph: finiteOrNull(num(ids.ph, NaN)),
    n: finiteOrNull(num(ids.n, NaN)),
    p: finiteOrNull(num(ids.p, NaN)),
    k: finiteOrNull(num(ids.k, NaN)),
  };
}

export function averageChannels(samples: SoftCalChannels[]): SoftCalChannels {
  const keys: (keyof SoftCalChannels)[] = [
    "moisture",
    "soilTemp",
    "ec",
    "ph",
    "n",
    "p",
    "k",
  ];
  const out: SoftCalChannels = {
    moisture: null,
    soilTemp: null,
    ec: null,
    ph: null,
    n: null,
    p: null,
    k: null,
  };
  for (const key of keys) {
    const vals = samples.map((s) => s[key]).filter((v): v is number => v != null && Number.isFinite(v));
    out[key] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }
  return out;
}

export function channelVariance(samples: SoftCalChannels[], key: keyof SoftCalChannels): number | null {
  const vals = samples.map((s) => s[key]).filter((v): v is number => v != null && Number.isFinite(v));
  if (vals.length < 2) return null;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const ss = vals.reduce((a, b) => a + (b - mean) ** 2, 0);
  return Math.sqrt(ss / vals.length);
}

/** Got = raw + offset → offset = known − rawAvg. */
export function softOffsetsFromWater(
  avg: SoftCalChannels,
  knownPh: number,
  knownEc?: number | null,
): SoftCalOffsets | null {
  if (!Number.isFinite(knownPh) || avg.ph == null) return null;
  const ph = clamp(knownPh - avg.ph, -3, 3);
  const moisture =
    avg.moisture != null ? clamp(WATER_MOISTURE_TARGET - avg.moisture, -40, 40) : 0;
  const ec =
    knownEc != null && Number.isFinite(knownEc) && avg.ec != null
      ? clamp(knownEc - avg.ec, -2000, 2000)
      : 0;
  return { ph, moisture, ec };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function roundOffset(kind: keyof SoftCalOffsets, value: number): number {
  switch (kind) {
    case "ph":
      return Math.round(value * 20) / 20;
    case "moisture":
      return Math.round(value * 2) / 2;
    case "ec":
      return Math.round(value / 10) * 10;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export type SoftCalCaptureResult = {
  pot: SoftCalPot;
  average: SoftCalChannels;
  variancePh: number | null;
  varianceMoisture: number | null;
  offsets: SoftCalOffsets | null;
  sampleCount: number;
};

/**
 * Collect SAMPLE_COUNT raw readings ~1s apart for each selected pot.
 * Caller supplies a live `num` reader (re-read each tick).
 */
export async function captureSoftCalAverages(
  pots: SoftCalPot[],
  num: (id: string, fb?: number) => number,
  opts?: { samples?: number; intervalMs?: number; onTick?: (done: number, total: number) => void },
): Promise<SoftCalCaptureResult[]> {
  const total = opts?.samples ?? SAMPLE_COUNT;
  const intervalMs = opts?.intervalMs ?? SAMPLE_MS;
  const buckets = new Map<SoftCalPot, SoftCalChannels[]>();
  for (const pot of pots) buckets.set(pot, []);

  for (let i = 0; i < total; i++) {
    for (const pot of pots) {
      buckets.get(pot)!.push(readSoftCalChannels(pot, num));
    }
    opts?.onTick?.(i + 1, total);
    if (i < total - 1) {
      await new Promise((r) => window.setTimeout(r, intervalMs));
    }
  }

  return pots.map((pot) => {
    const samples = buckets.get(pot) ?? [];
    const average = averageChannels(samples);
    return {
      pot,
      average,
      variancePh: channelVariance(samples, "ph"),
      varianceMoisture: channelVariance(samples, "moisture"),
      offsets: null,
      sampleCount: samples.length,
    };
  });
}

export function attachWaterOffsets(
  results: SoftCalCaptureResult[],
  knownPh: number,
  knownEc?: number | null,
): SoftCalCaptureResult[] {
  return results.map((row) => ({
    ...row,
    offsets: softOffsetsFromWater(row.average, knownPh, knownEc),
  }));
}

export { SAMPLE_COUNT, WATER_MOISTURE_TARGET };
