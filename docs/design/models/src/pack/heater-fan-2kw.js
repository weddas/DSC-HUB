// 2 kW fan heater 260 × 140 × 360; +Z is outflow
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, plateGeo, box, cyl, anchor, mesh, merge, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'heater_fan';
  const add = (m) => (g.add(m), m);
  const W = 0.26, D = 0.14, H = 0.35, foot = 0.01;
  add(box(THREE, P.plastic_dark, 'heater_foot', [0.28, foot, 0.18], [0, foot / 2, 0]));
  // body: rounded box to z = 0.05, plus a 20 mm deep front frame with the 200 × 200 recess
  const body = merge(THREE, [
    roundedBoxGeo(THREE, { w: W, d: 0.12, h: H, r: 0.02, seg: 3 }).translate(0, foot, -0.01),
    plateGeo(THREE, { w: W - 0.03, h: H - 0.02, depth: 0.02, hole: [0, 0.02, 0.2, 0.2] }).translate(0, foot + H / 2, 0.06),
  ]);
  add(mesh(THREE, body, P.plastic_dark, 'heater_body'));
  const cy = foot + H / 2 + 0.02;
  add(box(THREE, P.heat_element, 'heat_element', [0.19, 0.19, 0.002], [0, cy, 0.052]));
  const blades = mesh(THREE, bladesGeo(THREE, 5, { rIn: 0.012, rOut: 0.085, chord: 0.03, pitch: 0.6 }), P.fan_blade, 'heater_fan_blades');
  blades.rotation.x = Math.PI / 2; blades.position.set(0, cy, 0.04); add(blades);
  const slats = [];
  for (let i = 0; i < 10; i++) slats.push(new THREE.BoxGeometry(0.005, 0.2, 0.004).translate(-0.09 + i * 0.02, cy, 0.068));
  add(mesh(THREE, merge(THREE, slats), P.plastic_dark, 'heater_grille'));
  add(cyl(THREE, P.plastic_dark, 'heater_dial_1', { r: 0.015, h: 0.01, seg: 16, pos: [-0.05, foot + H + 0.005, -0.01] }));
  add(cyl(THREE, P.plastic_dark, 'heater_dial_2', { r: 0.015, h: 0.01, seg: 16, pos: [0.05, foot + H + 0.005, -0.01] }));
  add(cyl(THREE, P.cable_black, 'heater_lead', { r: 0.003, h: 0.06, seg: 8, axis: 'z', pos: [0.06, 0.05, -0.1] }));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, cy, 0.07]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.06, 0.05, -0.13]));
  return g;
}
