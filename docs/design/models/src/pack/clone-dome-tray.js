// 1020 propagation tray with 50-cell insert and 7" humidity dome
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'clone_dome_tray';
  const add = (m) => (g.add(m), m);
  const W = 0.54, D = 0.28, H = 0.06, t = 0.004;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(W - 0.02, t, D - 0.02).translate(0, t / 2, 0),
    ...[0, 1].map((k) => new THREE.BoxGeometry(W, H, t).translate(0, H / 2, (k ? 1 : -1) * (D / 2 - t / 2))),
    ...[0, 1].map((k) => new THREE.BoxGeometry(t, H, D - 2 * t).translate((k ? 1 : -1) * (W / 2 - t / 2), H / 2, 0)),
    new THREE.BoxGeometry(W + 0.02, 0.004, 0.01).translate(0, H - 0.002, D / 2 + 0.005), new THREE.BoxGeometry(W + 0.02, 0.004, 0.01).translate(0, H - 0.002, -D / 2 - 0.005),
  ]), P.plastic_dark, 'tray_base'));
  // cell insert: one slab with a 5 × 10 grid of raised cell rims (tops only)
  const cells = [new THREE.BoxGeometry(W - 0.03, 0.002, D - 0.03).translate(0, H - 0.01, 0)];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 10; c++) cells.push(new THREE.BoxGeometry(0.043, 0.004, 0.043).translate(-0.2475 + c * 0.055, H - 0.008, -0.11 + r * 0.055));
  add(mesh(THREE, merge(THREE, cells), P.plastic_dark, 'cell_insert'));
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W - 0.005, d: D - 0.005, h: 0.18, r: 0.03, seg: 3 }).translate(0, H, 0), P.window_acrylic, 'dome_shell'));
  add(cyl(THREE, P.plastic_white, 'dome_vent_1', { r: 0.02, h: 0.003, seg: 16, pos: [-0.15, H + 0.1815, 0] }));
  add(cyl(THREE, P.plastic_white, 'dome_vent_2', { r: 0.02, h: 0.003, seg: 16, pos: [0.15, H + 0.1815, 0] }));
  const sp = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
    const x = -0.2475 + c * 0.055, z = -0.11 + r * 0.055, y = H - 0.006;
    sp.push(new THREE.CylinderGeometry(0.0015, 0.0015, 0.02, 4).translate(x, y + 0.01, z));
    sp.push(tg(THREE, new THREE.PlaneGeometry(0.025, 0.012), { pos: [x + 0.012, y + 0.02, z], rot: [-Math.PI / 2 + 0.3, 0, 0] }));
    sp.push(tg(THREE, new THREE.PlaneGeometry(0.025, 0.012), { pos: [x - 0.012, y + 0.02, z], rot: [-Math.PI / 2 - 0.3, 0, 0] }));
  }
  add(mesh(THREE, merge(THREE, sp), P.leaf_green, 'sprouts'));
  add(anchor(THREE, P.plastic_dark, 'mat_under', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'lamp_over', [0, H + 0.18 + 0.3, 0]));
  add(anchor(THREE, P.plastic_dark, 'sensor_in', [0, H + 0.1, -D / 2 + 0.03]));
  return g;
}
