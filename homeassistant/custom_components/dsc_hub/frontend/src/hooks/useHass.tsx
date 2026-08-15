import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

const DSC_HELPER_DOMAINS = new Set([
  "input_boolean",
  "input_number",
  "input_select",
  "input_text",
  "input_datetime",
  "input_button",
]);

function isDscEntity(entityId: string | undefined): boolean {
  if (!entityId) return false;
  const id = entityId.toLowerCase();
  const dot = id.indexOf(".");
  const domain = dot >= 0 ? id.slice(0, dot) : "";
  const objectId = dot >= 0 ? id.slice(dot + 1) : id;
  if (objectId.startsWith("dsc_") || objectId.startsWith("dsc-") || objectId.includes("_dsc_")) {
    return true;
  }
  if (id.includes("dsc_") || id.includes("dsc-")) return true;
  if (DSC_HELPER_DOMAINS.has(domain)) {
    return objectId.startsWith("dsc_") || objectId.includes("dsc_");
  }
  return (
    id.startsWith("sensor.dsc") ||
    id.startsWith("switch.dsc") ||
    id.startsWith("binary_sensor.dsc") ||
    id.startsWith("number.dsc") ||
    id.startsWith("light.dsc") ||
    id.startsWith("fan.dsc") ||
    id.startsWith("select.dsc") ||
    id.startsWith("text.dsc") ||
    id.startsWith("datetime.dsc") ||
    id.startsWith("time.dsc")
  );
}

const TICK_DEBOUNCE_MS = 150;

export function HassProvider({
  hass,
  children,
}: {
  hass: HomeAssistant | null;
  children: ReactNode;
}) {
  const [tick, setTick] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hassRef = useRef(hass);
  hassRef.current = hass;

  const bumpTick = () => {
    if (debounceRef.current) return;
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      setTick((t) => t + 1);
    }, TICK_DEBOUNCE_MS);
  };

  useEffect(() => {
    if (!hass) return;
    bumpTick();

    const conn = hass.connection;
    if (!conn?.subscribeEvents) return;

    let unsub: (() => void) | undefined;
    let cancelled = false;

    const onEvent = (event: HassEvent) => {
      const entityId = event.data?.entity_id;
      if (!isDscEntity(entityId)) return;
      bumpTick();
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
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [hass]);

  const callService = useMemo(
    () =>
      (domain: string, service: string, data?: Record<string, unknown>) => {
        const h = hassRef.current;
        if (!h?.callService) return Promise.resolve(null);
        return h.callService(domain, service, data);
      },
    [],
  );

  const callWS = useMemo(
    () =>
      <T = unknown>(msg: Record<string, unknown>): Promise<T | null> => {
        const h = hassRef.current;
        if (h?.callWS) return h.callWS<T>(msg);
        const conn = h?.connection as
          | { sendMessagePromise?: (m: Record<string, unknown>) => Promise<T> }
          | undefined;
        if (conn?.sendMessagePromise) return conn.sendMessagePromise(msg);
        return Promise.resolve(null);
      },
    [],
  );

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
    return { hass, entity, state, num, available, callService, callWS, tick };
  }, [hass, tick, callService, callWS]);

  return createElement(HassContext.Provider, { value }, children);
}

export function useHass(): HassContextValue {
  const ctx = useContext(HassContext);
  if (!ctx) throw new Error("useHass outside HassProvider");
  return ctx;
}
