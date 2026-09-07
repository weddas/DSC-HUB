// Tower fan Ø280 × 760; fan_column yaws on the vertical axis; outlet faces +Z
export const budget = { tris: 1000 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'fan_tower';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.plastic_dark, 'fan_base', { r: 0.14, h: 0.04, seg: 24, pos: [0, 0.02, 0] }));
  const col = new THREE.Group(); col.name = 'fan_column'; col.position.set(0, 0.04, 0); add(col);
  const body = new THREE.CylinderGeometry(0.08, 0.1, 0.72, 20); body.scale(1, 1, 0.75); body.translate(0, 0.36, 0);
  col.add(mesh(THREE, body, P.plastic_dark, 'fan_column_body'));
  col.add(mesh(THREE, new THREE.PlaneGeometry(0.08, 0.66).translate(0, 0.36, 0.068), P.mesh_wire, 'fan_outlet_grille'));
  col.add(mesh(THREE, new THREE.PlaneGeometry(0.08, 0.66).rotateY(Math.PI).translate(0, 0.36, -0.068), P.mesh_wire, 'fan_intake_grille'));
  const cap = merge(THREE, [new THREE.CylinderGeometry(0.08, 0.08, 0.02, 20).translate(0, 0.73, 0), ...[0, 1, 2, 3].map((i) => new THREE.CylinderGeometry(0.006, 0.006, 0.003, 10).translate(-0.03 + i * 0.02, 0.741, 0.03))]);
  cap.scale(1, 1, 0.75);
  col.add(mesh(THREE, cap, P.plastic_dark, 'fan_cap'));
  col.add(box(THREE, P.screen_glass, 'fan_cap_display', [0.04, 0.001, 0.015], [0, 0.7405, -0.01]));
  add(cyl(THREE, P.cable_black, 'fan_cord', { r: 0.003, h: 0.08, seg: 6, axis: 'z', pos: [0, 0.01, -0.18] }));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, 0.4, 0.07]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.01, -0.22]));
  return g;
}
