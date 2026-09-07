// Tent family — variant "WxDxH" in cm, e.g. "120x120x200"
export const variants = ['60x60x140', '80x80x160', '100x100x200', '120x120x200', '150x150x200', '300x150x200'];
export const budget = () => ({ tris: 8000, meshes: 45 });
export function build(THREE, P, L, variant = '120x120x200') {
  const { box, cyl, torus, plate, anchor, mesh, merge } = L;
  const [W, D, H] = variant.split('x').map((n) => +n / 100);
  const g = new THREE.Group(); g.name = 'grow_tent';
  const add = (m) => (g.add(m), m);
  const t = 0.014, zf = D / 2 - t / 2;
  add(box(THREE, P.shell_black, 'panel_top', [W, t, D], [0, H - t / 2, 0]));
  add(box(THREE, P.shell_black, 'panel_bottom', [W, t, D], [0, t / 2, 0]));
  add(box(THREE, P.shell_black, 'panel_side_left', [t, H - 2 * t, D], [-W / 2 + t / 2, H / 2, 0]));
  add(box(THREE, P.shell_black, 'panel_side_right', [t, H - 2 * t, D], [W / 2 - t / 2, H / 2, 0]));
  add(box(THREE, P.shell_black, 'panel_back', [W - 2 * t, H - 2 * t, t], [0, H / 2, -D / 2 + t / 2]));
  // doors: ≤1.0 wide → single full-width door; ≥1.2 → two doors meeting at centre (total ≤ 1.2 m, flanks fill the rest)
  const dY0 = t, dY1 = H - 0.15, dH = dY1 - dY0, dYc = (dY0 + dY1) / 2;
  const single = W <= 1.0;
  const doorsW = single ? W - 2 * t : Math.min(W - 2 * t, 1.2);
  add(box(THREE, P.shell_black, 'panel_upper_front', [doorsW, H - t - dY1, t], [0, (dY1 + H - t) / 2, zf]));
  const flank = (W - 2 * t - doorsW) / 2;
  if (flank > 0.001) {
    add(box(THREE, P.shell_black, 'panel_front_left', [flank, H - 2 * t, t], [-(doorsW / 2 + flank / 2), H / 2, zf]));
    add(box(THREE, P.shell_black, 'panel_front_right', [flank, H - 2 * t, t], [(doorsW / 2 + flank / 2), H / 2, zf]));
  }
  const winW = 0.3, winH = 0.4, winY = Math.min(1.3, H * 0.6);
  let winX;
  if (single) {
    winX = 0;
    add(plate(THREE, P.shell_black, 'door_main', { w: doorsW, h: dH, depth: t, hole: [0, winY - dYc, winW, winH], pos: [0, dYc, zf] }));
  } else {
    winX = -doorsW / 4;
    add(plate(THREE, P.shell_black, 'door_main_left', { w: doorsW / 2, h: dH, depth: t, hole: [winX + doorsW / 4, winY - dYc, winW, winH], pos: [-doorsW / 4, dYc, zf] }));
    add(box(THREE, P.shell_black, 'door_main_right', [doorsW / 2, dH, t], [doorsW / 4, dYc, zf]));
  }
  add(box(THREE, P.window_acrylic, 'observation_window_1_pane', [winW, winH, 0.003], [winX, winY, D / 2 - 0.006]));
  add(plate(THREE, P.trim_green, 'observation_window_1_frame', { w: winW + 0.028, h: winH + 0.028, depth: 0.006, hole: [0, 0, winW, winH], pos: [winX, winY, D / 2 + 0.003] }));
  const zz = D / 2 + 0.0015;
  const zipX = single ? doorsW / 2 - 0.02 : 0;                 // single: both edges; double: centre split + head
  if (single) {
    add(box(THREE, P.trim_green, 'zip_door_1', [0.02, dH, 0.003], [-zipX, dYc, zz]));
    add(box(THREE, P.trim_green, 'zip_door_2', [0.02, dH, 0.003], [zipX, dYc, zz]));
  } else {
    add(box(THREE, P.trim_green, 'zip_door_1', [0.02, dH, 0.003], [0, dYc, zz]));
    add(box(THREE, P.trim_green, 'zip_door_2', [doorsW, 0.02, 0.003], [0, dY1, zz]));
  }
  const li = 0.002, iw = W - 2 * t - 0.004, ih = H - 2 * t - 0.004, id = D - 2 * t - 0.004;
  add(box(THREE, P.foil_lining, 'lining_top', [iw, li, id], [0, H - t - li / 2, 0]));
  add(box(THREE, P.foil_lining, 'lining_left', [li, ih, id], [-W / 2 + t + li / 2, H / 2, 0]));
  add(box(THREE, P.foil_lining, 'lining_right', [li, ih, id], [W / 2 - t - li / 2, H / 2, 0]));
  add(box(THREE, P.foil_lining, 'lining_back', [iw, ih, li], [0, H / 2, -D / 2 + t + li / 2]));
  // 19 mm frame
  const pr = 0.0095, px = W / 2 - 0.028, pz = D / 2 - 0.028;
  [[-px, -pz], [px, -pz], [px, pz], [-px, pz]].forEach(([x, z], i) =>
    add(cyl(THREE, P.frame_steel, `pole_corner_${i + 1}`, { r: pr, h: H - 2 * t, seg: 10, pos: [x, H / 2, z] })));
  for (const [tier, y] of Object.entries({ base: 0.028, mid: H / 2, top: H - 0.028 })) {
    add(cyl(THREE, P.frame_steel, `rail_${tier}_front`, { r: pr, h: 2 * px, seg: 10, axis: 'x', pos: [0, y, pz] }));
    add(cyl(THREE, P.frame_steel, `rail_${tier}_back`, { r: pr, h: 2 * px, seg: 10, axis: 'x', pos: [0, y, -pz] }));
    add(cyl(THREE, P.frame_steel, `rail_${tier}_left`, { r: pr, h: 2 * pz, seg: 10, axis: 'z', pos: [-px, y, 0] }));
    add(cyl(THREE, P.frame_steel, `rail_${tier}_right`, { r: pr, h: 2 * pz, seg: 10, axis: 'z', pos: [px, y, 0] }));
  }
  const yBar = H - 0.05;
  add(cyl(THREE, P.frame_steel, 'hanger_bar_back', { r: pr, h: 2 * px, seg: 10, axis: 'x', pos: [0, yBar, -D / 4] }));
  add(cyl(THREE, P.frame_steel, 'hanger_bar_front', { r: pr, h: 2 * px, seg: 10, axis: 'x', pos: [0, yBar, D / 4] }));
  const tw = W - 0.09, td = D - 0.09, tt = 0.006, lipH = 0.08;
  add(box(THREE, P.tray_pvc, 'floor_tray', [tw, tt, td], [0, t + tt / 2, 0]));
  add(box(THREE, P.tray_pvc, 'tray_lip_front', [tw, lipH, tt], [0, t + lipH / 2, td / 2 - tt / 2]));
  add(box(THREE, P.tray_pvc, 'tray_lip_back', [tw, lipH, tt], [0, t + lipH / 2, -td / 2 + tt / 2]));
  add(box(THREE, P.tray_pvc, 'tray_lip_left', [tt, lipH, td - 2 * tt], [-tw / 2 + tt / 2, t + lipH / 2, 0]));
  add(box(THREE, P.tray_pvc, 'tray_lip_right', [tt, lipH, td - 2 * tt], [tw / 2 - tt / 2, t + lipH / 2, 0]));
  // ports
  function port(name, r, [x, y, z], axis, sign) {
    const Lp = 0.08, seg = 20;
    const off = (k) => [x + (axis === 'x' ? k * sign : 0), y + (axis === 'y' ? k * sign : 0), z + (axis === 'z' ? k * sign : 0)];
    add(cyl(THREE, P.shell_black, `${name}_sleeve`, { r, h: Lp, seg, open: true, axis, pos: off(Lp / 2) }));
    add(torus(THREE, P.trim_green, `${name}_ring`, { r: r + 0.002, tube: 0.006, seg, tseg: 6, axis, pos: off(Lp) }));
    add(cyl(THREE, P.shell_black, `${name}_iris`, { r: r - 0.001, h: 0.004, seg, axis, pos: off(Lp - 0.01) }));
    return off(Lp);
  }
  const R6 = 0.076, R4 = 0.051, A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
  const roof = [], sideR = [], sideL = [], cables = [];
  const zRear = -D / 2 + 0.2, zFront = D / 2 - 0.2, ySide = Math.min(0.35, H * 0.2), zSide = D / 6;
  if (W <= 0.8) {
    roof.push(port('vent_port_roof_1', R4, [0, H, zRear], 'y', 1));
    sideL.push(port('vent_port_side_left_1', R4, [-W / 2, ySide, zSide], 'x', -1));
    cables.push(port('cable_port_1', R4, [0, 0.12, -D / 2], 'z', -1));
  } else if (W <= 1.5) {
    roof.push(port('vent_port_roof_1', R6, [-W / 4, H, zRear], 'y', 1), port('vent_port_roof_2', R6, [W / 4, H, zRear], 'y', 1));
    sideR.push(port('vent_port_side_right_1', R6, [W / 2, ySide, zSide], 'x', 1));
    sideL.push(port('vent_port_side_left_1', R4, [-W / 2, ySide, zSide], 'x', -1));
    cables.push(port('cable_port_1', R4, [-W / 3, 0.12, -D / 2], 'z', -1), port('cable_port_2', R4, [W / 3, 0.12, -D / 2], 'z', -1));
  } else {
    roof.push(port('vent_port_roof_1', R6, [-W / 4, H, zRear], 'y', 1), port('vent_port_roof_2', R6, [W / 4, H, zRear], 'y', 1),
      port('vent_port_roof_3', R6, [-W / 4, H, zFront], 'y', 1), port('vent_port_roof_4', R6, [W / 4, H, zFront], 'y', 1));
    sideR.push(port('vent_port_side_right_1', R6, [W / 2, ySide, zSide], 'x', 1), port('vent_port_side_right_2', R6, [W / 2, ySide, -zSide], 'x', 1));
    sideL.push(port('vent_port_side_left_1', R4, [-W / 2, ySide, zSide], 'x', -1), port('vent_port_side_left_2', R4, [-W / 2, ySide, -zSide], 'x', -1));
    cables.push(port('cable_port_1', R4, [-W / 3, 0.12, -D / 2], 'z', -1), port('cable_port_2', R4, [W / 3, 0.12, -D / 2], 'z', -1));
  }
  // anchors
  if (W >= 3) { A('lamp_2', [0.75, yBar, 0]); A('lamp_3', [-0.75, yBar, 0]); }
  else { A('lamp_main', [0, yBar, 0]); if (W >= 1.5) A('lamp_2', [0.6, yBar, 0]); }
  A('canopy_sensor', [0, yBar - 0.3, 0]);
  A('fan_exhaust', roof[0]); if (roof[1]) A('fan_exhaust_2', roof[1]);
  if (sideR[0]) A('fan_intake', sideR[0]); A('duct_passive', sideL[0]);
  const grid = { 0.6: [1, 1], 0.8: [2, 1], 1: [2, 2], 1.2: [2, 2], 1.5: [3, 2], 3: [6, 2] }[W];
  const [cols, rows] = grid, sx = cols > 1 ? Math.max(0.45, (tw - 0.3) / (cols - 1)) : 0, sz = rows > 1 ? Math.max(0.45, (td - 0.3) / (rows - 1)) : 0;
  let n = 1;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) A(`probe_${n++}`, [(c - (cols - 1) / 2) * sx, t + tt, (r - (rows - 1) / 2) * sz]);
  cables.forEach((p, i) => A(`cable_${i + 1}`, p));
  return g;
}
