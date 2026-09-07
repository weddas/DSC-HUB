// 1000 L IBC tote 1.20 × 1.00 × 1.16
export const budget = { tris: 1500 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, merge, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'reservoir_ibc';
  const add = (m) => (g.add(m), m);
  const pW = 1.2, pD = 1.0, pH = 0.15, bW = 1.15, bD = 0.95, bH = 1.0;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(pW, 0.03, pD).translate(0, pH - 0.015, 0),
    ...[-0.5, 0, 0.5].map((x) => new THREE.BoxGeometry(0.1, pH - 0.03, pD).translate(x, (pH - 0.03) / 2, 0)),
  ]), P.plastic_dark, 'ibc_pallet'));
  add(mesh(THREE, roundedBoxGeo(THREE, { w: bW, d: bD, h: bH, r: 0.08, seg: 3 }).translate(0, pH, 0), P.window_acrylic, 'ibc_bottle'));
  add(box(THREE, P.water, 'ibc_water', [bW - 0.02, 0.001, bD - 0.02], [0, pH + bH * 0.6, 0]));
  // cage: 4 corner tubes + 3 horizontal rings per face (i.e. 3 rectangular rings) + top ring
  const cx = pW / 2 - 0.01, cz = pD / 2 - 0.01, r = 0.01, cage = [];
  [[-cx, -cz], [cx, -cz], [cx, cz], [-cx, cz]].forEach(([x, z]) => cage.push(rodGeo(THREE, [x, pH, z], [x, pH + bH + 0.02, z], r, 8)));
  for (const y of [pH + 0.25, pH + 0.5, pH + 0.75, pH + bH + 0.02]) {
    cage.push(rodGeo(THREE, [-cx, y, -cz], [cx, y, -cz], r, 6), rodGeo(THREE, [-cx, y, cz], [cx, y, cz], r, 6), rodGeo(THREE, [-cx, y, -cz], [-cx, y, cz], r, 6), rodGeo(THREE, [cx, y, -cz], [cx, y, cz], r, 6));
  }
  add(mesh(THREE, merge(THREE, cage), P.frame_steel, 'ibc_cage'));
  add(cyl(THREE, P.plastic_white, 'ibc_cap', { r: 0.075, h: 0.03, seg: 20, pos: [0, pH + bH + 0.015, 0] }));
  add(mesh(THREE, merge(THREE, [
    new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12).rotateX(Math.PI / 2).translate(0, pH + 0.06, bD / 2 + 0.04),
    new THREE.BoxGeometry(0.08, 0.06, 0.06).translate(0, pH + 0.06, bD / 2 + 0.06),
  ]), P.plastic_dark, 'ibc_valve'));
  add(box(THREE, P.plastic_dark, 'ibc_valve_lever', [0.015, 0.1, 0.02], [0, pH + 0.13, bD / 2 + 0.06]));
  add(anchor(THREE, P.plastic_dark, 'hose_out', [0, pH + 0.06, bD / 2 + 0.09]));
  add(anchor(THREE, P.plastic_dark, 'pump_socket', [0, pH + 0.01, 0]));
  add(anchor(THREE, P.plastic_dark, 'probe_socket', [0, pH + bH + 0.03, 0]));
  add(anchor(THREE, P.plastic_dark, 'fill_in', [0, pH + bH + 0.03, 0]));
  return g;
}
