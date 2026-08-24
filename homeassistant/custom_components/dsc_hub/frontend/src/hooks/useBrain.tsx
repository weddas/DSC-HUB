import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { HassEntity, HomeAssistant } from "../vite-env";
import { get_fleet_state } from "../lib/fleetApi";

interface BrainContextValue {
  hass: HomeAssistant | null;
  tick: number;
  fleet: Record<string, unknown> | null;
  refresh: () => void;
}

let brainCtx: BrainContextValue | null = null;

export function useBrainContext(): BrainContextValue {
  if (!brainCtx) {
    throw new Error("BrainProvider missing");
  }
  return brainCtx;
}

/** Drop-in for useHass when running on Pi SPA. */
export function useHassCompat() {
  const { hass, tick } = useBrainContext();
  const entity = useCallback(
    (entityId: string) => hass?.states?.[entityId],
    [hass, tick],
  );
  const available = useCallback(
    (entityId: string) => {
      const st = entity(entityId)?.state;
      return !!st && st !== "unavailable" && st !== "unknown";
    },
    [entity, tick],
  );
  const state = useCallback(
    (entityId: string, fallback = "—") => {
      if (!available(entityId)) return fallback;
      return entity(entityId)?.state ?? fallback;
    },
    [available, entity, tick],
  );
  const num = useCallback(
    (entityId: string, fallback = NaN) => {
      if (!available(entityId)) return fallback;
      const n = Number(entity(entityId)?.state);
      return Number.isFinite(n) ? n : fallback;
    },
    [available, entity, tick],
  );
  const callService = useCallback(
    async (domain: string, service: string, data?: Record<string, unknown>) => {
      const resp = await fetch("/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, service, data }),
      });
      if (!resp.ok) throw new Error(`service ${domain}.${service} failed`);
      return resp.json();
    },
    [],
  );
  const callWS = useCallback(async <T,>(msg: Record<string, unknown>): Promise<T | null> => {
    void msg;
    return null;
  }, []);
  return { hass, entity, state, num, available, callService, callWS, tick };
}

function fleetToHass(fleet: Record<string, unknown>): HomeAssistant {
  const raw = fleet.hass_states as Record<string, HassEntity> | undefined;
  if (raw && Object.keys(raw).length > 0) {
    return {
      states: raw,
      callService: async () => null,
      callWS: async () => null,
    };
  }

  // Legacy fallback if brain is older than hass_states payload.
  const states: Record<string, HassEntity> = {};
  const hub = fleet.hub as { online?: boolean; values?: Record<string, unknown> } | undefined;
  const panel = fleet.panel as { online?: boolean } | undefined;
  const system = fleet.system as { appliance_link?: boolean } | undefined;

  const set = (id: string, value: string) => {
    states[id] = { entity_id: id, state: value, attributes: {} };
  };

  if (hub?.values?.temp_c != null) set("sensor.dsc_hub_temperature", String(hub.values.temp_c));
  if (hub?.values?.rh_pct != null) set("sensor.dsc_hub_humidity", String(hub.values.rh_pct));
  if (hub?.values?.vpd_kpa != null) set("sensor.dsc_hub_vpd", String(hub.values.vpd_kpa));
  set("binary_sensor.dsc_hub_link", hub?.online ? "on" : "off");
  set("binary_sensor.dsc_hub_panel_link", panel?.online ? "on" : "off");
  set("binary_sensor.dsc_pi_appliance_link", system?.appliance_link ? "on" : "off");
  set("binary_sensor.dsc_reduced_kit", "off");

  const pots = fleet.pots as Record<string, { online?: boolean; values?: Record<string, unknown> }> | undefined;
  if (pots) {
    for (const [potId, seat] of Object.entries(pots)) {
      const n = potId.replace("pot", "");
      const v = seat.values ?? {};
      if (v.moisture_pct != null) set(`sensor.dsc_pot${n}_soil_moisture`, String(v.moisture_pct));
      if (v.soil_temp_c != null) set(`sensor.dsc_pot${n}_soil_temperature`, String(v.soil_temp_c));
      if (v.ec_us != null) set(`sensor.dsc_pot${n}_soil_ec`, String(v.ec_us));
      if (v.ph != null) set(`sensor.dsc_pot${n}_soil_ph`, String(v.ph));
      set(`binary_sensor.dsc_pot${n}_in_service`, seat.online ? "on" : "off");
    }
  }

  const canopy = fleet.canopy as Record<string, unknown> | undefined;
  if (canopy?.temp_c != null) set("sensor.dsc_canopy_temperature", String(canopy.temp_c));
  if (canopy?.rh_pct != null) set("sensor.dsc_canopy_humidity", String(canopy.rh_pct));

  return {
    states,
    callService: async () => null,
    callWS: async () => null,
  };
}

export function BrainProvider({ children }: { children: ReactNode }) {
  const [fleet, setFleet] = useState<Record<string, unknown> | null>(null);
  const [tick, setTick] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  const refresh = useCallback(async () => {
    const data = await get_fleet_state();
    setFleet(data);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    refresh();
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/ws/fleet`);
    wsRef.current = ws;
    ws.onmessage = (ev) => {
      try {
        setFleet(JSON.parse(ev.data));
        setTick((t) => t + 1);
      } catch {
        /* ignore */
      }
    };
    ws.onclose = () => {
      window.setInterval(refresh, 5000);
    };
    return () => ws.close();
  }, [refresh]);

  const hass = useMemo(() => (fleet ? fleetToHass(fleet) : null), [fleet, tick]);

  const value: BrainContextValue = { hass, tick, fleet, refresh };
  brainCtx = value;

  return <>{children}</>;
}
