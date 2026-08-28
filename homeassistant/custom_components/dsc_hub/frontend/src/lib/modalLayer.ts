/**
 * Nested Escape ownership for DecisionLayer / SlideDrawer / overlays.
 * Only the topmost registered layer may handle Escape.
 */
let depth = 0;

export function pushModalLayer(): number {
  depth += 1;
  return depth;
}

export function popModalLayer(layerId: number): void {
  if (layerId <= 0) return;
  if (depth === layerId) {
    depth -= 1;
    return;
  }
  // Out-of-order unmount (parent closed first) — clamp to the closed id.
  if (layerId < depth) depth = layerId - 1;
  if (depth < 0) depth = 0;
}

export function isTopModalLayer(layerId: number): boolean {
  return layerId > 0 && layerId === depth;
}
