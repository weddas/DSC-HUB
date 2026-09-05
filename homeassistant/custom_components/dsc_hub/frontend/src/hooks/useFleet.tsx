import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { FleetSnapshot, InventoryRow, SeatSnapshot } from "../lib/fleetModel";
import { EMPTY_FLEET, hubVitals, inventoryInService, parseFleetSnapshot, tentVitals } from "../lib/fleetModel";
import { fleetFromHass, enrichFleetFromHassStates } from "../lib/fleetFromHass";
import type { HomeAssistant } from "../vite-env";
import { createStore, deepEqual, useStoreSelector, type Store } from "../lib/selectorStore";

export type FleetSource = "pi" | "ha";

interface FleetContextValue {
  fleet: FleetSnapshot;
  tick: number;
  source: FleetSource;
  loading: boolean;
  error: string | null;
  refresh?: () => Promise<void>;
  /** Wall-clock ms of the last fleet snapshot actually applied — null until the first lands (Pi source only). */
  lastUpdatedAt?: number | null;
}

const FleetStoreContext = createContext<Store<FleetContextValue> | null>(null);

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
  lastUpdatedAt = null,
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
  lastUpdatedAt?: number | null;
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
    () => ({ fleet, tick, source, loading, error, refresh, lastUpdatedAt }),
    [fleet, tick, source, loading, error, refresh, lastUpdatedAt],
  );

  // Store is created once and never replaced, so the context value (the store
  // reference itself) stays stable — only its subscribers decide, per selector,
  // whether a given publish is worth a re-render.
  const storeRef = useRef<Store<FleetContextValue> | null>(null);
  if (!storeRef.current) storeRef.current = createStore(value);
  const store = storeRef.current;

  useLayoutEffect(() => {
    store.setState(value);
  }, [store, value]);

  return <FleetStoreContext.Provider value={store}>{children}</FleetStoreContext.Provider>;
}

function useFleetStore(): Store<FleetContextValue> {
  const store = useContext(FleetStoreContext);
  if (!store) throw new Error("useFleet outside FleetProvider");
  return store;
}

/**
 * Subscribe to a derived slice of the fleet context. The component only re-renders
 * when `isEqual` (default: reference equality) says the selected slice changed —
 * unrelated WS ticks that don't touch this slice are a no-op for this subscriber.
 */
export function useFleetSelector<S>(
  selector: (value: FleetContextValue) => S,
  isEqual?: (a: S, b: S) => boolean,
): S {
  return useStoreSelector(useFleetStore(), selector, isEqual);
}

export function useFleetContext(): FleetContextValue {
  const store = useFleetStore();
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}

export function useFleet(): FleetSnapshot {
  return useFleetSelector((v) => v.fleet, deepEqual);
}

export function useFleetTick(): number {
  return useFleetSelector((v) => v.tick);
}

export function useFleetLastUpdated(): number | null {
  return useFleetSelector((v) => v.lastUpdatedAt ?? null);
}

export function useFleetSource(): FleetSource {
  return useFleetSelector((v) => v.source);
}

function selectSeat(fleet: FleetSnapshot, seatId: string): SeatSnapshot {
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

export function useSeat(seatId: string): SeatSnapshot {
  return useFleetSelector((v) => selectSeat(v.fleet, seatId), deepEqual);
}

export function useHubVitals() {
  return useFleetSelector((v) => ({ ...hubVitals(v.fleet), online: v.fleet.hub.online }), deepEqual);
}

export function useTentVitals(tent: "main" | "clone") {
  return useFleetSelector(
    (v) => ({ ...tentVitals(v.fleet, tent), online: v.fleet.hub.online }),
    deepEqual,
  );
}

export function useInventoryInService(seatId: string): boolean {
  return useFleetSelector((v) => inventoryInService(v.fleet, seatId));
}

export { EMPTY_FLEET, parseFleetSnapshot };
