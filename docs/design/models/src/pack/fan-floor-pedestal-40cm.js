// 16" pedestal fan; fan_head yaws at the knuckle; blows +Z
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { cyl, anchor, mesh, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'fan_pedestal';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.plastic_dark, 'fan_base', { r: 0.225, h: 0.03, seg: 24, pos: [0, 0.015, 0] }));
  add(cyl(THREE, P.roller_silver, 'fan_column', { r: 0.015, h: 1.0, seg: 12, pos: [0, 0.53, 0] }));
  add(cyl(THREE, P.plastic_dark, 'fan_knuckle', { r: 0.03, h: 0.06, seg: 12, pos: [0, 1.06, 0] }));
  const head = new THREE.Group(); head.name = 'fan_head'; head.position.set(0, 1.09, 0); add(head);
  const R = 0.225, hy = 0.12;
  head.add(mesh(THREE, new THREE.CylinderGeometry(R, R, 0.15, 24, 1, true).rotateX(Math.PI / 2), P.plastic_dark, 'fan_head_ring', [0, hy, 0.05]));
  head.add(mesh(THREE, new THREE.CircleGeometry(R, 24), P.mesh_wire, 'fan_guard_front', [0, hy, 0.125]));
  head.add(mesh(THREE, new THREE.CircleGeometry(R, 24), P.mesh_wire, 'fan_guard_rear', [0, hy, -0.025], [Math.PI, 0, 0]));
  const bl = mesh(THREE, bladesGeo(THREE, 3, { rIn: 0.03, rOut: 0.2, chord: 0.14, pitch: 0.55 }), P.fan_blade, 'fan_blades');
  bl.rotation.x = Math.PI / 2; bl.position.set(0, hy, 0.05); head.add(bl);
  head.add(cyl(THREE, P.plastic_dark, 'fan_motor', { r: 0.06, h: 0.15, seg: 16, axis: 'z', pos: [0, hy, -0.1] }));
  head.add(cyl(THREE, P.plastic_dark, 'fan_osc_knob', { r: 0.008, h: 0.03, seg: 8, pos: [0, hy + 0.075, -0.1] }));
  add(cyl(THREE, P.cable_black, 'fan_cord', { r: 0.003, h: 0.08, seg: 6, axis: 'z', pos: [0, 0.01, -0.26] }));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, 1.09 + hy, 0.125]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.01, -0.3]));
  return g;
}
