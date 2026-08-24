import { useHass } from "./useHass";
import { useFleet, useFleetSource } from "./useFleet";
import {
  fleetControlAttributes,
  fleetControlAvailable,
  fleetControlState,
} from "../lib/fleetControlMap";

/** Pi-native control read with HA fallback (panel mode + unmigrated entities). */
export function useFleetEntity(entityId: string) {
  const { state, available, entity } = useHass();
  const fleet = useFleet();
  const source = useFleetSource();

  if (source === "pi") {
    const nativeState = fleetControlState(entityId, fleet);
    if (nativeState != null) {
      return {
        state: nativeState,
        available: fleetControlAvailable(entityId, fleet),
        attributes: fleetControlAttributes(entityId, fleet),
      };
    }
  }

  return {
    state: state(entityId, "unavailable"),
    available: available(entityId),
    attributes: (entity(entityId)?.attributes as Record<string, unknown> | undefined) ?? {},
  };
}
