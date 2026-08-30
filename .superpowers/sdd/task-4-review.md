# Task 4 Review — Settings SPA filtered selects + Task params

**Reviewer:** subagent (read-only)  
**Date:** 2026-08-30  
**Artifacts:** `task-4-brief.md`, `task-4-report.md`, `2026-08-30-zigbee-role-vs-task-operator-design.md` (Settings SPA + filtered selects)  
**Verification:** `npm.cmd run build:spa` in `frontend/` → **built in 2.45s** (`index-B146_V8-.js`)

---

## Verdict

| Gate | Result |
|------|--------|
| **Spec** | ✅ |
| **Quality** | **Approved** |

Task 4 delivers the operator Settings path: capability-filtered Role/Task selects, per-row **Show all**, liquid-task params with honest banner templating, `capability_override` on mis-fingerprint binds, and dual save via existing binding/policy APIs. Implementation matches the approved operator spec and brief; remaining gaps are v1 deferrals or minor hygiene.

---

## Spec compliance

### Brief requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| `fleetApi` types: `device_classes`, `param_schema`, `capability_class` | ✅ | `ZigbeeRecipe`, `ZigbeeRole`, filter helpers exported |
| `ZigbeeBindRow`: filtered Role/Zone/Task + Show all | ✅ | Per-row toggle; current selection kept visible when filtered |
| Liquid task params: Appliance, Problem when, Banner | ✅ | Inline row when bound + `tank_full_appliance` |
| Banner refresh from template only if unchanged | ✅ | `updateLiquidParam` compares to `zigbeeBannerTemplate` prev/next |
| Filter helpers mirror server; Show all → full catalogs | ✅ | Aligns with `brain/dsc_brain/zigbee_mqtt.py` rules |
| Help copy under table | ✅ | Matches spec wording (intake/canopy/tank + optional Task) |
| Save `put_zigbee_bindings` + `put_zigbee_policies` with full params | ✅ | Single **Save roles & tasks** button |
| `build:spa` compiles | ✅ | Verified locally |
| No commit | ✅ | |

### Operator spec (Settings SPA + filtered selects)

| Spec point | Status | Notes |
|------------|--------|-------|
| Columns: Device · Model · Status · Role · Zone · Task | ✅ | + Show all column |
| Filtered `<select>` per capability class | ✅ | Uses `capability_class` + optional override |
| Show all for mis-fingerprint escape | ✅ | Per-device; sets `capability_override: "liquid"` on Show-all safety bind (motion/other) |
| Liquid task inline controls + editable banner | ✅ | |
| Recipe id `tank_full_appliance`, label “Liquid level → appliance OOS” | ✅ | Fallback catalog matches backend |
| `capability_override` sticky after Show-all bind | ✅ | Draft omits key on clear → full-map save clears server value (Task 3 semantics) |
| Friendly-name fallback includes `capability_override` | ✅ | `zigbee_mqtt.py` allowlist extended (Task 3 follow-up closed) |
| Zone filtered by class/role | ⚠️ deferred | All four zones always shown; spec allows same set for climate/safety v1; report acknowledged |
| Zone default from role hint | ⚠️ deferred | Not in brief; server/default binding still applies on load |
| Task filter via `suggested_roles` **or** `device_classes` | ⚠️ partial | Both SPA and brain filter on `device_classes` only; sufficient for current catalog (`tank_full_appliance` has both) |

---

## Quality assessment

### Strengths

1. **Filter parity with brain** — `CLASS_ROLE_KINDS`, `filterZigbeeRolesForClass`, and `filterZigbeeRecipesForClass` mirror `zigbee_mqtt.py`; `zigbeeBannerTemplate` matches `banner_template()` in `zigbee_policies.py`.
2. **Operator-safe banner editing** — Template auto-refresh on appliance/polarity change respects custom copy (empty banner also gets template).
3. **Mis-fingerprint path complete** — Show all → safety leak role on motion/other sets `capability_override`; effective class drives filtered lists before save; override clears when role leaves safety leak.
4. **Selection honesty** — Current role/recipe appended to filtered options so saved bindings stay visible after filter shrink.
5. **Resilient fallbacks** — Hardcoded role/recipe catalogs when API empty keeps Settings usable offline.
6. **Correct save split** — Bindings carry role/zone/override; policies carry recipe + params; dirty flag covers both binding and param edits.
7. **Task 3 integration** — Loads/persists `capability_override` from device binding; displays class hint in device subline.

### Implementation notes (verified)

