// 20 L DWC bucket — variants empty | veg
import { vegPlant } from './_plant.js';
export const variants = ['empty', 'veg'];
export const budget = () => ({ tris: 1500 });
export function build(THREE, P, L, variant = 'empty') {
  const { cyl, anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'dwc_bucket';
  const add = (m) => (g.add(m), m);
  const R = 0.15, H = 0.36, lidY = H;
  add(mesh(THREE, new THREE.LatheGeometry([[0, 0], [R - 0.01, 0], [R, H]].map(([r, y]) => new THREE.Vector2(r, y)), 20), P.plastic_dark, 'bucket_body'));
  add(mesh(THREE, new THREE.LatheGeometry([[0.075, lidY], [R + 0.005, lidY], [R + 0.005, lidY + 0.02], [0.075, lidY + 0.02]].map(([r, y]) => new THREE.Vector2(r, y)), 20), P.plastic_dark, 'bucket_lid'));
  add(mesh(THREE, new THREE.LatheGeometry([[0.05, lidY - 0.1], [0.075, lidY + 0.02], [0.08, lidY + 0.02]].map(([r, y]) => new THREE.Vector2(r, y)), 16), P.mesh_wire, 'net_pot'));
  add(cyl(THREE, P.soil, 'pebbles', { r: 0.073, h: 0.01, seg: 16, pos: [0, lidY + 0.005, 0] }));
  add(mesh(THREE, merge(THREE, [rodGeo(THREE, [0.1, lidY + 0.06, 0], [0.1, 0.02, 0], 0.003, 6)]), P.rubber_black, 'airline'));
  add(cyl(THREE, P.plastic_white, 'airstone', { r: 0.025, h: 0.015, seg: 12, pos: [0.1, 0.0125, 0] }));
  const bub = []; for (let i = 0; i < 12; i++) bub.push(tg(THREE, new THREE.SphereGeometry(0.004 + (i % 3) * 0.001, 6, 4), { pos: [0.1 + (i % 2 ? 0.006 : -0.006), 0.03 + i * 0.022, (i % 3 - 1) * 0.005] }));
  add(mesh(THREE, merge(THREE, bub), P.window_acrylic, 'bubbles'));
  add(cyl(THREE, P.water, 'bucket_water', { r: R - 0.004, h: 0.001, seg: 20, pos: [0, H * 0.7, 0] }));
  add(cyl(THREE, P.window_acrylic, 'sight_tube', { r: 0.0075, h: 0.3, seg: 8, pos: [-R - 0.01, 0.17, 0] }));
  add(cyl(THREE, P.water, 'sight_water', { r: 0.005, h: H * 0.7 - 0.02, seg: 8, pos: [-R - 0.01, 0.02 + (H * 0.7 - 0.02) / 2, 0] }));
  let top = lidY + 0.02;
  if (variant === 'veg') top = vegPlant(THREE, P, L, g, lidY + 0.01, 0.4);
  add(anchor(THREE, P.plastic_dark, 'air_in', [0.1, lidY + 0.06, 0]));
  add(anchor(THREE, P.plastic_dark, 'probe_socket', [-0.1, lidY + 0.02, 0]));
  if (variant === 'veg') add(anchor(THREE, P.plastic_dark, 'canopy_top', [0, top, 0]));
  return g;
}
