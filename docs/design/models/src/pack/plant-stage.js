// Plant at each hub growth stage — origin at the soil surface (y = 0), no pot.
export const variants = ['germination', 'seedling', 'early-veg', 'veg', 'push-veg', 'early-flower', 'flower', 'late-flower', 'flush'];
export const budget = (v) => ({ tris: v === 'germination' ? 200 : 1800 });

function fanN(THREE, L, n, len, [x, y, z], rotY) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const q = L.tg(THREE, new THREE.PlaneGeometry(len * 0.2, len), { pos: [0, len / 2, 0], rot: [-0.35, 0, 0] });
    L.tg(THREE, q, { rot: [0, 0, (i - (n - 1) / 2) * 0.55] });
    L.tg(THREE, q, { rot: [Math.PI / 2 - 0.4, rotY, 0] });
    q.translate(x, y, z); parts.push(q);
  }
  return parts;
}

const SPEC = {
  'early-veg':    { h: 0.18, branches: 0, fans: 4, canopyR: 0.09, fanLen: [0.06, 0.09] },
  'veg':          { h: 0.35, branches: 2, fans: 7, canopyR: 0.15, fanLen: [0.09, 0.13], stakes: true },
  'push-veg':     { h: 0.48, branches: 4, fans: 11, canopyR: 0.25, fanLen: [0.1, 0.14], stakes: true },
  'early-flower': { h: 0.62, branches: 4, fans: 11, canopyR: 0.25, fanLen: [0.1, 0.14], stakes: true, bud: [0.025, 0.05] },
  'flower':       { h: 0.68, branches: 4, fans: 9, canopyR: 0.275, fanLen: [0.1, 0.15], stakes: true, bud: [0.04, 0.09] },
  'late-flower':  { h: 0.68, branches: 4, fans: 6, fade: 2, canopyR: 0.26, fanLen: [0.1, 0.14], stakes: true, bud: [0.05, 0.12], ties: true },
  'flush':        { h: 0.68, branches: 4, fans: 4, fade: 99, canopyR: 0.24, fanLen: [0.09, 0.13], stakes: true, bud: [0.05, 0.12], ties: true },
};

export function build(THREE, P, L, variant = 'veg') {
  const { anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'plant_stage';
  const add = (m) => (g.add(m), m);
  const A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));

  if (variant === 'germination') {
    add(mesh(THREE, merge(THREE, [
      tg(THREE, new THREE.SphereGeometry(1, 6, 4), { pos: [-0.0035, 0.004, 0], scale: [0.004, 0.0075, 0.005] }),
      tg(THREE, new THREE.SphereGeometry(1, 6, 4), { pos: [0.0035, 0.004, 0], scale: [0.004, 0.0075, 0.005] }),
    ]), P.soil, 'plant_seed'));
    add(mesh(THREE, tg(THREE, new THREE.TorusGeometry(0.01, 0.0012, 4, 8, Math.PI), { pos: [0, 0.006, 0.006], rot: [0, Math.PI / 2, 0] }), P.plastic_white, 'plant_stem'));
    A('canopy_top', [0, 0.018, 0.006]); A('canopy_centre', [0, 0.008, 0.003]);
    return g;
  }
  if (variant === 'seedling') {
    const h = 0.07;
    add(mesh(THREE, rodGeo(THREE, [0, 0, 0], [0, h, 0], 0.0025, 6), P.leaf_green, 'plant_stem'));
    const cot = (rotY) => tg(THREE, new THREE.PlaneGeometry(0.04, 0.02), { pos: [0.022, 0, 0], rot: [-Math.PI / 2 + 0.3, 0, 0] }).applyMatrix4(new THREE.Matrix4().makeRotationY(rotY)).translate(0, h * 0.8, 0);
    add(mesh(THREE, merge(THREE, [cot(0), cot(Math.PI), ...fanN(THREE, L, 3, 0.05, [0, h, 0], 1.2)]), P.leaf_green, 'plant_leaves'));
    A('canopy_top', [0, h + 0.03, 0]); A('canopy_centre', [0, h * 0.85, 0]);
    return g;
  }

  const s = SPEC[variant]; const { h, branches, fans, fade = 0, canopyR, fanLen, bud, ties, stakes } = s;
  const stemR = 0.004 + h * 0.006;
  const stems = [rodGeo(THREE, [0, 0, 0], [0, h, 0], stemR, 6)];
  const tips = [];
  for (let i = 0; i < branches; i++) {
    const a = i * 2.4 + 0.6, rr = canopyR * 0.8, y0 = h * (0.28 + 0.09 * i);
    const tip = [Math.cos(a) * rr, h * (0.62 + 0.1 * (i % 3)), Math.sin(a) * rr];
    stems.push(rodGeo(THREE, [0, y0, 0], tip, stemR * 0.6, 6)); tips.push(tip);
  }
  if (ties) for (const f of [0.35, 0.6]) stems.push(new THREE.TorusGeometry(stemR + 0.006, 0.002, 4, 10).rotateX(Math.PI / 2).translate(0, h * f, 0));
  add(mesh(THREE, merge(THREE, stems), P.leaf_green, 'plant_stem'));

  const nStem = Math.max(1, fans - branches);
  const list = [];
  for (let j = 0; j < nStem; j++) list.push([0, nStem === 1 ? h : h * (0.32 + 0.68 * j / (nStem - 1)), 0]);
  list.push(...tips);
  const nFade = Math.min(fade, list.length), nGreen = list.length - nFade;
  const green = [], faded = [];
  list.forEach((p, i) => {
    const len = fanLen[0] + (fanLen[1] - fanLen[0]) * ((i % 3) / 2);
    (i < nGreen ? green : faded).push(...fanN(THREE, L, 5, len, p, i * 1.3));
  });
  if (green.length) add(mesh(THREE, merge(THREE, green), P.leaf_green, 'plant_leaves'));
  if (faded.length) add(mesh(THREE, merge(THREE, faded), P.soil, 'plant_leaves_fade'));

  let topY = h + fanLen[1] * 0.3;
  if (bud) {
    const [bw, bh] = bud;
    const budPos = [[0, h + bh * 0.35, 0], ...tips.map(([x, y, z]) => [x, y + bh * 0.3, z])];
    for (let j = nStem - 1; budPos.length < 8 && j >= 0; j--) budPos.push([0.012, list[j][1] + bh * 0.2, 0.006]);
    add(mesh(THREE, merge(THREE, budPos.map((p) => tg(THREE, new THREE.SphereGeometry(1, 8, 6), { pos: p, scale: [bw / 2, bh / 2, bw / 2] }))), P.trim_green, 'plant_buds'));
    const pist = [];
    budPos.forEach(([x, y, z], k) => { for (let i = 0; i < 3; i++) pist.push(tg(THREE, new THREE.PlaneGeometry(0.004, 0.018), { pos: [x, y + bh / 2, z], rot: [0.5 + i * 0.3, k + i * 2.1, 0.4] })); });
    add(mesh(THREE, merge(THREE, pist), P.plastic_white, 'plant_pistils'));
    topY = h + bh * 0.85;
  }
  const c = list.reduce((acc, p) => [acc[0] + p[0] / list.length, acc[1] + p[1] / list.length, acc[2] + p[2] / list.length], [0, 0, 0]);
  A('canopy_top', [0, topY, 0]); A('canopy_centre', c);
  if (stakes) { A('stake_1', [0.06, 0, 0]); A('stake_2', [-0.06, 0, 0]); }
  return g;
}
