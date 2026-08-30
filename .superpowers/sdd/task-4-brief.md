# Task brief

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-30-zigbee-role-vs-task-operator-design.md` (approved)
- Parent: `docs/superpowers/specs/2026-08-30-zigbee-device-tasks-design.md`
- Keep recipe id `tank_full_appliance`; change label only
- Pi: never bare `docker kill`; prefer `timeout 25 docker restart` or SPA-only `docker cp`
- Commit only when user asks
- Occupancy remains a wet signal in `normalize_binary_active` (already live)


### Task 4: Settings SPA — filtered selects + Task params

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx`
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/lib/fleetApi.ts`
- Build: SPA `npm run build` (or project’s spa build script) → `spa-dist`

**Interfaces:**
- Consumes: `device.capability_class`, recipe `device_classes` / `param_schema`, roles `kind`
- Produces: Save still `put_zigbee_bindings` + `put_zigbee_policies` with full params

- [ ] **Step 1: Types in fleetApi** — recipes include `device_classes?`, `param_schema?`; devices include `capability_class?`

- [ ] **Step 2: ZigbeeBindRow** — props: `capabilityClass`, `showAll`, `onToggleShowAll`, filtered role/zone/recipe options; when recipe is liquid-level, render:
  - `<select>` Appliance (dehumidifier/humidifier)
  - `<select>` Problem when (labels: “Wet / active = problem”, “Dry / inactive = problem”)
  - `<input>` Banner text
  - Changing appliance/polarity refreshes banner from template **only if** banner still equals previous template (don’t clobber custom edits)

- [ ] **Step 3: Filter helpers (client)** — mirror server rules; if `showAll`, use full catalogs

- [ ] **Step 4: Help copy** under table: *Role is where this sensor lives. Task is optional — No task only reports into Live/Climate.*

- [ ] **Step 5: Build SPA** and smoke-check Settings types compile

---
