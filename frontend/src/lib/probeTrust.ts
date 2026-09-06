import { isProbeInService } from "./probeModel";

export type ProbeTrustTone = "ok" | "warn" | "bad" | "muted";

export interface ProbeTrust {
  stuck: boolean;
  untrusted: boolean;
  peerDivergence: boolean;
  /** Do not glow Need as an action when untrusted. */
  blockNeedAct: boolean;
  tone: ProbeTrustTone;
  labels: string[];
}

export function readProbeTrust(
  probe: number,
  state: (id: string, fallback?: string) => string,
): ProbeTrust {
  const inService = isProbeInService(probe, state);
  const stuck = isBinaryOn(state(`binary_sensor.dsc_probe${probe}_sensor_stuck`));
  const untrusted = isBinaryOn(state(`binary_sensor.dsc_probe${probe}_untrusted`));
  const sensorFault = isBinaryOn(state(`binary_sensor.dsc_probe${probe}_sensor_fault`));
  const modbusId = `binary_sensor.dsc_probe${probe}_modbus_probe_online`;
  const modbusRaw = state(modbusId, "");
  const modbusKnown =
    modbusRaw !== "" && modbusRaw !== "unavailable" && modbusRaw !== "—";
  const modbusOffline = modbusKnown && !isBinaryOn(modbusRaw);
  // Summary is always informational (Δ… or "Need ≥2…"); only the MAD alert binary means warn.
  const peer = inService && isBinaryOn(state("binary_sensor.dsc_peer_mad_alert", "off"));
  const labels: string[] = [];
  if (stuck) labels.push("stuck");
  if (untrusted) labels.push("untrusted");
  if (sensorFault) labels.push("sensor fault");
  if (modbusOffline) labels.push("probe dark");
  if (peer) labels.push("peer divergence");
  let tone: ProbeTrustTone = "ok";
  if (untrusted || stuck || sensorFault) tone = "bad";
  else if (peer || modbusOffline) tone = "warn";
  return {
    stuck,
    untrusted,
    peerDivergence: peer,
    blockNeedAct: untrusted || stuck || sensorFault || modbusOffline,
    tone,
    labels,
  };
}

function isBinaryOn(raw: string): boolean {
  const s = (raw || "").trim().toLowerCase();
  return s === "on" || s === "true" || s === "1";
}

export function absoluteHumidity(tempC: number, rhPct: number): number {
  if (!Number.isFinite(tempC) || !Number.isFinite(rhPct)) return NaN;
  const es = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
  return (es * rhPct * 2.1674) / (273.15 + tempC);
}
