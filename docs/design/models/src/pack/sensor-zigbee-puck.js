// Zigbee canopy T/RH puck — origin at the cable loop (y = 0), disc hangs below
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'sensor_zigbee_puck';
  const add = (m) => (g.add(m), m);
  const top = -0.12, h = 0.014, r = 0.0225;
  const prof = [[0, top - h], [r, top - h], [r, top - 0.01], [r - 0.002, top - 0.01], [r - 0.002, top - 0.004], [r, top - 0.004], [r, top], [0, top]];
  add(mesh(THREE, new THREE.LatheGeometry(prof.map(([a, b]) => new THREE.Vector2(a, b)), 14), P.plastic_white, 'puck_body'));
  add(cyl(THREE, P.led_status, 'puck_led', { r: 0.001, h: 0.001, seg: 6, pos: [0.01, top + 0.0005, 0] }));
  add(mesh(THREE, merge(THREE, [
    new THREE.CylinderGeometry(0.0005, 0.0005, 0.12, 5).translate(0, top / 2, 0),
    tg(THREE, new THREE.TorusGeometry(0.004, 0.0005, 3, 8), { pos: [0, -0.004, 0] }),
  ]), P.cable_black, 'puck_cable'));
  add(anchor(THREE, P.plastic_dark, 'hang_point', [0, 0, 0]));
  return g;
}
