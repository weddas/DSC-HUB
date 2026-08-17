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
  const stuck = state(`binary_sensor.dsc_pot${pot}_sensor_stuck`) === "on";
  const untrusted = state(`binary_sensor.dsc_pot${pot}_untrusted`) === "on";
  const peerSummary = state("sensor.dsc_peer_divergence_summary", "");
  const peer =
    inService &&
    peerSummary !== "—" &&
    peerSummary !== "ok" &&
    peerSummary.toLowerCase() !== "none" &&
    peerSummary !== "unknown" &&
    peerSummary !== "unavailable" &&
    peerSummary.length > 0 &&
    peerSummary !== "0";
  const labels: string[] = [];
  if (stuck) labels.push("stuck");
  if (untrusted) labels.push("untrusted");
  if (peer) labels.push("peer divergence");
  let tone: PotTrustTone = "ok";
  if (untrusted || stuck) tone = "bad";
  else if (peer) tone = "warn";
  return {
    stuck,
    untrusted,
    peerDivergence: peer,
    blockNeedAct: untrusted || stuck,
    tone,
    labels,
  };
}

export function absoluteHumidity(tempC: number, rhPct: number): number {
  if (!Number.isFinite(tempC) || !Number.isFinite(rhPct)) return NaN;
  const es = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
  return (es * rhPct * 2.1674) / (273.15 + tempC);
}
