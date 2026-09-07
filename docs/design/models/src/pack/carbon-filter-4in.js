// Carbon filter — origin at the flange face centre, axis +Z (body extends toward −Z)
export const budget = { tris: 800 };
export function build(THREE, P, L) {
  const { cyl, torus, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'carbon_filter_4in';
  const add = (m) => (g.add(m), m);
  const R = 0.1, Lb = 0.4, fl = 0.04;
  add(cyl(THREE, P.plastic_dark, 'filter_flange', { r: 0.051, h: fl, seg: 24, open: true, axis: 'z', pos: [0, 0, -fl / 2] }));
  // body tube + flange-end annulus
  const body = merge(THREE, [
    new THREE.CylinderGeometry(R, R, Lb - 0.04, 24, 1, true),
    tg(THREE, new THREE.RingGeometry(0.051, R, 24), { pos: [0, (Lb - 0.04) / 2, 0], rot: [-Math.PI / 2, 0, 0] }),
  ]);
  add(mesh(THREE, body, P.frame_steel, 'filter_body', [0, 0, -fl - Lb / 2], [Math.PI / 2, 0, 0]));
  add(cyl(THREE, P.plastic_white, 'filter_sleeve_1', { r: R + 0.001, h: 0.02, seg: 24, open: true, axis: 'z', pos: [0, 0, -fl - 0.01] }));
  add(cyl(THREE, P.plastic_white, 'filter_sleeve_2', { r: R + 0.001, h: 0.02, seg: 24, open: true, axis: 'z', pos: [0, 0, -fl - Lb + 0.01] }));
  add(cyl(THREE, P.frame_steel, 'filter_end_cap', { r: R, h: 0.012, seg: 24, axis: 'z', pos: [0, 0, -fl - Lb - 0.006] }));
  add(torus(THREE, P.roller_silver, 'filter_eyelet_1', { r: 0.01, tube: 0.003, seg: 12, tseg: 6, axis: 'x', pos: [0, R + 0.008, -0.1] }));
  add(torus(THREE, P.roller_silver, 'filter_eyelet_2', { r: 0.01, tube: 0.003, seg: 12, tseg: 6, axis: 'x', pos: [0, R + 0.008, -0.38] }));
  add(anchor(THREE, P.plastic_dark, 'duct_out', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'hang_1', [0, R + 0.018, -0.1]));
  add(anchor(THREE, P.plastic_dark, 'hang_2', [0, R + 0.018, -0.38]));
  return g;
}
