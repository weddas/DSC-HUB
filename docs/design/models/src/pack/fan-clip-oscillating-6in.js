// 6" clip fan — origin at clamp jaw centre; fan_head yaws on the knuckle, blows +Z
export const budget = { tris: 1000 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'fan_clip_osc';
  const add = (m) => (g.add(m), m);
  add(box(THREE, P.plastic_dark, 'clip_jaw_bottom', [0.09, 0.008, 0.045], [0, 0.004, 0]));
  add(box(THREE, P.plastic_dark, 'clip_jaw_top', [0.09, 0.008, 0.045], [0, 0.036, 0]));
  add(cyl(THREE, P.plastic_dark, 'clip_knuckle', { r: 0.015, h: 0.06, seg: 12, pos: [0, 0.07, 0] }));
  const head = new THREE.Group(); head.name = 'fan_head'; head.position.set(0, 0.1, 0); add(head);
  const R = 0.08, D = 0.1;
  head.add(mesh(THREE, new THREE.CylinderGeometry(R, R, D, 20, 1, true).rotateX(Math.PI / 2), P.plastic_dark, 'fan_head_shell', [0, R, 0.04]));
  head.add(mesh(THREE, new THREE.CircleGeometry(R, 20), P.mesh_wire, 'fan_guard', [0, R, 0.04 + D / 2]));
  head.add(mesh(THREE, new THREE.CircleGeometry(R, 20), P.mesh_wire, 'fan_grille', [0, R, 0.04 - D / 2], [Math.PI, 0, 0]));
  const bl = mesh(THREE, bladesGeo(THREE, 3, { rIn: 0.015, rOut: 0.07, chord: 0.05, pitch: 0.6 }), P.fan_blade, 'fan_blades');
  bl.rotation.x = Math.PI / 2; bl.position.set(0, R, 0.04); head.add(bl);
  head.add(cyl(THREE, P.plastic_dark, 'fan_osc_knob', { r: 0.008, h: 0.03, seg: 10, pos: [0, 2 * R + 0.015, 0.02] }));
  add(cyl(THREE, P.cable_black, 'fan_cord', { r: 0.003, h: 0.06, seg: 6, axis: 'z', pos: [0.02, 0.06, -0.04] }));
  add(anchor(THREE, P.plastic_dark, 'clip_point', [0, 0.02, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.02, 0.06, -0.07]));
  return g;
}
