import { useHass } from "./useHass";
import { useFleetControlSlice, useFleetSelector, useFleetSource } from "./useFleet";
import { deepEqual } from "../lib/selectorStore";

/** Pi-native control read with HA fallback (panel mode + unmigrated entities). */
export function useFleetEntity(entityId: string) {
  const { state, available, entity } = useHass();
  const source = useFleetSource();
  const control = useFleetControlSlice(entityId);
  const hassFallback = useFleetSelector(
    (v) => {
      if (source === "pi" && control != null) return null;
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

  if (source === "pi" && control != null) {
    return {
      state: control.state,
      available: control.online,
      attributes: control.attributes,
    };
  }

  if (source === "pi" && hassFallback) {
    return hassFallback;
  }

  return {
    state: state(entityId, "unavailable"),
    available: available(entityId),
    attributes: (entity(entityId)?.attributes as Record<string, unknown> | undefined) ?? {},
  };
}
