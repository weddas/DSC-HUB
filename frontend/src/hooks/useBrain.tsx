import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { get_fleet_state, get_fleet_computed } from "../lib/fleetApi";
import { createStore, useStoreSelector, type Store } from "../lib/selectorStore";

interface BrainContextValue {
  tick: number;
  fleet: Record<string, unknown> | null;
  computed: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  /** Wall-clock ms of the last fleet snapshot actually applied (WS push or poll) — null until the first lands. */
  lastUpdatedAt: number | null;
}

const BrainStoreContext = createContext<Store<BrainContextValue> | null>(null);

/** /ws/fleet pushes every ~2 s; past this with nothing applied the socket is treated as dead. */
const FLEET_STALE_MS = 15_000;

function useBrainStore(): Store<BrainContextValue> {
  const store = useContext(BrainStoreContext);
  if (!store) {
    throw new Error("BrainProvider missing");
  }
  return store;
}

/** Subscribe to a derived slice of brain state; re-renders only when `isEqual` reports a change. */
export function useBrainSelector<S>(
  selector: (value: BrainContextValue) => S,
  isEqual?: (a: S, b: S) => boolean,
): S {
  return useStoreSelector(useBrainStore(), selector, isEqual);
}

export function useBrainContext(): BrainContextValue {
  const store = useBrainStore();
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}

/** The stable `refresh` callback alone — for callers that don't need to re-render on every fleet tick. */
export function useBrainRefresh(): () => Promise<void> {
  return useBrainSelector((v) => v.refresh);
}

export function BrainProvider({ children }: { children: ReactNode }) {
  const [fleet, setFleet] = useState<Record<string, unknown> | null>(null);
  const [computed, setComputed] = useState<Record<string, unknown> | null>(null);
  const [tick, setTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<number | null>(null);
  /** Mirror of lastUpdatedAt for the watchdog — a ref so the interval never goes stale. */
  const lastAppliedRef = useRef<number | null>(null);

  const applyFleet = useCallback((data: Record<string, unknown>) => {
    setFleet(data);
    setTick((t) => t + 1);
    setError(null);
    setLoading(false);
    const now = Date.now();
    lastAppliedRef.current = now;
    setLastUpdatedAt(now);
  }, []);

  // One in-flight fetch is always enough: every response is the whole current state, so a
  // second request issued while the first is pending can only return the same thing later.
  // The previous promise chain serialised calls but never coalesced or dropped them — three
  // producers (the 2 s /ws/fleet push, the 5 s computed poll, the onclose fallback) could
  // build a backlog that then drained back-to-back at ~17 req/s and buried the brain's accept
  // queue. On 2026-09-09 that outage ran 301 s and tripped the hub's safe_reboot_api_wedge.
  const computedInflight = useRef<Promise<void> | null>(null);

  const refreshComputed = useCallback(() => {
    if (computedInflight.current) return computedInflight.current;
    const run = (async () => {
      try {
        const data = await get_fleet_computed();
        setComputed(data);
        setTick((t) => t + 1);
      } catch {
        /* computed helpers are non-fatal */
      } finally {
        computedInflight.current = null;
      }
    })();
    computedInflight.current = run;
    return run;
  }, []);

  const fleetInflight = useRef<Promise<void> | null>(null);

  const refresh = useCallback(() => {
    if (fleetInflight.current) return fleetInflight.current;
    const run = (async () => {
      try {
        const [data] = await Promise.all([get_fleet_state(), refreshComputed()]);
        applyFleet(data);
      } catch (exc) {
        const msg = exc instanceof Error ? exc.message : "fleet fetch failed";
        setError(msg);
        setLoading(false);
      } finally {
        fleetInflight.current = null;
      }
    })();
    fleetInflight.current = run;
    return run;
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
      // A half-open socket never fires onclose, so the polling fallback below never starts and
      // the fleet snapshot freezes while computed keeps updating. If nothing has landed for a
      // few WS cadences, pull the whole snapshot (coalesced — at most one request in flight).
      const applied = lastAppliedRef.current;
      if (applied != null && Date.now() - applied > FLEET_STALE_MS) {
        void refresh();
        return;
      }
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

  const value = useMemo<BrainContextValue>(
    () => ({
      tick,
      fleet,
      computed,
      loading,
      error,
      refresh,
      lastUpdatedAt,
    }),
    [tick, fleet, computed, loading, error, refresh, lastUpdatedAt],
  );

  const storeRef = useRef<Store<BrainContextValue> | null>(null);
  if (!storeRef.current) storeRef.current = createStore(value);
  const store = storeRef.current;

  useLayoutEffect(() => {
    store.setState(value);
  }, [store, value]);

  return <BrainStoreContext.Provider value={store}>{children}</BrainStoreContext.Provider>;
}
