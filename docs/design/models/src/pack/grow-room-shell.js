// Grow room shell — placeholder 3.6 × 2.4 × 2.4 m, no front wall (+Z open)
export const budget = { tris: 1500 };
export function build(THREE, P, L) {
  const { plate, box, cyl, anchor, mesh } = L;
  const g = new THREE.Group(); g.name = 'grow_room_shell';
  const add = (m) => (g.add(m), m);
  const W = 3.6, D = 2.4, H = 2.4, t = 0.02;
  add(box(THREE, P.tray_pvc, 'room_floor', [W + 2 * t, t, D + 2 * t], [0, -t / 2, 0]));
  add(box(THREE, P.shell_black, 'room_ceiling', [W + 2 * t, t, D + 2 * t], [0, H + t / 2, 0]));
  add(box(THREE, P.shell_black, 'room_wall_back', [W + 2 * t, H, t], [0, H / 2, -D / 2 - t / 2]));
  // left wall (faces +X inward) with the 900 × 600 window at 1.5 m
  const winZ = 0, winY = 1.5;
  add(plate(THREE, P.shell_black, 'room_wall_left', { w: D, h: H, depth: t, hole: [-winZ, winY - H / 2, 0.9, 0.6], pos: [-W / 2 - t / 2, H / 2, 0], rot: [0, Math.PI / 2, 0] }));
  add(box(THREE, P.window_acrylic, 'window_pane', [0.006, 0.6, 0.9], [-W / 2 - t / 2, winY, winZ]));
  add(plate(THREE, P.frame_steel, 'window_frame', { w: 0.96, h: 0.66, depth: t + 0.02, hole: [0, 0, 0.9, 0.6], pos: [-W / 2 - t / 2, winY, winZ], rot: [0, Math.PI / 2, 0] }));
  // right wall (faces −X inward) with the 820 × 2040 door opening near the front
  const dW = 0.82, dH = 2.04, dZ = D / 2 - 0.15 - dW / 2;
  add(plate(THREE, P.shell_black, 'room_wall_right', { w: D, h: H, depth: t, hole: [dZ, dH / 2 - H / 2, dW, dH], pos: [W / 2 + t / 2, H / 2, 0], rot: [0, -Math.PI / 2, 0] }));
  add(plate(THREE, P.frame_steel, 'door_frame', { w: dW + 0.08, h: dH + 0.04, depth: t + 0.02, hole: [0, -0.02, dW, dH], pos: [W / 2 + t / 2, dH / 2 + 0.02, dZ], rot: [0, -Math.PI / 2, 0] }));
  // door leaf: pivot on the hinge (back edge), closed
  const leaf = mesh(THREE, new THREE.BoxGeometry(0.04, dH, dW).translate(0, dH / 2, dW / 2), P.plastic_white, 'door_leaf');
  leaf.position.set(W / 2 + t / 2, 0, dZ - dW / 2); add(leaf);
  // exhaust port high on the back wall
  const port = [1.2, 2.0, -D / 2];
  add(cyl(THREE, P.trim_green, 'vent_port_wall_sleeve', { r: 0.076, h: 0.08, seg: 24, open: true, axis: 'z', pos: [port[0], port[1], port[2] + 0.02] }));
  add(box(THREE, P.plastic_white, 'outlet_plate', [0.115, 0.07, 0.01], [-1.0, 0.3, -D / 2 + 0.005]));
  const A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
  A('tent_4x8', [0, 0, -D / 2 + 0.2 + 0.6]); A('tent_2x4', [-1.2, 0, 0.5]);
  A('fan_exhaust_room', port); A('dehum_spot', [1.4, 0, -0.5]); A('ac_spot', [1.4, 0, 0.3]);
  A('tank_spot', [-1.5, 0, -0.9]); A('hub_mount', [-1.0, 1.5, -D / 2]);
  return g;
}
