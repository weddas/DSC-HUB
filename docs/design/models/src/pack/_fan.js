// Inline duct fan; +Z is airflow. Shared builder for 4" (pack 1) and 6"/8" EC (pack 2).
export function fan(THREE, P, L, { slug, collarR, bodyR, bodyL, collarL = 0.03, blades = 5, bracket = false, display = false }) {
  const { box, cyl, anchor, mesh, merge, bladesGeo } = L;
  const g = new THREE.Group(); g.name = slug;
  const add = (m) => (g.add(m), m);
  const yA = bodyR + (bracket ? 0.01 : 0);                   // axis height
  const body = add(cyl(THREE, P.plastic_dark, 'fan_body', { r: bodyR, h: bodyL, seg: 24, open: true, axis: 'z', pos: [0, yA, 0] }));
  const bl = mesh(THREE, bladesGeo(THREE, blades, { rIn: 0.01, rOut: collarR - 0.004, chord: collarR * 0.9, pitch: 0.7 }), P.fan_blade, 'fan_blades');
  bl.position.set(0, -bodyL / 2 + 0.03, 0);                  // body local: +Y = world +Z
  body.add(bl);
  add(cyl(THREE, P.roller_silver, 'fan_hub', { r: 0.01, h: 0.05, seg: 12, axis: 'z', pos: [0, yA, -bodyL / 2 + 0.03] }));
  add(cyl(THREE, P.plastic_dark, 'fan_collar_in', { r: collarR, h: collarL, seg: 24, open: true, axis: 'z', pos: [0, yA, -bodyL / 2 - collarL / 2] }));
  add(cyl(THREE, P.plastic_dark, 'fan_collar_out', { r: collarR, h: collarL, seg: 24, open: true, axis: 'z', pos: [0, yA, bodyL / 2 + collarL / 2] }));
  const ring = (name, z) => add(mesh(THREE, new THREE.RingGeometry(collarR, bodyR, 24), P.plastic_dark, name, [0, yA, z], [z < 0 ? Math.PI : 0, 0, 0]));
  ring('fan_end_in', -bodyL / 2); ring('fan_end_out', bodyL / 2);
  if (bracket) add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(bodyR * 1.6, 0.01, 0.06).translate(0, 0.005, 0),
    new THREE.BoxGeometry(0.02, bodyR * 0.5, 0.06).translate(-bodyR * 0.8 + 0.01, 0.01 + bodyR * 0.25, 0),
    new THREE.BoxGeometry(0.02, bodyR * 0.5, 0.06).translate(bodyR * 0.8 - 0.01, 0.01 + bodyR * 0.25, 0),
  ]), P.plastic_dark, 'fan_bracket'));
  const cw = display ? 0.09 : 0.06, ch = 0.025, top = yA + bodyR;
  add(box(THREE, P.plastic_white, 'fan_controller', [cw, ch, 0.04], [0, top + ch / 2, 0]));
  if (display) add(box(THREE, P.screen_glass, 'fan_controller_display', [0.04, 0.001, 0.02], [-0.02, top + ch + 0.0005, 0]));
  add(cyl(THREE, P.plastic_dark, 'fan_controller_knob', { r: 0.008, h: 0.008, seg: 16, pos: [display ? 0.028 : 0.015, top + ch + 0.004, 0] }));
  add(cyl(THREE, P.cable_black, 'fan_lead', { r: 0.003, h: 0.06, seg: 8, axis: 'z', pos: [-0.015, top + 0.01, -0.05] }));
  add(anchor(THREE, P.plastic_dark, 'duct_in', [0, yA, -bodyL / 2 - collarL]));
  add(anchor(THREE, P.plastic_dark, 'duct_out', [0, yA, bodyL / 2 + collarL]));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, top, 0]));
  return g;
}
