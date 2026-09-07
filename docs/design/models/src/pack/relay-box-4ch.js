// 4-channel relay enclosure 150 × 90 × 60 — origin at back face centre, y = 0 bottom edge; front is +Z
export const budget = { tris: 500 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'relay_box_4ch';
  const add = (m) => (g.add(m), m);
  const W = 0.15, H = 0.09, D = 0.06;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(W, H, 0.003).translate(0, H / 2, 0.0015),
    new THREE.BoxGeometry(W, 0.003, D).translate(0, 0.0015, D / 2), new THREE.BoxGeometry(W, 0.003, D).translate(0, H - 0.0015, D / 2),
    new THREE.BoxGeometry(0.003, H, D).translate(-W / 2 + 0.0015, H / 2, D / 2), new THREE.BoxGeometry(0.003, H, D).translate(W / 2 - 0.0015, H / 2, D / 2),
  ]), P.plastic_dark, 'relay_enclosure'));
  add(box(THREE, P.window_acrylic, 'relay_lid', [W, H, 0.003], [0, H / 2, D + 0.0015]));
  const mods = []; for (let i = 0; i < 4; i++) mods.push(new THREE.BoxGeometry(0.02, 0.03, 0.015).translate(-0.05 + i * 0.026, 0.03, 0.02));
  add(mesh(THREE, merge(THREE, mods), P.plastic_white, 'relay_modules'));
  for (let i = 0; i < 4; i++) add(cyl(THREE, P.led_status, `relay_led_${i + 1}`, { r: 0.0015, h: 0.001, seg: 6, axis: 'z', pos: [-0.05 + i * 0.026, 0.05, 0.0275] }));
  add(box(THREE, P.plastic_dark, 'relay_board', [0.05, 0.03, 0.002], [0.04, 0.06, 0.012]));
  add(cyl(THREE, P.led_status, 'hub_status_led', { r: 0.0015, h: 0.001, seg: 6, axis: 'z', pos: [0.05, 0.07, 0.0135] }));
  add(cyl(THREE, P.cable_black, 'relay_antenna', { r: 0.002, h: 0.03, seg: 6, pos: [0.06, H + 0.015, D / 2] }));
  const gl = []; for (let i = 0; i < 6; i++) gl.push(new THREE.CylinderGeometry(0.005, 0.005, 0.01, 8).translate(-0.0625 + i * 0.025, -0.005, D / 2));
  add(mesh(THREE, merge(THREE, gl), P.plastic_dark, 'relay_glands'));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.012, 0.02, 0.003).translate(-W / 2 - 0.006, H / 2, -0.0015), new THREE.BoxGeometry(0.012, 0.02, 0.003).translate(W / 2 + 0.006, H / 2, -0.0015)]), P.plastic_dark, 'relay_ears'));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, H / 2, 0]));
  for (let i = 0; i < 6; i++) add(anchor(THREE, P.plastic_dark, `cable_${i + 1}`, [-0.0625 + i * 0.025, -0.01, D / 2]));
  return g;
}
