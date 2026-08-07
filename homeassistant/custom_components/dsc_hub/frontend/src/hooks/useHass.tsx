import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HassEntity, HomeAssistant } from "./vite-env";

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
  tick: number;
}

const HassContext = createContext<HassContextValue | null>(null);

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
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
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
    return { hass, entity, state, num, available, callService, tick };
  }, [hass, tick]);

  return createElement(HassContext.Provider, { value }, children);
}

export function useHass(): HassContextValue {
  const ctx = useContext(HassContext);
  if (!ctx) throw new Error("useHass outside HassProvider");
  return ctx;
}
