// Window AC 500 × 400 × 350; front is +Z
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge, tg, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'ac_window_unit';
  const add = (m) => (g.add(m), m);
  const W = 0.5, D = 0.4, H = 0.35;
  add(box(THREE, P.frame_steel, 'ac_body', [W, H, D - 0.03], [0, H / 2, -0.015]));
  add(box(THREE, P.plastic_white, 'ac_fascia', [W, H, 0.03], [0, H / 2, D / 2 - 0.015]));
  add(box(THREE, P.plastic_dark, 'ac_outlet_recess', [0.3, 0.2, 0.002], [-0.06, 0.21, D / 2 + 0.001]));
  const vg = [];
  for (let i = 0; i < 12; i++) vg.push(tg(THREE, new THREE.BoxGeometry(0.29, 0.003, 0.015), { pos: [0, -0.09 + i * 0.0164, 0], rot: [0.5, 0, 0] }));
  const vanes = mesh(THREE, merge(THREE, vg), P.plastic_dark, 'ac_vanes'); vanes.position.set(-0.06, 0.21, D / 2 + 0.006); add(vanes);
  const bl = mesh(THREE, bladesGeo(THREE, 5, { rIn: 0.012, rOut: 0.085, chord: 0.04, pitch: 0.6 }), P.fan_blade, 'ac_fan_blades');
  bl.rotation.x = Math.PI / 2; bl.position.set(-0.06, 0.21, D / 2 - 0.05); add(bl);
  const ig = [new THREE.BoxGeometry(0.002, 0.2, 0.06).translate(0, 0, 0)];
  for (let i = 0; i < 5; i++) ig.push(new THREE.BoxGeometry(0.004, 0.19, 0.005).translate(0.002, 0, -0.025 + i * 0.0125));
  add(mesh(THREE, merge(THREE, ig), P.plastic_dark, 'ac_intake_grille', [W / 2 + 0.001, 0.18, 0.1]));
  add(cyl(THREE, P.plastic_dark, 'ac_dial_1', { r: 0.015, h: 0.01, seg: 16, axis: 'z', pos: [0.17, 0.26, D / 2 + 0.005] }));
  add(cyl(THREE, P.plastic_dark, 'ac_dial_2', { r: 0.015, h: 0.01, seg: 16, axis: 'z', pos: [0.17, 0.2, D / 2 + 0.005] }));
  add(box(THREE, P.screen_glass, 'ac_display', [0.05, 0.02, 0.001], [0.17, 0.13, D / 2 + 0.0005]));
  add(cyl(THREE, P.led_status, 'ac_status_led', { r: 0.002, h: 0.001, seg: 8, axis: 'z', pos: [0.17, 0.1, D / 2 + 0.0005] }));
  const accordion = (name, sx) => {
    const ribs = [new THREE.BoxGeometry(0.15, H - 0.02, 0.006)];
    for (let i = 0; i < 6; i++) ribs.push(new THREE.BoxGeometry(0.006, H - 0.03, 0.004).translate(-0.06 + i * 0.024, 0, 0.005));
    add(mesh(THREE, merge(THREE, ribs), P.plastic_white, name, [sx * (W / 2 + 0.075), H / 2, D / 2 - 0.05]));
  };
  accordion('ac_side_panel_left', -1); accordion('ac_side_panel_right', 1);
  add(box(THREE, P.mesh_wire, 'ac_rear_grille', [W - 0.04, H - 0.04, 0.002], [0, H / 2, -D / 2 - 0.001]));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [-0.06, 0.21, D / 2]));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.2, 0.03, D / 2]));
  return g;
}
