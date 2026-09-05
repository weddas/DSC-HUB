import { isPotInService } from "./seatModel";

export type PotTrustTone = "ok" | "warn" | "bad" | "muted";

export interface PotTrust {
  stuck: boolean;
  untrusted: boolean;
  peerDivergence: boolean;
  /** Do not glow Need as an action when untrusted. */
  blockNeedAct: boolean;
  tone: PotTrustTone;
  labels: string[];
}

export function readPotTrust(
  pot: number,
  state: (id: string, fallback?: string) => string,
): PotTrust {
  const inService = isPotInService(pot, state);
  const stuck = isBinaryOn(state(`binary_sensor.dsc_probe${pot}_sensor_stuck`));
  const untrusted = isBinaryOn(state(`binary_sensor.dsc_probe${pot}_untrusted`));
  const sensorFault = isBinaryOn(state(`binary_sensor.dsc_probe${pot}_sensor_fault`));
  const modbusId = `binary_sensor.dsc_probe${pot}_modbus_probe_online`;
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
  let tone: PotTrustTone = "ok";
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
