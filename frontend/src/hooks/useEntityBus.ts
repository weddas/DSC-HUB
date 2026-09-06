/**
 * Unified entity reads for operational pages — fleet snapshot + HA-shaped compat
 * shim (the dialect the brain speaks; there is no live Home Assistant).
 *
 * Re-renders only when a tracked entity (one this render called state/num/entity/
 * available for) actually changed — not on every WS fleet tick.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useFleetStore, useFleetTick, type FleetContextValue } from "./useFleet";
import { fleetControlAttributes, fleetControlAvailable, fleetControlState } from "../lib/fleetControlMap";
import { fleetEntityAvailable, fleetLiveNumber, fleetLiveState } from "../lib/entityFleetMap";
import { fleetToHassCompat } from "../lib/fleetFromHass";
import { call_service } from "../lib/fleetApi";
import type { HassEntity, HomeAssistant } from "../vite-env";

function entityFingerprint(entityId: string, ctx: FleetContextValue): string {
  const { fleet, hassStates } = ctx;
  const ctrl = fleetControlState(entityId, fleet);
  if (ctrl != null) {
    return `c:${ctrl}:${JSON.stringify(fleetControlAttributes(entityId, fleet))}`;
  }
  const liveState = fleetLiveState(entityId, fleet);
  if (liveState != null) return `l:${liveState}`;
  const liveNum = fleetLiveNumber(entityId, fleet);
  if (liveNum != null && Number.isFinite(liveNum)) return `n:${liveNum}`;
  const fromHass = hassStates?.[entityId];
  if (fromHass) {
    return `h:${fromHass.state}:${JSON.stringify(fromHass.attributes ?? {})}`;
  }
  const compat = fleetToHassCompat(fleet)[entityId];
  if (compat) return `x:${compat.state}:${JSON.stringify(compat.attributes ?? {})}`;
  return `u:${fleetEntityAvailable(entityId, fleet) ? 1 : 0}`;
}

function resolveEntity(entityId: string, ctx: FleetContextValue): HassEntity | undefined {
  const { fleet, hassStates } = ctx;
  const ctrlState = fleetControlState(entityId, fleet);
  if (ctrlState != null) {
    return {
      entity_id: entityId,
      state: ctrlState,
      attributes: fleetControlAttributes(entityId, fleet),
      last_changed: new Date().toISOString(),
    };
  }
  const liveState = fleetLiveState(entityId, fleet);
  if (liveState != null) {
    return {
      entity_id: entityId,
      state: liveState,
      attributes: {},
      last_changed: new Date().toISOString(),
    };
  }
  const fromHass = hassStates?.[entityId];
  if (fromHass) return fromHass;
  return fleetToHassCompat(fleet)[entityId];
}

const noopCallWS = (async () => null) as HomeAssistant["callWS"];

export function useEntityBus() {
  const store = useFleetStore();
  const tick = useFleetTick();

  /** Entity ids touched during the current render — committed after paint. */
  const renderTracked = useRef(new Set<string>());
  renderTracked.current = new Set();
  const trackedRef = useRef(new Set<string>());
  const sigRef = useRef("");

  useLayoutEffect(() => {
    trackedRef.current = renderTracked.current;
  });

  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      store.subscribe(() => {
        const ctx = store.getState();
        const ids = trackedRef.current;
        if (!ids.size) return;
        let sig = "";
        for (const id of ids) {
          sig += `${id}=${entityFingerprint(id, ctx)};`;
        }
        if (sig === sigRef.current) return;
        sigRef.current = sig;
        onStoreChange();
      }),
    [store],
  );

  const getSnapshot = useCallback(() => {
    const ctx = store.getState();
    const ids = trackedRef.current.size ? trackedRef.current : renderTracked.current;
    let sig = "";
    for (const id of ids) {
      sig += `${id}=${entityFingerprint(id, ctx)};`;
    }
    if (sig === sigRef.current) return sigRef.current;
    sigRef.current = sig;
    return sig;
  }, [store]);

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo(() => {
    const track = (entityId: string) => {
      renderTracked.current.add(entityId);
    };

    const entity = (entityId: string): HassEntity | undefined => {
      track(entityId);
      return resolveEntity(entityId, store.getState());
    };

    const available = (entityId: string) => {
      track(entityId);
      const ctx = store.getState();
      if (fleetControlAvailable(entityId, ctx.fleet)) return true;
      if (fleetEntityAvailable(entityId, ctx.fleet)) return true;
      const st = resolveEntity(entityId, ctx)?.state;
      return st != null && st !== "unavailable" && st !== "unknown";
    };

    const state = (entityId: string, fallback = "—") => {
      track(entityId);
      const ctx = store.getState();
      const ctrl = fleetControlState(entityId, ctx.fleet);
      if (ctrl != null) return ctrl;
      const liveState = fleetLiveState(entityId, ctx.fleet);
      if (liveState != null) return liveState;
      const resolved = resolveEntity(entityId, ctx);
      if (resolved?.state != null && resolved.state !== "unavailable" && resolved.state !== "unknown") {
        return resolved.state;
      }
      return fallback;
    };

    const num = (entityId: string, fallback = NaN) => {
      track(entityId);
      const ctx = store.getState();
      const ctrl = fleetControlState(entityId, ctx.fleet);
      if (ctrl != null) {
        const n = Number(ctrl);
        if (Number.isFinite(n)) return n;
      }
      const live = fleetLiveNumber(entityId, ctx.fleet);
      if (live != null && Number.isFinite(live)) return live;
      const resolved = resolveEntity(entityId, ctx);
      if (resolved?.state != null) {
        const n = Number(resolved.state);
        if (Number.isFinite(n)) return n;
      }
      return fallback;
    };

    const callService = (domain: string, service: string, data?: Record<string, unknown>) =>
      call_service(domain, service, data ?? {});

    /** HA-shaped synthetic bus for the few consumers (Twin web component) that
     *  want a `hass`-like object with a `.states` map. */
    const hassCompat = (): HomeAssistant => {
      const ctx = store.getState();
      return {
        states: { ...fleetToHassCompat(ctx.fleet), ...(ctx.hassStates ?? {}) },
        callService: (domain, service, d) => call_service(domain, service, d ?? {}),
        callWS: noopCallWS,
      };
    };

    return {
      entity,
      available,
      state,
      num,
      callService,
      callWS: noopCallWS,
      tick,
      get hass(): HomeAssistant {
        return hassCompat();
      },
    };
  }, [store, tick]);
}
