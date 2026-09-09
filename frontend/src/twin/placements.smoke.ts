/**
 * Placement overrides — the resolution rule and the store.
 *
 * plan-spatial-layout S4. `Placed` consults this for every instance in the rig, so the two
 * properties that matter are: an empty store renders the scene exactly as its literals say,
 * and an override replaces only what it actually carries.
 *
 * Run: npm run test:placements
 */
import assert from "node:assert/strict";
import { placementCount, resolvePlacement, setPlacements, type Placement } from "./placements";
import type { PlaceAt, Vec3 } from "./Placed";

const SCENE_AT: PlaceAt = { parent: "tent4x8", anchor: "fan_exhaust" };
const SCENE_ROT: Vec3 = [-Math.PI / 2, 0, 0];
const sceneProps = { at: SCENE_AT, rotation: SCENE_ROT, self: "duct_in" };

// --- no override: the scene wins, untouched -------------------------------------------

{
  const out = resolvePlacement(null, sceneProps);
  assert.equal(out, sceneProps, "with no override the props object passes straight through");
  assert.equal(resolvePlacement(undefined, sceneProps).at, SCENE_AT);
}

// --- an override replaces only what it carries ----------------------------------------

{
  // The operator drags the fan to the other port. They said nothing about rotation, and a
  // fan that came back lying on its side would be the bug this guards.
  const moved: Placement = { at: { parent: "tent4x8", anchor: "fan_exhaust_2" } };
  const out = resolvePlacement(moved, sceneProps);
  assert.deepEqual(out.at, { parent: "tent4x8", anchor: "fan_exhaust_2" });
  assert.equal(out.rotation, SCENE_ROT, "rotation falls back to the scene's");
  assert.equal(out.self, "duct_in", "self falls back to the scene's");
}

{
  // ...and an override that DOES carry a rotation wins on it.
  const turned: Placement = { at: SCENE_AT, rotation: [0, 1.5708, 0] };
  const out = resolvePlacement(turned, sceneProps);
  assert.deepEqual(out.rotation, [0, 1.5708, 0]);
}

{
  // A free position overriding an anchored literal: the shape changes wholesale.
  const freed: Placement = { at: { position: [1, 0, 2] } };
  const out = resolvePlacement(freed, sceneProps);
  assert.deepEqual(out.at, { position: [1, 0, 2] });
  assert.ok(!("parent" in out.at), "the anchored shape must not leak through");
}

{
  const scaled: Placement = { at: SCENE_AT, scale: 1.5 };
  assert.equal(resolvePlacement(scaled, sceneProps).scale, 1.5);
  assert.equal(resolvePlacement({ at: SCENE_AT }, { at: SCENE_AT }).scale, undefined);
}

// --- the store ------------------------------------------------------------------------

{
  setPlacements({});
  assert.equal(placementCount(), 0, "a fresh rig has no overrides");

  setPlacements({ heater: { at: { parent: "tent4x8", anchor: "", offset: [0.9, 0, -0.32] } } });
  assert.equal(placementCount(), 1);

  // Replacing the map drops what is no longer in it: clearing an override on the brain has
  // to actually put the thing back, not leave a stale copy in the browser.
  setPlacements({});
  assert.equal(placementCount(), 0);
}

console.log("placement smoke tests ok");
