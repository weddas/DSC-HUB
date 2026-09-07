// Compact 12 L dehumidifier 300 × 200 × 480
export const budget = { tris: 1500 };
export function build(THREE, P, L) {
  const { roundedBox, box, cyl, anchor, mesh, merge, tg, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'dehumidifier_compact';
  const add = (m) => (g.add(m), m);
  const W = 0.3, D = 0.2, H = 0.48;
  add(roundedBox(THREE, P.plastic_white, 'dehum_body', { w: W, d: D, h: H, r: 0.015, seg: 3 }));
  // top grille: recessed dark backing + 8 louvre slats
  const tg_ = [new THREE.BoxGeometry(0.22, 0.002, 0.12).translate(0, H + 0.0005, 0)];
  for (let i = 0; i < 8; i++) tg_.push(new THREE.BoxGeometry(0.2, 0.006, 0.006).translate(0, H + 0.004, -0.0525 + i * 0.015));
  add(mesh(THREE, merge(THREE, tg_), P.plastic_dark, 'dehum_top_grille'));
  // fan disc just under the top grille (child, vertical axis)
  const blades = mesh(THREE, bladesGeo(THREE, 6, { rIn: 0.012, rOut: 0.055, chord: 0.03, pitch: 0.6 }), P.fan_blade, 'dehum_fan_blades');
  blades.position.set(0, H - 0.02, 0); add(blades);
  // front intake grille above the tank: backing + horizontal ribs
  const fg = [new THREE.BoxGeometry(0.24, 0.1, 0.002).translate(0, 0.25, D / 2 + 0.001)];
  for (let i = 0; i < 6; i++) fg.push(new THREE.BoxGeometry(0.22, 0.005, 0.005).translate(0, 0.21 + i * 0.016, D / 2 + 0.003));
  add(mesh(THREE, merge(THREE, fg), P.plastic_dark, 'dehum_front_grille'));
  // water tank: bottom 160 mm of the front, sits 4 mm proud
  add(box(THREE, P.window_acrylic, 'dehum_tank', [0.27, 0.15, 0.05], [0, 0.085, D / 2 - 0.021]));
  add(box(THREE, P.water, 'dehum_tank_water', [0.26, 0.001, 0.046], [0, 0.01 + 0.15 * 0.4, D / 2 - 0.021]));
  // control panel top rear with 3 buttons, status LED
  const pn = [new THREE.BoxGeometry(0.1, 0.004, 0.03).translate(0, H + 0.002, -0.075)];
  for (let i = 0; i < 3; i++) pn.push(new THREE.CylinderGeometry(0.005, 0.005, 0.003, 10).translate(-0.02 + i * 0.02, H + 0.0055, -0.075));
  add(mesh(THREE, merge(THREE, pn), P.plastic_white, 'dehum_panel'));
  add(cyl(THREE, P.led_status, 'dehum_status_led', { r: 0.002, h: 0.002, seg: 8, pos: [0.04, H + 0.005, -0.075] }));
  add(cyl(THREE, P.plastic_dark, 'dehum_drain', { r: 0.006, h: 0.03, seg: 10, axis: 'z', pos: [0.08, 0.04, -D / 2 - 0.015] }));
  add(anchor(THREE, P.plastic_dark, 'intake_face', [0, 0.25, D / 2]));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, H, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [-0.08, 0.05, -D / 2]));
  return g;
}
