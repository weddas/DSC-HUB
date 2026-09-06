import { useFleetControlSlice, useFleetSelector } from "./useFleet";
import { deepEqual } from "../lib/selectorStore";

/**
 * Pi-native control read. Prefers the fleet control slice; falls back to the
 * brain's synthetic hass_states for entities not yet on a control mapping.
 */
export function useFleetEntity(entityId: string) {
  const control = useFleetControlSlice(entityId);
  const statesFallback = useFleetSelector(
    (v) => {
      if (control != null) return null;
      const fromStates = v.hassStates?.[entityId];
      if (!fromStates) return null;
      return {
        state: fromStates.state,
        available: fromStates.state !== "unavailable" && fromStates.state !== "unknown",
        attributes: (fromStates.attributes as Record<string, unknown> | undefined) ?? {},
      };
    },
    deepEqual,
  );

  if (control != null) {
    return {
      state: control.state,
      available: control.online,
      attributes: control.attributes,
    };
  }

  if (statesFallback) return statesFallback;

  return { state: "unavailable", available: false, attributes: {} as Record<string, unknown> };
}
