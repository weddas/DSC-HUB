// Cube camera on a magnetic base — origin at base underside centre; lens faces +Z
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { box, cyl, torus, anchor, mesh } = L;
  const g = new THREE.Group(); g.name = 'camera_cube';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.plastic_dark, 'cam_base', { r: 0.025, h: 0.012, seg: 12, pos: [0, 0.006, 0] }));
  add(mesh(THREE, new THREE.SphereGeometry(0.008, 8, 5).translate(0, 0.018, 0), P.plastic_dark, 'cam_ball'));
  add(box(THREE, P.plastic_white, 'cam_body', [0.03, 0.03, 0.03], [0, 0.04, 0]));
  add(torus(THREE, P.plastic_dark, 'cam_lens_ring', { r: 0.005, tube: 0.0015, seg: 10, tseg: 3, axis: 'z', pos: [0, 0.042, 0.0155] }));
  add(cyl(THREE, P.glass_clear, 'cam_lens', { r: 0.004, h: 0.001, seg: 10, axis: 'z', pos: [0, 0.042, 0.0155] }));
  add(cyl(THREE, P.led_status, 'cam_status_led', { r: 0.001, h: 0.001, seg: 6, axis: 'z', pos: [0.01, 0.032, 0.0155] }));
  add(cyl(THREE, P.cable_black, 'cam_cable', { r: 0.0015, h: 0.04, seg: 4, axis: 'z', pos: [0, 0.035, -0.035] }));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.035, -0.055]));
  return g;
}
