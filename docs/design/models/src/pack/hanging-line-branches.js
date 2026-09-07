// Drying line with six hung branches — origin at the left hook
import { fanGeo } from './_plant.js';
export const budget = { tris: 1500 };
export function build(THREE, P, L) {
  const { anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'hanging_line';
  const add = (m) => (g.add(m), m);
  const Lc = 1.2, yC = -0.04;
  add(mesh(THREE, rodGeo(THREE, [0, yC, 0], [Lc, yC, 0], 0.0015, 4), P.cable_black, 'line_cord'));
  const hook = (name, x) => add(mesh(THREE, merge(THREE, [tg(THREE, new THREE.TorusGeometry(0.01, 0.002, 4, 10, Math.PI), { pos: [x, -0.01, 0] }), tg(THREE, new THREE.TorusGeometry(0.01, 0.002, 4, 10, Math.PI), { pos: [x, -0.03, 0], rot: [0, 0, Math.PI] })]), P.roller_silver, name));
  hook('line_hook_1', 0); hook('line_hook_2', Lc);
  const stems = [], buds = [], leaves = [];
  for (let i = 0; i < 6; i++) {
    const x = 0.15 + i * 0.18, yT = yC - 0.01, yB = yT - 0.3;
    stems.push(rodGeo(THREE, [x, yT, 0], [x, yB, 0], 0.003, 4));
    for (let k = 0; k < 3; k++) {
      const y = yT - 0.08 - k * 0.08, a = k * 2.1 + i, tip = [x + Math.cos(a) * 0.07, y - 0.05, Math.sin(a) * 0.07];
      stems.push(rodGeo(THREE, [x, y, 0], tip, 0.002, 3));
      buds.push(tg(THREE, new THREE.SphereGeometry(1, 5, 3), { pos: tip, scale: [0.0175, 0.035, 0.0175] }));
      
    }
    for (let k = 0; k < 3; k++) buds.push(tg(THREE, new THREE.SphereGeometry(1, 5, 3), { pos: [x, yB + 0.04 + k * 0.06, 0], scale: [0.0175, 0.035, 0.0175] }));
    for (let k = 0; k < 2; k++) leaves.push(...fanGeo(THREE, L, [x, yT - 0.06 - k * 0.12, 0], 0.4, k * 1.7));
  }
  add(mesh(THREE, merge(THREE, [...stems, ...leaves]), P.leaf_green, 'branch_stems'));
  add(mesh(THREE, merge(THREE, buds), P.trim_green, 'branch_buds'));
  add(anchor(THREE, P.plastic_dark, 'hang_1', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'hang_2', [Lc, 0, 0]));
  return g;
}
