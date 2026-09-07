// CO₂ sources — variants tank | bag | generator
export const variants = ['tank', 'bag', 'generator'];
export const budget = (v) => ({ tris: v === 'bag' ? 300 : 1200 });
export function build(THREE, P, L, variant = 'tank') {
  const { roundedBoxGeo, box, cyl, torus, anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group();
  const add = (m) => (g.add(m), m);
  const A = (n, p) => add(anchor(THREE, P.plastic_dark, n, p));
  if (variant === 'tank') {
    g.name = 'co2_tank';
    const R = 0.1, Hc = 0.55;
    const pts = [[0, 0], [R - 0.01, 0], [R, 0.02], [R, Hc], [R * 0.7, Hc + 0.05], [0.02, Hc + 0.08], [0, Hc + 0.08]].map(([r, y]) => new THREE.Vector2(r, y));
    add(mesh(THREE, new THREE.LatheGeometry(pts, 20), P.roller_silver, 'tank_body'));
    const yN = Hc + 0.08;
    add(cyl(THREE, P.roller_silver, 'tank_neck', { r: 0.02, h: 0.04, seg: 12, pos: [0, yN + 0.02, 0] }));
    add(torus(THREE, P.plastic_dark, 'tank_handle', { r: 0.055, tube: 0.008, seg: 16, tseg: 6, axis: 'y', pos: [0, yN + 0.03, 0] }));
    add(box(THREE, P.metal_brass, 'tank_valve', [0.03, 0.06, 0.03], [0, yN + 0.07, 0]));
    add(cyl(THREE, P.metal_brass, 'tank_handwheel', { r: 0.025, h: 0.008, seg: 16, pos: [0, yN + 0.105, 0] }));
    // regulator off the valve side (+x)
    const yR = yN + 0.075;
    add(box(THREE, P.metal_brass, 'regulator_body', [0.06, 0.04, 0.04], [0.045, yR, 0]));
    add(cyl(THREE, P.screen_glass, 'gauge_1', { r: 0.025, h: 0.015, seg: 16, axis: 'z', pos: [0.04, yR + 0.045, 0.02] }));
    add(cyl(THREE, P.screen_glass, 'gauge_2', { r: 0.025, h: 0.015, seg: 16, axis: 'z', pos: [0.095, yR + 0.045, 0.02] }));
    add(box(THREE, P.plastic_dark, 'solenoid_body', [0.04, 0.05, 0.03], [0.1, yR - 0.03, 0]));
    add(cyl(THREE, P.led_status, 'solenoid_status_led', { r: 0.002, h: 0.001, seg: 8, axis: 'z', pos: [0.1, yR - 0.02, 0.0155] }));
    add(cyl(THREE, P.metal_brass, 'needle_knob', { r: 0.008, h: 0.012, seg: 12, axis: 'x', pos: [0.126, yR - 0.03, 0] }));
    // tubing: down the side of the tank to a diffuser
    const tube = [rodGeo(THREE, [0.1, yR - 0.055, 0], [0.13, yR - 0.15, 0], 0.003, 6), rodGeo(THREE, [0.13, yR - 0.15, 0], [0.13, 0.2, 0], 0.003, 6), rodGeo(THREE, [0.13, 0.2, 0], [0.2, 0.15, 0.05], 0.003, 6)];
    add(mesh(THREE, merge(THREE, tube), P.rubber_black, 'co2_tubing'));
    add(cyl(THREE, P.plastic_dark, 'co2_diffuser', { r: 0.008, h: 0.03, seg: 10, pos: [0.2, 0.135, 0.05] }));
    add(cyl(THREE, P.window_acrylic, 'co2_plume', { rt: 0.03, rb: 0.008, h: 0.1, seg: 10, pos: [0.2, 0.07, 0.05] }));
    A('tubing_end', [0.2, 0.12, 0.05]); A('cable_out', [0.1, yR - 0.03, -0.015]);
  } else if (variant === 'bag') {
    g.name = 'co2_bag';
    add(mesh(THREE, roundedBoxGeo(THREE, { w: 0.3, d: 0.1, h: 0.2, r: 0.03, seg: 3 }).translate(0, -0.22, 0), P.plastic_white, 'bag_body'));
    add(cyl(THREE, P.plastic_dark, 'bag_vent', { r: 0.02, h: 0.002, seg: 12, axis: 'z', pos: [0, -0.1, 0.051] }));
    add(mesh(THREE, merge(THREE, [tg(THREE, new THREE.TorusGeometry(0.01, 0.002, 4, 12), { pos: [0, -0.01, 0] }), rodGeo(THREE, [0, -0.02, 0], [0, -0.03, 0], 0.002, 4)]), P.cable_black, 'bag_loop'));
    A('hang_point', [0, 0, 0]);
  } else {
    g.name = 'co2_generator';
    const W = 0.4, D = 0.3, H = 0.6, top = -0.05;         // bracket hook at 0, body below
    add(box(THREE, P.plastic_dark, 'gen_body', [W, H, D], [0, top - H / 2, 0]));
    const lv = [];
    for (let i = 0; i < 12; i++) lv.push(tg(THREE, new THREE.BoxGeometry(0.3, 0.004, 0.02), { pos: [0, top - 0.12 - i * 0.03, D / 2 + 0.008], rot: [0.5, 0, 0] }));
    add(mesh(THREE, merge(THREE, lv), P.plastic_dark, 'gen_louvres'));
    add(box(THREE, P.window_acrylic, 'gen_window', [0.1, 0.06, 0.002], [0, top - 0.52, D / 2 + 0.001]));
    add(box(THREE, P.heat_element, 'heat_element', [0.09, 0.05, 0.002], [0, top - 0.52, D / 2 - 0.01]));
    add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(0.2, 0.004, 0.03).translate(0, top + 0.002, 0), rodGeo(THREE, [-0.08, top, 0], [0, 0, 0], 0.004, 6), rodGeo(THREE, [0.08, top, 0], [0, 0, 0], 0.004, 6)]), P.frame_steel, 'gen_bracket'));
    add(cyl(THREE, P.metal_brass, 'gen_gas_inlet', { r: 0.008, h: 0.03, seg: 10, axis: 'z', pos: [-0.1, top - 0.5, -D / 2 - 0.015] }));
    add(box(THREE, P.plastic_dark, 'solenoid_body', [0.04, 0.05, 0.03], [0.1, top - 0.5, -D / 2 - 0.015]));
    add(cyl(THREE, P.led_status, 'solenoid_status_led', { r: 0.002, h: 0.001, seg: 8, axis: 'z', pos: [0.1, top - 0.49, -D / 2 - 0.0305] }));
    A('hang_point', [0, 0, 0]); A('gas_in', [-0.1, top - 0.5, -D / 2 - 0.03]); A('cable_out', [0.1, top - 0.52, -D / 2 - 0.03]);
  }
  return g;
}
