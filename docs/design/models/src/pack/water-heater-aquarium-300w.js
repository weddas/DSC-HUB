// Submersible aquarium heater Ø30 × 300 — origin at the tube bottom (hangs tip-down)
export const budget = { tris: 200 };
export function build(THREE, P, L) {
  const { cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'water_heater';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.glass_clear, 'heater_tube', { r: 0.015, h: 0.26, seg: 8, pos: [0, 0.13, 0] }));
  add(cyl(THREE, P.heat_element, 'heat_element', { r: 0.01, h: 0.22, seg: 5, pos: [0, 0.13, 0] }));
  add(cyl(THREE, P.plastic_dark, 'heater_cap', { r: 0.016, h: 0.04, seg: 8, pos: [0, 0.28, 0] }));
  add(cyl(THREE, P.plastic_dark, 'heater_dial', { r: 0.012, h: 0.008, seg: 8, pos: [0, 0.304, 0] }));
  add(cyl(THREE, P.led_status, 'heater_status_led', { r: 0.0015, h: 0.001, seg: 4, axis: 'z', pos: [0, 0.27, 0.016] }));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.008, 0.12, 0.02).translate(0, 0.2, -0.02), new THREE.CylinderGeometry(0.012, 0.006, 0.006, 5).rotateX(Math.PI / 2).translate(0, 0.16, -0.032), new THREE.CylinderGeometry(0.012, 0.006, 0.006, 5).rotateX(Math.PI / 2).translate(0, 0.24, -0.032)]), P.plastic_dark, 'heater_clip'));
  add(cyl(THREE, P.cable_black, 'heater_cable', { r: 0.0015, h: 0.06, seg: 4, pos: [0, 0.34, 0] }));
  add(anchor(THREE, P.plastic_dark, 'socket', [0, 0.3, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.37, 0]));
  return g;
}
