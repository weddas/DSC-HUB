import {
  filterZigbeeRecipesForClass,
  filterZigbeeRolesForClass,
  zigbeeBannerTemplate,
  zigbeeFloodBannerTemplate,
  type ZigbeeRecipe,
  type ZigbeeRole,
} from "../../lib/fleetApi";
import { FLOOD_TASK_ID, TANK_TASK_ID } from "./settingsConstants";
import { effectiveZigbeeClass } from "./settingsHelpers";

/** Shared between the Zigbee table row and the bind drawer — one source for the option filtering. */
export function zigbeeOptionLists(opts: {
  capabilityClass: string;
  capabilityOverride?: string;
  showAll: boolean;
  role: string;
  recipeId: string;
  allRoles: ZigbeeRole[];
  allRecipes: ZigbeeRecipe[];
}): { roles: ZigbeeRole[]; recipes: ZigbeeRecipe[] } {
  const effectiveClass = effectiveZigbeeClass(opts.capabilityClass, opts.capabilityOverride);
  let roles = opts.showAll ? opts.allRoles : filterZigbeeRolesForClass(effectiveClass, opts.allRoles);
  let recipes = opts.showAll ? opts.allRecipes : filterZigbeeRecipesForClass(effectiveClass, opts.allRecipes);
  if (!roles.some((r) => r.id === opts.role)) {
    const cur = opts.allRoles.find((r) => r.id === opts.role);
    if (cur) roles = [...roles, cur];
  }
  if (!recipes.some((r) => r.id === opts.recipeId)) {
    const cur = opts.allRecipes.find((r) => r.id === opts.recipeId);
    if (cur) recipes = [...recipes, cur];
  }
  if (!recipes.length) {
    recipes = [
      { id: "none", label: "No task" },
      { id: TANK_TASK_ID, label: "Liquid level → appliance OOS" },
      { id: FLOOD_TASK_ID, label: "Floor flood → alert" },
    ];
  }
  return { roles, recipes };
}

/** Next task params after editing one field; keeps the banner template in step unless the operator wrote their own.
 *
 * Only the two banner tasks get that templating. Everything else is a plain merge: this used
 * to fall through to the tank branch, which both stamped `seat_id` / `banner` / `banner_tone`
 * onto tasks that have no use for them AND silently dropped any field the old patch type did
 * not name — so a generic task's own params could never be edited at all.
 */
export function nextTaskParams(
  recipeId: string,
  params: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const isFlood = recipeId === FLOOD_TASK_ID;
  if (!isFlood && recipeId !== TANK_TASK_ID) return { ...params, ...patch };
  const seatId = String(params.seat_id ?? "dehumidifier");
  const problemWhen = String(params.problem_when ?? "active");
  const banner = String(params.banner ?? "");
  const nextPolarity = patch.problem_when != null ? String(patch.problem_when) : problemWhen;
  let nextBanner = patch.banner != null ? String(patch.banner) : banner;
  if (isFlood) {
    if (patch.problem_when != null) {
      const prevTemplate = zigbeeFloodBannerTemplate(problemWhen);
      const nextTemplate = zigbeeFloodBannerTemplate(nextPolarity);
      if (banner === prevTemplate || !banner.trim()) nextBanner = nextTemplate;
    }
    return { ...params, problem_when: nextPolarity, banner: nextBanner, banner_tone: params.banner_tone ?? "critical" };
  }
  const nextSeat = patch.seat_id != null ? String(patch.seat_id) : seatId;
  if (patch.seat_id != null || patch.problem_when != null) {
    const prevTemplate = zigbeeBannerTemplate(seatId, problemWhen);
    const nextTemplate = zigbeeBannerTemplate(nextSeat, nextPolarity);
    if (banner === prevTemplate || !banner.trim()) nextBanner = nextTemplate;
  }
  return {
    ...params,
    seat_id: nextSeat,
    problem_when: nextPolarity,
    banner: nextBanner,
    force_relay: params.force_relay ?? "off",
    banner_tone: params.banner_tone ?? "critical",
  };
}
