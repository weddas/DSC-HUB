import { useCallback } from "react";
import { call_service } from "../lib/fleetApi";
import { useHass } from "./useHass";
import { useFleetSource } from "./useFleet";

const PI_MODE = import.meta.env.VITE_DSC_PI === "1";

/** Writes: brain /control/service on Pi, HA callService on panel. */
export function useFleetActions() {
  const hass = useHass();
  const source = useFleetSource();

  const callService = useCallback(
    async (domain: string, service: string, data?: Record<string, unknown>) => {
      if (PI_MODE || source === "pi") {
        return call_service(domain, service, data ?? {});
      }
      return hass.callService(domain, service, data);
    },
    [hass, source],
  );

  return { callService };
}