```228:252:homeassistant/custom_components/dsc_hub/frontend/src/lib/fleetApi.ts
export function filterZigbeeRolesForClass(
  capabilityClass: string,
  roles: ZigbeeRole[],
): ZigbeeRole[] {
  const allowed = CLASS_ROLE_KINDS[String(capabilityClass).toLowerCase()] ?? new Set<string>();
  return roles.filter((role) => {
    const kind = String(role.kind ?? "none");
    const id = String(role.id ?? "");
    return id === "unbound" || allowed.has(kind);
  });
}

export function filterZigbeeRecipesForClass(
  capabilityClass: string,
  recipes: ZigbeeRecipe[],
): ZigbeeRecipe[] {
  const cap = String(capabilityClass).toLowerCase();
  return recipes.filter((recipe) => {
    const id = String(recipe.id ?? "");
    if (id === "none") return true;
    const classes = recipe.device_classes;
    if (!Array.isArray(classes)) return false;
    return classes.some((c) => String(c).toLowerCase() === cap);
  });
}
```

```204:226:homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx
  const updateLiquidParam = (patch: Partial<{ seat_id: string; problem_when: string; banner: string }>) => {
    const nextSeat = patch.seat_id ?? seatId;
    const nextPolarity = patch.problem_when ?? problemWhen;
    const prevTemplate = zigbeeBannerTemplate(seatId, problemWhen);
    let nextBanner = patch.banner ?? banner;
    if (patch.seat_id != null || patch.problem_when != null) {
      const nextTemplate = zigbeeBannerTemplate(nextSeat, nextPolarity);
      if (banner === prevTemplate || !banner.trim()) {
        nextBanner = nextTemplate;
      }
    }
    onPolicyChange(ieee, {
      recipe_id: recipeId,
      params: { /* seat_id, problem_when, banner, force_relay, banner_tone */ },
    });
  };
```

```1540:1546:homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx
            <Button
              onClick={async () => {
                await put_zigbee_bindings(zigbeeBindDraft);
                await put_zigbee_policies(zigbeePolicyDraft);
                setZigbeeBindDirty(false);
                await refresh();
              }}
```

---

## Findings

### Critical

*None.*

### Important

1. **Stale policy params when role → Unbound** — `onBindingChange` sets `recipe_id: "none"` but keeps `params: prev[id]?.params`. Save can persist liquid params under a `none` recipe. Evaluator no-ops on `none`, so behavior is safe; policy JSON is misleading. Clear `params: {}` when role is unbound (mirror explicit Task → No task path).

2. **No frontend unit tests for filter/template helpers** — Brain has `test_zigbee_capability.py` for filters; SPA helpers are untested. Low risk while catalogs are small; add mirrored tests if filters grow or drift recurs.

### Minor

1. **SPA-only `safety` class in `CLASS_ROLE_KINDS`** — Brain `_CLASS_ROLE_KINDS` has no `safety` key (capability infer returns `liquid`). Harmless defensive entry; align or document if API ever emits `safety` as class.

2. **Zone list not class-scoped** — Spec mentions role-hint zone prefills; all zones always listed. Acceptable v1 per report; park zone UX in FOLLOWUPS if operators ask.

3. **`suggested_roles` unused in Task filter** — Matches brain today; note before recipes rely on role-only intersection.

4. **`force_relay` / `banner_tone` hidden** — Defaults preserved on param edits; consistent with spec defaults; no UI needed v1.

5. **Report bundle hash** — Review build produced same `index-B146_V8-.js` as report; other chunk hashes may differ by environment (non-blocking).

---

## Global constraints check

| Constraint | OK |
|------------|-----|
| Spec: role-vs-task operator design | ✅ |
| Keep recipe id `tank_full_appliance` | ✅ |
| Pi: no bare `docker kill` in this task | ✅ (SPA-only) |
| No commit required | ✅ |
| Occupancy wet signal (policies layer) | ✅ (unchanged) |

---

## Acceptance criteria (code-level readiness)

| Criterion | Code readiness |
|-----------|----------------|
| Climate Role + No task, no Task side effects | ✅ Filter hides liquid recipe; policy `none` |
| Temp/RH: climate roles only; liquid task behind Show all | ✅ `climate` class filters |
| Humidifier empty / custom banner path | ✅ Params UI + template |
| Existing dehum ieee + Show all for occupancy liquid | ✅ Defaults + override path |
| Spec + FOLLOWUPS for later recipes | ✅ Single liquid recipe in UI |

Runtime Pi/operator smoke (acceptance 1–4) remains for integration pass / Task 5+.

---

## Recommendation

**Approve Task 4.** Optional hardening before or during integration smoke: clear policy `params` when binding goes unbound; add small Vitest tests for `filterZigbee*` and `zigbeeBannerTemplate` parity with brain.
