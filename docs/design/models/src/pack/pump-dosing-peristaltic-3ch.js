// 3-channel peristaltic doser 170 × 110 × 80; heads on the +Z face
export const budget = { tris: 800 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'pump_dosing';
  const add = (m) => (g.add(m), m);
  const W = 0.17, D = 0.11, H = 0.08;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: H, r: 0.008, seg: 2 }), P.plastic_white, 'dosing_body'));
  const xs = [-0.055, 0, 0.055], yH = 0.045;
  xs.forEach((x, i) => {
    add(cyl(THREE, P.window_acrylic, `dosing_head_${i + 1}`, { r: 0.025, h: 0.012, seg: 14, open: true, axis: 'z', pos: [x, yH, D / 2 + 0.006] }));
    const rot = mesh(THREE, merge(THREE, [
      new THREE.CylinderGeometry(0.008, 0.008, 0.01, 8),
      ...[0, 1, 2].map((k) => tg(THREE, new THREE.CylinderGeometry(0.005, 0.005, 0.01, 5), { pos: [0.016 * Math.cos(k * 2.094), 0, 0.016 * Math.sin(k * 2.094)] })),
    ]).rotateX(Math.PI / 2), P.plastic_dark, `dosing_rotor_${i + 1}`);
    rot.position.set(x, yH, D / 2 + 0.006); add(rot);
    add(cyl(THREE, P.rubber_black, `dosing_tube_${2 * i + 1}`, { r: 0.002, h: 0.03, seg: 4, axis: 'z', pos: [x - 0.015, 0.012, D / 2 + 0.015] }));
    add(cyl(THREE, P.rubber_black, `dosing_tube_${2 * i + 2}`, { r: 0.002, h: 0.03, seg: 4, axis: 'z', pos: [x + 0.015, 0.012, D / 2 + 0.015] }));
  });
  add(box(THREE, P.screen_glass, 'dosing_display', [0.04, 0.001, 0.02], [-0.03, H + 0.0005, 0]));
  add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(0.005, 0.005, 0.002, 10).translate(0.02, H + 0.001, 0), new THREE.CylinderGeometry(0.005, 0.005, 0.002, 10).translate(0.04, H + 0.001, 0)]), P.plastic_white, 'dosing_buttons'));
  add(cyl(THREE, P.led_status, 'dosing_status_led', { r: 0.002, h: 0.001, seg: 8, pos: [0.06, H + 0.0005, 0] }));
  xs.forEach((x, i) => add(anchor(THREE, P.plastic_dark, `tube_out_${i + 1}`, [x + 0.015, 0.012, D / 2 + 0.03])));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.02, -D / 2]));
  return g;
}
