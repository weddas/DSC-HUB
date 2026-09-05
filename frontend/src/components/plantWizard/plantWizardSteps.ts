export const STEPS = [
  { id: "plant", label: "Plant", icon: "roster" as const },
  { id: "soil", label: "Probe & soil", icon: "root" as const },
  { id: "feed", label: "Feed", icon: "nutrient" as const, optional: true },
  { id: "light", label: "Light", icon: "lighting" as const, optional: true },
  { id: "review", label: "Review", icon: "ok" as const },
] as const;

export type PlantWizardStepId = (typeof STEPS)[number]["id"];

export function strainOk(strain: string): boolean {
  return Boolean(strain && strain !== "unknown" && strain !== "unavailable");
}

export type CallService = (
  domain: string,
  service: string,
  data?: Record<string, unknown>,
) => Promise<unknown>;
