// Portable 9000 BTU AC 440 × 380 × 720 on castors, exhaust hose stub at the back
export const budget = { tris: 2000 };
export function build(THREE, P, L) {
  const { roundedBox, box, cyl, anchor, mesh, merge, tg, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'ac_portable';
  const add = (m) => (g.add(m), m);
  const W = 0.44, D = 0.38, H = 0.72, cH = 0.05;
  add(roundedBox(THREE, P.plastic_white, 'ac_body', { w: W, d: D, h: H - cH, r: 0.03, seg: 3, pos: [0, cH, 0] }));
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sz], i) =>
    add(cyl(THREE, P.plastic_dark, `ac_castor_${i + 1}`, { r: 0.025, h: 0.02, seg: 12, axis: 'x', pos: [sx * 0.17, 0.025, sz * 0.14] })));
  // outlet: dark backing + 6 horizontal vanes on the front-top
  const vy = 0.62, zf = D / 2;
  const vanes = [new THREE.BoxGeometry(0.3, 0.1, 0.002).translate(0, vy, zf + 0.001)];
  for (let i = 0; i < 6; i++) vanes.push(tg(THREE, new THREE.BoxGeometry(0.29, 0.004, 0.02), { pos: [0, vy - 0.04 + i * 0.016, zf + 0.008], rot: [0.5, 0, 0] }));
  add(mesh(THREE, merge(THREE, vanes), P.plastic_dark, 'ac_outlet_vanes'));
  const blades = mesh(THREE, bladesGeo(THREE, 6, { rIn: 0.015, rOut: 0.048, chord: 0.03, pitch: 0.6 }), P.fan_blade, 'ac_fan_blades');
  blades.rotation.x = Math.PI / 2; blades.position.set(0, vy, zf - 0.03); add(blades);
  // rear intake grille: backing + 10 vertical ribs
  const rg = [new THREE.BoxGeometry(0.34, 0.4, 0.002).translate(0, 0.32, -zf - 0.001)];
  for (let i = 0; i < 10; i++) rg.push(new THREE.BoxGeometry(0.006, 0.38, 0.005).translate(-0.15 + i * 0.0333, 0.32, -zf - 0.003));
  add(mesh(THREE, merge(THREE, rg), P.plastic_dark, 'ac_rear_grille'));
  // top panel with display, 4 buttons, status LED
  const pn = [new THREE.BoxGeometry(0.3, 0.006, 0.12).translate(0, H + 0.003, 0.05)];
  for (let i = 0; i < 4; i++) pn.push(new THREE.CylinderGeometry(0.007, 0.007, 0.003, 12).translate(0.06 + i * 0.022, H + 0.0075, 0.05));
  add(mesh(THREE, merge(THREE, pn), P.plastic_white, 'ac_panel'));
  add(box(THREE, P.screen_glass, 'ac_display', [0.08, 0.002, 0.04], [-0.07, H + 0.007, 0.05]));
  add(cyl(THREE, P.led_status, 'ac_status_led', { r: 0.0025, h: 0.002, seg: 8, pos: [0, H + 0.007, 0.05] }));
  // exhaust hose stub: 150 mm dia, 200 mm long, 5 ribs, high on the back
  const hz = -zf, hy = 0.6, hL = 0.2, hr = 0.075;
  const hose = [tg(THREE, new THREE.CylinderGeometry(hr - 0.002, hr - 0.002, hL, 20, 1, true), { pos: [0, hy, hz - hL / 2], rot: [Math.PI / 2, 0, 0] })];
  for (let i = 0; i < 5; i++) hose.push(tg(THREE, new THREE.TorusGeometry(hr, 0.005, 4, 16), { pos: [0, hy, hz - 0.02 - i * 0.04] }));
  add(mesh(THREE, merge(THREE, hose), P.duct_foil, 'ac_hose_stub'));
  add(cyl(THREE, P.plastic_dark, 'ac_drain', { r: 0.008, h: 0.02, seg: 10, axis: 'z', pos: [0.12, 0.1, hz - 0.01] }));
  add(anchor(THREE, P.plastic_dark, 'duct_out', [0, hy, hz - hL]));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, vy, zf]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [-0.12, 0.1, hz]));
  return g;
}
