/** Soft calibrate — Raw Modbus captures → prefer ESP NVS cal plane (not stacked HA+ESP). */

import { KIT_PROBE_NUMBERS } from "./seatModel";

export const SOFT_CAL_POTS = KIT_PROBE_NUMBERS;
export type SoftCalPot = (typeof SOFT_CAL_POTS)[number];
export type SoftCalPhase = "water" | "after_water";

/** SoftCal channels only — N/P/K are EC-derived; do not SoftCal as independent. */
export type SoftCalChannels = {
  moisture: number | null;
  soilTemp: number | null;
  ec: number | null;
  ph: number | null;
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
const MIN_UNIQUE_MODBUS = 3;

export function softCalEntityIds(pot: SoftCalPot): {
  moisture: string;
  soilTemp: string;
  ec: string;
  ph: string;
  offsetPh: string;
  offsetEc: string;
  offsetMoisture: string;
  dualCalStack: string;
} {
  return {
    moisture: `sensor.dsc_probe${pot}_soil_moisture_raw`,
    soilTemp: `sensor.dsc_probe${pot}_soil_temperature_raw`,
    ec: `sensor.dsc_probe${pot}_soil_conductivity_raw`,
    ph: `sensor.dsc_probe${pot}_soil_ph_raw`,
    offsetPh: `input_number.dsc_probe${pot}_offset_ph`,
    offsetEc: `input_number.dsc_probe${pot}_offset_ec_us`,
    offsetMoisture: `input_number.dsc_probe${pot}_offset_moisture`,
    dualCalStack: `binary_sensor.dsc_probe${pot}_dual_cal_stack`,
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
  };
}

export function averageChannels(samples: SoftCalChannels[]): SoftCalChannels {
  const keys: (keyof SoftCalChannels)[] = ["moisture", "soilTemp", "ec", "ph"];
  const out: SoftCalChannels = {
    moisture: null,
    soilTemp: null,
    ec: null,
    ph: null,
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
  uniqueModbusTimestamps: number;
  cachedNotSigma: boolean;
};

export type SoftCalEntityMeta = {
  lastUpdated?: string | number | null;
};

/**
 * Collect SAMPLE_COUNT readings. Prefer unique Modbus last_updated stamps (≥3)
 * or flag cachedNotSigma (1 Hz poll of a 60s holding register is not σ).
 */
export async function captureSoftCalAverages(
  pots: SoftCalPot[],
  num: (id: string, fb?: number) => number,
  opts?: {
    samples?: number;
    intervalMs?: number;
    onTick?: (done: number, total: number) => void;
    entityMeta?: (id: string) => SoftCalEntityMeta | undefined;
  },
): Promise<SoftCalCaptureResult[]> {
  const total = opts?.samples ?? SAMPLE_COUNT;
  const intervalMs = opts?.intervalMs ?? SAMPLE_MS;
  const buckets = new Map<SoftCalPot, SoftCalChannels[]>();
  const stamps = new Map<SoftCalPot, Set<string>>();
  for (const pot of pots) {
    buckets.set(pot, []);
    stamps.set(pot, new Set());
  }

  for (let i = 0; i < total; i++) {
    for (const pot of pots) {
      const ids = softCalEntityIds(pot);
      buckets.get(pot)!.push(readSoftCalChannels(pot, num));
      const meta = opts?.entityMeta?.(ids.ph);
      // Only count a real Modbus last_updated stamp as evidence — a missing meta must never
      // fabricate a fake-unique tick, or cachedNotSigma reads as fresh with zero real evidence.
      if (meta?.lastUpdated != null) {
        stamps.get(pot)!.add(String(meta.lastUpdated));
      }
    }
    opts?.onTick?.(i + 1, total);
    if (i < total - 1) {
      await new Promise((r) => window.setTimeout(r, intervalMs));
    }
  }

  return pots.map((pot) => {
    const samples = buckets.get(pot) ?? [];
    const unique = stamps.get(pot)?.size ?? 0;
    const average = averageChannels(samples);
    return {
      pot,
      average,
      variancePh: channelVariance(samples, "ph"),
      varianceMoisture: channelVariance(samples, "moisture"),
      offsets: null,
      sampleCount: samples.length,
      uniqueModbusTimestamps: unique,
      cachedNotSigma: unique < MIN_UNIQUE_MODBUS,
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

export function softCalBlockedByDualStack(
  pot: SoftCalPot,
  state: (id: string, fb?: string) => string,
  available?: (id: string) => boolean,
): boolean {
  const id = softCalEntityIds(pot).dualCalStack;
  // Fail closed: an unknown dual-stack state (sensor not on the bus yet) must block, not pass through.
  if (available && !available(id)) return true;
  return state(id, "off") === "on";
}

export { SAMPLE_COUNT, WATER_MOISTURE_TARGET, MIN_UNIQUE_MODBUS };
