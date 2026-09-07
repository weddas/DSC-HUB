// Flood table 1.20 × 0.60 × 0.18 on a 0.75 m stand
export const budget = { tris: 1000 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'flood_table';
  const add = (m) => (g.add(m), m);
  const W = 1.2, D = 0.6, Ht = 0.18, yS = 0.75, t = 0.006;
  const tray = merge(THREE, [
    new THREE.BoxGeometry(W, t, D).translate(0, yS + t / 2, 0),
    new THREE.BoxGeometry(W, Ht, t).translate(0, yS + Ht / 2, D / 2 - t / 2), new THREE.BoxGeometry(W, Ht, t).translate(0, yS + Ht / 2, -D / 2 + t / 2),
    new THREE.BoxGeometry(t, Ht, D - 2 * t).translate(W / 2 - t / 2, yS + Ht / 2, 0), new THREE.BoxGeometry(t, Ht, D - 2 * t).translate(-W / 2 + t / 2, yS + Ht / 2, 0),
  ]);
  add(mesh(THREE, tray, P.plastic_white, 'table_tray'));
  const ribs = []; for (let i = 0; i < 8; i++) ribs.push(new THREE.BoxGeometry(W - 0.04, 0.008, 0.02).translate(0, yS + t + 0.004, -0.245 + i * 0.07));
  add(mesh(THREE, merge(THREE, ribs), P.plastic_white, 'table_ribs'));
  add(cyl(THREE, P.plastic_dark, 'table_fill', { r: 0.012, h: 0.04, seg: 10, pos: [W / 2 - 0.08, yS + 0.02, -D / 2 + 0.08] }));
  add(cyl(THREE, P.plastic_dark, 'table_overflow', { r: 0.01, h: 0.12, seg: 10, pos: [W / 2 - 0.08, yS + 0.06, D / 2 - 0.08] }));
  add(box(THREE, P.water, 'table_water', [W - 2 * t - 0.002, 0.001, D - 2 * t - 0.002], [0, yS + 0.02, 0]));
  const sx = W / 2 - 0.05, sz = D / 2 - 0.05, r = 0.0125, legs = [];
  [[-sx, -sz], [sx, -sz], [sx, sz], [-sx, sz]].forEach(([x, z]) => legs.push(new THREE.BoxGeometry(0.025, yS, 0.025).translate(x, yS / 2, z)));
  for (const y of [0.15, yS - 0.02]) legs.push(new THREE.BoxGeometry(2 * sx, 0.025, 0.025).translate(0, y, -sz), new THREE.BoxGeometry(2 * sx, 0.025, 0.025).translate(0, y, sz), new THREE.BoxGeometry(0.025, 0.025, 2 * sz).translate(-sx, y, 0), new THREE.BoxGeometry(0.025, 0.025, 2 * sz).translate(sx, y, 0));
  legs.push(rodGeo(THREE, [-sx, 0.15, -sz], [-sx, yS - 0.02, sz], r, 6), rodGeo(THREE, [sx, 0.15, sz], [sx, yS - 0.02, -sz], r, 6));
  add(mesh(THREE, merge(THREE, legs), P.frame_steel, 'table_stand'));
  add(anchor(THREE, P.plastic_dark, 'hose_in', [W / 2 - 0.08, yS + 0.04, -D / 2 + 0.08]));
  add(anchor(THREE, P.plastic_dark, 'drain_out', [W / 2 - 0.08, yS + 0.12, D / 2 - 0.08]));
  let n = 1; for (const z of [-0.19, 0.19]) for (const x of [-0.38, 0, 0.38]) add(anchor(THREE, P.plastic_dark, `pot_${n++}`, [x, yS + t, z]));
  return g;
}
