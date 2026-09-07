// Chrome wire rack 900 × 450 × 1800, four shelves
export const budget = { tris: 1500 };
export function build(THREE, P, L) {
  const { cyl, anchor, mesh, merge, plateGeo } = L;
  const g = new THREE.Group(); g.name = 'rack_wire_4tier';
  const add = (m) => (g.add(m), m);
  const W = 0.9, D = 0.45, H = 1.8, px = W / 2 - 0.02, pz = D / 2 - 0.02;
  [[-px, -pz], [px, -pz], [px, pz], [-px, pz]].forEach(([x, z], i) => {
    add(cyl(THREE, P.roller_silver, `rack_post_${i + 1}`, { r: 0.0125, h: H - 0.02, seg: 12, pos: [x, 0.02 + (H - 0.02) / 2, z] }));
    add(cyl(THREE, P.roller_silver, `rack_foot_${i + 1}`, { r: 0.018, h: 0.02, seg: 12, pos: [x, 0.01, z] }));
  });
  [0.15, 0.65, 1.15, 1.65].forEach((y, i) => {
    const rim = plateGeo(THREE, { w: W, h: D, depth: 0.03, hole: [0, 0, W - 0.06, D - 0.06] }).rotateX(-Math.PI / 2).translate(0, y - 0.015, 0);
    add(mesh(THREE, rim, P.roller_silver, `rack_shelf_${i + 1}_rim`));
    add(mesh(THREE, new THREE.PlaneGeometry(W - 0.06, D - 0.06).rotateX(-Math.PI / 2).translate(0, y - 0.001, 0), P.mesh_wire, `rack_shelf_${i + 1}`));
    add(anchor(THREE, P.plastic_dark, `shelf_${i + 1}`, [0, y, 0]));
    if (i > 0) add(anchor(THREE, P.plastic_dark, `lamp_under_${i + 1}`, [0, y - 0.03, 0]));
  });
  return g;
}
