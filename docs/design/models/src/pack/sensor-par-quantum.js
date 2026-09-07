// Quantum PAR sensor on a levelling plate — origin at plate underside centre
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'sensor_par';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.plastic_dark, 'par_plate', { r: 0.03, h: 0.004, seg: 16, pos: [0, 0.002, 0] }));
  add(cyl(THREE, P.plastic_dark, 'par_puck', { r: 0.012, h: 0.033, seg: 12, pos: [0, 0.004 + 0.0165, 0] }));
  add(mesh(THREE, new THREE.SphereGeometry(0.006, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2).translate(0, 0.037, 0), P.plastic_white, 'par_diffuser'));
  add(mesh(THREE, merge(THREE, [0, 1, 2].map((k) => new THREE.CylinderGeometry(0.003, 0.003, 0.008, 5).translate(0.024 * Math.cos(k * 2.094), 0.008, 0.024 * Math.sin(k * 2.094)))), P.roller_silver, 'par_screws'));
  add(cyl(THREE, P.glass_clear, 'par_bubble', { r: 0.003, h: 0.002, seg: 6, pos: [0.02, 0.005, -0.012] }));
  add(cyl(THREE, P.cable_black, 'par_cable', { r: 0.0015, h: 0.15, seg: 4, axis: 'x', pos: [-0.105, 0.002, 0] }));
  add(anchor(THREE, P.plastic_dark, 'canopy_point', [0, 0.043, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [-0.18, 0.002, 0]));
  return g;
}
