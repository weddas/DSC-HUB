// 1/10 HP water chiller 340 × 280 × 360; intake grille on +Z
export const budget = { tris: 1000 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, merge, tg, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'water_chiller';
  const add = (m) => (g.add(m), m);
  const W = 0.34, D = 0.28, H = 0.34, f = 0.02;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: H, r: 0.015, seg: 3 }).translate(0, f, 0), P.plastic_white, 'chiller_body'));
  add(mesh(THREE, merge(THREE, [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => new THREE.CylinderGeometry(0.015, 0.015, f, 10).translate(sx * 0.14, f / 2, sz * 0.11))), P.plastic_dark, 'chiller_feet'));
  add(box(THREE, P.mesh_wire, 'chiller_grille', [0.2, 0.16, 0.002], [0, f + 0.16, D / 2 + 0.001]));
  const bl = mesh(THREE, bladesGeo(THREE, 5, { rIn: 0.012, rOut: 0.07, chord: 0.04, pitch: 0.6 }), P.fan_blade, 'chiller_fan_blades');
  bl.rotation.x = Math.PI / 2; bl.position.set(0, f + 0.16, D / 2 - 0.03); add(bl);
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.16, 0.004, 0.08).translate(0, f + H + 0.002, -0.05), new THREE.CylinderGeometry(0.006, 0.006, 0.003, 10).translate(0.04, f + H + 0.0055, -0.03), new THREE.CylinderGeometry(0.006, 0.006, 0.003, 10).translate(0.06, f + H + 0.0055, -0.03)]), P.plastic_white, 'chiller_panel'));
  add(box(THREE, P.screen_glass, 'chiller_display', [0.05, 0.001, 0.02], [-0.04, f + H + 0.0045, -0.05]));
  add(cyl(THREE, P.led_status, 'chiller_status_led', { r: 0.002, h: 0.001, seg: 8, pos: [0.06, f + H + 0.0045, -0.07] }));
  add(cyl(THREE, P.plastic_dark, 'chiller_barb_in', { r: 0.0065, h: 0.03, seg: 10, axis: 'z', pos: [-0.06, f + 0.08, -D / 2 - 0.015] }));
  add(cyl(THREE, P.plastic_dark, 'chiller_barb_out', { r: 0.0065, h: 0.03, seg: 10, axis: 'z', pos: [0.06, f + 0.08, -D / 2 - 0.015] }));
  const lv = []; for (let i = 0; i < 8; i++) lv.push(tg(THREE, new THREE.BoxGeometry(0.004, 0.003, 0.18), { pos: [W / 2 + 0.004, f + 0.1 + i * 0.02, 0], rot: [0, 0, 0.5] }));
  add(mesh(THREE, merge(THREE, lv), P.plastic_dark, 'chiller_louvres'));
  add(cyl(THREE, P.cable_black, 'chiller_cord', { r: 0.003, h: 0.05, seg: 6, axis: 'z', pos: [0.12, f + 0.03, -D / 2 - 0.025] }));
  add(anchor(THREE, P.plastic_dark, 'hose_in', [-0.06, f + 0.08, -D / 2 - 0.03]));
  add(anchor(THREE, P.plastic_dark, 'hose_out', [0.06, f + 0.08, -D / 2 - 0.03]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.12, f + 0.03, -D / 2 - 0.05]));
  return g;
}
