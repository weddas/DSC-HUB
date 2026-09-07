// Generic AU smart plug — origin at the back (pins) face centre, y = 0 at the bottom
export const budget = { tris: 400 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'plug_smart_au';
  const add = (m) => (g.add(m), m);
  const W = 0.055, H = 0.075, D = 0.035;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: H, r: 0.012, seg: 3 }).translate(0, 0, D / 2), P.plastic_white, 'plug_body'));
  const slot = (x, y, rz) => tg(THREE, new THREE.BoxGeometry(0.003, 0.012, 0.001), { pos: [x, y, D + 0.0005], rot: [0, 0, rz] });
  add(mesh(THREE, merge(THREE, [slot(-0.009, 0.048, -0.52), slot(0.009, 0.048, 0.52), slot(0, 0.03, 0)]), P.plastic_dark, 'plug_socket_face'));
  add(cyl(THREE, P.plastic_white, 'plug_button', { r: 0.006, h: 0.002, seg: 12, axis: 'z', pos: [0, 0.012, D + 0.001] }));
  add(cyl(THREE, P.led_status, 'plug_status_led', { r: 0.0015, h: 0.002, seg: 8, axis: 'z', pos: [0.012, 0.012, D + 0.001] }));
  const pin = (x, y, rz) => tg(THREE, new THREE.BoxGeometry(0.0065, 0.0015, 0.015), { pos: [x, y, -0.0075], rot: [0, 0, rz] });
  add(mesh(THREE, merge(THREE, [pin(-0.009, 0.048, -0.52), pin(0.009, 0.048, 0.52), pin(0, 0.03, Math.PI / 2)]), P.plastic_dark, 'plug_pins'));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, H / 2, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.04, D]));
  return g;
}
