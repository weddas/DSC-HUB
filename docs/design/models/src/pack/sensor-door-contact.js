// Magnetic door contact — origin at the sensor half's mounting face (back, z = 0), y = 0 bottom edge
export const budget = { tris: 100 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh } = L;
  const g = new THREE.Group(); g.name = 'sensor_door';
  const add = (m) => (g.add(m), m);
  add(box(THREE, P.plastic_white, 'door_sensor_half', [0.04, 0.015, 0.01], [0, 0.0075, 0.005]));
  add(cyl(THREE, P.led_status, 'door_status_led', { r: 0.001, h: 0.001, seg: 6, axis: 'z', pos: [0.015, 0.0075, 0.0105] }));
  const mag = mesh(THREE, new THREE.BoxGeometry(0.03, 0.01, 0.01).translate(0.015, 0.005, 0.005), P.plastic_white, 'door_magnet_half');
  mag.position.set(0.025, 0, 0); add(mag);
  add(anchor(THREE, P.plastic_dark, 'mount_fixed', [0, 0.0075, 0]));
  add(anchor(THREE, P.plastic_dark, 'mount_moving', [0.04, 0.005, 0]));
  return g;
}
