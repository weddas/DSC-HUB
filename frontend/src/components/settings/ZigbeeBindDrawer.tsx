import { useEffect, useState } from "react";
import { Button, StatusChip } from "../ui";
import { isZigbeeSafetyLeakRole, zigbeeBannerTemplate, zigbeeFloodBannerTemplate, type ZigbeeRecipe, type ZigbeeRole } from "../../lib/fleetApi";
import { FLOOD_TASK_ID, TANK_TASK_ID, TASK_PARAM_IDS } from "./settingsConstants";
import { taskParamDefaults } from "./settingsHelpers";
import { DrawerField, SettingsDrawer } from "./SettingsDrawer";
import { nextTaskParams, zigbeeOptionLists } from "./zigbeeBindLogic";

export type ZigbeeBindValue = {
  alias: string;
  role: string;
  zone: string;
  recipe_id: string;
  params: Record<string, unknown>;
  capability_override?: string;
};

/**
 * One Zigbee device's binding as a drawer (plan-settings S5): rename, role, zone, task
 * and its parameters, class override — Save writes only this device. Replaces the
 * eight-column inline editor that made the Device tab a wall.
 */
export function ZigbeeBindDrawer({
  open,
  onClose,
  ieee,
  name,
  model,
  capabilityClass,
  value,
  allRoles,
  allRecipes,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  ieee: string;
  name: string;
  model: string;
  capabilityClass: string;
  value: ZigbeeBindValue | null;
  allRoles: ZigbeeRole[];
  allRecipes: ZigbeeRecipe[];
  onSave: (ieee: string, next: ZigbeeBindValue) => Promise<void>;
}) {
  const [draft, setDraft] = useState<ZigbeeBindValue | null>(value);
  const [showAll, setShowAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setDraft(value);
    setShowAll(false);
    setError(null);
  }, [value, open]);
  if (!draft) return null;

  const dirty = JSON.stringify(draft) !== JSON.stringify(value);
  const { roles, recipes } = zigbeeOptionLists({
    capabilityClass,
    capabilityOverride: draft.capability_override,
    showAll,
    role: draft.role,
    recipeId: draft.recipe_id,
    allRoles,
    allRecipes,
  });
  const showTaskParams = draft.role !== "unbound" && TASK_PARAM_IDS.has(draft.recipe_id);
  const isFlood = draft.recipe_id === FLOOD_TASK_ID;
  const seatId = String(draft.params.seat_id ?? "dehumidifier");
  const problemWhen = String(draft.params.problem_when ?? "active");
  const banner = String(draft.params.banner ?? "");

  return (
    <SettingsDrawer
      open={open}
      onClose={onClose}
      title={`Bind · ${(draft.alias || name).trim() || ieee}`}
      dirty={dirty}
      saving={saving}
      error={error}
      onSave={async () => {
        setSaving(true);
        setError(null);
        try {
          await onSave(ieee, draft);
          onClose();
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e));
        } finally {
          setSaving(false);
        }
      }}
      footer={
        <Button variant="secondary" onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Filtered lists" : "Show all roles"}
        </Button>
      }
    >
      <p className="dsc-muted" style={{ marginTop: 0 }}>
        <code>{ieee}</code> · {model || "unknown model"} · class {draft.capability_override ? `${draft.capability_override} (override)` : capabilityClass || "other"}
      </p>
      <DrawerField label="Name" hint="What Climate and Overview show. Blank falls back to the Zigbee name.">
        <input type="text" value={draft.alias} placeholder={name} onChange={(e) => setDraft({ ...draft, alias: e.target.value })} />
      </DrawerField>
      <DrawerField label="Role" hint="Where this sensor lives — intake, canopy, tank … Unbound only reports raw values.">
        <select
          value={draft.role}
          onChange={(e) => {
            const nextRole = e.target.value;
            let nextOverride = draft.capability_override;
            if (showAll && isZigbeeSafetyLeakRole(nextRole) && (capabilityClass === "motion" || capabilityClass === "other")) nextOverride = "liquid";
            else if (!isZigbeeSafetyLeakRole(nextRole)) nextOverride = undefined;
            setDraft({
              ...draft,
              role: nextRole,
              recipe_id: nextRole === "unbound" ? "none" : draft.recipe_id,
              params: nextRole === "unbound" ? {} : draft.params,
              capability_override: nextOverride,
            });
          }}
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </DrawerField>
      <DrawerField label="Zone">
        <select value={draft.zone} onChange={(e) => setDraft({ ...draft, zone: e.target.value })}>
          <option value="4x8">4×8</option>
          <option value="2x4">2×4</option>
          <option value="room">Room</option>
          <option value="shared">Shared</option>
        </select>
      </DrawerField>
      <DrawerField label="Task" hint={draft.role === "unbound" ? "Bind a role first." : "Optional — No task only reports into Live / Climate."}>
        <select
          value={draft.recipe_id}
          disabled={draft.role === "unbound"}
          onChange={(e) => {
            const nextRecipe = e.target.value;
            const params = TASK_PARAM_IDS.has(nextRecipe)
              ? taskParamDefaults(nextRecipe, allRecipes.find((r) => r.id === nextRecipe))
              : {};
            setDraft({ ...draft, recipe_id: nextRecipe, params: nextRecipe === "none" ? {} : params });
          }}
        >
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </DrawerField>
      {showTaskParams ? (
        <>
          {draft.recipe_id === TANK_TASK_ID ? (
            <DrawerField label="Appliance">
              <select value={seatId} onChange={(e) => setDraft({ ...draft, params: nextTaskParams(draft.recipe_id, draft.params, { seat_id: e.target.value }) })}>
                <option value="dehumidifier">Dehumidifier</option>
                <option value="humidifier">Humidifier</option>
              </select>
            </DrawerField>
          ) : null}
          <DrawerField label="Problem when">
            <select value={problemWhen} onChange={(e) => setDraft({ ...draft, params: nextTaskParams(draft.recipe_id, draft.params, { problem_when: e.target.value }) })}>
              <option value="active">Wet / active = problem</option>
              <option value="inactive">Dry / inactive = problem</option>
            </select>
          </DrawerField>
          <DrawerField label="Banner text" hint="Shown on the Alerts desk while the task is in its problem state.">
            <input
              type="text"
              value={banner}
              placeholder={isFlood ? zigbeeFloodBannerTemplate(problemWhen) : zigbeeBannerTemplate(seatId, problemWhen)}
              onChange={(e) => setDraft({ ...draft, params: nextTaskParams(draft.recipe_id, draft.params, { banner: e.target.value }) })}
            />
          </DrawerField>
        </>
      ) : null}
      {draft.capability_override ? (
        <p className="dsc-muted" style={{ fontSize: "var(--dsc-fs-sm)" }}>
          <StatusChip label="CLASS OVERRIDE" tone="warn" /> treated as <b>{draft.capability_override}</b> — cleared when the role stops being a leak role.
        </p>
      ) : null}
    </SettingsDrawer>
  );
}
