// Bar-style LED — variant 6bar (0.84 × 0.84) or 8bar (0.84 × 1.68); origin at the hook
export const variants = ['6bar', '8bar'];
export const budget = () => ({ tris: 2500 });
export function build(THREE, P, L, variant = '6bar') {
  const { box, cyl, anchor, mesh, merge, tg, rodGeo } = L;
  const g = new THREE.Group(); g.name = 'lamp_bar_led';
  const add = (m) => (g.add(m), m);
  const eight = variant === '8bar';
  const nBars = eight ? 8 : 6, barL = eight ? 1.68 : 0.84, pitch = eight ? 0.12 : 0.168, width = 0.84;
  const yBar = -0.25 - 0.015;                                  // bar centre; hook at 0, bars 250 mm below
  const spines = eight ? [-barL / 4, 0, barL / 4] : [-barL / 4, barL / 4];
  for (let i = 0; i < nBars; i++) {
    const x = (i - (nBars - 1) / 2) * pitch;
    add(box(THREE, P.frame_steel, `lamp_bar_${i + 1}`, [0.04, 0.03, barL], [x, yBar, 0]));
    add(box(THREE, P.lamp_emitter, `lamp_emitter_${i + 1}`, [0.03, 0.001, barL - 0.02], [x, yBar - 0.0155, 0]));
  }
  spines.forEach((z, i) => add(box(THREE, P.frame_steel, `lamp_spine_${i + 1}`, [width, 0.03, 0.06], [0, yBar + 0.03, z])));
  const drivers = eight ? [-barL / 4, barL / 4] : [0];
  drivers.forEach((z, i) => add(box(THREE, P.plastic_white, eight ? `lamp_driver_${i + 1}` : 'lamp_driver', [0.3, 0.055, 0.11], [0, yBar + 0.045 + 0.0275, z])));
  const yTop = yBar + 0.1;
  add(cyl(THREE, P.plastic_dark, 'lamp_dimmer_knob', { r: 0.01, h: 0.01, seg: 16, pos: [0.1, yTop + 0.005, drivers[0]] }));
  add(cyl(THREE, P.led_status, 'lamp_status_led', { r: 0.002, h: 0.001, seg: 8, pos: [0.06, yTop + 0.0005, drivers[0]] }));
  const ends = []; spines.forEach((z) => ends.push([-width / 2 + 0.02, z], [width / 2 - 0.02, z]));
  const cables = ends.map(([x, z]) => rodGeo(THREE, [x, yBar + 0.045, z], [0, -0.012, 0], 0.0015, 5));
  cables.push(tg(THREE, new THREE.TorusGeometry(0.008, 0.002, 6, 16), { pos: [0, -0.007, 0] }));
  add(mesh(THREE, merge(THREE, cables), P.cable_black, 'lamp_hanger'));
  add(anchor(THREE, P.plastic_dark, 'hang_point', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [0, yTop - 0.03, drivers[0] - 0.055]));
  return g;
}
