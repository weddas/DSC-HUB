import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { HassEntity, HomeAssistant } from "../vite-env";
import { get_fleet_state, get_fleet_computed, call_service } from "../lib/fleetApi";
import { parseFleetSnapshot } from "../lib/fleetModel";
import { fleetToHassCompat } from "../lib/fleetFromHass";

function mergeHassExtras(
  states: Record<string, HassEntity>,
  extras: Record<string, HassEntity> | undefined,
): void {
  if (!extras) return;
  for (const [id, ent] of Object.entries(extras)) {
    states[id] = {
      entity_id: id,
      state: ent.state ?? "unavailable",
      attributes: ent.attributes ?? {},
      last_changed: ent.last_changed ?? new Date().toISOString(),
    };
  }
}

/** Pi synthetic HA bus — native fleet SoT + computed extras from /fleet/computed. */
export function fleetToHass(
  fleet: Record<string, unknown>,
  computed?: Record<string, unknown> | null,
): HomeAssistant {
  const parsed = parseFleetSnapshot(fleet);
  const states: Record<string, HassEntity> = { ...fleetToHassCompat(parsed) };
  const extras = computed?.hass_extras as Record<string, HassEntity> | undefined;
  mergeHassExtras(states, extras);

  return {
    states,
    callService: async (domain: string, service: string, data?: Record<string, unknown>) =>
      call_service(domain, service, data ?? {}),
    callWS: async <T,>(_msg?: Record<string, unknown>) => null as T,
  };
}

interface BrainContextValue {
  hass: HomeAssistant | null;
  tick: number;
  fleet: Record<string, unknown> | null;
  computed: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const BrainContext = createContext<BrainContextValue | null>(null);

export function useBrainContext(): BrainContextValue {
  const ctx = useContext(BrainContext);
  if (!ctx) {
    throw new Error("BrainProvider missing");
  }
  return ctx;
}

export function BrainProvider({ children }: { children: ReactNode }) {
  const [fleet, setFleet] = useState<Record<string, unknown> | null>(null);
  const [computed, setComputed] = useState<Record<string, unknown> | null>(null);
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<number | null>(null);

  const applyFleet = useCallback((data: Record<string, unknown>) => {
    setFleet(data);
    setTick((t) => t + 1);
    setError(null);
    setLoading(false);
  }, []);

  const computedChain = useRef(Promise.resolve());

  const refreshComputed = useCallback(() => {
    const run = async () => {
      try {
        const data = await get_fleet_computed();
        setComputed(data);
        setTick((t) => t + 1);
      } catch {
        /* computed helpers are non-fatal */
      }
    };
    computedChain.current = computedChain.current.then(run, run);
    return computedChain.current;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [data] = await Promise.all([get_fleet_state(), refreshComputed()]);
      applyFleet(data);
    } catch (exc) {
      const msg = exc instanceof Error ? exc.message : "fleet fetch failed";
      setError(msg);
      setLoading(false);
    }
  }, [applyFleet, refreshComputed]);

  useEffect(() => {
    void refresh();

    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/ws/fleet`);
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      try {
        applyFleet(JSON.parse(ev.data) as Record<string, unknown>);
        void refreshComputed();
      } catch {
        /* ignore malformed ws payload */
      }
    };

    ws.onerror = () => {
      /* polling fallback handles continuity */
    };

    ws.onclose = () => {
      if (pollRef.current == null) {
        pollRef.current = window.setInterval(() => {
          void refresh();
        }, 5000);
      }
    };

    const computedPoll = window.setInterval(() => {
      void refreshComputed();
    }, 5000);

    return () => {
      ws.close();
      window.clearInterval(computedPoll);
      if (pollRef.current != null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [applyFleet, refresh, refreshComputed]);

  const hass = useMemo(
    () => (fleet ? fleetToHass(fleet, computed) : null),
    [fleet, computed],
  );

  const value = useMemo<BrainContextValue>(
    () => ({
      hass,
      tick,
      fleet,
      computed,
      loading,
      error,
      refresh,
    }),
    [hass, tick, fleet, computed, loading, error, refresh],
  );

  return <BrainContext.Provider value={value}>{children}</BrainContext.Provider>;
}
