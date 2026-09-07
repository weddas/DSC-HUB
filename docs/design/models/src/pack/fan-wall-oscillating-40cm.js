// 16" wall-mounted oscillating fan — origin at the bracket back face, y = 0 at its bottom edge; fan_head yaws at the arm end; blows +Z
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'fan_wall';
  const add = (m) => (g.add(m), m);
  const ay = 0.05;
  add(box(THREE, P.plastic_dark, 'fan_bracket', [0.15, 0.1, 0.01], [0, ay, 0.005]));
  add(cyl(THREE, P.roller_silver, 'fan_arm', { r: 0.015, h: 0.2, seg: 12, axis: 'z', pos: [0, ay, 0.11] }));
  add(cyl(THREE, P.plastic_dark, 'fan_knuckle', { r: 0.03, h: 0.06, seg: 12, pos: [0, ay, 0.23] }));
  const head = new THREE.Group(); head.name = 'fan_head'; head.position.set(0, ay + 0.03, 0.23); add(head);
  const R = 0.225, hy = 0.12;
  head.add(mesh(THREE, new THREE.CylinderGeometry(R, R, 0.15, 24, 1, true).rotateX(Math.PI / 2), P.plastic_dark, 'fan_head_ring', [0, hy, 0.15]));
  head.add(mesh(THREE, new THREE.CircleGeometry(R, 24), P.mesh_wire, 'fan_guard_front', [0, hy, 0.225]));
  head.add(mesh(THREE, new THREE.CircleGeometry(R, 24), P.mesh_wire, 'fan_guard_rear', [0, hy, 0.075], [Math.PI, 0, 0]));
  const bl = mesh(THREE, bladesGeo(THREE, 3, { rIn: 0.03, rOut: 0.2, chord: 0.14, pitch: 0.55 }), P.fan_blade, 'fan_blades');
  bl.rotation.x = Math.PI / 2; bl.position.set(0, hy, 0.15); head.add(bl);
  head.add(cyl(THREE, P.plastic_dark, 'fan_motor', { r: 0.06, h: 0.15, seg: 16, axis: 'z', pos: [0, hy, 0] }));
  head.add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(0.0015, 0.0015, 0.25, 4).translate(-0.03, hy - 0.06 - 0.125, 0), new THREE.CylinderGeometry(0.0015, 0.0015, 0.2, 4).translate(0.03, hy - 0.06 - 0.1, 0)]), P.cable_black, 'fan_pull_cords'));
  add(cyl(THREE, P.cable_black, 'fan_cord', { r: 0.003, h: 0.08, seg: 6, pos: [0.05, ay - 0.05 - 0.04, 0.005] }));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, ay, 0]));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, ay + 0.03 + hy, 0.23 + 0.225]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0.05, ay - 0.13, 0.005]));
  return g;
}
