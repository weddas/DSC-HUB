import { useCallback, useEffect, useSyncExternalStore } from "react";
import { CAMERAS_PREDATE, getCameras, type CameraRecord, type CamerasSummary } from "../lib/camerasApi";

/**
 * One shared camera list for every surface (zone cards, Devices › Cameras, the viewer).
 * Polls the brain every 30 s while anyone is subscribed; `refresh()` after a mutation.
 * An old brain without `/cameras` is reported as `predates`, never as an empty list.
 */

interface CamerasState {
  summary: CamerasSummary | null;
  error: string | null;
  predates: boolean;
  loaded: boolean;
}

let state: CamerasState = { summary: null, error: null, predates: false, loaded: false };
const listeners = new Set<() => void>();
let timer: number | null = null;
let inflight: Promise<void> | null = null;

const POLL_MS = 30_000;

function emit() {
  for (const l of listeners) l();
}

export async function refreshCameras(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const summary = await getCameras();
      state = { summary, error: null, predates: false, loaded: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const predates = msg === CAMERAS_PREDATE;
      state = { summary: state.summary, error: msg, predates, loaded: true };
      // An old brain will not grow the route while this tab is open — stop asking.
      if (predates && timer != null) {
        window.clearInterval(timer);
        timer = null;
      }
    } finally {
      inflight = null;
      emit();
    }
  })();
  return inflight;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1) {
    void refreshCameras();
    timer = window.setInterval(() => void refreshCameras(), POLL_MS);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer != null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot() {
  return state;
}

export function useCameras(): CamerasState & { refresh: () => Promise<void> } {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const refresh = useCallback(() => refreshCameras(), []);
  return { ...snap, refresh };
}

/** Cameras bound to one brain zone id (`4x8`, `2x4`, `grow_room`). */
export function useSpaceCameras(spaceId: string): { cameras: CameraRecord[]; predates: boolean; loaded: boolean; error: string | null } {
  const { summary, predates, loaded, error } = useCameras();
  const cameras = (summary?.cameras ?? []).filter((c) => c.space_id === spaceId);
  return { cameras, predates, loaded, error };
}

/** Re-poll faster while a viewer is open (the brain still owns the cadence). */
export function useCameraFastPoll(active: boolean, everyMs = 10_000) {
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => void refreshCameras(), everyMs);
    return () => window.clearInterval(id);
  }, [active, everyMs]);
}
