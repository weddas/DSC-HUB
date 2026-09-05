import type { FleetSnapshot } from "./fleetModel";

export type FleetControlEntry = {
  state: string;
  options?: string[];
  percentage?: number;
  brightness?: number;
};

export function hubControls(
  fleet: FleetSnapshot,
): Record<string, FleetControlEntry> | undefined {
  const raw = fleet.hub.values.controls;
  if (!raw || typeof raw !== "object") return undefined;
  return raw as Record<string, FleetControlEntry>;
}

export function fleetControlState(entityId: string, fleet: FleetSnapshot): string | null {
  if (!fleet.hub.online) return null;
  const ctrl = hubControls(fleet)?.[entityId];
  return ctrl?.state ?? null;
}

export function fleetControlAvailable(entityId: string, fleet: FleetSnapshot): boolean {
  return fleet.hub.online && !!hubControls(fleet)?.[entityId];
}

export function fleetControlAttributes(
  entityId: string,
  fleet: FleetSnapshot,
): Record<string, unknown> {
  const ctrl = hubControls(fleet)?.[entityId];
  if (!ctrl) return {};
  const attrs: Record<string, unknown> = {};
  if (ctrl.options?.length) attrs.options = ctrl.options;
  if (ctrl.percentage != null) attrs.percentage = ctrl.percentage;
  if (ctrl.brightness != null) attrs.brightness = ctrl.brightness;
  return attrs;
}
