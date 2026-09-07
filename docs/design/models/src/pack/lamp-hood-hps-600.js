// Air-cooled HID hood — variants hood (default, origin at hook) | ballast (floor origin)
export const variants = ['hood', 'ballast'];
export const budget = () => ({ tris: 2500 });
export function build(THREE, P, L, variant = 'hood') {
  const { box, cyl, torus, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group();
  const add = (m) => (g.add(m), m);
  const A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
  if (variant === 'ballast') {
    g.name = 'lamp_ballast';
    add(box(THREE, P.plastic_dark, 'ballast_body', [0.3, 0.07, 0.12], [0, 0.035, 0]));
    const ribs = []; for (let i = 0; i < 10; i++) ribs.push(new THREE.BoxGeometry(0.004, 0.01, 0.1).translate(-0.09 + i * 0.02, 0.075, 0));
    add(mesh(THREE, merge(THREE, ribs), P.plastic_dark, 'ballast_ribs'));
    add(cyl(THREE, P.led_status, 'ballast_status_led', { r: 0.002, h: 0.001, seg: 8, axis: 'z', pos: [0.12, 0.05, 0.0605] }));
    add(box(THREE, P.plastic_dark, 'ballast_inlet', [0.025, 0.02, 0.01], [-0.12, 0.03, -0.065]));
    add(cyl(THREE, P.cable_black, 'ballast_cord', { r: 0.003, h: 0.06, seg: 6, axis: 'z', pos: [0.12, 0.03, -0.09] }));
    A('cable_out', [-0.12, 0.03, -0.07]); A('mount', [0, 0, 0]);
    return g;
  }
  g.name = 'lamp_hood_hps';
  const W = 0.58, D = 0.43, H = 0.23, top = -0.06, yB = top - H;   // hook at 0, eyelets 60 mm below
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(W, 0.004, D).translate(0, top - 0.002, 0),
    new THREE.BoxGeometry(W, H, 0.004).translate(0, top - H / 2, D / 2 - 0.002), new THREE.BoxGeometry(W, H, 0.004).translate(0, top - H / 2, -D / 2 + 0.002),
    new THREE.BoxGeometry(0.004, H, D).translate(-W / 2 + 0.002, top - H / 2, 0), new THREE.BoxGeometry(0.004, H, D).translate(W / 2 - 0.002, top - H / 2, 0),
  ]), P.plastic_white, 'hood_body'));
  add(box(THREE, P.window_acrylic, 'hood_glass', [W - 0.01, 0.004, D - 0.01], [0, yB + 0.002, 0]));
  const refl = [];
  for (const s of [-1, 1]) refl.push(tg(THREE, new THREE.PlaneGeometry(W - 0.02, 0.2), { pos: [0, top - 0.11, s * 0.13], rot: [s * 0.9, 0, 0] }));
  refl.push(tg(THREE, new THREE.PlaneGeometry(W - 0.02, 0.12), { pos: [0, top - 0.01, 0], rot: [Math.PI / 2, 0, 0] }));
  add(mesh(THREE, merge(THREE, refl), P.roller_silver, 'hood_reflector'));
  add(cyl(THREE, P.plastic_dark, 'hood_collar_in', { r: 0.076, h: 0.06, seg: 24, open: true, axis: 'x', pos: [-W / 2 - 0.03, top - H / 2, 0] }));
  add(cyl(THREE, P.plastic_dark, 'hood_collar_out', { r: 0.076, h: 0.06, seg: 24, open: true, axis: 'x', pos: [W / 2 + 0.03, top - H / 2, 0] }));
  add(mesh(THREE, new THREE.CapsuleGeometry(0.02, 0.22, 4, 16).rotateZ(Math.PI / 2).translate(0.01, top - 0.13, 0), P.lamp_emitter, 'lamp_emitter'));
  add(cyl(THREE, P.plastic_dark, 'lamp_base', { r: 0.018, h: 0.02, seg: 12, axis: 'x', pos: [-0.14, top - 0.13, 0] }));
  const eye = (name, x) => add(mesh(THREE, merge(THREE, [tg(THREE, new THREE.TorusGeometry(0.01, 0.003, 6, 12), { pos: [x, top + 0.012, 0] }), new THREE.CylinderGeometry(0.0015, 0.0015, 0.06, 5).translate(x, -0.03, 0)]), P.plastic_dark, name));
  eye('hood_eyelet_1', -0.15); eye('hood_eyelet_2', 0.15);
  A('hang_1', [-0.15, top + 0.02, 0]); A('hang_2', [0.15, top + 0.02, 0]);
  A('duct_in', [-W / 2 - 0.06, top - H / 2, 0]); A('duct_out', [W / 2 + 0.06, top - H / 2, 0]);
  return g;
}
