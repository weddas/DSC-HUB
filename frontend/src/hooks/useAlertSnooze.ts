import { useCallback, useMemo } from "react";
import { useEntityBus } from "./useEntityBus";

const STORAGE_PREFIX = "dsc-hub-snooze:";

type SnoozeMap = Record<string, true>;

function readMap(bootKey: string): SnoozeMap {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + bootKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as SnoozeMap;
  } catch {
    return {};
  }
}

function writeMap(bootKey: string, map: SnoozeMap): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + bootKey, JSON.stringify(map));
  } catch {
    /* quota / private mode — snooze is panel-local best-effort */
  }
}

/** Acknowledge until the next hub boot (`sensor.dsc_hub_uptime` last_changed). */
export function useAlertSnooze() {
  const { entity, tick } = useEntityBus();
  const bootKey = entity("sensor.dsc_hub_uptime")?.last_changed || "noboot";
  const map = useMemo(() => readMap(bootKey), [bootKey, tick]);

  const isSnoozed = useCallback((entityId: string) => !!map[entityId], [map]);

  const snooze = useCallback(
    (entityId: string) => {
      if (!entityId) return;
      const next = { ...readMap(bootKey), [entityId]: true as const };
      writeMap(bootKey, next);
    },
    [bootKey],
  );

  const unsnooze = useCallback(
    (entityId: string) => {
      const next = { ...readMap(bootKey) };
      delete next[entityId];
      writeMap(bootKey, next);
    },
    [bootKey],
  );

  return { bootKey, isSnoozed, snooze, unsnooze };
}
