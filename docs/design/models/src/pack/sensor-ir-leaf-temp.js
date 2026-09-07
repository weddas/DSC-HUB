// IR leaf-temperature sensor on a gooseneck from a spring clip — origin at the clip jaw centre, y = 0 at the clip bottom
export const budget = { tris: 250 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh } = L;
  const g = new THREE.Group(); g.name = 'sensor_ir_leaf';
  const add = (m) => (g.add(m), m);
  add(box(THREE, P.plastic_dark, 'clip_jaw_bottom', [0.04, 0.006, 0.03], [0, 0.003, 0]));
  add(box(THREE, P.plastic_dark, 'clip_jaw_top', [0.04, 0.006, 0.03], [0, 0.016, -0.004], [-0.25, 0, 0]));
  const pts = [[0, 0.02, -0.01], [0.02, 0.06, 0], [0.03, 0.1, 0.03], [0.01, 0.14, 0.05], [-0.01, 0.17, 0.06], [0, 0.2, 0.07]].map((p) => new THREE.Vector3(...p));
  const curve = new THREE.CatmullRomCurve3(pts);
  add(mesh(THREE, new THREE.TubeGeometry(curve, 12, 0.004, 5, false), P.roller_silver, 'ir_gooseneck'));
  add(cyl(THREE, P.plastic_dark, 'ir_body', { r: 0.0125, h: 0.04, seg: 10, axis: 'z', pos: [0, 0.2, 0.09] }));
  add(mesh(THREE, new THREE.CircleGeometry(0.005, 10), P.glass_clear, 'ir_lens', [0, 0.2, 0.1105]));
  add(cyl(THREE, P.led_status, 'ir_status_led', { r: 0.0015, h: 0.002, seg: 6, axis: 'z', pos: [0.006, 0.206, 0.069] }));
  add(cyl(THREE, P.cable_black, 'ir_cable', { r: 0.0015, h: 0.05, seg: 5, open: true, axis: 'z', pos: [0, 0.192, 0.045] }));
  add(anchor(THREE, P.plastic_dark, 'clip_point', [0, 0.008, 0]));
  add(anchor(THREE, P.plastic_dark, 'aim', [0, 0.2, 0.111]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, 0.192, 0.02]));
  return g;
}
