// Square LCD hygrometer puck — origin at the back face centre, y = 0 at the bottom edge; hygro_stand hinges at the top back edge
export const budget = { tris: 250 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge, roundedBoxGeo, plateGeo } = L;
  const g = new THREE.Group(); g.name = 'sensor_hygro';
  const add = (m) => (g.add(m), m);
  const W = 0.06, H = 0.06, D = 0.02;
  add(mesh(THREE, roundedBoxGeo(THREE, { w: W, d: D, h: H, r: 0.006, seg: 3 }).translate(0, 0, D / 2), P.plastic_white, 'hygro_body'));
  add(box(THREE, P.screen_glass, 'hygro_screen', [0.04, 0.025, 0.001], [0, 0.036, D + 0.0005]));
  const vents = []; for (let i = 0; i < 5; i++) vents.push(new THREE.BoxGeometry(0.001, 0.012, 0.0015).translate(W / 2 + 0.0005, 0.03, 0.004 + i * 0.003));
  add(mesh(THREE, merge(THREE, vents), P.plastic_dark, 'hygro_vents'));
  add(mesh(THREE, plateGeo(THREE, { w: 0.014, h: 0.01, depth: 0.003, hole: [0, 0.001, 0.005, 0.004] }).translate(0, H + 0.004, D / 2), P.plastic_white, 'hygro_tab'));
  const stand = new THREE.Group(); stand.name = 'hygro_stand'; stand.position.set(0, H - 0.008, 0.001); stand.rotation.x = 0.5; add(stand);
  stand.add(box(THREE, P.plastic_dark, 'hygro_stand_leg', [0.03, 0.045, 0.002], [0, -0.0225, -0.001]));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, H / 2, 0]));
  add(anchor(THREE, P.plastic_dark, 'hang_point', [0, H + 0.005, D / 2]));
  return g;
}
