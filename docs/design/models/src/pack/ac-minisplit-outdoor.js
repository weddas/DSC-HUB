// Mini-split outdoor condenser 800 × 300 × 550; fan grille on +Z
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge, tg, rodGeo, bladesGeo } = L;
  const g = new THREE.Group(); g.name = 'ac_minisplit_outdoor';
  const add = (m) => (g.add(m), m);
  const W = 0.8, D = 0.3, H = 0.52, f = 0.03;
  add(box(THREE, P.frame_steel, 'cond_body', [W, H, D], [0, f + H / 2, 0]));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.06, f, D).translate(-0.3, f / 2, 0), new THREE.BoxGeometry(0.06, f, D).translate(0.3, f / 2, 0)]), P.rubber_black, 'cond_feet'));
  add(mesh(THREE, new THREE.CircleGeometry(0.21, 24), P.mesh_wire, 'cond_grille', [-0.12, f + H / 2, D / 2 + 0.002]));
  const bl = mesh(THREE, bladesGeo(THREE, 3, { rIn: 0.03, rOut: 0.19, chord: 0.13, pitch: 0.55 }), P.fan_blade, 'cond_fan_blades');
  bl.rotation.x = Math.PI / 2; bl.position.set(-0.12, f + H / 2, D / 2 - 0.04); add(bl);
  const coil = [new THREE.BoxGeometry(0.004, H - 0.04, D - 0.04).translate(0, 0, 0)];
  for (let i = 0; i < 12; i++) coil.push(new THREE.BoxGeometry(0.004, H - 0.06, 0.004).translate(0.003, 0, -0.12 + i * 0.022));
  add(mesh(THREE, merge(THREE, coil), P.roller_silver, 'cond_coil', [-W / 2 - 0.003, f + H / 2, 0]));
  add(box(THREE, P.plastic_dark, 'cond_valve_cover', [0.1, 0.16, 0.06], [W / 2 - 0.05, f + 0.12, -D / 2 - 0.03]));
  add(mesh(THREE, merge(THREE, [new THREE.CylinderGeometry(0.008, 0.008, 0.03, 10).translate(0, 0, 0), new THREE.CylinderGeometry(0.008, 0.008, 0.03, 10).translate(0, 0.05, 0)]), P.metal_brass, 'cond_valves', [W / 2 - 0.05, f + 0.08, -D / 2 - 0.06]));
  add(mesh(THREE, merge(THREE, [rodGeo(THREE, [W / 2 - 0.05, f + 0.08, -D / 2 - 0.07], [W / 2 - 0.05, f + 0.08, -D / 2 - 0.2], 0.012, 8), rodGeo(THREE, [W / 2 - 0.05, f + 0.13, -D / 2 - 0.07], [W / 2 - 0.05, f + 0.13, -D / 2 - 0.2], 0.012, 8)]), P.rubber_black, 'cond_pipes'));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(W + 0.01, 0.01, D + 0.01).translate(0, f + H + 0.005, 0), new THREE.BoxGeometry(0.12, 0.02, 0.02).translate(0, f + H + 0.02, D / 2 - 0.05)]), P.frame_steel, 'cond_lid'));
  add(anchor(THREE, P.plastic_dark, 'pipe_in', [W / 2 - 0.05, f + 0.1, -D / 2 - 0.2]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [W / 2 - 0.05, f + 0.04, -D / 2 - 0.06]));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0, 0]));
  return g;
}
