# Pass A architect sketch — kit SoT + Root honesty

**Commit base:** `0c75a48` (design locked).  
**Status:** scaffold for implementers — fill bodies against this contract.

## Caller usage (written first)

```ts
// Root / honesty / Fleet pulse
import { KIT_PROBE_NUMBERS, isPotInServiceWithFleet, potGotEntity, probeLabel } from "./seatModel";

const probes = [...KIT_PROBE_NUMBERS].map((n) => ({
  n,
  oos: !isPotInServiceWithFleet(n, state, fleet),
}));
// Never iterate ALL_POT_NUMBERS on Live Root.

const ecId = potGotEntity(n, "ec", state); // resolves got_ec → soil_ec → conductivity
```

## Types / module map

```ts
// seatModel.ts
export const KIT_PROBE_NUMBERS = [1, 2] as const;
export const ALL_POT_NUMBERS = [1, 2, 3, 4] as const; // Device restore / entity map only

export function probeLabel(n: number): string; // "Probe N"
export function potGotEntity(
  pot: number,
  kind: "moisture" | "ec" | "ph",
  state: (id: string, fallback?: string) => string,
): string; // ec fallback chain includes soil_ec

// entityFleetMap.ts — add aliases Root reads
// sensor.dsc_probe{N}_got_ec, _soil_conductivity, _dryback_pct, _soil_moisture_rate,
// _soil_nitrogen, _soil_phosphorus, _soil_potassium → pot{N} metrics
```

## Root card contract

```ts
// RootPage — not implemented shapes
function LiveRootPage(): JSX.Element;
// subtitle: `${inService} of ${KIT_PROBE_NUMBERS.length} probes in service`
// cards: KIT_PROBE_NUMBERS only; no redundant Open-seat button
// drawer title: `Probe ${n}` + plant name

function RootProbeCard(props: {
  pot: number;
  oos: boolean;
  onOpen: () => void;
}): JSX.Element;
// title: Probe N; className dsc-pot-card; gauges horizontal; NPK via useHeldReading
```

## ArcGauge contract

```ts
// charts.tsx ArcGauge
// path: true top semicircle (large-arc 0); dash length = π*r
// viewBox padded; no dual SVG+CSS glow; print min/max text
```

## Synthesis decision

Prefer one SoT constant + default-arg consumers over dual `plannedWhenOff` labeling. Fleet map aliases beat inventing new entity names. Horizontal row via CSS `flex-wrap: nowrap` + chip strip for NPK — not a second gauge type in Pass A.
