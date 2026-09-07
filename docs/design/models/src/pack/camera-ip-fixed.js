// Fixed IP camera on a ball bracket — origin at the base plate back face centre, y = 0 at the plate's bottom edge; +Z is the sight line
export const budget = { tris: 350 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'camera_ip_fixed';
  const add = (m) => (g.add(m), m);
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(0.05, 0.05, 0.006).translate(0, 0.025, 0.003),
    ]), P.plastic_dark, 'cam_base'));
  add(mesh(THREE, merge(THREE, [
    new THREE.CylinderGeometry(0.006, 0.006, 0.045, 8, 1, true).rotateX(Math.PI / 2).translate(0, 0.025, 0.0285),
    new THREE.SphereGeometry(0.012, 8, 5).translate(0, 0.025, 0.056),
    tg(THREE, new THREE.CylinderGeometry(0.005, 0.005, 0.03, 6, 1, true), { pos: [0, 0.037, 0.068], rot: [-0.7, 0, 0] }),
  ]), P.plastic_dark, 'cam_ball'));
  const cy = 0.05, cz = 0.1;
  add(cyl(THREE, P.plastic_white, 'cam_body', { r: 0.02, h: 0.06, seg: 12, axis: 'z', pos: [0, cy, cz] }));
  add(mesh(THREE, new THREE.TorusGeometry(0.008, 0.002, 3, 10), P.plastic_dark, 'cam_lens_ring', [0, cy, cz + 0.031]));
  add(mesh(THREE, new THREE.CircleGeometry(0.006, 8), P.glass_clear, 'cam_lens', [0, cy, cz + 0.031]));
  const ir = []; for (let i = 0; i < 6; i++) ir.push(new THREE.CircleGeometry(0.0015, 4).translate(Math.cos(i / 6 * Math.PI * 2) * 0.014, cy + Math.sin(i / 6 * Math.PI * 2) * 0.014, cz + 0.0305));
  add(mesh(THREE, merge(THREE, ir), P.led_status, 'cam_ir_ring'));
  add(cyl(THREE, P.led_status, 'cam_status_led', { r: 0.001, h: 0.002, seg: 4, axis: 'z', pos: [0.012, cy + 0.012, cz + 0.03] }));
  add(cyl(THREE, P.cable_black, 'cam_cable', { r: 0.002, h: 0.04, seg: 4, open: true, axis: 'z', pos: [0, cy - 0.01, cz - 0.05] }));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0.025, 0]));
  add(anchor(THREE, P.plastic_dark, 'aim', [0, cy, cz + 0.031]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, cy - 0.01, cz - 0.07]));
  return g;
}
