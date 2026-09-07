// 120 × 60 × 210 cm 2-in-1 clone tent (pack-2 construction + divider at 105 cm). Front is +Z.
export const budget = { tris: 9000, meshes: 60 };
export function build(THREE, P, L) {
  const { box, cyl, torus, plate, anchor, mesh, merge, tg } = L;
  const g = new THREE.Group(); g.name = 'grow_tent_2x4';
  const add = (m) => (g.add(m), m);
  const W = 1.2, D = 0.6, H = 2.1, t = 0.014, zf = D / 2 - t / 2;
  add(box(THREE, P.shell_black, 'panel_top', [W, t, D], [0, H - t / 2, 0]));
  add(box(THREE, P.shell_black, 'panel_bottom', [W, t, D], [0, t / 2, 0]));
  add(box(THREE, P.shell_black, 'panel_side_left', [t, H - 2 * t, D], [-W / 2 + t / 2, H / 2, 0]));
  add(box(THREE, P.shell_black, 'panel_side_right', [t, H - 2 * t, D], [W / 2 - t / 2, H / 2, 0]));
  add(box(THREE, P.shell_black, 'panel_back', [W - 2 * t, H - 2 * t, t], [0, H / 2, -D / 2 + t / 2]));
  // front: lower doors · mid strip · upper doors · head strip
  const divY = 1.05, dT = 0.02, iw = W - 2 * t, dw = iw / 2;
  const lo0 = t, lo1 = divY - 0.01, up0 = divY + 0.03, up1 = H - 0.12;
  const cLo = (lo0 + lo1) / 2, cUp = (up0 + up1) / 2;
  const w1 = [0.3, 0.4, 0.6], w2 = [0.3, 0.3, 1.55], vw = [0.25, 0.25, 1.55];
  add(plate(THREE, P.shell_black, 'door_main_left', { w: dw, h: lo1 - lo0, depth: t, hole: [0, w1[2] - cLo, w1[0], w1[1]], pos: [-dw / 2, cLo, zf] }));
  add(box(THREE, P.shell_black, 'door_main_right', [dw, lo1 - lo0, t], [dw / 2, cLo, zf]));
  add(plate(THREE, P.shell_black, 'door_upper_left', { w: dw, h: up1 - up0, depth: t, hole: [0, w2[2] - cUp, w2[0], w2[1]], pos: [-dw / 2, cUp, zf] }));
  add(plate(THREE, P.shell_black, 'door_upper_right', { w: dw, h: up1 - up0, depth: t, hole: [0, vw[2] - cUp, vw[0], vw[1]], pos: [dw / 2, cUp, zf] }));
  add(box(THREE, P.shell_black, 'panel_front_mid', [iw, up0 - lo1, t], [0, (lo1 + up0) / 2, zf]));
  add(box(THREE, P.shell_black, 'panel_upper_front', [iw, H - t - up1, t], [0, (up1 + H - t) / 2, zf]));
  const win = (name, x, [ww, wh, wy], paneMat) => {
    add(box(THREE, paneMat, `${name}_pane`, [ww, wh, 0.003], [x, wy, D / 2 - 0.006]));
    add(plate(THREE, P.trim_green, `${name}_frame`, { w: ww + 0.028, h: wh + 0.028, depth: 0.006, hole: [0, 0, ww, wh], pos: [x, wy, D / 2 + 0.003] }));
  };
  win('observation_window_1', -dw / 2, w1, P.window_acrylic);
  win('observation_window_2', -dw / 2, w2, P.window_acrylic);
  win('vent_window', dw / 2, vw, P.mesh_wire);
  const zz = D / 2 + 0.0015;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(0.02, lo1 - lo0, 0.003).translate(0, cLo, zz), new THREE.BoxGeometry(iw, 0.02, 0.003).translate(0, lo1, zz),
    new THREE.BoxGeometry(0.02, up1 - up0, 0.003).translate(0, cUp, zz), new THREE.BoxGeometry(iw, 0.02, 0.003).translate(0, up1, zz),
  ]), P.trim_green, 'zips'));
  const li = 0.002, lw = iw - 0.004, lh = H - 2 * t - 0.004, ld = D - 2 * t - 0.004;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(lw, li, ld).translate(0, H - t - li / 2, 0),
    new THREE.BoxGeometry(li, lh, ld).translate(-W / 2 + t + li / 2, H / 2, 0),
    new THREE.BoxGeometry(li, lh, ld).translate(W / 2 - t - li / 2, H / 2, 0),
    new THREE.BoxGeometry(lw, lh, li).translate(0, H / 2, -D / 2 + t + li / 2),
  ]), P.foil_lining, 'lining'));
  add(box(THREE, P.shell_black, 'divider_shelf', [lw, dT, ld], [0, divY, 0]));
  // frame
  const pr = 0.0095, px = W / 2 - 0.028, pz = D / 2 - 0.028, cg = (r, h) => new THREE.CylinderGeometry(r, r, h, 10);
  add(mesh(THREE, merge(THREE, [[-px, -pz], [px, -pz], [px, pz], [-px, pz]].map(([x, z]) => cg(pr, H - 2 * t).translate(x, H / 2, z))), P.frame_steel, 'poles_corner'));
  for (const [tier, y] of Object.entries({ base: 0.028, mid: divY, top: H - 0.028 })) {
    add(mesh(THREE, merge(THREE, [
      cg(pr, 2 * px).rotateZ(Math.PI / 2).translate(0, y, pz), cg(pr, 2 * px).rotateZ(Math.PI / 2).translate(0, y, -pz),
      cg(pr, 2 * pz).rotateX(Math.PI / 2).translate(-px, y, 0), cg(pr, 2 * pz).rotateX(Math.PI / 2).translate(px, y, 0),
    ]), P.frame_steel, `rail_${tier}`));
  }
  add(mesh(THREE, merge(THREE, [cg(pr, 2 * px).rotateZ(Math.PI / 2).translate(0, H - 0.05, -D / 4), cg(pr, 2 * px).rotateZ(Math.PI / 2).translate(0, H - 0.05, D / 4)]), P.frame_steel, 'hanger_bars'));
  // tray
  const tw = W - 0.09, td = D - 0.09, tt = 0.006, lipH = 0.08, trayY = t + tt;
  add(box(THREE, P.tray_pvc, 'floor_tray', [tw, tt, td], [0, t + tt / 2, 0]));
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(tw, lipH, tt).translate(0, t + lipH / 2, td / 2 - tt / 2), new THREE.BoxGeometry(tw, lipH, tt).translate(0, t + lipH / 2, -td / 2 + tt / 2),
    new THREE.BoxGeometry(tt, lipH, td - 2 * tt).translate(-tw / 2 + tt / 2, t + lipH / 2, 0), new THREE.BoxGeometry(tt, lipH, td - 2 * tt).translate(tw / 2 - tt / 2, t + lipH / 2, 0),
  ]), P.tray_pvc, 'tray_lips'));
  // ports (all 4")
  function port(name, r, [x, y, z], axis, sign) {
    const Lp = 0.08, seg = 20;
    const off = (k) => [x + (axis === 'x' ? k * sign : 0), y + (axis === 'y' ? k * sign : 0), z + (axis === 'z' ? k * sign : 0)];
    add(cyl(THREE, P.shell_black, `${name}_sleeve`, { r, h: Lp, seg, open: true, axis, pos: off(Lp / 2) }));
    add(torus(THREE, P.trim_green, `${name}_ring`, { r: r + 0.002, tube: 0.006, seg, tseg: 6, axis, pos: off(Lp) }));
    add(cyl(THREE, P.shell_black, `${name}_iris`, { r: r - 0.001, h: 0.004, seg, axis, pos: off(Lp - 0.01) }));
    return off(Lp);
  }
  const R4 = 0.051, A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
  const roof = port('vent_port_roof', R4, [0, H, -D / 2 + 0.15], 'y', 1);
  const srl = port('vent_port_side_right_lower', R4, [W / 2, 0.35, 0.1], 'x', 1);
  const slu = port('vent_port_side_left_upper', R4, [-W / 2, 0.85, 0.1], 'x', -1);
  const sll = port('vent_port_side_left_lower', R4, [-W / 2, 0.3, 0.1], 'x', -1);
  const upc = port('vent_port_upper_chamber', R4, [W / 2, 1.6, 0.1], 'x', 1);
  const c1 = port('cable_port_1', R4, [-0.4, 0.12, -D / 2], 'z', -1);
  const c2 = port('cable_port_2', R4, [0.4, 0.12, -D / 2], 'z', -1);
  A('lamp_main', [0, divY - dT / 2 - 0.02, 0]); A('lamp_upper', [0, H - t - 0.02, 0]);
  A('mat_spot', [0, trayY, 0]); A('probe_1', [-0.25, trayY, 0]); A('probe_2', [0.25, trayY, 0]);
  A('tray_upper', [0, divY + dT / 2, 0]);
  A('fan_intake', srl); A('fan_exhaust', roof); A('duct_passive_1', sll); A('duct_passive_2', slu); A('duct_upper', upc);
  A('canopy_sensor', [0, trayY + 0.6, 0]);
  A('humidifier_spot', [0.45, trayY, -0.15]); A('mister_spot', [-0.45, trayY, -0.15]);
  A('cable_1', c1); A('cable_2', c2);
  return g;
}
