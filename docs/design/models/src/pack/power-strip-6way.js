// 6-way power strip 300 × 60 × 40, sockets on the top face
export const budget = { tris: 400 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'power_strip';
  const add = (m) => (g.add(m), m);
  const W = 0.3, D = 0.06, H = 0.04;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: H, r: 0.006, seg: 1 }), P.plastic_white, 'strip_body'));
  for (let i = 0; i < 6; i++) {
    const x = -0.1125 + i * 0.045;
    const slot = (dx, dz, ry) => tg(THREE, new THREE.BoxGeometry(0.003, 0.0005, 0.01), { pos: [x + dx, H + 0.00025, dz], rot: [0, ry, 0] });
    add(mesh(THREE, merge(THREE, [slot(-0.008, 0.008, -0.52), slot(0.008, 0.008, 0.52), slot(0, -0.008, Math.PI / 2)]), P.plastic_dark, `strip_socket_${i + 1}`));
    add(cyl(THREE, P.led_status, `outlet_led_${i + 1}`, { r: 0.001, h: 0.001, seg: 4, pos: [x + 0.018, H + 0.0005, -0.02] }));
    add(anchor(THREE, P.plastic_dark, `plug_${i + 1}`, [x, H, 0]));
  }
  add(box(THREE, P.led_status, 'strip_switch', [0.015, 0.003, 0.025], [0.14, H + 0.0015, 0]));
  add(cyl(THREE, P.cable_black, 'strip_cord', { r: 0.003, h: 0.06, seg: 5, axis: 'x', pos: [-W / 2 - 0.03, H / 2, 0] }));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [-W / 2 - 0.06, H / 2, 0]));
  return g;
}
