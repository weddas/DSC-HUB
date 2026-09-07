import { fan } from './_fan.js';
export const budget = { tris: 1500 };
export function build(THREE, P, L) { return fan(THREE, P, L, { slug: 'fan_inline_4in', collarR: 0.051, bodyR: 0.07, bodyL: 0.16 }); }
