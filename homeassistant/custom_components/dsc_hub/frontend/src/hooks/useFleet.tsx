import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { FleetSnapshot, InventoryRow, SeatSnapshot } from "../lib/fleetModel";
import { EMPTY_FLEET, hubVitals, inventoryInService, parseFleetSnapshot, tentVitals } from "../lib/fleetModel";
import { fleetFromHass, enrichFleetFromHassStates } from "../lib/fleetFromHass";
import type { HomeAssistant } from "../vite-env";

export type FleetSource = "pi" | "ha";

interface FleetContextValue {
  fleet: FleetSnapshot;
  tick: number;
  source: FleetSource;
  loading: boolean;
  error: string | null;
  refresh?: () => Promise<void>;
}

const FleetContext = createContext<FleetContextValue | null>(null);

export function FleetProvider({
  children,
  fleetRaw,
  hass,
  tick = 0,
  source,
  loading = false,
  error = null,
  refresh,
  inventory,
}: {
  children: ReactNode;
  fleetRaw?: Record<string, unknown> | null;
  hass?: HomeAssistant | null;
  tick?: number;
  source: FleetSource;
  loading?: boolean;
  error?: string | null;
  refresh?: () => Promise<void>;
  inventory?: InventoryRow[];
}) {
  const fleet = useMemo(() => {
    if (source === "pi" && fleetRaw) {
      let parsed = parseFleetSnapshot(fleetRaw);
      const apiHass = fleetRaw.hass_states as Record<string, import("../vite-env").HassEntity> | undefined;
      parsed = enrichFleetFromHassStates(parsed, apiHass);
      if (Array.isArray(fleetRaw?.inventory)) {
        return { ...parsed, inventory: fleetRaw.inventory as InventoryRow[] };
      }
      if (inventory?.length) {
        return { ...parsed, inventory };
      }
      return parsed;
    }
    return fleetFromHass(hass ?? null, inventory);
  }, [source, fleetRaw, hass, inventory, tick]);

  const value = useMemo<FleetContextValue>(
    () => ({ fleet, tick, source, loading, error, refresh }),
    [fleet, tick, source, loading, error, refresh],
  );

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

export function useFleetContext(): FleetContextValue {
  const ctx = useContext(FleetContext);
  if (!ctx) throw new Error("useFleet outside FleetProvider");
  return ctx;
}

export function useFleet(): FleetSnapshot {
  return useFleetContext().fleet;
}

export function useFleetTick(): number {
  return useFleetContext().tick;
}

export function useFleetSource(): FleetSource {
  return useFleetContext().source;
}

export function useSeat(seatId: string): SeatSnapshot {
  const fleet = useFleet();
  if (seatId === "hub") return fleet.hub;
  if (seatId === "panel") return fleet.panel;
  if (seatId.startsWith("pot")) return fleet.pots[seatId] ?? EMPTY_FLEET.pots[seatId] ?? {
    seat_id: seatId,
    online: false,
    firmware: null,
    values: {},
    last_seen: null,
  };
  return fleet.sonoffs[seatId] ?? {
    seat_id: seatId,
    online: false,
    firmware: null,
    values: {},
    last_seen: null,
  };
}

export function useHubVitals() {
  const fleet = useFleet();
  return { ...hubVitals(fleet), online: fleet.hub.online };
}

export function useTentVitals(tent: "main" | "clone") {
  const fleet = useFleet();
  return { ...tentVitals(fleet, tent), online: fleet.hub.online };
}

export function useInventoryInService(seatId: string): boolean {
  const fleet = useFleet();
  return inventoryInService(fleet, seatId);
}

export { EMPTY_FLEET, parseFleetSnapshot };
