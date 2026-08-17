import { useEffect, useRef, useState } from "react";
import { useHass } from "./useHass";

export type HeldReading = {
  value: number;
  stale: boolean;
  heldAt: number | undefined;
  live: boolean;
};

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
 * Never writes fake HA states; never maps unavailable → 0.
 */
export function useHeldReading(entityId: string): HeldReading {
  const { available, tick, entity } = useHass();
  const hold = useRef<{ value: number; at: number } | null>(null);
  const prevId = useRef(entityId);
  const [, bump] = useState(0);

  // Switching pots/entities must not flash the previous row's HELD value.
  if (prevId.current !== entityId) {
    prevId.current = entityId;
    hold.current = null;
  }

  const hubDark = !available(HUB_UPTIME) || !available(HUB_BEAT);
  const liveOk = available(entityId);
  const raw = parseLiveNumber(entity(entityId)?.state, liveOk);
  // Hub-dark + 0 only: keep prior hold. Live 0 while hub is online stays live.
  const suspiciousZero = hubDark && raw === 0;

  useEffect(() => {
    if (liveOk && Number.isFinite(raw) && !suspiciousZero) {
      hold.current = { value: raw, at: Date.now() };
      bump((n) => n + 1);
      return;
    }
    bump((n) => n + 1);
    void tick;
    void entity;
  }, [entityId, liveOk, raw, suspiciousZero, tick, entity]);

  if (liveOk && Number.isFinite(raw) && !suspiciousZero) {
    return { value: raw, stale: false, heldAt: hold.current?.at, live: true };
  }
  if (hold.current != null) {
    return {
      value: hold.current.value,
      stale: true,
      heldAt: hold.current.at,
      live: false,
    };
  }
  return { value: NaN, stale: true, heldAt: undefined, live: false };
}

function useOfflineMs(entityId: string): number | null {
  const { available, entity, tick } = useHass();
  void tick;
  if (available(entityId)) return null;
  const lc = entity(entityId)?.last_changed;
  if (!lc) return null;
  const t = Date.parse(lc);
  return Number.isFinite(t) ? Date.now() - t : null;
}

/** Hub offline duration from uptime entity last_changed. */
export function useHubOfflineMs(): number | null {
  return useOfflineMs(HUB_UPTIME);
}

export function useBeatOfflineMs(): number | null {
  return useOfflineMs(HUB_BEAT);
}

export function usePanelOfflineMs(): number | null {
  return useOfflineMs("binary_sensor.dsc_hub_panel_link");
}
