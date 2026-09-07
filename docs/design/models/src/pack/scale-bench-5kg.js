// Bench scale 200 × 150 × 30
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { box, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'scale';
  const add = (m) => (g.add(m), m);
  add(box(THREE, P.plastic_dark, 'scale_base', [0.2, 0.028, 0.15], [0, 0.014, 0]));
  add(box(THREE, P.roller_silver, 'scale_platform', [0.18, 0.002, 0.11], [0, 0.029, -0.01]));
  add(box(THREE, P.screen_glass, 'scale_display', [0.05, 0.001, 0.02], [-0.04, 0.0285, 0.06]));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.015, 0.001, 0.01).translate(0.03, 0.0285, 0.06), new THREE.BoxGeometry(0.015, 0.001, 0.01).translate(0.055, 0.0285, 0.06)]), P.plastic_dark, 'scale_buttons'));
  add(anchor(THREE, P.plastic_dark, 'platform_centre', [0, 0.03, -0.01]));
  return g;
}
