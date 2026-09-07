// EC inline fans 6in / 8in with bracket, display and 7-blade impeller; origin y = 0 at bracket bottom
import { fan } from './_fan.js';
export const variants = ['6in', '8in'];
export const budget = () => ({ tris: 1500 });
export function build(THREE, P, L, variant = '6in') {
  const s = variant === '8in' ? { collarR: 0.1015, bodyR: 0.12, bodyL: 0.23 } : { collarR: 0.076, bodyR: 0.1, bodyL: 0.25 };
  return fan(THREE, P, L, { slug: 'fan_inline', ...s, collarL: 0.035, blades: 7, bracket: true, display: true });
}
