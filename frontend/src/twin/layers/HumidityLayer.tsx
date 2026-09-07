import * as THREE from "three";
import type { TwinZone } from "../../lib/twinState";
import type { TwinPalette } from "../wire";
import { VolumeHaze } from "./Particles";

/**
 * Humidity haze per zone: density follows RH, tone follows the want band (too humid →
 * blue-white, too dry → amber and sparse), and a dew-point risk (air within 2 °C of its
 * dew point) turns the haze the bad tone — condensation is the failure this shows.
 */
export function humidityTone(z: TwinZone, palette: TwinPalette): { color: string; opacity: number; count: number; dewRisk: boolean } {
  if (!z.rh.available) return { color: palette.dim, opacity: 0, count: 0, dewRisk: false };
  const rh = z.rh.value;
  const density = Math.max(0, Math.min(1, (rh - 35) / 45));
  const dewRisk = Number.isFinite(z.dewPoint) && z.temp.available && z.temp.value - z.dewPoint < 2;
  if (dewRisk) return { color: palette.bad, opacity: 0.55, count: 420, dewRisk };
  if (z.rhDelta > 0) return { color: palette.blue, opacity: 0.25 + 0.35 * density, count: 260 + Math.round(200 * density), dewRisk };
  if (z.rhDelta < 0) return { color: palette.warn, opacity: 0.12 + 0.15 * density, count: 80 + Math.round(120 * density), dewRisk };
  return { color: palette.teal, opacity: 0.12 + 0.25 * density, count: 120 + Math.round(240 * density), dewRisk };
}

export function HumidityVolume({ box, zone, palette, active = true }: { box: THREE.Box3; zone: TwinZone; palette: TwinPalette; active?: boolean }) {
  const t = humidityTone(zone, palette);
  if (!t.count) return null;
  // shrink the box a little so haze never pokes through the tent skin
  const inner = new THREE.Box3(box.min.clone().addScalar(0.06), box.max.clone().subScalar(0.06));
  return <VolumeHaze box={inner} color={t.color} count={t.count} opacity={t.opacity} active={active} />;
}
