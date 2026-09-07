// Clone-tent mister: humidifier base, 6 mm riser, 3-head spray bar 200 mm wide
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { roundedBox, cyl, anchor } = L;
  const g = new THREE.Group(); g.name = 'mister_clone';
  const add = (m) => (g.add(m), m);
  add(roundedBox(THREE, P.plastic_dark, 'mister_base', { w: 0.18, d: 0.18, h: 0.07, r: 0.02, seg: 3 }));
  add(cyl(THREE, P.led_status, 'mister_status_led', { r: 0.002, h: 0.002, seg: 8, axis: 'z', pos: [-0.04, 0.035, 0.091] }));
  add(cyl(THREE, P.plastic_white, 'mister_tube', { r: 0.003, h: 0.4, seg: 8, pos: [0, 0.27, 0] }));
  add(cyl(THREE, P.plastic_white, 'mister_bar', { r: 0.006, h: 0.2, seg: 10, axis: 'x', pos: [0, 0.47, 0] }));
  [-0.08, 0, 0.08].forEach((x, i) => {
    add(cyl(THREE, P.window_acrylic, `mist_plume_${i + 1}`, { rt: 0.008, rb: 0.02, h: 0.1, seg: 10, pos: [x, 0.476 + 0.05, 0] }));
  });
  add(anchor(THREE, P.plastic_dark, 'mist_out', [0, 0.476, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.02, -0.09]));
  return g;
}
