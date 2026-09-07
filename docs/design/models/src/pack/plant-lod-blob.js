// Canopy proxy for far camera / phone still — origin at soil surface. Variants s | m | l = canopy Ø 0.25 / 0.45 / 0.65 m
export const variants = ['s', 'm', 'l'];
export const budget = () => ({ tris: 120 });
export function build(THREE, P, L, variant = 'm') {
  const { cyl, anchor, mesh, tg } = L;
  const g = new THREE.Group(); g.name = 'plant_lod';
  const d = { s: 0.25, m: 0.45, l: 0.65 }[variant], hB = d * 0.9, stem = 0.06;
  g.add(cyl(THREE, P.leaf_green, 'stem', { r: 0.008, h: stem, seg: 6, open: true, pos: [0, stem / 2, 0] }));
  g.add(mesh(THREE, tg(THREE, new THREE.SphereGeometry(1, 8, 6), { pos: [0, stem + hB / 2, 0], scale: [d / 2, hB / 2, d / 2] }), P.leaf_green, 'blob'));
  g.add(anchor(THREE, P.plastic_dark, 'canopy_top', [0, stem + hB, 0]));
  return g;
}
