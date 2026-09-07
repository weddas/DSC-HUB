// 500 × 1200 mm heat mat, same nodes as heat-mat-25x50
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { roundedBox, box, cyl, anchor } = L;
  const g = new THREE.Group(); g.name = 'heat_mat';
  const add = (m) => (g.add(m), m);
  add(roundedBox(THREE, P.plastic_dark, 'mat_base', { w: 0.5, d: 1.2, h: 0.005, r: 0.012, seg: 3 }));
  add(box(THREE, P.heat_element, 'heat_element', [0.47, 0.001, 1.17], [0, 0.0055, 0]));
  add(cyl(THREE, P.plastic_dark, 'mat_lead', { r: 0.0025, h: 0.3, seg: 8, axis: 'z', pos: [0, 0.0025, 0.75] }));
  add(cyl(THREE, P.plastic_white, 'mat_thermostat', { r: 0.0175, h: 0.012, seg: 16, axis: 'z', pos: [0, 0.0175, 0.77] }));
  add(anchor(THREE, P.plastic_dark, 'tray_1', [0, 0.006, -0.3]));
  add(anchor(THREE, P.plastic_dark, 'tray_2', [0, 0.006, 0.3]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.0025, 0.9]));
  return g;
}
