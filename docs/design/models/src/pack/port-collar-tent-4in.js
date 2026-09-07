// Tent-side 4" port sleeve gathered around a duct — origin at the tent wall face centre, +Z outward
export const budget = { tris: 300 };
export function build(THREE, P, L) {
  const { cyl, torus, anchor, mesh } = L;
  const g = new THREE.Group(); g.name = 'port_collar';
  const add = (m) => (g.add(m), m);
  add(cyl(THREE, P.shell_black, 'collar_sleeve', { r: 0.051, h: 0.12, seg: 16, open: true, axis: 'z', pos: [0, 0, 0.06] }));
  add(mesh(THREE, new THREE.TorusGeometry(0.055, 0.01, 5, 16), P.shell_black, 'collar_ruffle', [0, 0, 0.1]));
  add(mesh(THREE, new THREE.TorusGeometry(0.012, 0.003, 4, 12), P.cable_black, 'collar_drawcord', [0.05, -0.04, 0.1], [0, Math.PI / 2, 0]));
  add(anchor(THREE, P.plastic_dark, 'duct_in', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'duct_out', [0, 0, 0.12]));
  return g;
}
