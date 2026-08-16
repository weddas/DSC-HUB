import { useCallback, useEffect, useRef, useState } from "react";
import { useHass } from "./useHass";

/** Matches follower debounce in dsc_v4_automations.yaml — offline-only wait. */
export const OFFLINE_COOLDOWN_MS = 25_000;

/**
 * Online reports immediately. Offline waits `cooldownMs` after last-seen live
 * so HA-link flaps do not flash kit nodes. Never invents HA states.
 */
export function useSettledAvailability(cooldownMs = OFFLINE_COOLDOWN_MS): (entityId: string) => boolean {
  const { available, tick } = useHass();
  const lastOnline = useRef<Record<string, number>>({});
  const [, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return useCallback(
    (entityId: string) => {
      if (!entityId) return false;
      if (available(entityId)) {
        lastOnline.current[entityId] = Date.now();
        return true;
      }
      const last = lastOnline.current[entityId];
      if (last == null) return false;
      return Date.now() - last < cooldownMs;
    },
    [available, cooldownMs, tick],
  );
}
