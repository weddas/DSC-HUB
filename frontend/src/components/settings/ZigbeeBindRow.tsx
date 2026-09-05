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
import { effectiveZigbeeClass, taskParamDefaults } from "./settingsHelpers";
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
  const showTaskParams = role !== "unbound" && TASK_PARAM_IDS.has(recipeId);
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

  const updateTaskParam = (patch: Partial<{ seat_id: string; problem_when: string; banner: string }>) => {
    const nextPolarity = patch.problem_when ?? problemWhen;
    let nextBanner = patch.banner ?? banner;
    if (isFlood) {
      const prevTemplate = zigbeeFloodBannerTemplate(problemWhen);
      if (patch.problem_when != null) {
        const nextTemplate = zigbeeFloodBannerTemplate(nextPolarity);
        if (banner === prevTemplate || !banner.trim()) {
          nextBanner = nextTemplate;
        }
      }
      onPolicyChange(ieee, {
        recipe_id: recipeId,
        params: {
          ...policyParams,
          problem_when: nextPolarity,
          banner: nextBanner,
          banner_tone: policyParams.banner_tone ?? "critical",
        },
      });
      return;
    }
    const nextSeat = patch.seat_id ?? seatId;
    const prevTemplate = zigbeeBannerTemplate(seatId, problemWhen);
    if (patch.seat_id != null || patch.problem_when != null) {
      const nextTemplate = zigbeeBannerTemplate(nextSeat, nextPolarity);
      if (banner === prevTemplate || !banner.trim()) {
        nextBanner = nextTemplate;
      }
    }
    onPolicyChange(ieee, {
      recipe_id: recipeId,
      params: {
        ...policyParams,
        seat_id: nextSeat,
        problem_when: nextPolarity,
        banner: nextBanner,
        force_relay: policyParams.force_relay ?? "off",
        banner_tone: policyParams.banner_tone ?? "critical",
      },
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
            if (TASK_PARAM_IDS.has(nextRecipe)) {
              onPolicyChange(ieee, {
                recipe_id: nextRecipe,
                params: taskParamDefaults(
                  nextRecipe,
                  allRecipes.find((r) => r.id === nextRecipe),
                ),
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
            {recipeId === TANK_TASK_ID ? (
              <label>
                Appliance
                <select value={seatId} onChange={(e) => updateTaskParam({ seat_id: e.target.value })}>
                  <option value="dehumidifier">Dehumidifier</option>
                  <option value="humidifier">Humidifier</option>
                </select>
              </label>
            ) : null}
            <label>
              Problem when
              <select value={problemWhen} onChange={(e) => updateTaskParam({ problem_when: e.target.value })}>
                <option value="active">Wet / active = problem</option>
                <option value="inactive">Dry / inactive = problem</option>
              </select>
            </label>
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
          </div>
        </SettingsSubRow>
      ) : null}
    </>
  );
}
