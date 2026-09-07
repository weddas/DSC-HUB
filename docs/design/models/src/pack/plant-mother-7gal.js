// 7-gal mother plant
import { fabricPot } from './pot-family.js';
import { fanGeo } from './_plant.js';
export const budget = { tris: 3000 };
export function build(THREE, P, L) {
  const { anchor, mesh, merge, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'plant_mother';
  const add = (m) => (g.add(m), m);
  const soilY = fabricPot(THREE, P, L, g, 0.18, 0.28);
  const top = soilY + 0.5;
  const stems = [rodGeo(THREE, [0, soilY, 0], [0, top, 0], 0.01, 8)];
  const tips = [];
  [0.12, 0.22, 0.32, 0.42].forEach((h, i) => {
    const a = i * 1.9, len = 0.3 - i * 0.03;
    const tip = [Math.cos(a) * len, soilY + h + 0.12, Math.sin(a) * len]; tips.push(tip);
    stems.push(rodGeo(THREE, [0, soilY + h, 0], tip, 0.006, 6));
  });
  add(mesh(THREE, merge(THREE, stems), P.leaf_green, 'plant_stem'));
  const leaves = [];
  tips.forEach((tip, i) => { for (let k = 0; k < 4; k++) { const f = (k + 1) / 4; leaves.push(...fanGeo(THREE, L, [tip[0] * f, soilY + 0.12 + i * 0.1 + 0.12 * f, tip[2] * f], 0.55, k * 1.6 + i)); } });
  for (let k = 0; k < 6; k++) leaves.push(...fanGeo(THREE, L, [0, soilY + 0.1 + k * 0.08, 0], 0.55, k * 2.1));
  add(mesh(THREE, merge(THREE, leaves), P.leaf_green, 'plant_leaves'));
  add(anchor(THREE, P.plastic_dark, 'probe_socket', [0.08, soilY, 0]));
  add(anchor(THREE, P.plastic_dark, 'canopy_top', [0, top + 0.06, 0]));
  tips.forEach((t, i) => add(anchor(THREE, P.plastic_dark, `cutting_${i + 1}`, t)));
  return g;
}
