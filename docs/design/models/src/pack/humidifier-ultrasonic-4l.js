// Ultrasonic humidifier 180 × 180 × 320
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { roundedBox, box, cyl, anchor } = L;
  const g = new THREE.Group(); g.name = 'humidifier_ultrasonic';
  const add = (m) => (g.add(m), m);
  add(roundedBox(THREE, P.plastic_dark, 'hum_base', { w: 0.18, d: 0.18, h: 0.07, r: 0.02, seg: 3 }));
  add(cyl(THREE, P.plastic_dark, 'hum_dial', { r: 0.015, h: 0.008, seg: 16, axis: 'z', pos: [0.04, 0.035, 0.094] }));
  add(cyl(THREE, P.led_status, 'hum_status_led', { r: 0.002, h: 0.002, seg: 8, axis: 'z', pos: [-0.04, 0.035, 0.091] }));
  add(roundedBox(THREE, P.window_acrylic, 'hum_tank', { w: 0.17, d: 0.17, h: 0.22, r: 0.02, seg: 3, pos: [0, 0.07, 0] }));
  add(box(THREE, P.water, 'hum_tank_water', [0.16, 0.001, 0.16], [0, 0.07 + 0.22 * 0.3, 0]));
  add(cyl(THREE, P.plastic_white, 'hum_nozzle', { r: 0.0125, h: 0.03, seg: 16, pos: [0, 0.305, 0] }));
  add(cyl(THREE, P.window_acrylic, 'mist_plume', { rt: 0.01, rb: 0.03, h: 0.15, seg: 12, pos: [0, 0.32 + 0.075, 0] }));
  add(anchor(THREE, P.plastic_dark, 'mist_out', [0, 0.32, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.02, -0.09]));
  return g;
}
