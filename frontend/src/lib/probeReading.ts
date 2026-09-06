/** Prefer hub `got_*` moisture over legacy soil entity (Overview pot1 landing lie). */
export function probeMoistureNum(
  num: (id: string, fb?: number) => number,
  state: (id: string, fb?: string) => string,
  probe: number,
): number {
  const gotRaw = state(`sensor.dsc_probe${probe}_got_moisture`, "");
  if (gotRaw && gotRaw !== "unknown" && gotRaw !== "unavailable") {
    const got = Number(gotRaw);
    if (Number.isFinite(got)) return got;
  }
  return num(`sensor.dsc_probe${probe}_soil_moisture`, NaN);
}
