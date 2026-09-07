// Wired stainless thermistor probe — origin at the tip point, standing up (+Y along the probe)
export const budget = { tris: 150 };
export function build(THREE, P, L) {
  const { box, cyl, anchor } = L;
  const g = new THREE.Group(); g.name = 'probe_temp_wired';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.frame_steel, 'probe_tip', { rt: 0.003, rb: 0.0015, h: 0.05, seg: 10, pos: [0, 0.025, 0] }));
  add(cyl(THREE, P.rubber_black, 'probe_collar', { rt: 0.004, rb: 0.005, h: 0.02, seg: 10, pos: [0, 0.06, 0] }));
  add(cyl(THREE, P.cable_black, 'probe_cable', { r: 0.0015, h: 0.3, seg: 6, open: true, pos: [0, 0.22, 0] }));
  add(box(THREE, P.plastic_white, 'probe_plug', [0.008, 0.014, 0.005], [0, 0.377, 0]));
  add(anchor(THREE, P.plastic_dark, 'tip', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.07, 0]));
  return g;
}
