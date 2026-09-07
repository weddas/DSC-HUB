// CO₂ sensor enclosure 60 × 40 × 25 — origin at the hanging tab
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'sensor_co2';
  const add = (m) => (g.add(m), m);
  const top = -0.015, H = 0.025;
  add(box(THREE, P.plastic_white, 'co2_box', [0.06, H, 0.04], [0, top - H / 2, 0]));
  const v = []; for (let i = 0; i < 6; i++) v.push(new THREE.BoxGeometry(0.002, 0.015, 0.001).translate(-0.015 + i * 0.006, top - H / 2, 0.0205));
  add(mesh(THREE, merge(THREE, v), P.plastic_dark, 'co2_vents'));
  add(cyl(THREE, P.led_status, 'co2_status_led', { r: 0.0015, h: 0.001, seg: 8, pos: [0.02, top + 0.0005, 0.01] }));
  add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(0.004, 0.004, 0.006, 8).rotateZ(Math.PI / 2).translate(0.033, top - H / 2, 0), new THREE.CylinderGeometry(0.002, 0.002, 0.2, 6).rotateZ(Math.PI / 2).translate(0.136, top - H / 2, 0)]), P.cable_black, 'co2_cable'));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.012, 0.015, 0.002).translate(0, top + 0.0075, 0), new THREE.TorusGeometry(0.004, 0.0012, 4, 10).translate(0, -0.005, 0)]), P.plastic_white, 'co2_tab'));
  add(anchor(THREE, P.plastic_dark, 'hang_point', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.036, top - H / 2, 0]));
  return g;
}
