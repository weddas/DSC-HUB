// Dual-outlet air pump 120 × 80 × 60; outlets on +X end
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'air_pump';
  const add = (m) => (g.add(m), m);
  add(mesh(THREE, roundedBoxGeo(THREE, { w: 0.12, d: 0.08, h: 0.052, r: 0.012, seg: 1 }).translate(0, 0.008, 0), P.plastic_dark, 'pump_body'));
  add(mesh(THREE, merge(THREE, [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => new THREE.CylinderGeometry(0.006, 0.006, 0.008, 6).translate(sx * 0.045, 0.004, sz * 0.028))), P.rubber_black, 'pump_feet'));
  add(cyl(THREE, P.plastic_white, 'pump_outlet_1', { r: 0.003, h: 0.012, seg: 8, axis: 'x', pos: [0.066, 0.035, 0.015] }));
  add(cyl(THREE, P.plastic_white, 'pump_outlet_2', { r: 0.003, h: 0.012, seg: 8, axis: 'x', pos: [0.066, 0.035, -0.015] }));
  add(cyl(THREE, P.plastic_dark, 'pump_dial', { r: 0.012, h: 0.006, seg: 12, pos: [0, 0.063, 0] }));
  add(cyl(THREE, P.led_status, 'pump_status_led', { r: 0.0015, h: 0.001, seg: 6, pos: [0.03, 0.0605, 0.02] }));
  add(cyl(THREE, P.cable_black, 'pump_cord', { r: 0.0025, h: 0.05, seg: 6, axis: 'x', pos: [-0.085, 0.02, 0] }));
  add(anchor(THREE, P.plastic_dark, 'air_out_1', [0.072, 0.035, 0.015]));
  add(anchor(THREE, P.plastic_dark, 'air_out_2', [0.072, 0.035, -0.015]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [-0.11, 0.02, 0]));
  return g;
}
