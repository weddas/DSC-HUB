/** Read Bar 3 root_steering SoT from Brain fleet — never invent phase client-side. */

export type RootSteeringPhase = "P0" | "P1" | "P2" | "P3" | null;

export type RootSteeringProbe = {
  phase: RootSteeringPhase;
  reason?: string;
  dryback_pct?: number | null;
  lights_on?: boolean;
  override?: boolean;
  act_allowed?: boolean;
  targets?: Record<string, number>;
};

export type RootSteeringSnapshot = {
  override?: boolean;
  lights_on?: boolean;
  targets?: Record<string, number>;
  pots?: Record<string, RootSteeringProbe>;
};

export function probeSteering(
  snapshot: RootSteeringSnapshot | null | undefined,
  probeId: string,
): RootSteeringProbe | null {
  const row = snapshot?.pots?.[probeId];
  return row ?? null;
}

export function phaseLabel(phase: RootSteeringPhase): string {
  switch (phase) {
    case "P0":
      return "P0 night";
    case "P1":
      return "P1 early";
    case "P2":
      return "P2 veg";
    case "P3":
      return "P3 gen";
    case null:
      return "—";
    default: {
      const _e: never = phase;
      return _e;
    }
  }
}
