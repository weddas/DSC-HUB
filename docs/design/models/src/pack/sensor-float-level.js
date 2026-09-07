// Vertical float switch — origin at the bulkhead underside, stem hanging down
export const budget = { tris: 200 };
export function build(THREE, P, L) {
  const { cyl, torus, anchor, mesh } = L;
  const g = new THREE.Group(); g.name = 'sensor_float';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.plastic_dark, 'float_stem', { r: 0.005, h: 0.1, seg: 6, pos: [0, -0.05, 0] }));
  add(cyl(THREE, P.metal_brass, 'float_bulkhead', { r: 0.008, h: 0.02, seg: 8, pos: [0, 0.01, 0] }));
  add(cyl(THREE, P.metal_brass, 'float_nut', { r: 0.012, h: 0.006, seg: 6, pos: [0, 0.003, 0] }));
  const ring = mesh(THREE, new THREE.CylinderGeometry(0.015, 0.015, 0.025, 12), P.plastic_white, 'float_ring'); ring.position.set(0, -0.06, 0); add(ring);
  add(torus(THREE, P.plastic_dark, 'float_stop', { r: 0.006, tube: 0.002, seg: 8, tseg: 3, axis: 'y', pos: [0, -0.098, 0] }));
  add(cyl(THREE, P.cable_black, 'float_cable', { r: 0.001, h: 0.06, seg: 4, pos: [0, 0.05, 0] }));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.08, 0]));
  return g;
}
