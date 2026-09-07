// Six curing jars on a tray
export const budget = { tris: 1800 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, tg } = L;
  const g = new THREE.Group(); g.name = 'curing_jars';
  const add = (m) => (g.add(m), m);
  add(box(THREE, P.plastic_dark, 'jar_tray', [0.4, 0.02, 0.28], [0, 0.01, 0]));
  let n = 1;
  for (const z of [-0.065, 0.065]) for (const x of [-0.13, 0, 0.13]) {
    const y0 = 0.02;
    add(cyl(THREE, P.glass_clear, `jar_${n}`, { r: 0.05, h: 0.16, seg: 16, pos: [x, y0 + 0.08, z] }));
    add(cyl(THREE, P.roller_silver, `jar_lid_${n}`, { r: 0.046, h: 0.012, seg: 16, pos: [x, y0 + 0.166, z] }));
    const bud = new THREE.SphereGeometry(1, 8, 6); bud.scale(0.044, 0.048, 0.044);
    add(mesh(THREE, bud.translate(x, y0 + 0.05, z), P.trim_green, `jar_bud_${n}`));
    add(cyl(THREE, P.screen_glass, `jar_hygro_${n}`, { r: 0.012, h: 0.002, seg: 12, pos: [x, y0 + 0.159, z] }));
    add(cyl(THREE, P.led_status, `jar_status_led_${n}`, { r: 0.001, h: 0.001, seg: 6, pos: [x + 0.015, y0 + 0.1585, z] }));
    add(anchor(THREE, P.plastic_dark, `jar_${n}`, [x, y0 + 0.172, z]));
    n++;
  }
  return g;
}
