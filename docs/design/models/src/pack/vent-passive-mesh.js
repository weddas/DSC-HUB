// Passive intake vent with insect mesh — 4in / 6in; origin at flange face, +Z inflow
export const variants = ['4in', '6in'];
export const budget = () => ({ tris: 400 });
export function build(THREE, P, L, variant = '4in') {
  const { cyl, plate, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'vent_passive';
  const add = (m) => (g.add(m), m);
  const r = variant === '6in' ? 0.076 : 0.051, fl = variant === '6in' ? 0.2 : 0.15;
  add(cyl(THREE, P.frame_steel, 'vent_tube', { r, h: 0.04, seg: 24, open: true, axis: 'z', pos: [0, 0, 0.02] }));
  add(plate(THREE, P.frame_steel, 'vent_flange', { w: fl, h: fl, depth: 0.003, hole: [0, 0, 2 * r, 2 * r], pos: [0, 0, 0.0015] }));
  add(mesh(THREE, new THREE.CircleGeometry(r - 0.001, 24), P.mesh_wire, 'vent_mesh', [0, 0, 0.004]));
  add(mesh(THREE, merge(THREE, [
    tg(THREE, new THREE.CircleGeometry(r - 0.002, 16, 0, Math.PI), { pos: [0, 0, 0.02] }),
    tg(THREE, new THREE.CircleGeometry(r - 0.002, 16, Math.PI, Math.PI), { pos: [0, 0, 0.035] }),
  ]), P.plastic_dark, 'vent_baffle'));
  add(anchor(THREE, P.plastic_dark, 'duct_in', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'duct_out', [0, 0, 0.04]));
  return g;
}
