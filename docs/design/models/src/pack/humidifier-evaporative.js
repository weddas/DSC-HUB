// Evaporative wick-drum humidifier 320 × 220 × 360
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'humidifier_evap';
  const add = (m) => (g.add(m), m);
  const W = 0.32, D = 0.22;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: 0.12, r: 0.02, seg: 3 }), P.plastic_dark, 'hum_base'));
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: 0.24, r: 0.02, seg: 3 }).translate(0, 0.12, 0), P.plastic_white, 'hum_housing'));
  add(box(THREE, P.mesh_wire, 'hum_outlet_grille', [0.24, 0.002, 0.14], [0, 0.361, 0]));
  add(box(THREE, P.window_acrylic, 'hum_window', [0.002, 0.08, 0.12], [W / 2 + 0.001, 0.08, 0]));
  add(box(THREE, P.water, 'hum_water', [0.004, 0.001, 0.11], [W / 2 - 0.002, 0.04 + 0.08 * 0.6, 0]));
  add(cyl(THREE, P.plastic_dark, 'hum_dial', { r: 0.015, h: 0.008, seg: 16, axis: 'z', pos: [0.05, 0.3, D / 2 + 0.004] }));
  add(cyl(THREE, P.led_status, 'hum_status_led', { r: 0.002, h: 0.002, seg: 8, axis: 'z', pos: [-0.05, 0.3, D / 2 + 0.001] }));
  add(cyl(THREE, P.plastic_white, 'hum_wick_drum', { r: 0.09, h: 0.2, seg: 20, pos: [0, 0.2, 0] }));
  const bl = mesh(THREE, bladesGeo(THREE, 5, { rIn: 0.012, rOut: 0.08, chord: 0.04, pitch: 0.6 }), P.fan_blade, 'hum_fan_blades');
  bl.position.set(0, 0.33, 0); add(bl);
  add(cyl(THREE, P.cable_black, 'hum_cord', { r: 0.003, h: 0.06, seg: 8, axis: 'z', pos: [0.08, 0.04, -D / 2 - 0.03] }));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, 0.362, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.08, 0.04, -D / 2 - 0.06]));
  return g;
}
