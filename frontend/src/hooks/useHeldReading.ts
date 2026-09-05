import { useEffect, useRef, useState } from "react";
import { useEntityBus } from "./useEntityBus";
import { useFleet, useFleetSource } from "./useFleet";
import { fleetEntityAvailable, fleetLiveNumber, hubFleetDark } from "../lib/entityFleetMap";

export type HeldReading = {
  value: number;
  stale: boolean;
  heldAt: number | undefined;
  live: boolean;
};

/** Default staleness horizon for readings that carry their own `updated_at`
 *  (Zigbee-by-role, and other fleet-snapshot values that aren't HA entities). */
export const TIMESTAMPED_READING_STALE_MS = 10 * 60 * 1000;

export type TimestampedReading = { value: number; stale: boolean };

/**
 * Pure last-known-good for a value that arrives with its own epoch-seconds
 * timestamp in the fleet snapshot rather than as an entity on the bus. No
 * subscription, no hooks — safe to call inside a `.map()` / `useMemo`.
 *
 * Fails closed: a non-finite value, or no usable timestamp, is `stale` (we do
 * not assume a bare number is live). This is the shared rule for `zigbee_by_role`
 * and anything else with its own `updated_at` (see DESIGN-TOKENS §3.1).
 */
export function timestampedReading(
  value: number | string | null | undefined,
  updatedAtSec: number | string | null | undefined,
  staleMs: number = TIMESTAMPED_READING_STALE_MS,
): TimestampedReading {
  const num = typeof value === "number" ? value : value == null || value === "" ? NaN : Number(value);
  const ts = typeof updatedAtSec === "number" ? updatedAtSec : Number(updatedAtSec);
  if (!Number.isFinite(num)) return { value: NaN, stale: false };
  const stale = Number.isFinite(ts) ? Date.now() - ts * 1000 > staleMs : true;
  return { value: num, stale };
}

/** Hook-named alias of {@link timestampedReading} for call sites that read
 *  better as a hook. Identical behaviour — it holds no state. */
export const useTimestampedReading = timestampedReading;

const HUB_UPTIME = "sensor.dsc_hub_uptime";
const HUB_BEAT = "sensor.dsc_hub_heartbeat";

/** Parse a live numeric HA state. Never maps unavailable/unknown/empty → 0. */
function parseLiveNumber(raw: string | undefined, liveOk: boolean): number {
  if (!liveOk || raw == null || raw === "") return NaN;
  const s = raw.trim().toLowerCase();
  if (s === "unavailable" || s === "unknown" || s === "none") return NaN;
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * UI-only last-known-good numeric reading.
 * Pi: prefers fleet metric; HA: entity bus. Never maps unavailable → 0.
 */
export function useHeldReading(entityId: string): HeldReading {
  const { available, tick, entity } = useEntityBus();
  const fleet = useFleet();
  const source = useFleetSource();
  const holds = useRef<Record<string, { value: number; at: number }>>({});
  const [, bump] = useState(0);

  const fleetVal = source === "pi" ? fleetLiveNumber(entityId, fleet) : null;
  const fleetOk = source === "pi" ? fleetEntityAvailable(entityId, fleet) : false;
  const hubDark =
    source === "pi"
      ? hubFleetDark(fleet)
      : !available(HUB_UPTIME) || !available(HUB_BEAT);
  const liveOk = source === "pi" ? fleetOk || available(entityId) : available(entityId);
  const raw =
    fleetVal != null && Number.isFinite(fleetVal)
      ? fleetVal
      : parseLiveNumber(entity(entityId)?.state, liveOk);
  const suspiciousZero = hubDark && raw === 0;
  const held = holds.current[entityId];

  useEffect(() => {
    if (liveOk && Number.isFinite(raw) && !suspiciousZero) {
      holds.current[entityId] = { value: raw, at: Date.now() };
      bump((n) => n + 1);
      return;
    }
    bump((n) => n + 1);
    void tick;
    void entity;
  }, [entityId, liveOk, raw, suspiciousZero, tick, entity]);

  if (liveOk && Number.isFinite(raw) && !suspiciousZero) {
    return { value: raw, stale: false, heldAt: held?.at, live: true };
  }
  if (held != null) {
    return {
      value: held.value,
      stale: true,
      heldAt: held.at,
      live: false,
    };
  }
  return { value: NaN, stale: false, heldAt: undefined, live: false };
}

function useOfflineMs(entityId: string): number | null {
  const { available, entity, tick } = useEntityBus();
  const fleet = useFleet();
  const source = useFleetSource();
  void tick;
  if (source === "pi" && entityId === HUB_UPTIME && fleet.hub.online) return null;
  if (available(entityId)) return null;
  const lc = entity(entityId)?.last_changed;
  if (!lc) return null;
  const t = Date.parse(lc);
  return Number.isFinite(t) ? Date.now() - t : null;
}

/** Hub offline duration from uptime entity last_changed. */
export function useHubOfflineMs(): number | null {
  const fleet = useFleet();
  const source = useFleetSource();
  const fromEntity = useOfflineMs(HUB_UPTIME);
  if (source === "pi" && !fleet.hub.online && fleet.hub.last_seen) {
    return Date.now() - fleet.hub.last_seen * 1000;
  }
  return fromEntity;
}

export function useBeatOfflineMs(): number | null {
  return useOfflineMs(HUB_BEAT);
}

export function usePanelOfflineMs(): number | null {
  const fleet = useFleet();
  const source = useFleetSource();
  const fromEntity = useOfflineMs("binary_sensor.dsc_hub_panel_link");
  if (source === "pi" && !fleet.panel.online && fleet.panel.last_seen) {
    return Date.now() - fleet.panel.last_seen * 1000;
  }
  return fromEntity;
}
