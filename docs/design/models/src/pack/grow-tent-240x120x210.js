export const budget = { tris: 12000, meshes: 60 };
export function build(THREE, P, L) {
const { box, cyl, torus, plate, anchor } = L;
const g = new THREE.Group(); g.name = 'grow_tent_240x120x210';
const add = (m) => (g.add(m), m);

const W = 2.4, D = 1.2, H = 2.1, t = 0.014;
const zf = D / 2 - t / 2;               // front panel plane centre
// Shell panels
add(box(THREE, P.shell_black, 'panel_top', [W, t, D], [0, H - t / 2, 0]));
add(box(THREE, P.shell_black, 'panel_bottom', [W, t, D], [0, t / 2, 0]));
add(box(THREE, P.shell_black, 'panel_side_left', [t, H - 2 * t, D], [-W / 2 + t / 2, H / 2, 0]));
add(box(THREE, P.shell_black, 'panel_side_right', [t, H - 2 * t, D], [W / 2 - t / 2, H / 2, 0]));
add(box(THREE, P.shell_black, 'panel_back', [W - 2 * t, H - 2 * t, t], [0, H / 2, -D / 2 + t / 2]));
// Front: doors 0.05–1.95 in the central 1.2 m, flanks either side, strips above and below
const dY0 = t, dY1 = 1.95, dH = dY1 - dY0;
add(box(THREE, P.shell_black, 'panel_upper_front', [1.2, H - t - dY1, t], [0, (dY1 + H - t) / 2, zf]));
add(box(THREE, P.shell_black, 'panel_front_left', [W / 2 - 0.6 - t, H - 2 * t, t], [-(0.6 + (W / 2 - 0.6 - t) / 2), H / 2, zf]));
add(box(THREE, P.shell_black, 'panel_front_right', [W / 2 - 0.6 - t, H - 2 * t, t], [(0.6 + (W / 2 - 0.6 - t) / 2), H / 2, zf]));
// Doors — left door carries the 30×40 observation window (hole in the plate)
const winX = -0.3, winY = 1.3, winW = 0.3, winH = 0.4;
add(plate(THREE, P.shell_black, 'door_main_left', { w: 0.6, h: dH, depth: t, hole: [winX + 0.3, winY - (dY0 + dY1) / 2, winW, winH], pos: [-0.3, (dY0 + dY1) / 2, zf] }));
add(box(THREE, P.shell_black, 'door_main_right', [0.6, dH, t], [0.3, (dY0 + dY1) / 2, zf]));
add(box(THREE, P.window_acrylic, 'observation_window_1_pane', [winW, winH, 0.003], [winX, winY, D / 2 - 0.006]));
add(plate(THREE, P.trim_green, 'observation_window_1_frame', { w: winW + 0.028, h: winH + 0.028, depth: 0.006, hole: [0, 0, winW, winH], pos: [winX, winY, D / 2 + 0.003] }));
// Zips (proud of the front face)
const zz = D / 2 + 0.0015;
add(box(THREE, P.trim_green, 'zip_door_left', [0.02, dH + 0.02, 0.003], [-0.6, (dY0 + dY1) / 2, zz]));
add(box(THREE, P.trim_green, 'zip_door_right', [0.02, dH + 0.02, 0.003], [0.6, (dY0 + dY1) / 2, zz]));
add(box(THREE, P.trim_green, 'zip_door_split', [0.02, dH, 0.003], [0, (dY0 + dY1) / 2, zz]));

// Foil lining (2 mm inside the shell)
const li = 0.002, iw = W - 2 * t - 0.004, ih = H - 2 * t - 0.004, id = D - 2 * t - 0.004;
add(box(THREE, P.foil_lining, 'lining_top', [iw, li, id], [0, H - t - li / 2, 0]));
add(box(THREE, P.foil_lining, 'lining_left', [li, ih, id], [-W / 2 + t + li / 2, H / 2, 0]));
add(box(THREE, P.foil_lining, 'lining_right', [li, ih, id], [W / 2 - t - li / 2, H / 2, 0]));
add(box(THREE, P.foil_lining, 'lining_back', [iw, ih, li], [0, H / 2, -D / 2 + t + li / 2]));
// Steel frame: 22 mm poles, three tiers
const pr = 0.011, px = W / 2 - 0.03, pz = D / 2 - 0.03;
[[-px, -pz], [px, -pz], [px, pz], [-px, pz]].forEach(([x, z], i) =>
  add(cyl(THREE, P.frame_steel, `pole_corner_${i + 1}`, { r: pr, h: H - 2 * t, seg: 12, pos: [x, H / 2, z] })));
const tiers = { base: 0.03, mid: 1.05, top: H - 0.03 };
for (const [tier, y] of Object.entries(tiers)) {
  add(cyl(THREE, P.frame_steel, `rail_${tier}_front`, { r: pr, h: 2 * px, seg: 12, axis: 'x', pos: [0, y, pz] }));
  add(cyl(THREE, P.frame_steel, `rail_${tier}_back`, { r: pr, h: 2 * px, seg: 12, axis: 'x', pos: [0, y, -pz] }));
  add(cyl(THREE, P.frame_steel, `rail_${tier}_left`, { r: pr, h: 2 * pz, seg: 12, axis: 'z', pos: [-px, y, 0] }));
  add(cyl(THREE, P.frame_steel, `rail_${tier}_right`, { r: pr, h: 2 * pz, seg: 12, axis: 'z', pos: [px, y, 0] }));
}
// Hanger bars along the width, 15 cm and 105 cm from the back, at 2.05 m
add(cyl(THREE, P.frame_steel, 'hanger_bar_back', { r: pr, h: 2 * px, seg: 12, axis: 'x', pos: [0, 2.05, -D / 2 + 0.15] }));
add(cyl(THREE, P.frame_steel, 'hanger_bar_front', { r: pr, h: 2 * px, seg: 12, axis: 'x', pos: [0, 2.05, -D / 2 + 1.05] }));
// Floor tray, 8 cm lip
const tw = W - 0.1, td = D - 0.1, tt = 0.006, lipH = 0.08, ty = t;
add(box(THREE, P.tray_pvc, 'floor_tray', [tw, tt, td], [0, ty + tt / 2, 0]));
add(box(THREE, P.tray_pvc, 'tray_lip_front', [tw, lipH, tt], [0, ty + lipH / 2, td / 2 - tt / 2]));
add(box(THREE, P.tray_pvc, 'tray_lip_back', [tw, lipH, tt], [0, ty + lipH / 2, -td / 2 + tt / 2]));
add(box(THREE, P.tray_pvc, 'tray_lip_left', [tt, lipH, td - 2 * tt], [-tw / 2 + tt / 2, ty + lipH / 2, 0]));
add(box(THREE, P.tray_pvc, 'tray_lip_right', [tt, lipH, td - 2 * tt], [tw / 2 - tt / 2, ty + lipH / 2, 0]));
// Ports: sleeve (canvas), ring (trim), iris (closed canvas disc). `dir` = outward axis unit vector.
function port(name, r, [x, y, z], axis, sign) {
  const L = 0.08, seg = 24;
  const off = (k) => [x + (axis === 'x' ? k * sign : 0), y + (axis === 'y' ? k * sign : 0), z + (axis === 'z' ? k * sign : 0)];
  add(cyl(THREE, P.shell_black, `${name}_sleeve`, { r, h: L, seg, open: true, axis, pos: off(L / 2) }));
  add(torus(THREE, P.trim_green, `${name}_ring`, { r: r + 0.002, tube: 0.006, seg, axis, pos: off(L) }));
  add(cyl(THREE, P.shell_black, `${name}_iris`, { r: r - 0.001, h: 0.004, seg, axis, pos: off(L - 0.01) }));
  return off(L);
}
const R6 = 0.076, R4 = 0.051;
const exL = port('vent_port_roof_left', R6, [-0.7, H, -0.4], 'y', 1);
const exR = port('vent_port_roof_right', R6, [0.7, H, -0.4], 'y', 1);
const inR = port('vent_port_side_right_lower', R6, [W / 2, 0.35, 0.2], 'x', 1);
const psL = port('vent_port_side_left_lower', R4, [-W / 2, 0.35, 0.2], 'x', -1);
const c1 = port('cable_port_1', R4, [-0.9, 0.12, -D / 2], 'z', -1);
const c2 = port('cable_port_2', R4, [0.9, 0.12, -D / 2], 'z', -1);
// Anchors (hidden 1 cm cubes)
const A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
A('lamp_main', [0, 2.05, 0]); A('lamp_twin', [0.6, 2.05, 0]);
A('fan_exhaust', exL); A('fan_exhaust_2', exR); A('fan_intake', inR); A('duct_passive', psL);
A('canopy_sensor', [0, 1.75, 0]);
[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].forEach(([x, z], i) => A(`probe_${i + 1}`, [x, ty + tt, z]));
A('cable_1', c1); A('cable_2', c2);


return g;
}
