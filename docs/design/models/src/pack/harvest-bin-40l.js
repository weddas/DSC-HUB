// 40 L trimming tote — origin floor centre; bin_lid hinges at the back top edge
export const budget = { tris: 400 };
export function build(THREE, P, L) {
  const { box, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'harvest_bin';
  const add = (m) => (g.add(m), m);
  const W = 0.6, D = 0.4, H = 0.32, t = 0.006;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(W, t, D).translate(0, t / 2, 0),
    new THREE.BoxGeometry(W, H, t).translate(0, H / 2, D / 2 - t / 2), new THREE.BoxGeometry(W, H, t).translate(0, H / 2, -D / 2 + t / 2),
    new THREE.BoxGeometry(t, H, D - 2 * t).translate(-W / 2 + t / 2, H / 2, 0), new THREE.BoxGeometry(t, H, D - 2 * t).translate(W / 2 - t / 2, H / 2, 0),
  ]), P.plastic_dark, 'bin_body'));
  const lid = new THREE.Group(); lid.name = 'bin_lid'; lid.position.set(0, H, -D / 2); add(lid);
  lid.add(box(THREE, P.plastic_dark, 'bin_lid_panel', [W + 0.02, 0.02, D + 0.02], [0, 0.01, D / 2]));
  add(mesh(THREE, tg(THREE, new THREE.SphereGeometry(1, 10, 6), { pos: [0, 0.14, 0], scale: [W / 2 - 0.02, 0.1, D / 2 - 0.02] }), P.trim_green, 'bin_contents'));
  add(anchor(THREE, P.plastic_dark, 'lid_hinge', [0, H, -D / 2]));
  add(anchor(THREE, P.plastic_dark, 'contents_top', [0, 0.24, 0]));
  return g;
}
