// Inline duct silencer — 4in (Ø200 × 450) / 6in (Ø250 × 600); origin at inlet collar face, +Z
export const variants = ['4in', '6in'];
export const budget = () => ({ tris: 500 });
export function build(THREE, P, L, variant = '4in') {
  const { cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'duct_silencer';
  const add = (m) => (g.add(m), m);
  const six = variant === '6in', r = six ? 0.076 : 0.051, R = six ? 0.125 : 0.1, Lb = six ? 0.6 : 0.45, c = 0.04;
  add(cyl(THREE, P.plastic_dark, 'silencer_collar_in', { r, h: c, seg: 20, open: true, axis: 'z', pos: [0, 0, c / 2] }));
  add(mesh(THREE, merge(THREE, [
    tg(THREE, new THREE.CylinderGeometry(R, R, Lb, 20, 1, true), { pos: [0, 0, c + Lb / 2], rot: [Math.PI / 2, 0, 0] }),
    tg(THREE, new THREE.RingGeometry(r, R, 20), { pos: [0, 0, c], rot: [Math.PI, 0, 0] }),
    tg(THREE, new THREE.RingGeometry(r, R, 20), { pos: [0, 0, c + Lb] }),
  ]), P.duct_foil, 'silencer_body'));
  add(cyl(THREE, P.plastic_dark, 'silencer_collar_out', { r, h: c, seg: 20, open: true, axis: 'z', pos: [0, 0, c + Lb + c / 2] }));
  const strap = (name, z) => add(mesh(THREE, new THREE.TorusGeometry(0.02, 0.004, 4, 12), P.cable_black, name, [0, R + 0.016, z]));
  strap('silencer_strap_1', c + Lb * 0.2); strap('silencer_strap_2', c + Lb * 0.8);
  add(anchor(THREE, P.plastic_dark, 'duct_in', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'duct_out', [0, 0, 2 * c + Lb]));
  add(anchor(THREE, P.plastic_dark, 'hang_1', [0, R + 0.036, c + Lb * 0.2]));
  add(anchor(THREE, P.plastic_dark, 'hang_2', [0, R + 0.036, c + Lb * 0.8]));
  return g;
}
