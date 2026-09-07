// Fan speed controller 80 × 60 × 50 — origin at back face centre, y = 0 bottom edge; front is +Z
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'controller_fan_speed';
  const add = (m) => (g.add(m), m);
  const W = 0.08, H = 0.06, D = 0.05;
  add(box(THREE, P.plastic_dark, 'ctrl_body', [W, H, D], [0, H / 2, D / 2]));
  add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(0.02, 0.02, 0.01, 20).rotateX(Math.PI / 2).translate(0, 0, 0.005), new THREE.BoxGeometry(0.003, 0.012, 0.002).translate(0, 0.013, 0.011)]), P.plastic_dark, 'ctrl_knob', [0, 0.022, D]));
  add(box(THREE, P.screen_glass, 'ctrl_display', [0.03, 0.012, 0.001], [0, 0.05, D + 0.0005]));
  add(cyl(THREE, P.led_status, 'ctrl_status_led', { r: 0.0015, h: 0.001, seg: 6, axis: 'z', pos: [0.025, 0.05, D + 0.0005] }));
  add(cyl(THREE, P.cable_black, 'ctrl_cord', { r: 0.003, h: 0.04, seg: 6, axis: 'z', pos: [-0.02, 0.015, -0.02] }));
  add(box(THREE, P.plastic_white, 'ctrl_socket', [0.02, 0.015, 0.006], [0.02, 0.015, -0.003]));
  add(box(THREE, P.plastic_dark, 'ctrl_tab', [0.015, 0.012, 0.002], [0, H + 0.006, 0.001]));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, H / 2, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_in', [-0.02, 0.015, -0.04]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.02, 0.015, -0.006]));
  return g;
}
