### Task 2: Settings â€” shared task params + safety role helper

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/lib/fleetApi.ts`
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx`

**Interfaces:**
- Consumes: recipe catalog from API (`floor_flood_alert`, new roles)
- Produces: `isZigbeeSafetyLeakRole(roleId)` true for `leak_tank` and any id starting with `leak_floor`; `zigbeeFloodBannerTemplate(problemWhen)`; Settings shows Appliance only for tank

- [ ] **Step 1: Extend `fleetApi.ts` helpers**

Replace:

```typescript
export function isZigbeeSafetyLeakRole(roleId: string): boolean {
  return roleId === "leak_tank" || roleId === "leak_floor";
}
```

With:

```typescript
export function isZigbeeSafetyLeakRole(roleId: string): boolean {
  const id = String(roleId || "");
  return id === "leak_tank" || id === "leak_floor" || id.startsWith("leak_floor_");
}

export function zigbeeFloodBannerTemplate(problemWhen: string): string {
  const polarity = String(problemWhen || "active").toLowerCase();
  if (polarity === "inactive") return "Floor dry alarm â€” check sensor";
  return "Floor water detected";
}
```

- [ ] **Step 2: Generalize Settings task-params UI**

In `SettingsPage.tsx`:

1. Constants:

```typescript
const TANK_TASK_ID = "tank_full_appliance";
const FLOOD_TASK_ID = "floor_flood_alert";
const TASK_PARAM_IDS = new Set([TANK_TASK_ID, FLOOD_TASK_ID]);
```

2. Defaults helper:

```typescript
function taskParamDefaults(
  recipeId: string,
  recipe: ZigbeeRecipe | undefined,
): Record<string, unknown> {
  const defaults = recipe?.default_params ?? {};
  if (recipeId === FLOOD_TASK_ID) {
    const problem_when = String(defaults.problem_when ?? "active");
    return {
      problem_when,
      banner: String(defaults.banner ?? zigbeeFloodBannerTemplate(problem_when)),
      banner_tone: String(defaults.banner_tone ?? "critical"),
    };
  }
  // tank (existing liquidTaskDefaults body)
  return {
    seat_id: String(defaults.seat_id ?? "dehumidifier"),
    problem_when: String(defaults.problem_when ?? "active"),
    force_relay: String(defaults.force_relay ?? "off"),
    banner: String(
      defaults.banner ??
        zigbeeBannerTemplate(
          String(defaults.seat_id ?? "dehumidifier"),
          String(defaults.problem_when ?? "active"),
        ),
    ),
    banner_tone: String(defaults.banner_tone ?? "critical"),
  };
}
```

3. `showTaskParams = role !== "unbound" && TASK_PARAM_IDS.has(recipeId)`
4. On recipe change to flood/tank: `params: taskParamDefaults(nextRecipe, recipe)`
5. Param updater: if flood, only `problem_when` + `banner`; regenerating banner on polarity uses `zigbeeFloodBannerTemplate` for flood and `zigbeeBannerTemplate` for tank
6. Render Appliance `<select>` only when `recipeId === TANK_TASK_ID`
7. Fallback recipes/roles arrays in Settings include flood recipe + three space roles

- [ ] **Step 3: Typecheck / build SPA**

```bash
cd homeassistant/custom_components/dsc_hub/frontend
npm run build:spa
```

Expected: exit 0; new hashed assets under spa-dist (or projectâ€™s usual SPA out dir)

- [ ] **Step 4: Commit** (only if user asked)

```bash
git add homeassistant/custom_components/dsc_hub/frontend/src/lib/fleetApi.ts homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx
git commit -m "feat(spa): Settings task params for floor flood alert"
```

---

