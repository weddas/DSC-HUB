// Sonoff S31 smart plug — origin at the back (pins) face centre, y = 0 at the bottom
export const budget = { tris: 400 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'plug_sonoff';
  const add = (m) => (g.add(m), m);
  const W = 0.06, H = 0.08, D = 0.04;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: H, r: 0.008, seg: 3 }).translate(0, 0, D / 2), P.plastic_white, 'plug_body'));
  // AU socket: two slots at ±30°, vertical earth slot
  const slot = (x, y, rz) => tg(THREE, new THREE.BoxGeometry(0.003, 0.012, 0.001), { pos: [x, y, D + 0.0005], rot: [0, 0, rz] });
  add(mesh(THREE, merge(THREE, [slot(-0.009, 0.05, -0.52), slot(0.009, 0.05, 0.52), slot(0, 0.032, 0)]), P.plastic_dark, 'plug_socket_face'));
  add(cyl(THREE, P.plastic_white, 'plug_button', { r: 0.005, h: 0.002, seg: 12, pos: [0.012, H + 0.001, D / 2] }));
  add(cyl(THREE, P.led_status, 'plug_status_led', { r: 0.0015, h: 0.002, seg: 8, pos: [-0.012, H + 0.001, D / 2] }));
  const pin = (x, y, rz) => tg(THREE, new THREE.BoxGeometry(0.0065, 0.0015, 0.015), { pos: [x, y, -0.0075], rot: [0, 0, rz] });
  add(mesh(THREE, merge(THREE, [pin(-0.009, 0.05, -0.52), pin(0.009, 0.05, 0.52), pin(0, 0.032, Math.PI / 2)]), P.plastic_dark, 'plug_pins'));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, H / 2, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, H / 2, D]));
  return g;
}
