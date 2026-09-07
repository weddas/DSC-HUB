// Trellis net (net-120) and bamboo stakes (stakes-90)
export const variants = ['net-120', 'stakes-90'];
export const budget = (v) => ({ tris: v === 'net-120' ? 600 : 200 });
export function build(THREE, P, L, variant = 'net-120') {
  const { box, anchor, mesh, merge, rodGeo } = L;
  const g = new THREE.Group();
  const add = (m) => (g.add(m), m);
  if (variant === 'net-120') {
    g.name = 'trellis_net';
    const S = 1.2, r = 0.0125, h = S / 2 - r;
    const frame = [[-h, -h, h, -h], [-h, h, h, h], [-h, -h, -h, h], [h, -h, h, h]].map(([x1, z1, x2, z2]) => rodGeo(THREE, [x1, r, z1], [x2, r, z2], r, 8));
    add(mesh(THREE, merge(THREE, frame), P.frame_steel, 'net_frame'));
    const strips = [];
    for (let i = 1; i <= 7; i++) { const p = -S / 2 + i * 0.15; strips.push(new THREE.BoxGeometry(S - 0.05, 0.001, 0.004).translate(0, r, p), new THREE.BoxGeometry(0.004, 0.001, S - 0.05).translate(p, r, 0)); }
    add(mesh(THREE, merge(THREE, strips), P.mesh_wire, 'net_mesh'));
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sz], i) => {
      add(box(THREE, P.plastic_dark, `net_clamp_${i + 1}`, [0.03, 0.03, 0.03], [sx * (S / 2 + 0.015), r, sz * (S / 2 + 0.015)]));
      add(anchor(THREE, P.plastic_dark, `pole_${i + 1}`, [sx * (S / 2 + 0.015), r, sz * (S / 2 + 0.015)]));
    });
  } else {
    g.name = 'plant_stakes';
    const pts = [[-0.05, -0.05], [0.05, -0.05], [0.05, 0.05], [-0.05, 0.05]];
    add(mesh(THREE, merge(THREE, pts.map(([x, z]) => rodGeo(THREE, [x, 0, z], [x, 0.9, z], 0.006, 5))), P.soil, 'stakes'));
    const ties = [];
    for (const y of [0.4, 0.7]) for (let i = 0; i < 4; i++) { const a = pts[i], b = pts[(i + 1) % 4]; ties.push(rodGeo(THREE, [a[0], y, a[1]], [b[0], y, b[1]], 0.0025, 3)); }
    add(mesh(THREE, merge(THREE, ties), P.rubber_black, 'stake_ties'));
    add(anchor(THREE, P.plastic_dark, 'plant_base', [0, 0, 0]));
  }
  return g;
}
