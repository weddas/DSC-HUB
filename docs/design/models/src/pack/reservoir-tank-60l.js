// 60 L HDPE reservoir 500 × 400 × 350 with hinged lid and water plane at 70 %
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { plateGeo, box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'reservoir_tank_60l';
  const add = (m) => (g.add(m), m);
  const W = 0.5, D = 0.4, H = 0.35, t = 0.005;
  // open tub: floor + 4 walls + a 20 mm rim, one mesh
  const tub = merge(THREE, [
    new THREE.BoxGeometry(W, t, D).translate(0, t / 2, 0),
    new THREE.BoxGeometry(W, H - t, t).translate(0, (H + t) / 2, D / 2 - t / 2),
    new THREE.BoxGeometry(W, H - t, t).translate(0, (H + t) / 2, -D / 2 + t / 2),
    new THREE.BoxGeometry(t, H - t, D - 2 * t).translate(W / 2 - t / 2, (H + t) / 2, 0),
    new THREE.BoxGeometry(t, H - t, D - 2 * t).translate(-W / 2 + t / 2, (H + t) / 2, 0),
    plateGeo(THREE, { w: W + 0.04, h: D + 0.04, depth: 0.008, hole: [0, 0, W - 2 * t, D - 2 * t] }).rotateX(-Math.PI / 2).translate(0, H - 0.004, 0),
  ]);
  add(mesh(THREE, tub, P.plastic_dark, 'tank_body'));
  // lid: pivot on the back edge (hinge), closed
  const lid = mesh(THREE, new THREE.BoxGeometry(W + 0.04, 0.01, D + 0.04).translate(0, 0.005, (D + 0.04) / 2), P.plastic_dark, 'tank_lid');
  lid.position.set(0, H, -(D + 0.04) / 2); add(lid);
  add(box(THREE, P.water, 'tank_water', [W - 2 * t - 0.002, 0.001, D - 2 * t - 0.002], [0, H * 0.7, 0]));
  add(cyl(THREE, P.plastic_dark, 'tank_outlet', { r: 0.012, h: 0.04, seg: 12, axis: 'x', pos: [W / 2 + 0.02, 0.05, 0] }));
  add(cyl(THREE, P.plastic_white, 'tank_probe_ph', { r: 0.0075, h: 0.12, seg: 10, pos: [-0.03, H - 0.06, 0.1] }));
  add(cyl(THREE, P.plastic_white, 'tank_probe_ec', { r: 0.0075, h: 0.12, seg: 10, pos: [0.03, H - 0.06, 0.1] }));
  add(anchor(THREE, P.plastic_dark, 'hose_out', [W / 2 + 0.04, 0.05, 0]));
  add(anchor(THREE, P.plastic_dark, 'pump_socket', [0, t, 0]));
  return g;
}
