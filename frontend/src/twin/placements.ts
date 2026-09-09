import { useSyncExternalStore } from "react";
import type { PlaceAt, Vec3 } from "./Placed";

/**
 * Placement overrides — where the operator has moved something.
 *
 * plan-spatial-layout S4. The rig's layout was source code: every object in RigScene is a
 * hand-written `<Placed>` with literal offsets and rotations, so nothing could be moved
 * without an edit and a rebuild.
 *
 * Rather than rebuilding the scene from a flat list — which would mean reconstructing the
 * parent/child nesting that the JSX tree already expresses correctly — this store is
 * consulted by `Placed` itself, keyed on the id it already has. One intercept covers every
 * placement in the scene, and the literals stay as the defaults.
 *
 * Only OVERRIDES live here. An empty store renders the rig exactly as it always did, and
 * moving something back is deleting a row.
 */

export type Placement = {
  at: PlaceAt;
  rotation?: Vec3;
  self?: string | [string, string];
  scale?: number | Vec3;
};

let overrides: Record<string, Placement> = {};
const listeners = new Set<() => void>();
/** Bumped on every replace, so `useSyncExternalStore` sees a changed snapshot. */
let version = 0;

function emit(): void {
  version += 1;
  for (const l of listeners) l();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Replace the whole map (the shape `GET /placements` returns). */
export function setPlacements(next: Record<string, Placement>): void {
  overrides = next ?? {};
  emit();
}

export function placementCount(): number {
  return Object.keys(overrides).length;
}

/**
 * The override for an instance, or null.
 *
 * Returns the SAME object identity while the store is unchanged: `Placed` keys effects off
 * these values, and a fresh object each render would rebuild the model every frame.
 */
export function usePlacementOverride(id: string): Placement | null {
  return useSyncExternalStore(
    subscribe,
    () => overrides[id] ?? null,
    () => null,
  );
}

/** Version counter, for anything that needs to react to any placement changing. */
export function usePlacementVersion(): number {
  return useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
}

/** Load the overrides from the brain. A failure is non-fatal: the scene keeps its own. */
export async function loadPlacements(): Promise<void> {
  try {
    const resp = await fetch("/placements");
    if (!resp.ok) return;
    const data = (await resp.json()) as {
      placements?: Record<string, { space_id?: string; placement?: Placement }>;
    };
    const next: Record<string, Placement> = {};
    for (const [id, row] of Object.entries(data.placements ?? {})) {
      if (row?.placement?.at) next[id] = row.placement;
    }
    setPlacements(next);
  } catch {
    /* the rig renders from the scene's own literals */
  }
}

/**
 * The scene's own literal, unless the operator has moved this instance.
 *
 * Field-by-field, not all-or-nothing: an override that only carries an `at` must not also
 * silently drop the rotation the scene gave the model, or a fan snapped to a new port
 * would come back lying on its side.
 */
export function resolvePlacement(
  override: Placement | null | undefined,
  props: { at: PlaceAt; rotation?: Vec3; self?: string | [string, string]; scale?: number | Vec3 },
): { at: PlaceAt; rotation?: Vec3; self?: string | [string, string]; scale?: number | Vec3 } {
  if (!override) return props;
  return {
    at: override.at ?? props.at,
    rotation: override.rotation ?? props.rotation,
    self: override.self ?? props.self,
    scale: override.scale ?? props.scale,
  };
}
