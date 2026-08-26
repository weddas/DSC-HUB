import { useCallback } from "react";
import { call_service, post_demand, type DemandSeat } from "../lib/fleetApi";
import { useHass } from "./useHass";
import { useFleetSource } from "./useFleet";

const PI_MODE = import.meta.env.VITE_DSC_PI === "1";

const DEMAND_ENTITY: Record<DemandSeat, string> = {
  heater: "switch.dsc_hub_heater_demand",
  heatmat: "switch.dsc_hub_grow_mat_demand",
  humidifier: "switch.dsc_hub_humidifier_demand",
  dehumidifier: "switch.dsc_hub_dehumidifier_demand",
  ac: "switch.dsc_hub_ac_demand",
  clone_humidifier: "switch.dsc_hub_clone_humidifier_demand",
};

/** Writes: brain /control/* on Pi, HA callService on panel. */
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

  const setDemand = useCallback(
    async (seat: DemandSeat, on: boolean) => {
      if (PI_MODE || source === "pi") {
        return post_demand(seat, on);
      }
      const entityId = DEMAND_ENTITY[seat];
      return hass.callService("switch", on ? "turn_on" : "turn_off", { entity_id: entityId });
    },
    [hass, source],
  );

  return { callService, setDemand };
}
