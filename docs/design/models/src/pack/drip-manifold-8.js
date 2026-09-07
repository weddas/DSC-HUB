// 8-port drip manifold with lines, emitters and stakes; origin at the hub centre on the floor
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { cyl, anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'drip_manifold';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.plastic_dark, 'drip_hub', { r: 0.03, h: 0.04, seg: 16, pos: [0, 0.02, 0] }));
  add(cyl(THREE, P.rubber_black, 'drip_inlet', { r: 0.0065, h: 0.04, seg: 8, axis: 'y', pos: [0, 0.06, 0] }));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, dx = Math.cos(a), dz = Math.sin(a);
    const p = (d, y) => [dx * d, y, dz * d];
    const tipBase = p(0.55, 0.003), stakeTop = p(0.6, 0.1);
    const line = [rodGeo(THREE, p(0.03, 0.02), p(0.08, 0.003), 0.003, 4), rodGeo(THREE, p(0.08, 0.003), tipBase, 0.003, 4),
      rodGeo(THREE, tipBase, stakeTop, 0.003, 4), rodGeo(THREE, stakeTop, p(0.63, 0.0), 0.004, 4),
      tg(THREE, new THREE.CylinderGeometry(0.006, 0.006, 0.02, 6), { pos: stakeTop })];
    add(mesh(THREE, merge(THREE, line), P.plastic_dark, `drip_line_${i + 1}`));
    add(mesh(THREE, merge(THREE, [rodGeo(THREE, p(0.08, 0.003), tipBase, 0.0015, 3), rodGeo(THREE, tipBase, stakeTop, 0.0015, 3)]), P.water, `drip_water_${i + 1}`));
    add(anchor(THREE, P.plastic_dark, `emitter_${i + 1}`, p(0.63, 0)));
  }
  add(anchor(THREE, P.plastic_dark, 'hose_in', [0, 0.08, 0]));
  return g;
}
