// Tubular ceramic heater Ø60 × 600 in a wire guard
export const budget = { tris: 500 };
export function build(THREE, P, L) {
  const { box, cyl, anchor } = L;
  const g = new THREE.Group(); g.name = 'heater_ceramic_tube';
  const add = (m) => (g.add(m), m);
  const yA = 0.05 + 0.045;
  add(cyl(THREE, P.heat_element, 'heat_element', { r: 0.03, h: 0.6, seg: 16, axis: 'x', pos: [0, yA, 0] }));
  add(cyl(THREE, P.mesh_wire, 'heater_guard', { r: 0.045, h: 0.62, seg: 16, open: true, axis: 'x', pos: [0, yA, 0] }));
  add(box(THREE, P.plastic_dark, 'heater_bracket_1', [0.02, 0.05, 0.06], [-0.3, 0.025, 0]));
  add(box(THREE, P.plastic_dark, 'heater_bracket_2', [0.02, 0.05, 0.06], [0.3, 0.025, 0]));
  add(cyl(THREE, P.cable_black, 'heater_cord', { r: 0.003, h: 0.08, seg: 8, axis: 'x', pos: [0.35, yA, 0] }));
  add(anchor(THREE, P.plastic_dark, 'mount_1', [-0.3, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'mount_2', [0.3, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.39, yA, 0]));
  return g;
}
