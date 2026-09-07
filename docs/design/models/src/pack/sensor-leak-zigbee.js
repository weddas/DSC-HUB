// Zigbee leak sensor 50 × 50 × 18, two contact pins underneath
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'sensor_leak_zigbee';
  const add = (m) => (g.add(m), m);
  add(mesh(THREE, roundedBoxGeo(THREE, { w: 0.05, d: 0.05, h: 0.018, r: 0.008, seg: 3 }).translate(0, 0.006, 0), P.plastic_white, 'leak_body'));
  add(cyl(THREE, P.led_status, 'leak_led', { r: 0.002, h: 0.001, seg: 8, pos: [0, 0.0245, 0] }));
  add(mesh(THREE, merge(THREE, [
    new THREE.CylinderGeometry(0.003, 0.003, 0.006, 8).translate(-0.01, 0.003, 0),
    new THREE.CylinderGeometry(0.003, 0.003, 0.006, 8).translate(0.01, 0.003, 0),
  ]), P.roller_silver, 'leak_pins'));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0.006, 0]));
  return g;
}
