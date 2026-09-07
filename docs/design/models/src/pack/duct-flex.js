// Deformable flex duct — ribbed tube along a polyline. variant: '4in' | '6in' (demo path) or { size, path: [[x,y,z], ...] } in scene metres.
export const variants = ['4in', '6in'];
const DEMO = [[0, 0, 0], [0, 0, 0.3], [0.25, 0.15, 0.6], [0.4, 0.15, 1.0]];
function spec(v) {
  const o = v && typeof v === 'object' ? v : { size: v };
  const path = o.path ?? DEMO;
  let len = 0; for (let i = 1; i < path.length; i++) len += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2]);
  return { r: o.size === '6in' ? 0.076 : 0.051, path, len };
}
export const budget = (v) => ({ tris: Math.ceil(900 * spec(v).len) });
export function build(THREE, P, L, variant = '4in') {
  const { anchor, mesh } = L;
  const { r, path } = spec(variant);
  const g = new THREE.Group(); g.name = 'duct_flex';
  const curve = new THREE.CatmullRomCurve3(path.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
  const len = curve.getLength(), radial = 10, tubular = Math.max(8, Math.round(len / 0.025));
  const geo = new THREE.TubeGeometry(curve, tubular, r, radial, false);
  const pos = geo.attributes.position, c = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const t = Math.floor(i / (radial + 1)) / tubular;
    curve.getPointAt(t, c); v.fromBufferAttribute(pos, i).sub(c);
    const rr = r + 0.003 * Math.sin((t * len / 0.08) * Math.PI * 2);
    v.setLength(rr).add(c); pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  g.add(mesh(THREE, geo, P.duct_foil, 'duct_tube'));
  const A = (n, t) => { const a = anchor(THREE, P.plastic_dark, n, curve.getPointAt(t).toArray()); a.lookAt(curve.getPointAt(t).add(curve.getTangentAt(t))); g.add(a); };
  A('duct_in', 0); A('duct_out', 1);
  return g;
}
