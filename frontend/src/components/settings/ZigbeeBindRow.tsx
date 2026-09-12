import { Button, StatusChip } from "../ui";
import {
  filterZigbeeRecipesForClass,
  filterZigbeeRolesForClass,
  isZigbeeSafetyLeakRole,
  zigbeeBannerTemplate,
  zigbeeFloodBannerTemplate,
  type ZigbeeRecipe,
  type ZigbeeRole,
} from "../../lib/fleetApi";
import { FLOOD_TASK_ID, TANK_TASK_ID, TASK_PARAM_IDS } from "./settingsConstants";
import TaskParamFields from "./TaskParamFields";
import { nextTaskParams } from "./zigbeeBindLogic";
import { effectiveZigbeeClass, taskHasParams, taskParamDefaults } from "./settingsHelpers";
import {
  ActionsCell,
  HealthCell,
  InlineEditCell,
  SelectCell,
  SettingsRow,
  SettingsSubRow,
} from "./SettingsTable";

/** Column count for the Zigbee bindings table — keep in sync with the header in
 *  SettingsPage and the SettingsSubRow colSpan below. */
export const ZIGBEE_BIND_COLS = 8;

export function ZigbeeBindRow({
  ieee,
  name,
  alias,
  model,
  status,
  role,
  zone,
  recipeId,
  policyParams,
  capabilityClass,
  capabilityOverride,
  showAll,
  onToggleShowAll,
  allRoles,
  allRecipes,
  onBindingChange,
  onPolicyChange,
  onRename,
  liveWet,
  liveProblem,
  battery,
  linkquality,
  lastSeen,
}: {
  ieee: string;
  name: string;
  /** Operator rename — takes precedence over the raw Z2M friendly_name for display. */
  alias?: string;
  model: string;
  status: string;
  role: string;
  zone: string;
  recipeId: string;
  policyParams: Record<string, unknown>;
  capabilityClass: string;
  capabilityOverride?: string;
  showAll: boolean;
  onToggleShowAll: () => void;
  allRoles: ZigbeeRole[];
  allRecipes: ZigbeeRecipe[];
  onBindingChange: (
    ieee: string,
    patch: { role: string; zone: string; recipe_id: string; capability_override?: string },
  ) => void;
  onPolicyChange: (ieee: string, patch: { recipe_id: string; params: Record<string, unknown> }) => void;
  onRename: (ieee: string, alias: string) => void;
  liveWet?: boolean | null;
  liveProblem?: boolean | null;
  /** Percent (0-100), from the device's raw Z2M state payload — absent when the device doesn't report it. */
  battery?: number | null;
  linkquality?: number | null;
  /** Epoch seconds of the last MQTT state message for this device. */
  lastSeen?: number | null;
}) {
  const effectiveClass = effectiveZigbeeClass(capabilityClass, capabilityOverride);
  let roleOptions = showAll ? allRoles : filterZigbeeRolesForClass(effectiveClass, allRoles);
  let recipeOptions = showAll ? allRecipes : filterZigbeeRecipesForClass(effectiveClass, allRecipes);
  if (!roleOptions.some((r) => r.id === role)) {
    const current = allRoles.find((r) => r.id === role);
    if (current) roleOptions = [...roleOptions, current];
  }
  if (!recipeOptions.some((r) => r.id === recipeId)) {
    const current = allRecipes.find((r) => r.id === recipeId);
    if (current) recipeOptions = [...recipeOptions, current];
  }
  const activeRecipe = allRecipes.find((r) => r.id === recipeId);
  const genericParams = !TASK_PARAM_IDS.has(recipeId) && taskHasParams(activeRecipe);
  const showTaskParams = role !== "unbound" && (TASK_PARAM_IDS.has(recipeId) || genericParams);
  const isFlood = recipeId === FLOOD_TASK_ID;
  const seatId = String(policyParams.seat_id ?? "dehumidifier");
  const problemWhen = String(policyParams.problem_when ?? "active");
  const banner = String(policyParams.banner ?? "");

  const displayName = (alias && alias.trim()) || name;
  const classNote = capabilityOverride
    ? `class ${capabilityOverride}`
    : capabilityClass
      ? capabilityClass
      : "";
  const secondary = [ieee || "—", classNote].filter(Boolean).join(" · ");

  // Delegates to nextTaskParams so the banner templating lives in exactly one place, and so
  // a generic task's own params (window_mode, countdown_backup, …) survive the merge — this
  // used to inline the tank branch and silently drop any field it did not name.
  const updateTaskParam = (patch: Record<string, unknown>) => {
    onPolicyChange(ieee, {
      recipe_id: recipeId,
      params: nextTaskParams(recipeId, policyParams, patch),
    });
  };

  return (
    <>
      <SettingsRow>
        <InlineEditCell
          value={displayName}
          ariaLabel={`Rename ${name}`}
          placeholder={name}
          onCommit={(next) => onRename(ieee, next === name ? "" : next)}
          secondary={secondary}
        />
        <td>{model || "—"}</td>
        <HealthCell battery={battery} linkquality={linkquality} lastSeen={lastSeen} />
        <td>
          <div className="dsc-chip-row" style={{ flexWrap: "wrap" }}>
            <StatusChip
              label={status === "bound" ? "BOUND" : status === "conflict" ? "CONFLICT" : "UNBOUND"}
              tone={status === "bound" ? "ok" : status === "conflict" ? "warn" : "muted"}
            />
            {recipeId !== "none" && liveWet != null ? (
              <StatusChip label={liveWet ? "Wet" : "Dry"} tone={liveWet ? "warn" : "ok"} />
            ) : null}
            {recipeId !== "none" && liveProblem != null ? (
              <StatusChip label={liveProblem ? "Problem" : "Clear"} tone={liveProblem ? "warn" : "ok"} />
            ) : null}
          </div>
        </td>
        <SelectCell
          value={role}
          onChange={(nextRole) => {
            let nextOverride = capabilityOverride;
            if (showAll && isZigbeeSafetyLeakRole(nextRole) && (capabilityClass === "motion" || capabilityClass === "other")) {
              nextOverride = "liquid";
            } else if (!isZigbeeSafetyLeakRole(nextRole)) {
              nextOverride = undefined;
            }
            onBindingChange(ieee, {
              role: nextRole,
              zone,
              recipe_id: nextRole === "unbound" ? "none" : recipeId,
              capability_override: nextOverride,
            });
          }}
        >
          {roleOptions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </SelectCell>
        <SelectCell
          value={zone}
          onChange={(nextZone) =>
            onBindingChange(ieee, { role, zone: nextZone, recipe_id: recipeId, capability_override: capabilityOverride })
          }
        >
          <option value="4x8">4×8</option>
          <option value="2x4">2×4</option>
          <option value="room">Room</option>
          <option value="shared">Shared</option>
        </SelectCell>
        <SelectCell
          value={recipeId}
          disabled={role === "unbound"}
          title={role === "unbound" ? "Bind a Role first" : "Task / recipe when sensor is active"}
          onChange={(nextRecipe) => {
            onBindingChange(ieee, { role, zone, recipe_id: nextRecipe, capability_override: capabilityOverride });
            const picked = allRecipes.find((r) => r.id === nextRecipe);
            if (TASK_PARAM_IDS.has(nextRecipe) || taskHasParams(picked)) {
              onPolicyChange(ieee, {
                recipe_id: nextRecipe,
                params: taskParamDefaults(nextRecipe, picked),
              });
            } else if (nextRecipe === "none") {
              onPolicyChange(ieee, { recipe_id: "none", params: {} });
            }
          }}
        >
          {(recipeOptions.length
            ? recipeOptions
            : [
                { id: "none", label: "No task" },
                { id: TANK_TASK_ID, label: "Liquid level → appliance OOS" },
                { id: FLOOD_TASK_ID, label: "Floor flood → alert" },
              ]
          ).map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </SelectCell>
        <ActionsCell>
          <Button variant="secondary" onClick={onToggleShowAll}>
            {showAll ? "Filtered" : "Show all"}
          </Button>
        </ActionsCell>
      </SettingsRow>
      {showTaskParams ? (
        <SettingsSubRow colSpan={ZIGBEE_BIND_COLS}>
          <div className="dsc-row-actions" style={{ flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
            {genericParams ? (
              <TaskParamFields
                schema={activeRecipe?.param_schema ?? {}}
                params={policyParams}
                onChange={updateTaskParam}
              />
            ) : null}
            {genericParams ? null : recipeId === TANK_TASK_ID ? (
              <label>
                Appliance
                <select value={seatId} onChange={(e) => updateTaskParam({ seat_id: e.target.value })}>
                  <option value="dehumidifier">Dehumidifier</option>
                  <option value="humidifier">Humidifier</option>
                </select>
              </label>
            ) : null}
            {genericParams ? null : (
            <label>
              Problem when
              <select value={problemWhen} onChange={(e) => updateTaskParam({ problem_when: e.target.value })}>
                <option value="active">Wet / active = problem</option>
                <option value="inactive">Dry / inactive = problem</option>
              </select>
            </label>
            )}
            {genericParams ? null : (
            <label style={{ flex: "1 1 240px" }}>
              Banner text
              <input
                type="text"
                value={banner}
                onChange={(e) => updateTaskParam({ banner: e.target.value })}
                placeholder={
                  isFlood
                    ? zigbeeFloodBannerTemplate(problemWhen)
                    : zigbeeBannerTemplate(seatId, problemWhen)
                }
              />
            </label>
            )}
          </div>
        </SettingsSubRow>
      ) : null}
    </>
  );
}
