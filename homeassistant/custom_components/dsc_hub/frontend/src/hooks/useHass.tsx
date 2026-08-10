import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HassEntity, HassEvent, HomeAssistant } from "../vite-env";

interface HassContextValue {
  hass: HomeAssistant | null;
  entity: (entityId: string) => HassEntity | undefined;
  state: (entityId: string, fallback?: string) => string;
  num: (entityId: string, fallback?: number) => number;
  available: (entityId: string) => boolean;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ) => Promise<unknown>;
  callWS: <T = unknown>(msg: Record<string, unknown>) => Promise<T | null>;
  /** Increments on DSC-relevant state_changed (and hass object replace). */
  tick: number;
}

const HassContext = createContext<HassContextValue | null>(null);

function isDscEntity(entityId: string | undefined): boolean {
  if (!entityId) return false;
  const id = entityId.toLowerCase();
  return (
    id.includes("dsc_") ||
    id.includes("dsc-") ||
    id.startsWith("sensor.dsc") ||
    id.startsWith("switch.dsc") ||
    id.startsWith("binary_sensor.dsc") ||
    id.startsWith("number.dsc") ||
    id.startsWith("light.dsc") ||
    id.startsWith("fan.dsc") ||
    id.startsWith("select.dsc") ||
    id.startsWith("input_")
  );
}

export function HassProvider({
  hass,
  children,
}: {
  hass: HomeAssistant | null;
  children: ReactNode;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!hass) return;
    setTick((t) => t + 1);

    const conn = hass.connection;
    if (!conn?.subscribeEvents) return;

    let unsub: (() => void) | undefined;
    let cancelled = false;

    const onEvent = (event: HassEvent) => {
      const entityId = event.data?.entity_id;
      if (!isDscEntity(entityId)) return;
      setTick((t) => t + 1);
    };

    Promise.resolve(conn.subscribeEvents(onEvent, "state_changed"))
      .then((fn) => {
        if (cancelled) {
          fn();
          return;
        }
        unsub = fn;
      })
      .catch(() => {
        /* connection may not be ready yet — hass prop updates still refresh */
      });

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [hass]);

  const value = useMemo<HassContextValue>(() => {
    const entity = (entityId: string) => hass?.states?.[entityId];
    const available = (entityId: string) => {
      const st = entity(entityId)?.state;
      return !!st && st !== "unavailable" && st !== "unknown";
    };
    const state = (entityId: string, fallback = "—") => {
      if (!available(entityId)) return fallback;
      return entity(entityId)?.state ?? fallback;
    };
    const num = (entityId: string, fallback = NaN) => {
      const n = Number(state(entityId, ""));
      return Number.isFinite(n) ? n : fallback;
    };
    const callService = (
      domain: string,
      service: string,
      data?: Record<string, unknown>,
    ) => {
      if (!hass?.callService) return Promise.resolve(null);
      return hass.callService(domain, service, data);
    };
    const callWS = <T = unknown>(msg: Record<string, unknown>) => {
      if (!hass?.callWS) return Promise.resolve(null);
      return hass.callWS<T>(msg);
    };
    return { hass, entity, state, num, available, callService, callWS, tick };
  }, [hass, tick]);

  return createElement(HassContext.Provider, { value }, children);
}

export function useHass(): HassContextValue {
  const ctx = useContext(HassContext);
  if (!ctx) throw new Error("useHass outside HassProvider");
  return ctx;
}
