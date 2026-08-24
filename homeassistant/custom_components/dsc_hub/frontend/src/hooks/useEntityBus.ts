/**
 * Unified entity reads — Pi uses fleet snapshot + compat shim; HA uses live bus.
 * Drop-in replacement for useHass() on operational pages.
 */
import { useMemo } from "react";
import { useHass } from "./useHass";
import { useFleet, useFleetSource } from "./useFleet";
import { fleetControlAttributes, fleetControlAvailable, fleetControlState } from "../lib/fleetControlMap";
import { fleetEntityAvailable, fleetLiveNumber } from "../lib/entityFleetMap";
import type { HassEntity } from "../vite-env";

export function useEntityBus() {
  const hass = useHass();
  const fleet = useFleet();
  const source = useFleetSource();

  return useMemo(() => {
    if (source !== "pi") return hass;

    const entity = (entityId: string): HassEntity | undefined => {
      const shim = hass.entity(entityId);
      const ctrlState = fleetControlState(entityId, fleet);
      if (ctrlState != null) {
        return {
          entity_id: entityId,
          state: ctrlState,
          attributes: fleetControlAttributes(entityId, fleet),
          last_changed: new Date().toISOString(),
        };
      }
      return shim;
    };

    const available = (entityId: string) => {
      if (fleetControlAvailable(entityId, fleet)) return true;
      if (fleetEntityAvailable(entityId, fleet)) return true;
      return hass.available(entityId);
    };

    const state = (entityId: string, fallback = "—") => {
      const ctrl = fleetControlState(entityId, fleet);
      if (ctrl != null) return ctrl;
      const live = fleetLiveNumber(entityId, fleet);
      if (live != null && Number.isFinite(live)) return String(live);
      return hass.state(entityId, fallback);
    };

    const num = (entityId: string, fallback = NaN) => {
      const ctrl = fleetControlState(entityId, fleet);
      if (ctrl != null) {
        const n = Number(ctrl);
        if (Number.isFinite(n)) return n;
      }
      const live = fleetLiveNumber(entityId, fleet);
      if (live != null && Number.isFinite(live)) return live;
      return hass.num(entityId, fallback);
    };

    return { ...hass, entity, available, state, num };
  }, [hass, fleet, source]);
}
