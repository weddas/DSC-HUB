import { useCallback } from "react";
import { call_service, post_demand, type DemandSeat } from "../lib/fleetApi";

/** Writes go to the brain: /control/service and /control/demand. */
export function useFleetActions() {
  const callService = useCallback(
    async (domain: string, service: string, data?: Record<string, unknown>) =>
      call_service(domain, service, data ?? {}),
    [],
  );

  const setDemand = useCallback(
    async (seat: DemandSeat, on: boolean) => post_demand(seat, on),
    [],
  );

  return { callService, setDemand };
}
