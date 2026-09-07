import { duct } from './_duct.js';
export const budget = { tris: 600 };
export function build(THREE, P, L) { return duct(THREE, P, L, { slug: 'duct_4in_straight', r: 0.051, kind: 'straight' }); }
