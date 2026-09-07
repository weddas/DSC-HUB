// Submersible pump 90 × 70 × 80 with impeller behind the +Z grille
export const budget = { tris: 400 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'pump_submersible';
  const add = (m) => (g.add(m), m);
  const W = 0.09, D = 0.07, H = 0.08, f = 0.01;
  // body: open on the +Z face (grille side), other 5 faces
  const body = merge(THREE, [
    new THREE.BoxGeometry(W, H, 0.003).translate(0, f + H / 2, -D / 2 + 0.0015),
    new THREE.BoxGeometry(W, 0.003, D).translate(0, f + 0.0015, 0),
    new THREE.BoxGeometry(W, 0.003, D).translate(0, f + H - 0.0015, 0),
    new THREE.BoxGeometry(0.003, H, D).translate(-W / 2 + 0.0015, f + H / 2, 0),
    new THREE.BoxGeometry(0.003, H, D).translate(W / 2 - 0.0015, f + H / 2, 0),
  ]);
  add(mesh(THREE, body, P.plastic_dark, 'pump_body'));
  const ribs = [];
  for (let i = 0; i < 7; i++) ribs.push(new THREE.BoxGeometry(0.004, H, 0.003).translate(-0.036 + i * 0.012, f + H / 2, D / 2 - 0.0015));
  add(mesh(THREE, merge(THREE, ribs), P.plastic_dark, 'pump_grille'));
  const imp = mesh(THREE, bladesGeo(THREE, 6, { rIn: 0.006, rOut: 0.028, chord: 0.02, pitch: 0.5 }), P.fan_blade, 'pump_impeller');
  imp.position.set(0, f + H / 2, 0.01); add(imp);
  add(cyl(THREE, P.roller_silver, 'pump_barb', { r: 0.0065, h: 0.02, seg: 10, pos: [0, f + H + 0.01, 0] }));
  add(mesh(THREE, merge(THREE, [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) =>
    new THREE.CylinderGeometry(0.008, 0.01, f, 10).translate(sx * 0.03, f / 2, sz * 0.02))), P.plastic_dark, 'pump_feet'));
  add(anchor(THREE, P.plastic_dark, 'hose_out', [0, f + H + 0.02, 0]));
  return g;
}
