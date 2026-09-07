// Oil-filled 7-fin column heater 380 × 150 × 630
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'heater_oil_column';
  const add = (m) => (g.add(m), m);
  const yF = 0.03, finH = 0.6;
  const fins = [];
  for (let i = 0; i < 7; i++) fins.push(roundedBoxGeo(THREE, { w: 0.025, d: 0.06, h: finH, r: 0.008, seg: 2 }).translate(-0.15 + i * 0.05, yF, 0));
  add(mesh(THREE, merge(THREE, fins), P.heat_element, 'heat_element'));
  add(cyl(THREE, P.plastic_white, 'heater_header_top', { r: 0.0125, h: 0.35, seg: 12, axis: 'x', pos: [-0.01, yF + finH - 0.04, 0] }));
  add(cyl(THREE, P.plastic_white, 'heater_header_bottom', { r: 0.0125, h: 0.35, seg: 12, axis: 'x', pos: [-0.01, yF + 0.04, 0] }));
  add(box(THREE, P.plastic_white, 'heater_control_box', [0.06, 0.2, 0.1], [0.19, yF + 0.3, 0]));
  add(cyl(THREE, P.plastic_dark, 'heater_dial', { r: 0.02, h: 0.01, seg: 16, axis: 'x', pos: [0.225, yF + 0.35, 0] }));
  add(box(THREE, P.plastic_dark, 'heater_switch', [0.01, 0.03, 0.02], [0.225, yF + 0.27, 0]));
  add(cyl(THREE, P.led_status, 'heater_status_led', { r: 0.002, h: 0.002, seg: 8, axis: 'x', pos: [0.221, yF + 0.3, 0.03] }));
  const foot = (name, x) => add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(0.03, 0.02, 0.2).translate(x, 0.03, 0),
    tg(THREE, new THREE.CylinderGeometry(0.02, 0.02, 0.015, 12), { pos: [x, 0.02, 0.09], rot: [0, 0, Math.PI / 2] }),
    tg(THREE, new THREE.CylinderGeometry(0.02, 0.02, 0.015, 12), { pos: [x, 0.02, -0.09], rot: [0, 0, Math.PI / 2] }),
  ]), P.plastic_dark, name));
  foot('heater_foot_1', -0.15); foot('heater_foot_2', 0.15);
  add(cyl(THREE, P.cable_black, 'heater_cord', { r: 0.003, h: 0.06, seg: 8, axis: 'z', pos: [0.19, yF + 0.22, -0.08] }));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.19, yF + 0.22, -0.11]));
  return g;
}
