// 3-gal fabric pot with a stylised plant; stage = seedling | veg | flower | empty
export function pot(THREE, P, L, stage) {
  const { box, cyl, anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'pot_plant_' + stage;
  const add = (m) => (g.add(m), m);
  // pot: lathe with floor, tapered wall, rolled rim, short inner wall down to the soil
  const pts = [[0, 0], [0.11, 0], [0.125, 0.22], [0.118, 0.22], [0.118, 0.2]].map(([r, y]) => new THREE.Vector2(r, y));
  add(mesh(THREE, new THREE.LatheGeometry(pts, 20), P.pot_fabric, 'pot_body'));
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(0.06, 0.02, 0.004).translate(0, 0.19, 0.127),
    new THREE.BoxGeometry(0.06, 0.02, 0.004).translate(0, 0.19, -0.127),
  ]), P.pot_fabric, 'pot_handles'));
  add(cyl(THREE, P.soil, 'soil_surface', { r: 0.117, h: 0.002, seg: 20, pos: [0, 0.2, 0] }));
  const soilY = 0.2;
  let top = soilY;
  if (stage === 'seedling') {
    top = soilY + 0.06;
    add(cyl(THREE, P.leaf_green, 'plant_stem', { r: 0.003, h: 0.06, seg: 6, pos: [0, soilY + 0.03, 0] }));
    const leaf = (rotY) => tg(THREE, new THREE.PlaneGeometry(0.04, 0.02), { pos: [0.022, 0, 0], rot: [-Math.PI / 2 + 0.3, 0, 0] }).applyMatrix4(new THREE.Matrix4().makeRotationY(rotY)).translate(0, top, 0);
    add(mesh(THREE, merge(THREE, [leaf(0), leaf(Math.PI)]), P.leaf_green, 'plant_leaves'));
  } else if (stage === 'veg' || stage === 'flower') {
    const h = 0.35; top = soilY + h;
    const stems = [rodGeo(THREE, [0, soilY, 0], [0, top, 0], 0.006, 6)];
    const branchTips = [[0.09, soilY + 0.24, 0.03], [-0.08, soilY + 0.2, -0.05]];
    branchTips.forEach((tip, i) => stems.push(rodGeo(THREE, [0, soilY + 0.1 + i * 0.03, 0], tip, 0.004, 6)));
    add(mesh(THREE, merge(THREE, stems), P.leaf_green, 'plant_stem'));
    // 7 five-finger fans
    const fanAt = ([x, y, z], scale, rotY) => {
      const parts = [];
      for (let i = 0; i < 5; i++) {
        const a = (i - 2) * 0.55;
        const q = tg(THREE, new THREE.PlaneGeometry(0.022 * scale, 0.11 * scale), { pos: [0, 0.055 * scale, 0], rot: [-0.35, 0, 0] });
        tg(THREE, q, { rot: [0, 0, a] });                  // fan the fingers
        tg(THREE, q, { rot: [Math.PI / 2 - 0.4, rotY, 0] }); // lay roughly flat, droop outward
        q.translate(x, y, z); parts.push(q);
      }
      return parts;
    };
    const leaves = [];
    const nodes = [[0, soilY + 0.12, 0], [0, soilY + 0.2, 0], [0, soilY + 0.28, 0], [0, top, 0], ...branchTips, [0.045, soilY + 0.17, 0.015]];
    nodes.forEach((p, i) => leaves.push(...fanAt(p, 0.9 + (i % 3) * 0.15, i * 1.3)));
    add(mesh(THREE, merge(THREE, leaves), P.leaf_green, 'plant_leaves'));
    if (stage === 'flower') {
      const buds = [[0, top + 0.03, 0], [0, soilY + 0.3, 0], [0.045, soilY + 0.19, 0.015], ...branchTips.map(([x, y, z]) => [x, y + 0.03, z]), [0, soilY + 0.24, 0]];
      add(mesh(THREE, merge(THREE, buds.map((p) => tg(THREE, new THREE.SphereGeometry(1, 10, 6), { pos: p, scale: [0.02, 0.045, 0.02] }))), P.trim_green, 'plant_buds'));
      top += 0.075;
    }
  }
  add(anchor(THREE, P.plastic_dark, 'probe_socket', [0, soilY, -0.06]));
  add(anchor(THREE, P.plastic_dark, 'canopy_top', [0, top, 0]));
  return g;
}
