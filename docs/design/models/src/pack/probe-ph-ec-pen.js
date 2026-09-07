// Pen probes — variants ph | ec; origin at the tip bottom (hangs tip-down)
export const variants = ['ph', 'ec'];
export const budget = () => ({ tris: 300 });
export function build(THREE, P, L, variant = 'ph') {
  const { box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'probe_pen';
  const add = (m) => (g.add(m), m);
  const tipL = 0.06, bodyL = 0.15;
  if (variant === 'ph') add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(0.006, 0.006, tipL - 0.01, 8).translate(0, 0.01 + (tipL - 0.01) / 2, 0), new THREE.SphereGeometry(0.007, 8, 5).translate(0, 0.008, 0)]), P.glass_clear, 'pen_tip'));
  else add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(0.006, 0.006, tipL - 0.012, 8).translate(0, 0.012 + (tipL - 0.012) / 2, 0), new THREE.CylinderGeometry(0.0015, 0.0015, 0.014, 6).translate(-0.003, 0.007, 0), new THREE.CylinderGeometry(0.0015, 0.0015, 0.014, 6).translate(0.003, 0.007, 0)]), P.glass_clear, 'pen_tip'));
  add(cyl(THREE, P.plastic_white, 'pen_body', { r: 0.015, h: bodyL, seg: 12, pos: [0, tipL + bodyL / 2, 0] }));
  add(box(THREE, P.screen_glass, 'pen_display', [0.02, 0.01, 0.001], [0, tipL + 0.1, 0.0152]));
  add(cyl(THREE, P.led_status, 'pen_status_led', { r: 0.0015, h: 0.001, seg: 8, axis: 'z', pos: [0, tipL + 0.085, 0.0152] }));
  add(cyl(THREE, P.cable_black, 'pen_cable', { r: 0.001, h: 0.15, seg: 4, pos: [0, tipL + bodyL + 0.075, 0] }));
  add(anchor(THREE, P.plastic_dark, 'socket', [0, tipL + bodyL, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, tipL + bodyL + 0.15, 0]));
  return g;
}
