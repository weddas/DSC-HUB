// T5 HO fixtures — variants 2ft4 | 4ft4; origin at the hooks, fixture below
export const variants = ['2ft4', '4ft4'];
export const budget = () => ({ tris: 1200 });
export function build(THREE, P, L, variant = '2ft4') {
  const { box, cyl, anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'lamp_t5_ho';
  const add = (m) => (g.add(m), m);
  const Lf = variant === '4ft4' ? 1.2 : 0.59, W = 0.25, H = 0.08, top = -0.03, yB = top - H;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(Lf, 0.004, W).translate(0, top - 0.002, 0),
    new THREE.BoxGeometry(Lf, H, 0.004).translate(0, top - H / 2, W / 2 - 0.002), new THREE.BoxGeometry(Lf, H, 0.004).translate(0, top - H / 2, -W / 2 + 0.002),
    new THREE.BoxGeometry(0.004, H, W).translate(-Lf / 2 + 0.002, top - H / 2, 0), new THREE.BoxGeometry(0.004, H, W).translate(Lf / 2 - 0.002, top - H / 2, 0),
    ...[0, 1, 2, 3].flatMap((i) => [new THREE.CylinderGeometry(0.012, 0.012, 0.01, 10).rotateZ(Math.PI / 2).translate(-Lf / 2 + 0.009, yB + 0.04, -0.0825 + i * 0.055), new THREE.CylinderGeometry(0.012, 0.012, 0.01, 10).rotateZ(Math.PI / 2).translate(Lf / 2 - 0.009, yB + 0.04, -0.0825 + i * 0.055)]),
  ]), P.plastic_white, 't5_housing'));
  const refl = [];
  for (let i = 0; i < 4; i++) refl.push(tg(THREE, new THREE.PlaneGeometry(Lf - 0.02, 0.05), { pos: [0, top - 0.02, -0.0825 + i * 0.055], rot: [Math.PI / 2, 0, 0] }));
  add(mesh(THREE, merge(THREE, refl), P.roller_silver, 't5_reflector'));
  for (let i = 0; i < 4; i++) add(cyl(THREE, P.lamp_emitter, `lamp_emitter_${i + 1}`, { r: 0.008, h: Lf - 0.03, seg: 12, axis: 'x', pos: [0, yB + 0.04, -0.0825 + i * 0.055] }));
  add(box(THREE, P.plastic_dark, 't5_switch', [0.01, 0.015, 0.02], [Lf / 2 + 0.005, top - 0.02, 0.09]));
  add(cyl(THREE, P.cable_black, 't5_cord', { r: 0.003, h: 0.06, seg: 6, axis: 'x', pos: [Lf / 2 + 0.03, top - 0.05, 0.1] }));
  const hook = (name, x) => add(mesh(THREE, merge(THREE, [rodGeo(THREE, [x - 0.03, top, 0], [x, 0, 0], 0.0015, 5), rodGeo(THREE, [x + 0.03, top, 0], [x, 0, 0], 0.0015, 5)]), P.plastic_dark, name));
  hook('t5_hook_1', -Lf / 4); hook('t5_hook_2', Lf / 4);
  add(anchor(THREE, P.plastic_dark, 'hang_1', [-Lf / 4, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'hang_2', [Lf / 4, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [Lf / 2 + 0.06, top - 0.05, 0.1]));
  return g;
}
