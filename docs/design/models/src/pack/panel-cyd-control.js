// Wall control panel (ESP32 CYD 3.5") — origin at the back face centre, y = 0 at the bottom edge
export const budget = { tris: 400 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'panel_cyd';
  const add = (m) => (g.add(m), m);
  const W = 0.1, H = 0.07, D = 0.025;
  add(box(THREE, P.plastic_dark, 'panel_enclosure', [W, H, D], [0, H / 2, D / 2]));
  add(box(THREE, P.screen_glass, 'panel_screen', [0.074, 0.049, 0.002], [0, H / 2, D + 0.001]));
  add(cyl(THREE, P.led_status, 'panel_status_led', { r: 0.0015, h: 0.002, seg: 8, axis: 'z', pos: [0.044, 0.008, D + 0.001] }));
  add(box(THREE, P.roller_silver, 'panel_usb', [0.009, 0.003, 0.004], [0, -0.002, D / 2]));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.014, 0.02, 0.004).translate(-0.057, H / 2, 0.002), new THREE.BoxGeometry(0.014, 0.02, 0.004).translate(0.057, H / 2, 0.002)]), P.plastic_dark, 'panel_ears'));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, H / 2, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, -0.004, D / 2]));
  return g;
}
