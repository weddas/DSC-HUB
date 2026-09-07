// Empty pots — variants 1gal | 5gal | 7gal | square-3.6l | airpot-10l | saucer-30
export const variants = ['1gal', '5gal', '7gal', 'square-3.6l', 'airpot-10l', 'saucer-30'];
export const budget = () => ({ tris: 800 });
export function fabricPot(THREE, P, L, g, R, H, prefix = 'pot') {
  const { mesh, merge, cyl } = L;
  const add = (m) => (g.add(m), m);
  add(mesh(THREE, new THREE.LatheGeometry([[0, 0], [R * 0.88, 0], [R - 0.005, H - 0.015], [R - 0.008, H - 0.02]].map(([r, y]) => new THREE.Vector2(r, y)), 20), P.pot_fabric, `${prefix}_body`));
  add(mesh(THREE, new THREE.TorusGeometry(R - 0.006, 0.0075, 6, 20).rotateX(Math.PI / 2).translate(0, H - 0.0075, 0), P.pot_fabric, `${prefix}_rim`));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.06, 0.02, 0.004).translate(0, H - 0.03, R + 0.001), new THREE.BoxGeometry(0.06, 0.02, 0.004).translate(0, H - 0.03, -R - 0.001)]), P.pot_fabric, `${prefix}_handles`));
  add(cyl(THREE, P.soil, 'soil_surface', { r: R - 0.009, h: 0.002, seg: 20, pos: [0, H - 0.02, 0] }));
  return H - 0.02;
}
export function build(THREE, P, L, variant = '1gal') {
  const { box, cyl, anchor, mesh, merge, tg, plateGeo } = L;
  const g = new THREE.Group(); g.name = 'pot';
  const add = (m) => (g.add(m), m);
  const A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
  let soilY = null, R = 0.15;
  if (variant.endsWith('gal')) {
    const s = { '1gal': [0.09, 0.15], '5gal': [0.15, 0.25], '7gal': [0.18, 0.28] }[variant]; R = s[0];
    soilY = fabricPot(THREE, P, L, g, s[0], s[1]);
  } else if (variant === 'square-3.6l') {
    const W = 0.15, H = 0.2; R = W / 2;
    add(mesh(THREE, merge(THREE, [
      new THREE.BoxGeometry(W - 0.02, 0.004, W - 0.02).translate(0, 0.002, 0),
      ...[0, 1, 2, 3].map((i) => tg(THREE, new THREE.BoxGeometry(W - 0.004, H - 0.004, 0.004), { pos: [0, H / 2, W / 2 - 0.002] }).applyMatrix4(new THREE.Matrix4().makeRotationY(i * Math.PI / 2))),
    ]), P.plastic_dark, 'pot_body'));
    add(mesh(THREE, plateGeo(THREE, { w: W + 0.01, h: W + 0.01, depth: 0.01, hole: [0, 0, W - 0.008, W - 0.008] }).rotateX(-Math.PI / 2).translate(0, H - 0.005, 0), P.plastic_dark, 'pot_rim'));
    add(mesh(THREE, merge(THREE, [[-0.04, 0], [0.04, 0], [0, -0.04], [0, 0.04]].map(([x, z]) => new THREE.BoxGeometry(0.02, 0.002, 0.008).translate(x, -0.001, z))), P.plastic_dark, 'pot_drain'));
    soilY = H - 0.02; add(box(THREE, P.soil, 'soil_surface', [W - 0.01, 0.002, W - 0.01], [0, soilY, 0]));
  } else if (variant === 'airpot-10l') {
    R = 0.125; const H = 0.3;
    const cones = [new THREE.CylinderGeometry(R, R, H, 12, 1, true).translate(0, H / 2, 0)];
    for (let ring = 0; ring < 8; ring++) for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2 + (ring % 2) * (Math.PI / 16), y = 0.03 + ring * 0.034;
      cones.push(tg(THREE, new THREE.ConeGeometry(0.01, 0.012, 3, 1, true), { pos: [Math.cos(a) * (R + 0.005), y, Math.sin(a) * (R + 0.005)], rot: [Math.PI / 2, 0, Math.PI / 2 - a] }));
    }
    add(mesh(THREE, merge(THREE, cones), P.plastic_dark, 'pot_body'));
    add(mesh(THREE, new THREE.TorusGeometry(R, 0.005, 4, 12).rotateX(Math.PI / 2).translate(0, H, 0), P.plastic_dark, 'pot_rim'));
    add(cyl(THREE, P.plastic_dark, 'pot_drain', { r: R - 0.005, h: 0.004, seg: 12, pos: [0, 0.002, 0] }));
    soilY = H - 0.02; add(cyl(THREE, P.soil, 'soil_surface', { r: R - 0.004, h: 0.002, seg: 12, pos: [0, soilY, 0] }));
  } else {
    R = 0.15;
    add(mesh(THREE, new THREE.LatheGeometry([[0, 0], [0.13, 0], [R, 0.03], [R - 0.004, 0.03], [0.128, 0.004], [0, 0.004]].map(([r, y]) => new THREE.Vector2(r, y)), 20), P.plastic_dark, 'pot_body'));
    add(mesh(THREE, new THREE.TorusGeometry(R - 0.003, 0.003, 4, 20).rotateX(Math.PI / 2).translate(0, 0.03, 0), P.plastic_dark, 'pot_rim'));
  }
  if (soilY != null) { A('probe_socket', [0, soilY, -0.06]); A('plant_base', [0, soilY, 0]); }
  A('saucer_under', [0, 0, 0]);
  return g;
}
