import { useSyncExternalStore } from "react";
import * as THREE from "three";

/**
 * Anchor registry — where every placed model published its anchors in *world* space.
 *
 * Models load asynchronously and children snap to their parent's anchors, so the scene
 * is a small dependency graph: a `Placed` registers `<instanceId>` → { anchor → world
 * position } once it has settled, and anything waiting on that instance re-renders.
 * Positions are stored as plain objects so the store snapshot is stable and cheap.
 */

export interface AnchorSet {
  /** World-space anchor positions, plus `<anchor>__min` / `__max` for prefix anchors. */
  pos: Map<string, THREE.Vector3>;
  /** World transform of the instance root (for orientation-aware snapping). */
  matrix: THREE.Matrix4;
  /** World bounding box of the instance. */
  bounds: THREE.Box3;
}

const sets = new Map<string, AnchorSet>();
const listeners = new Set<() => void>();
let version = 0;
let scheduled = false;

/**
 * Notify once per tick, not once per registration: a Suspense reveal re-runs every placed
 * model's layout effect in one commit, and a synchronous notification from each would be
 * dozens of nested updates — React's "maximum update depth" trip.
 */
function emit() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    version += 1;
    for (const l of listeners) l();
  });
}

function sameSet(a: AnchorSet, b: AnchorSet): boolean {
  if (!a.matrix.equals(b.matrix)) return false;
  if (a.pos.size !== b.pos.size) return false;
  for (const [k, v] of a.pos) {
    const w = b.pos.get(k);
    if (!w || w.distanceToSquared(v) > 1e-10) return false;
  }
  return true;
}

/** Publish an instance's anchors. A re-registration with identical geometry is silent, so a re-render never fans out. */
export function registerAnchors(id: string, set: AnchorSet): void {
  const prev = sets.get(id);
  if (prev && sameSet(prev, set)) return; // keep the old object so dependants' memos hold
  sets.set(id, set);
  emit();
}

export function unregisterAnchors(id: string): void {
  if (sets.delete(id)) emit();
}

export function getAnchorSet(id: string): AnchorSet | undefined {
  return sets.get(id);
}

export function getAnchor(id: string, anchor: string): THREE.Vector3 | undefined {
  return sets.get(id)?.pos.get(anchor);
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Re-renders when any anchor set changes; returns the registry version to key memos on. */
export function useAnchorVersion(): number {
  return useSyncExternalStore(subscribe, () => version, () => version);
}

/**
 * World position of `anchor` on instance `id`, or null until that instance has settled.
 * Falls back to the instance root when `anchor` is "" — useful for "stand next to".
 */
export function useAnchor(id: string | null | undefined, anchor: string): THREE.Vector3 | null {
  const v = useAnchorVersion();
  void v;
  if (!id) return null;
  const set = sets.get(id);
  if (!set) return null;
  if (anchor === "") return new THREE.Vector3().setFromMatrixPosition(set.matrix);
  return set.pos.get(anchor) ?? null;
}

export function useAnchorSet(id: string | null | undefined): AnchorSet | null {
  const v = useAnchorVersion();
  void v;
  return id ? sets.get(id) ?? null : null;
}

/** Reset — tests and the stage unmount. */
export function clearAnchors(): void {
  sets.clear();
  emit();
}
