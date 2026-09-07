// Gooseneck clip LED — origin at the clamp jaw centre, y = 0 at clamp bottom; head faces +Z
export const budget = { tris: 800 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh } = L;
  const g = new THREE.Group(); g.name = 'lamp_clip_led';
  const add = (m) => (g.add(m), m);
  add(box(THREE, P.plastic_dark, 'clip_jaw_bottom', [0.08, 0.006, 0.04], [0, 0.003, 0]));
  add(box(THREE, P.plastic_dark, 'clip_jaw_top', [0.08, 0.006, 0.04], [0, 0.033, 0]));
  add(cyl(THREE, P.plastic_dark, 'clip_knuckle', { r: 0.01, h: 0.04, seg: 12, axis: 'z', pos: [-0.04, 0.018, 0] }));
  // gooseneck: rises 0.25 then curves 90° forward (+Z), radius 0.1
  const curve = new THREE.CurvePath();
  curve.add(new THREE.LineCurve3(new THREE.Vector3(-0.04, 0.03, 0), new THREE.Vector3(-0.04, 0.25, 0)));
  curve.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.04, 0.25, 0), new THREE.Vector3(-0.04, 0.35, 0), new THREE.Vector3(-0.04, 0.35, 0.1)));
  add(mesh(THREE, new THREE.TubeGeometry(curve, 12, 0.006, 8, false), P.roller_silver, 'gooseneck'));
  add(cyl(THREE, P.plastic_dark, 'lamp_head', { r: 0.055, h: 0.05, seg: 20, axis: 'z', pos: [-0.04, 0.35, 0.125] }));
  add(cyl(THREE, P.lamp_emitter, 'lamp_emitter', { r: 0.05, h: 0.001, seg: 20, axis: 'z', pos: [-0.04, 0.35, 0.151] }));
  add(cyl(THREE, P.cable_black, 'lamp_cord', { r: 0.002, h: 0.06, seg: 6, axis: 'x', pos: [-0.08, 0.018, 0] }));
  add(anchor(THREE, P.plastic_dark, 'clip_point', [0, 0.018, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [-0.11, 0.018, 0]));
  return g;
}
