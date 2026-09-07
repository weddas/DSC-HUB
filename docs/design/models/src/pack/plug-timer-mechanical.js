// 24 h mechanical segment timer — origin at the back (pins) face centre, y = 0 at the bottom; timer_dial turns about its own +Z
export const budget = { tris: 400 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'plug_timer';
  const add = (m) => (g.add(m), m);
  const W = 0.085, H = 0.13, D = 0.04, dialY = 0.085;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: H, r: 0.008, seg: 1 }).translate(0, 0, D / 2), P.plastic_white, 'plug_body'));
  add(cyl(THREE, P.screen_glass, 'plug_dial_face', { r: 0.04, h: 0.002, seg: 16, axis: 'z', pos: [0, dialY, D + 0.001] }));
  const dial = new THREE.Group(); dial.name = 'timer_dial'; dial.position.set(0, dialY, D + 0.002); add(dial);
  const tabs = []; for (let i = 0; i < 12; i++) tabs.push(tg(THREE, new THREE.BoxGeometry(0.004, 0.006, 0.003), { pos: [Math.sin(i / 12 * Math.PI * 2) * 0.034, Math.cos(i / 12 * Math.PI * 2) * 0.034, 0.0015], rot: [0, 0, -i / 12 * Math.PI * 2] }));
  tabs.push(new THREE.BoxGeometry(0.003, 0.03, 0.002).translate(0, 0.015, 0.001));
  dial.add(mesh(THREE, merge(THREE, tabs), P.plastic_dark, 'timer_dial_tabs'));
  const slot = (x, y, rz) => tg(THREE, new THREE.BoxGeometry(0.003, 0.012, 0.001), { pos: [x, y, D + 0.0005], rot: [0, 0, rz] });
  add(mesh(THREE, merge(THREE, [slot(-0.009, 0.03, -0.52), slot(0.009, 0.03, 0.52), slot(0, 0.014, 0)]), P.plastic_dark, 'plug_socket_face'));
  const pin = (x, y, rz) => tg(THREE, new THREE.BoxGeometry(0.0065, 0.0015, 0.015), { pos: [x, y, -0.0075], rot: [0, 0, rz] });
  add(mesh(THREE, merge(THREE, [pin(-0.009, 0.03, -0.52), pin(0.009, 0.03, 0.52), pin(0, 0.014, Math.PI / 2)]), P.plastic_dark, 'plug_pins'));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, H / 2, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.03, D]));
  return g;
}
