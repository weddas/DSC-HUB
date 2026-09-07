// Foil ducting — origin at inlet face centre, axis +Z. Straight 1 m or 90° elbow (turns toward +X).
export function duct(THREE, P, L, { slug, r, kind }) {
  const { anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = slug;
  const add = (m) => (g.add(m), m);
  if (kind === 'straight') {
    // lathe profile along y (→ rotated to z): 12 ribs at 80 mm, ±3 mm
    const pts = []; const n = 12, pitch = 0.08, L0 = 1.0;
    pts.push(new THREE.Vector2(r - 0.003, 0));
    for (let i = 0; i < n; i++) {
      const c = 0.06 + i * pitch;
      pts.push(new THREE.Vector2(r + 0.003, c), new THREE.Vector2(r - 0.003, c + pitch / 2));
    }
    pts.push(new THREE.Vector2(r - 0.003, L0));
    const geo = new THREE.LatheGeometry(pts, 12);
    add(mesh(THREE, geo, P.duct_foil, 'duct_tube', [0, 0, 0], [Math.PI / 2, 0, 0]));
    add(anchor(THREE, P.plastic_dark, 'duct_in', [0, 0, 0]));
    add(anchor(THREE, P.plastic_dark, 'duct_out', [0, 0, L0]));
  } else {
    const R = 0.15; const parts = [new THREE.TorusGeometry(R, r - 0.002, 14, 12, Math.PI / 2)];
    for (let i = 0; i < 6; i++) {
      const rib = new THREE.TorusGeometry(R, r + 0.003, 14, 1, 0.08);
      tg(THREE, rib, { rot: [0, 0, (i + 0.5) * (Math.PI / 2) / 6 - 0.04] });
      parts.push(rib);
    }
    const geo = merge(THREE, parts);
    // map: start (R,0,0) tangent +Y → origin tangent +Z; end tangent −X → +X  (180° about (0,1,1)/√2), then shift +R in x
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 1).normalize(), Math.PI);
    tg(THREE, geo, { quat: q }); geo.translate(R, 0, 0);
    add(mesh(THREE, geo, P.duct_foil, 'duct_tube'));
    add(anchor(THREE, P.plastic_dark, 'duct_in', [0, 0, 0]));
    add(anchor(THREE, P.plastic_dark, 'duct_out', [R, 0, R]));
  }
  return g;
}
