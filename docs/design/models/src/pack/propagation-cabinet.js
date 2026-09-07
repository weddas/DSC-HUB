// Propagation cabinet 600 × 400 × 900; door hinged on the left edge (child)
export const budget = { tris: 1500 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge, plateGeo } = L;
  const g = new THREE.Group(); g.name = 'propagation_cabinet';
  const add = (m) => (g.add(m), m);
  const W = 0.6, D = 0.4, H = 0.87, f = 0.03, t = 0.015;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(W, t, D).translate(0, f + t / 2, 0), new THREE.BoxGeometry(W, t, D).translate(0, f + H - t / 2, 0),
    new THREE.BoxGeometry(W, H - 2 * t, t).translate(0, f + H / 2, -D / 2 + t / 2),
    new THREE.BoxGeometry(t, H - 2 * t, D - t).translate(-W / 2 + t / 2, f + H / 2, t / 2), new THREE.BoxGeometry(t, H - 2 * t, D - t).translate(W / 2 - t / 2, f + H / 2, t / 2),
  ]), P.plastic_white, 'cab_body'));
  const door = new THREE.Group(); door.name = 'cab_door'; door.position.set(-W / 2, f, D / 2); add(door);
  door.add(mesh(THREE, plateGeo(THREE, { w: W, h: H, depth: t, hole: [0, 0.05, 0.3, 0.5] }).translate(W / 2, H / 2, t / 2), P.plastic_white, 'cab_door_leaf'));
  door.add(box(THREE, P.window_acrylic, 'cab_window', [0.3, 0.5, 0.003], [W / 2, H / 2 + 0.05, t / 2]));
  [0.3, 0.6].forEach((y, i) => {
    add(mesh(THREE, merge(THREE, [plateGeo(THREE, { w: W - 2 * t, h: D - t, depth: 0.02, hole: [0, 0, W - 2 * t - 0.04, D - t - 0.04] }).rotateX(-Math.PI / 2).translate(0, f + y - 0.01, t / 2),
      new THREE.PlaneGeometry(W - 2 * t - 0.04, D - t - 0.04).rotateX(-Math.PI / 2).translate(0, f + y - 0.001, t / 2)]), P.mesh_wire, `cab_shelf_${i + 1}`));
    add(anchor(THREE, P.plastic_dark, `shelf_${i + 1}`, [0, f + y, t / 2]));
  });
  add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16).translate(0, f + H + 0.01, -0.12), new THREE.CircleGeometry(0.028, 16).rotateX(-Math.PI / 2).translate(0, f + H + 0.021, -0.12)]), P.mesh_wire, 'cab_vent'));
  add(cyl(THREE, P.plastic_dark, 'cab_cable_port', { r: 0.02, h: 0.02, seg: 12, axis: 'z', pos: [0.2, f + 0.08, -D / 2] }));
  add(mesh(THREE, merge(THREE, [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => new THREE.CylinderGeometry(0.015, 0.015, f, 10).translate(sx * (W / 2 - 0.04), f / 2, sz * (D / 2 - 0.04)))), P.plastic_dark, 'cab_feet'));
  add(anchor(THREE, P.plastic_dark, 'lamp_under_top', [0, f + H - t, t / 2]));
  add(anchor(THREE, P.plastic_dark, 'lamp_under_2', [0, f + 0.6 - 0.02, t / 2]));
  add(anchor(THREE, P.plastic_dark, 'fan_exhaust', [0, f + H + 0.02, -0.12]));
  add(anchor(THREE, P.plastic_dark, 'cable_1', [0.2, f + 0.08, -D / 2 - 0.01]));
  add(anchor(THREE, P.plastic_dark, 'tray_1', [0, f + 0.3, t / 2]));
  return g;
}
