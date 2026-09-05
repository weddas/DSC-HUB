import assert from "node:assert/strict";
import {
  SOIL_PRESETS,
  applyBlendLayers,
  blendSummary,
  clearComposeDraft,
  hasComposeDraft,
} from "./composePlantLogic";

const calls: Array<{ domain: string; service: string; data: Record<string, unknown> }> = [];
const callService = (domain: string, service: string, data: Record<string, unknown>) => {
  calls.push({ domain, service, data });
};

const helpers: Record<string, string> = {
  "input_text.dsc_blend_component_1_name": "",
  "input_number.dsc_blend_pct_1": "0",
  "input_text.dsc_blend_component_2_name": "",
  "input_number.dsc_blend_pct_2": "0",
  "input_text.dsc_blend_component_3_name": "",
  "input_number.dsc_blend_pct_3": "0",
  "input_text.dsc_build_strain": "",
  "input_select.dsc_build_assign_pot": "none",
};

const state = (id: string, fallback = "") => helpers[id] ?? fallback;

applyBlendLayers(SOIL_PRESETS[0].layers, callService);
assert.ok(calls.some((c) => c.data.entity_id === "input_text.dsc_blend_component_1_name"));
assert.equal(blendSummary(state), "Not set");

helpers["input_text.dsc_blend_component_1_name"] = "Coco coir";
helpers["input_number.dsc_blend_pct_1"] = "100";
assert.equal(blendSummary(state), "Coco coir 100%");

helpers["input_text.dsc_build_strain"] = "Test Strain";
assert.equal(hasComposeDraft(state), true);

clearComposeDraft(callService);
assert.ok(calls.some((c) => c.data.entity_id === "input_text.dsc_build_strain"));

console.log("composePlantLogic smoke tests ok");
