// Mini-split indoor head 800 × 190 × 300 — origin at the back mounting plate centre, y = 0 at bottom edge
export const budget = { tris: 1200 };
export function build(THREE, P, L) {
  const { roundedBoxGeo, box, cyl, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'ac_minisplit_indoor';
  const add = (m) => (g.add(m), m);
  const W = 0.8, D = 0.19, H = 0.3;
  add(box(THREE, P.plastic_white, 'ac_mount_plate', [0.6, 0.2, 0.004], [0, 0.15, 0.002]));
  // housing: rounded x-y silhouette (rounded vertical edges seen from the front), depth D along z, hugging the plate
  const hg = roundedBoxGeo(THREE, { w: W, d: H, h: D - 0.004, r: 0.04, seg: 3 }); // footprint w×d in x/z, extruded up y
  hg.rotateX(Math.PI / 2);           // extrusion now runs along +z (depth), footprint d becomes height
  hg.translate(0, H / 2, 0.004);
  add(mesh(THREE, hg, P.plastic_white, 'ac_housing'));
  add(box(THREE, P.mesh_wire, 'ac_intake_grille', [0.7, 0.002, 0.06], [0, H + 0.001, D / 2]));
  add(box(THREE, P.plastic_white, 'ac_front_panel', [0.72, 0.16, 0.004], [0, 0.18, D + 0.002]));
  // outlet slot backing and the vane (child, pivot on its long x axis at the slot top)
  add(box(THREE, P.plastic_dark, 'ac_outlet_recess', [0.68, 0.04, 0.002], [0, 0.05, D + 0.001]));
  const vane = mesh(THREE, new THREE.BoxGeometry(0.68, 0.003, 0.035).translate(0, 0, 0.0175), P.plastic_dark, 'ac_vane');
  vane.position.set(0, 0.068, D + 0.002); vane.rotation.x = 0.3; add(vane);
  // barrel fan: cylinder with 12 shallow ridges, child pivoting on its long axis
  const bf = [new THREE.CylinderGeometry(0.043, 0.043, 0.68, 16).rotateZ(Math.PI / 2)];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; bf.push(tg(THREE, new THREE.BoxGeometry(0.68, 0.004, 0.006), { pos: [0, 0.045 * Math.sin(a), 0.045 * Math.cos(a)], rot: [a, 0, 0] })); }
  const barrel = mesh(THREE, merge(THREE, bf), P.fan_blade, 'ac_barrel_fan'); barrel.position.set(0, 0.1, D * 0.55); add(barrel);
  add(box(THREE, P.screen_glass, 'ac_display', [0.05, 0.02, 0.001], [0.3, 0.18, D + 0.0045]));
  add(cyl(THREE, P.led_status, 'ac_status_led', { r: 0.002, h: 0.001, seg: 8, axis: 'z', pos: [0.34, 0.16, D + 0.0045] }));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0.15, 0]));
  add(anchor(THREE, P.plastic_dark, 'outlet_face', [0, 0.05, D]));
  add(anchor(THREE, P.plastic_dark, 'pipe_out', [0.36, 0.06, 0.01]));
  return g;
}
