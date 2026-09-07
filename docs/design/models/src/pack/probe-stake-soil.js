// DSC soil probe stake — tip at y = 0
export const budget = { tris: 800 };
export function build(THREE, P, L) {
  const { box, cyl, anchor } = L;
  const g = new THREE.Group(); g.name = 'probe_stake_soil';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.frame_steel, 'probe_tine_1', { r: 0.0025, h: 0.2, seg: 8, pos: [-0.0125, 0.1, 0] }));
  add(cyl(THREE, P.frame_steel, 'probe_tine_2', { r: 0.0025, h: 0.2, seg: 8, pos: [0.0125, 0.1, 0] }));
  add(box(THREE, P.plastic_dark, 'probe_collar', [0.04, 0.012, 0.03], [0, 0.206, 0]));
  add(box(THREE, P.plastic_white, 'probe_box', [0.06, 0.025, 0.04], [0, 0.2245, 0]));
  add(cyl(THREE, P.led_status, 'probe_status_led', { r: 0.0015, h: 0.002, seg: 8, pos: [0.015, 0.238, 0.01] }));
  add(cyl(THREE, P.cable_black, 'probe_antenna', { r: 0.002, h: 0.03, seg: 8, pos: [-0.025, 0.252, -0.01] }));
  add(anchor(THREE, P.plastic_dark, 'soil_line', [0, 0.12, 0]));
  return g;
}
