// Spider Farmer SF1000 — origin at the HOOK (y = 0), board hangs to −0.16
export const budget = { tris: 2000 };
export function build(THREE, P, L) {
  const { box, cyl, torus, anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'lamp_sf1000';
  const add = (m) => (g.add(m), m);
  const S = 0.27, yB = -0.16;                       // board bottom
  add(box(THREE, P.plastic_white, 'lamp_board', [S, 0.01, S], [0, yB + 0.005, 0]));
  add(box(THREE, P.lamp_emitter, 'lamp_emitter', [S - 0.02, 0.001, S - 0.02], [0, yB - 0.0005, 0]));
  // heatsink: 20 mm slab + 6 fins 30 mm tall
  const fins = [new THREE.BoxGeometry(S, 0.02, S).translate(0, yB + 0.02, 0)];
  for (let i = 0; i < 6; i++) fins.push(new THREE.BoxGeometry(0.006, 0.03, S - 0.02).translate(-0.1 + i * 0.04, yB + 0.045, 0));
  add(mesh(THREE, merge(THREE, fins), P.frame_steel, 'lamp_heatsink'));
  // driver box on the fins
  const yD = yB + 0.06;
  add(box(THREE, P.plastic_white, 'lamp_driver', [0.12, 0.035, 0.06], [0, yD + 0.0175, -0.06]));
  add(cyl(THREE, P.plastic_dark, 'lamp_dimmer_knob', { r: 0.008, h: 0.008, seg: 16, pos: [0.04, yD + 0.035 + 0.004, -0.06] }));
  add(cyl(THREE, P.led_status, 'lamp_status_led', { r: 0.002, h: 0.001, seg: 8, pos: [-0.04, yD + 0.0355, -0.06] }));
  // hanger: four 1.5 mm cables from the corners to a hook at the origin
  const c = 0.12, yC = yB + 0.03;
  const cables = [[c, c], [-c, c], [c, -c], [-c, -c]].map(([x, z]) => rodGeo(THREE, [x, yC, z], [0, -0.012, 0], 0.0015, 6));
  cables.push(tg(THREE, new THREE.TorusGeometry(0.007, 0.0015, 6, 16), { pos: [0, -0.007, 0] }));
  add(mesh(THREE, merge(THREE, cables), P.cable_black, 'lamp_hanger'));
  add(anchor(THREE, P.plastic_dark, 'hang_point', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, yD + 0.0175, -0.09]));
  return g;
}
