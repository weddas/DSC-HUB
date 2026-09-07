// 30 L dehumidifier 360 × 270 × 520
export const budget = { tris: 1800 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, merge, tg, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'dehumidifier_30l';
  const add = (m) => (g.add(m), m);
  const W = 0.36, D = 0.27, H = 0.52, cH = 0.04;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: H - cH, r: 0.02, seg: 3 }).translate(0, cH, 0), P.plastic_white, 'dehum_body'));
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sz], i) =>
    add(cyl(THREE, P.plastic_dark, `dehum_castor_${i + 1}`, { r: 0.02, h: 0.015, seg: 12, axis: 'x', pos: [sx * 0.14, 0.02, sz * 0.1] })));
  // top outlet vanes: child pivoting on its long (x) axis
  const vanes = new THREE.Group(); vanes.name = 'dehum_vanes_pivot';
  const vg = [];
  for (let i = 0; i < 10; i++) vg.push(tg(THREE, new THREE.BoxGeometry(0.24, 0.003, 0.014), { pos: [0, 0, -0.07 + i * 0.0155], rot: [0.6, 0, 0] }));
  const vm = mesh(THREE, merge(THREE, vg), P.plastic_dark, 'dehum_vanes'); vm.position.set(0, H + 0.004, 0.0); add(vm);
  add(box(THREE, P.plastic_dark, 'dehum_outlet_recess', [0.26, 0.002, 0.16], [0, H + 0.001, 0]));
  const bl = mesh(THREE, bladesGeo(THREE, 7, { rIn: 0.012, rOut: 0.07, chord: 0.035, pitch: 0.6 }), P.fan_blade, 'dehum_fan_blades');
  bl.position.set(0, H - 0.03, 0); add(bl);
  const rg = [new THREE.BoxGeometry(0.3, 0.42, 0.002).translate(0, 0.29, -D / 2 - 0.001)];
  for (let i = 0; i < 9; i++) rg.push(new THREE.BoxGeometry(0.006, 0.4, 0.005).translate(-0.13 + i * 0.0325, 0.29, -D / 2 - 0.003));
  add(mesh(THREE, merge(THREE, rg), P.plastic_dark, 'dehum_rear_grille'));
  add(box(THREE, P.window_acrylic, 'dehum_tank', [0.32, 0.18, 0.06], [0, cH + 0.09, D / 2 - 0.026]));
  add(box(THREE, P.water, 'dehum_tank_water', [0.31, 0.001, 0.056], [0, cH + 0.09, D / 2 - 0.026]));
  const pn = [new THREE.BoxGeometry(0.2, 0.004, 0.05).translate(0, H + 0.002, -0.09)];
  for (let i = 0; i < 5; i++) pn.push(new THREE.CylinderGeometry(0.005, 0.005, 0.003, 10).translate(-0.03 + i * 0.018, H + 0.0055, -0.1));
  add(mesh(THREE, merge(THREE, pn), P.plastic_white, 'dehum_panel'));
  add(box(THREE, P.screen_glass, 'dehum_display', [0.04, 0.001, 0.02], [-0.07, H + 0.0045, -0.09]));
  add(cyl(THREE, P.led_status, 'dehum_status_led', { r: 0.002, h: 0.002, seg: 8, pos: [0.07, H + 0.005, -0.09] }));
  add(cyl(THREE, P.plastic_dark, 'dehum_drain_barb', { r: 0.0065, h: 0.03, seg: 10, axis: 'z', pos: [0.1, 0.08, -D / 2 - 0.015] }));
  add(anchor(THREE, P.plastic_dark, 'intake_face', [0, 0.29, -D / 2]));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, H, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [-0.1, 0.08, -D / 2]));
  add(anchor(THREE, P.plastic_dark, 'drain_out', [0.1, 0.08, -D / 2 - 0.03]));
  return g;
}
