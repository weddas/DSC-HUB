/**
 * Derived-metrics layer. Import from here, not from the individual files.
 *
 *   climate.ts — the pure math (Tetens, Magnus, moisture density, series helpers)
 *   types.ts   — the DerivedValue contract: resolved-with-provenance or unavailable-with-reason
 *   metrics.ts — the metric builders and the per-zone aggregate
 *
 * Brain-side counterpart for the control-driving subset: brain/dsc_brain/derived_metrics.py.
 */

export * from "./climate";
export * from "./types";
export * from "./metrics";
