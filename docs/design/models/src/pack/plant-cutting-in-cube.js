// Rooted clone in a 25 mm rockwool cube — origin at the cube base centre
export const budget = { tris: 250 };
export function build(THREE, P, L) {
  const { box, anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'plant_cutting';
  const add = (m) => (g.add(m), m);
  const c = 0.025, h = 0.06;
  add(box(THREE, P.plastic_white, 'cube', [c, c, c], [0, c / 2, 0]));
  add(mesh(THREE, rodGeo(THREE, [0, c, 0], [0, c + h, 0], 0.002, 6), P.leaf_green, 'stem'));
  const fan = ([x, y, z], len, rotY) => {
    const parts = [];
    for (let i = 0; i < 3; i++) {
      const q = tg(THREE, new THREE.PlaneGeometry(len * 0.22, len), { pos: [0, len / 2, 0], rot: [-0.35, 0, 0] });
      tg(THREE, q, { rot: [0, 0, (i - 1) * 0.55] }); tg(THREE, q, { rot: [Math.PI / 2 - 0.5, rotY, 0] });
      q.translate(x, y, z); parts.push(q);
    }
    return parts;
  };
  add(mesh(THREE, merge(THREE, [...fan([0, c + h, 0], 0.04, 0.4), ...fan([0, c + h * 0.7, 0], 0.035, 2.6)]), P.leaf_green, 'leaves'));
  const roots = []; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; roots.push(rodGeo(THREE, [Math.cos(a) * 0.006, 0.001, Math.sin(a) * 0.006], [Math.cos(a) * 0.016, -0.03, Math.sin(a) * 0.016], 0.0007, 4)); }
  add(mesh(THREE, merge(THREE, roots), P.plastic_white, 'roots'));
  add(anchor(THREE, P.plastic_dark, 'canopy_top', [0, c + h + 0.02, 0]));
  add(anchor(THREE, P.plastic_dark, 'cube_base', [0, 0, 0]));
  return g;
}
