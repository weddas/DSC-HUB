/** Prefer hub `got_*` moisture over legacy soil entity (Overview pot1 landing lie). */
export function potMoistureNum(
  num: (id: string, fb?: number) => number,
  state: (id: string, fb?: string) => string,
  pot: number,
): number {
  const gotRaw = state(`sensor.dsc_pot${pot}_got_moisture`, "");
  if (gotRaw && gotRaw !== "unknown" && gotRaw !== "unavailable") {
    const got = Number(gotRaw);
    if (Number.isFinite(got)) return got;
  }
  return num(`sensor.dsc_pot${pot}_soil_moisture`, NaN);
}
