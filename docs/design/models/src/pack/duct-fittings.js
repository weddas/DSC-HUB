// Duct fittings: y-4in, y-6in, reducer-6to4, reducer-8to6, collar-4in, collar-6in. Origin at inlet face, axis +Z.
export const variants = ['y-4in', 'y-6in', 'reducer-6to4', 'reducer-8to6', 'collar-4in', 'collar-6in'];
export const budget = () => ({ tris: 700 });
const R = { '4in': 0.051, '6in': 0.076, '8in': 0.1015 };
export function build(THREE, P, L, variant = 'y-4in') {
  const { cyl, torus, plate, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'duct_fitting';
  const add = (m) => (g.add(m), m);
  const A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
  const [kind, size] = variant.split('-');
  if (kind === 'y') {
    const r = R[size], trunk = 0.2, arm = 0.18, a = Math.PI / 4;
    const parts = [tg(THREE, new THREE.CylinderGeometry(r, r, trunk, 20, 1, true), { pos: [0, 0, trunk / 2], rot: [Math.PI / 2, 0, 0] })];
    const outs = [];
    for (const s of [-1, 1]) {
      const dir = new THREE.Vector3(s * Math.sin(a), 0, Math.cos(a));
      const mid = dir.clone().multiplyScalar(arm / 2).add(new THREE.Vector3(0, 0, trunk - 0.02));
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      parts.push(tg(THREE, new THREE.CylinderGeometry(r, r, arm, 20, 1, true), { pos: mid.toArray(), quat: q }));
      outs.push(dir.multiplyScalar(arm).add(new THREE.Vector3(0, 0, trunk - 0.02)).toArray());
    }
    parts.push(tg(THREE, new THREE.SphereGeometry(r, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), { pos: [0, 0, trunk - 0.02], rot: [-Math.PI / 2, 0, 0] }));
    add(mesh(THREE, merge(THREE, parts), P.duct_foil, 'fitting_body'));
    A('duct_in', [0, 0, 0]); A('duct_out_1', outs[0]); A('duct_out_2', outs[1]);
  } else if (kind === 'reducer') {
    const [big, small] = size.split('to').map((n) => R[n + 'in']);
    const parts = [
      tg(THREE, new THREE.CylinderGeometry(big, big, 0.03, 20, 1, true), { pos: [0, 0, 0.015], rot: [Math.PI / 2, 0, 0] }),
      tg(THREE, new THREE.CylinderGeometry(small, big, 0.09, 20, 1, true), { pos: [0, 0, 0.075], rot: [Math.PI / 2, 0, 0] }),
      tg(THREE, new THREE.CylinderGeometry(small, small, 0.03, 20, 1, true), { pos: [0, 0, 0.135], rot: [Math.PI / 2, 0, 0] }),
    ];
    add(mesh(THREE, merge(THREE, parts), P.duct_foil, 'fitting_body'));
    A('duct_in', [0, 0, 0]); A('duct_out', [0, 0, 0.15]);
  } else {
    const r = R[size], fl = size === '4in' ? 0.15 : 0.2;
    add(cyl(THREE, P.frame_steel, 'fitting_body', { r, h: 0.04, seg: 24, open: true, axis: 'z', pos: [0, 0, 0.02] }));
    add(plate(THREE, P.frame_steel, 'fitting_flange', { w: fl, h: fl, depth: 0.003, hole: [0, 0, 2 * r, 2 * r], pos: [0, 0, 0.0015] }));
    add(torus(THREE, P.roller_silver, 'fitting_clamp', { r: r + 0.002, tube: 0.006, seg: 24, tseg: 4, axis: 'z', pos: [0, 0, 0.03] }));
    A('duct_in', [0, 0, 0]); A('duct_out', [0, 0, 0.04]);
  }
  return g;
}
