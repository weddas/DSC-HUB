const PPFD_STEPS = [25, 50, 75, 100] as const;

/** DLI (mol/m²/day) from PPFD µmol/m²/s and photoperiod hours. */
export function dliFromPpfdHours(ppfd: number, lightHours: number): number | null {
  if (!Number.isFinite(ppfd) || ppfd <= 0 || !Number.isFinite(lightHours) || lightHours <= 0) return null;
  return (ppfd * lightHours * 3600) / 1_000_000;
}

/** Best-effort canopy PPFD from SF1000 calibration curve at current brightness. */
export function readCalibratedPpfd(
  num: (id: string, fb?: number) => number,
  entity: (id: string) => { attributes?: Record<string, unknown> } | undefined,
): number | null {
  const light = entity("light.dsc_hub_sf1000_dimmer");
  const bri = Number(light?.attributes?.brightness ?? light?.attributes?.brightness_pct ?? NaN);
  const pct = Number.isFinite(bri) ? Math.min(100, Math.max(0, bri / (bri <= 100 ? 1 : 2.55))) : 100;

  let best: { step: number; ppfd: number } | null = null;
  for (const step of PPFD_STEPS) {
    const v = num(`input_number.dsc_cal_ppfd_${step}`, NaN);
    if (!Number.isFinite(v) || v <= 0) continue;
    if (!best || Math.abs(step - pct) < Math.abs(best.step - pct)) best = { step, ppfd: v };
  }
  if (!best) return null;
  if (best.step === pct) return best.ppfd;
  return (best.ppfd * pct) / best.step;
}

export function fmtDli(mol: number | null): string {
  return mol != null && Number.isFinite(mol) ? mol.toFixed(1) : "—";
}
