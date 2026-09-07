// DSC hub (ESP32 CYD) — origin at the back face centre, y = 0 at the bottom edge
export const budget = { tris: 700 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'hub_esp32_cyd';
  const add = (m) => (g.add(m), m);
  const W = 0.12, H = 0.09, D = 0.03;
  add(box(THREE, P.plastic_dark, 'hub_enclosure', [W, H, D], [0, H / 2, D / 2]));
  add(box(THREE, P.screen_glass, 'hub_screen', [0.07, 0.052, 0.002], [-0.012, 0.05, D + 0.001]));
  add(cyl(THREE, P.led_status, 'hub_status_led', { r: 0.0015, h: 0.002, seg: 8, axis: 'z', pos: [0.042, 0.07, D + 0.001] }));
  for (let i = 0; i < 4; i++) add(cyl(THREE, P.led_status, `hub_link_led_${i + 1}`, { r: 0.0025, h: 0.002, seg: 8, axis: 'z', pos: [-0.03 + i * 0.02, 0.012, D + 0.001] }));
  add(mesh(THREE, merge(THREE, [
    new THREE.CylinderGeometry(0.006, 0.006, 0.015, 10).translate(0.05, H + 0.0075, D / 2),
    new THREE.CylinderGeometry(0.004, 0.004, 0.08, 8).translate(0.05, H + 0.015 + 0.04, D / 2),
  ]), P.cable_black, 'hub_antenna'));
  add(cyl(THREE, P.plastic_dark, 'hub_gland_1', { r: 0.006, h: 0.012, seg: 10, pos: [-0.03, -0.006, D / 2] }));
  add(cyl(THREE, P.plastic_dark, 'hub_gland_2', { r: 0.006, h: 0.012, seg: 10, pos: [0.03, -0.006, D / 2] }));
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(0.015, 0.02, 0.004).translate(-0.065, H / 2, -0.002),
    new THREE.BoxGeometry(0.015, 0.02, 0.004).translate(0.065, H / 2, -0.002),
  ]), P.plastic_dark, 'hub_ears'));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, H / 2, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_1', [-0.03, -0.012, D / 2]));
  add(anchor(THREE, P.plastic_dark, 'cable_2', [0.03, -0.012, D / 2]));
  return g;
}
