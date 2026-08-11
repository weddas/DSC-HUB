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

/**
 * UI-only last-known-good numeric reading.
 * Never writes fake HA states; never maps unavailable → 0.
 */
export function useHeldReading(entityId: string): HeldReading {
  const { num, available, tick, entity } = useHass();
  const hold = useRef<{ value: number; at: number } | null>(null);
  const [, bump] = useState(0);

  const hubDark = !available(HUB_UPTIME) || !available(HUB_BEAT);
  const liveOk = available(entityId);
  const raw = num(entityId);

  useEffect(() => {
    if (liveOk && Number.isFinite(raw)) {
      // Hub-dark + suspicious zero: keep prior hold for climate-like sensors
      if (hubDark && raw === 0 && hold.current != null) {
        bump((n) => n + 1);
        return;
      }
      hold.current = { value: raw, at: Date.now() };
      bump((n) => n + 1);
      return;
    }
    bump((n) => n + 1);
    // tick keeps stale clocks fresh for UI
    void tick;
    void entity;
  }, [entityId, liveOk, raw, hubDark, tick, entity]);

  if (liveOk && Number.isFinite(raw) && !(hubDark && raw === 0 && hold.current != null)) {
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
  return { value: NaN, stale: !liveOk, heldAt: undefined, live: false };
}

/** Hub offline duration from uptime entity last_changed. */
export function useHubOfflineMs(): number | null {
  const { available, entity, tick } = useHass();
  void tick;
  if (available(HUB_UPTIME)) return null;
  const lc = entity(HUB_UPTIME)?.last_changed;
  if (!lc) return null;
  const t = Date.parse(lc);
  return Number.isFinite(t) ? Date.now() - t : null;
}
