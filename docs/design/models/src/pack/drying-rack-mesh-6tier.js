// Hanging 6-tier mesh drying rack Ø600 × 1200 — origin at the hook
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'drying_rack';
  const add = (m) => (g.add(m), m);
  const R = 0.3, top = -0.1;
  add(mesh(THREE, merge(THREE, [tg(THREE, new THREE.TorusGeometry(0.02, 0.003, 4, 10, Math.PI), { pos: [0, -0.02, 0] }), tg(THREE, new THREE.TorusGeometry(0.02, 0.003, 4, 10, Math.PI), { pos: [0, -0.06, 0], rot: [0, 0, Math.PI] })]), P.roller_silver, 'rack_hook'));
  add(mesh(THREE, new THREE.TorusGeometry(0.04, 0.003, 4, 16).rotateX(Math.PI / 2).translate(0, top, 0), P.roller_silver, 'rack_top_ring'));
  const straps = [];
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4, x = Math.cos(a), z = Math.sin(a); straps.push(rodGeo(THREE, [x * 0.04, top, z * 0.04], [x * (R - 0.02), top - 0.2, z * (R - 0.02)], 0.004, 4), rodGeo(THREE, [x * (R - 0.02), top - 0.2, z * (R - 0.02)], [x * (R - 0.02), top - 1.2, z * (R - 0.02)], 0.004, 4)); }
  add(mesh(THREE, merge(THREE, straps), P.cable_black, 'rack_straps'));
  for (let i = 0; i < 6; i++) {
    const y = top - 0.2 - i * 0.2;
    add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(R, R, 0.02, 24, 1, true).translate(0, y + 0.01, 0), new THREE.CircleGeometry(R - 0.001, 24).rotateX(-Math.PI / 2).translate(0, y, 0)]), P.mesh_wire, `rack_tier_${i + 1}`));
    if (i < 3) { const b = new THREE.CylinderGeometry(R - 0.05, R - 0.07, 0.015, 16); add(mesh(THREE, b.translate(0, y + 0.0075, 0), P.trim_green, `rack_buds_${i + 1}`)); }
    add(anchor(THREE, P.plastic_dark, `tier_${i + 1}`, [0, y, 0]));
  }
  add(anchor(THREE, P.plastic_dark, 'hang_point', [0, 0, 0]));
  return g;
}
