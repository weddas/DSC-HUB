// Shared stylised plants: five-finger leaf fans on a stem. Adds plant_stem + plant_leaves to `g`; returns canopy top y.
export function fanGeo(THREE, L, [x, y, z], scale, rotY) {
  const { tg } = L; const parts = [];
  for (let i = 0; i < 5; i++) {
    const q = tg(THREE, new THREE.PlaneGeometry(0.022 * scale, 0.11 * scale), { pos: [0, 0.055 * scale, 0], rot: [-0.35, 0, 0] });
    tg(THREE, q, { rot: [0, 0, (i - 2) * 0.55] });
    tg(THREE, q, { rot: [Math.PI / 2 - 0.4, rotY, 0] });
    q.translate(x, y, z); parts.push(q);
  }
  return parts;
}
export function vegPlant(THREE, P, L, g, baseY, h, opts = {}) {
  const { mesh, merge, rodGeo } = L;
  const top = baseY + h, stemR = opts.stemR ?? 0.006;
  const branchTips = opts.branchTips ?? [[0.09, baseY + h * 0.68, 0.03], [-0.08, baseY + h * 0.57, -0.05]];
  const stems = [rodGeo(THREE, [0, baseY, 0], [0, top, 0], stemR, 6)];
  branchTips.forEach((tip, i) => stems.push(rodGeo(THREE, [0, baseY + h * 0.3 + i * 0.03, 0], tip, stemR * 0.66, 6)));
  const m = mesh(THREE, merge(THREE, stems), P.leaf_green, 'plant_stem'); g.add(m);
  const leaves = [];
  const nodes = opts.nodes ?? [[0, baseY + h * 0.34, 0], [0, baseY + h * 0.57, 0], [0, baseY + h * 0.8, 0], [0, top, 0], ...branchTips, [0.045, baseY + h * 0.5, 0.015]];
  nodes.forEach((p, i) => leaves.push(...fanGeo(THREE, L, p, (opts.leafScale ?? 1) * (0.9 + (i % 3) * 0.15), i * 1.3)));
  g.add(mesh(THREE, merge(THREE, leaves), P.leaf_green, 'plant_leaves'));
  return top;
}
