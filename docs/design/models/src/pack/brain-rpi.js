// Raspberry Pi 4 in a finned aluminium case with a Zigbee dongle — origin floor centre; ports on +X end, LEDs on +Z front edge
export const budget = { tris: 400 };
export function build(THREE, P, L) {
  const { box, cyl, anchor, mesh, merge } = L;
  const g = new THREE.Group(); g.name = 'brain_rpi';
  const add = (m) => (g.add(m), m);
  const W = 0.1, H = 0.035, D = 0.07, hb = 0.028;
  const fins = []; for (let i = 0; i < 6; i++) fins.push(new THREE.BoxGeometry(W - 0.012, H - hb, 0.005).translate(0, hb + (H - hb) / 2, -0.03 + i * 0.012));
  add(mesh(THREE, merge(THREE, [new THREE.BoxGeometry(W, hb, D).translate(0, hb / 2, 0), ...fins]), P.plastic_dark, 'brain_case'));
  const xe = W / 2 + 0.0005, ze = D / 2 + 0.0005;
  add(mesh(THREE, merge(THREE, [
    new THREE.BoxGeometry(0.001, 0.013, 0.016).translate(xe, 0.012, -0.022),   // ethernet
    new THREE.BoxGeometry(0.001, 0.016, 0.013).translate(xe, 0.012, -0.002),   // usb stack 1
    new THREE.BoxGeometry(0.001, 0.016, 0.013).translate(xe, 0.012, 0.016),    // usb stack 2
    new THREE.BoxGeometry(0.009, 0.003, 0.001).translate(-0.035, 0.008, ze),   // usb-c
    new THREE.BoxGeometry(0.007, 0.003, 0.001).translate(-0.02, 0.008, ze),    // micro-hdmi
  ]), P.roller_silver, 'brain_ports'));
  add(cyl(THREE, P.led_status, 'brain_power_led', { r: 0.0015, h: 0.002, seg: 8, axis: 'z', pos: [0.03, 0.02, ze] }));
  add(cyl(THREE, P.led_status, 'brain_activity_led', { r: 0.0015, h: 0.002, seg: 8, axis: 'z', pos: [0.036, 0.02, ze] }));
  add(box(THREE, P.plastic_white, 'zigbee_dongle', [0.02, 0.007, 0.014], [W / 2 + 0.01, 0.016, 0.016]));
  add(cyl(THREE, P.led_status, 'zigbee_led', { r: 0.001, h: 0.002, seg: 6, pos: [W / 2 + 0.016, 0.0205, 0.016] }));
  add(cyl(THREE, P.cable_black, 'brain_cable', { r: 0.002, h: 0.05, seg: 6, axis: 'z', pos: [-0.035, 0.008, D / 2 + 0.025] }));
  add(anchor(THREE, P.plastic_dark, 'mount', [0, 0, 0]));
  add(anchor(THREE, P.plastic_dark, 'cable_out', [-0.035, 0.008, D / 2 + 0.05]));
  add(anchor(THREE, P.plastic_dark, 'dongle_tip', [W / 2 + 0.02, 0.016, 0.016]));
  return g;
}
