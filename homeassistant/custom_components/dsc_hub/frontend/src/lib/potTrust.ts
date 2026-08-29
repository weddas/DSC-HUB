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
  const stuck = state(`binary_sensor.dsc_probe${pot}_sensor_stuck`) === "on";
  const untrusted = state(`binary_sensor.dsc_probe${pot}_untrusted`) === "on";
  const sensorFault = state(`binary_sensor.dsc_probe${pot}_sensor_fault`) === "on";
  const modbusId = `binary_sensor.dsc_probe${pot}_modbus_probe_online`;
  const modbusKnown = state(modbusId, "") !== "" && state(modbusId, "unavailable") !== "unavailable";
  const modbusOffline = modbusKnown && state(modbusId) === "off";
  // Summary is always informational (Δ… or "Need ≥2…"); only the MAD alert binary means warn.
  const peer = inService && state("binary_sensor.dsc_peer_mad_alert", "off") === "on";
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
    blockNeedAct: untrusted || stuck || sensorFault,
    tone,
    labels,
  };
}

export function absoluteHumidity(tempC: number, rhPct: number): number {
  if (!Number.isFinite(tempC) || !Number.isFinite(rhPct)) return NaN;
  const es = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
  return (es * rhPct * 2.1674) / (273.15 + tempC);
}
