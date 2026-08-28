/**
 * Nested Escape ownership for DecisionLayer / SlideDrawer / HelpTip.
 * Opaque tokens (not depth-as-id) so out-of-order unmount cannot orphan higher layers.
 */
const stack: symbol[] = [];

export function pushModalLayer(): symbol {
  const token = Symbol("modal-layer");
  stack.push(token);
  return token;
}

export function popModalLayer(token: symbol): void {
  const i = stack.lastIndexOf(token);
  if (i >= 0) stack.splice(i, 1);
}

export function isTopModalLayer(token: symbol): boolean {
  return stack.length > 0 && stack[stack.length - 1] === token;
}
