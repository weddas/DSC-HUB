// Roster vessel catalogue — empty pots with a soil disc 25 mm below the rim. Slug vessel--<catalogue id>.
export const variants = ['generic_fabric_25l', 'generic_fabric_20l', 'felt_15l', 'generic_tall_pet_20l', 'plastic_taper_15l', 'airpot_20l'];
export const budget = () => ({ tris: 700 });
export function build(THREE, P, L, variant = 'generic_fabric_25l') {
  const { box, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'vessel';
  const add = (m) => (g.add(m), m);
  const A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
  const disc = (mat, name, r, y, seg = 20) => add(mesh(THREE, new THREE.CircleGeometry(r, seg).rotateX(-Math.PI / 2), mat, name, [0, y, 0]));
  const lathe = (pts, mat, name, seg = 20) => add(mesh(THREE, new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg), mat, name));
  const rim = (r, tube, y, mat, tseg = 5, seg = 20, extra = []) => add(mesh(THREE, merge(THREE, [new THREE.TorusGeometry(r, tube, tseg, seg).rotateX(Math.PI / 2).translate(0, y, 0), ...extra]), mat, 'pot_rim'));
  const handles = (R, y) => add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.06, 0.02, 0.004).translate(0, y, R + 0.002), new THREE.BoxGeometry(0.06, 0.02, 0.004).translate(0, y, -R - 0.002)]), P.pot_fabric, 'pot_handles'));
  let R, H, soilY, soilR, soilSeg = 20;
  if (variant.startsWith('generic_fabric')) {
    [R, H] = variant.endsWith('25l') ? [0.16, 0.3] : [0.15, 0.28];
    lathe([[0, 0], [R * 0.9, 0], [R * 1.03, H * 0.45], [R * 0.98, H - 0.015]], P.pot_fabric, 'pot_body');
    rim(R * 0.98 - 0.006, 0.0075, H - 0.0075, P.pot_fabric); handles(R * 0.99, H - 0.03);
    soilY = H - 0.025; soilR = R * 0.96;
  } else if (variant === 'felt_15l') {
    R = 0.135; H = 0.26;
    lathe([[0, 0], [R * 0.85, 0], [R, H - 0.015]], P.pot_fabric, 'pot_body');
    rim(R - 0.006, 0.0075, H - 0.0075, P.pot_fabric); handles(R, H - 0.03);
    soilY = H - 0.025; soilR = R - 0.012;
  } else if (variant === 'generic_tall_pet_20l') {
    R = 0.125; H = 0.4;
    const ribs = [0, 1, 2, 3].map((i) => tg(THREE, new THREE.BoxGeometry(0.008, H - 0.02, 0.006), { pos: [0, H / 2, R], rot: [0, i * Math.PI / 2, 0] }));
    add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(R, R, H, 20, 1, true).translate(0, H / 2, 0), ...ribs]), P.window_acrylic, 'pot_body'));
    rim(R, 0.005, H - 0.004, P.plastic_dark, 4);
    const slots = []; for (let i = 0; i < 12; i++) slots.push(tg(THREE, new THREE.BoxGeometry(0.02, 0.002, 0.005), { pos: [Math.cos(i / 12 * Math.PI * 2) * R * 0.6, 0.001, Math.sin(i / 12 * Math.PI * 2) * R * 0.6], rot: [0, -i / 12 * Math.PI * 2, 0] }));
    add(mesh(THREE, merge(THREE, slots), P.plastic_dark, 'pot_drain'));
    soilY = H - 0.025; soilR = R - 0.005;
    add(cyl(THREE, P.soil, 'soil_column', { r: R - 0.005, h: soilY - 0.002, seg: 16, open: true, pos: [0, soilY / 2, 0] }));
  } else if (variant === 'plastic_taper_15l') {
    R = 0.14; H = 0.26;
    lathe([[0, 0], [0.1, 0], [R, H - 0.004]], P.plastic_dark, 'pot_body');
    rim(R, 0.005, H - 0.004, P.plastic_dark, 4);
    add(mesh(THREE, merge(THREE, [[-0.05, 0], [0.05, 0], [0, -0.05], [0, 0.05]].map(([x, z]) => new THREE.BoxGeometry(0.025, 0.002, 0.008).translate(x, -0.001, z))), P.plastic_dark, 'pot_drain'));
    soilY = H - 0.025; soilR = R - 0.012;
  } else {
    R = 0.15; H = 0.32; soilSeg = 12;
    const cones = [new THREE.CylinderGeometry(R, R, H, 10, 1, true).translate(0, H / 2, 0)];
    for (let ring = 0; ring < 8; ring++) for (let k = 0; k < 20; k++) {
      const a = (k / 20) * Math.PI * 2 + (ring % 2) * (Math.PI / 20), y = 0.03 + ring * 0.037;
      cones.push(tg(THREE, new THREE.ConeGeometry(0.011, 0.014, 3, 1, true), { pos: [Math.cos(a) * (R + 0.006), y, Math.sin(a) * (R + 0.006)], rot: [Math.PI / 2, 0, Math.PI / 2 - a] }));
    }
    add(mesh(THREE, merge(THREE, cones), P.plastic_dark, 'pot_body'));
    rim(R, 0.005, H, P.plastic_dark, 3, 12, [new THREE.BoxGeometry(0.012, H, 0.006).translate(R + 0.006, H / 2, 0)]);
    add(mesh(THREE, new THREE.CircleGeometry(R - 0.004, 12).rotateX(-Math.PI / 2), P.plastic_dark, 'pot_drain', [0, 0.002, 0]));
    soilY = H - 0.025; soilR = R - 0.004;
  }
  disc(P.soil, 'soil_surface', soilR, soilY, soilSeg);
  disc(P.water, 'soil_wet', soilR - 0.002, soilY + 0.001, soilSeg);
  A('plant_base', [0, soilY, 0]); A('probe_socket', [0, soilY, -0.06]); A('saucer_under', [0, 0, 0]);
  A('emitter_1', [0.08, soilY, 0]); A('emitter_2', [-0.08, soilY, 0]); A('label_tab', [0, H, R]);
  return g;
}
