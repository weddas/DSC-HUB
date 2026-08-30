# Zigbee policy honesty + floor flood — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show Wet/Dry plus Problem/Clear on Climate for bound liquid Tasks, and ship one banner-only recipe `floor_flood_alert` with distinct floor roles (room / 4×8 / 2×4), proven on both desk sensors.

**Architecture:** Extend the shared `evaluate_device_policies` path with a no-seat recipe; add `leak_floor_room` / `leak_floor_4x8` / `leak_floor_2x4` to the role catalog; Climate reads `zigbee_by_role` wet plus `zigbee_policy_state[ieee].problem`; Settings reuses one task-params block for tank + flood (hide Appliance on flood).

**Tech Stack:** Python `zigbee_policies.py` / `zigbee_mqtt.py`, pytest, React Climate/Settings SPA (`fleetApi.ts`), Pi hotpatch with `timeout` docker restart only.

## Global Constraints

- Spec (approved): `docs/superpowers/specs/2026-08-31-zigbee-policy-honesty-floor-flood-design.md`
- Extends: Role vs Task operator + device-tasks specs (2026-08-30)
- One new recipe only: `floor_flood_alert` — never OOS / force_relay
- Wet/Dry primary; Problem/Clear only when Task bound and `zigbee_policy_state` present
- Distinct roles for spaces (not zone-multiplex under one role id); multi-sensor-per-space = future indexed `*_b` roles (FOLLOWUPS only)
- Evidence: desk `0xa4c1385a686af7df` + `0xa4c1380d734f2033` → room + 4×8 flood; no required 2×4 bind
- Pi: never bare `docker kill`; prefer `timeout 25 docker restart` or SPA `docker cp`
- Commit only when user asks (skip commit steps unless asked)
- Probe/Plant language; behavioral honesty

### File map

| File | Responsibility |
|------|----------------|
| `brain/dsc_brain/zigbee_policies.py` | `floor_flood_alert` catalog entry; optional `flood_banner_template`; tests |
| `brain/dsc_brain/zigbee_mqtt.py` | Add `leak_floor_room` / `leak_floor_4x8` / `leak_floor_2x4` roles |
| `brain/tests/test_zigbee_policies.py` | Flood wet/dry/inactive; no OOS |
| `brain/tests/test_zigbee_capability.py` | New roles in safety filter |
| `homeassistant/.../frontend/src/lib/fleetApi.ts` | `isZigbeeSafetyLeakRole` prefix; flood banner helper |
| `homeassistant/.../frontend/src/pages/SettingsPage.tsx` | Shared task params; flood recipe in fallbacks |
| `homeassistant/.../frontend/src/pages/ClimatePage.tsx` | Safety subsection Wet/Dry + Problem/Clear |
| `docs/FOLLOWUPS.md` | Mark honesty + flood done; park multi-sensor + 2×4 evidence |

---

### Task 1: Roles + `floor_flood_alert` recipe (TDD)

**Files:**
- Modify: `brain/dsc_brain/zigbee_mqtt.py` (role catalog ~line 42)
- Modify: `brain/dsc_brain/zigbee_policies.py` (`RECIPE_CATALOG`, optional `flood_banner_template`)
- Modify: `brain/tests/test_zigbee_policies.py`
- Modify: `brain/tests/test_zigbee_capability.py`

**Interfaces:**
- Consumes: existing `evaluate_device_policies`, `save_zigbee_policies`, `normalize_binary_active`
- Produces: recipe id `floor_flood_alert`; roles `leak_floor_room`, `leak_floor_4x8`, `leak_floor_2x4`; `flood_banner_template(problem_when: str) -> str`

- [ ] **Step 1: Write failing tests**

Append to `brain/tests/test_zigbee_policies.py`:

```python
def test_floor_flood_wet_banner_no_oos(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    forced: list[tuple[str, bool]] = []
    monkeypatch.setattr(
        "dsc_brain.appliance_driver.force_set_sonoff_relay_sync",
        lambda seat, on: forced.append((seat, on)),
    )
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies

    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["zigbee_policy_state"] = {}
    fleet.system["critical_banners"] = []
    update_fleet_state(fleet)

    save_zigbee_policies(
        {
            "0xflood1": {
                "recipe_id": "floor_flood_alert",
                "enabled": True,
                "params": {"problem_when": "active", "banner": "Floor water detected"},
            }
        }
    )
    out = evaluate_device_policies(
        ieee="0xflood1",
        friendly_name="desk_flood",
        payload={"occupancy": True},
    )
    assert out and out["changed"] is True and out["problem"] is True
    assert _seat("dehumidifier", temp_db)["in_service"] is True
    assert _seat("humidifier", temp_db)["in_service"] is True
    assert forced == []
    banners = get_fleet_state().system.get("critical_banners") or []
    assert any(b.get("id") == "zb-policy-0xflood1" for b in banners)
    st = get_fleet_state().system["zigbee_policy_state"]["0xflood1"]
    assert st["active"] is True and st["problem"] is True


def test_floor_flood_dry_clears_banner(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies

    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["zigbee_policy_state"] = {
        "0xflood1": {"recipe_id": "floor_flood_alert", "active": True, "problem": True}
    }
    fleet.system["critical_banners"] = [
        {"id": "zb-policy-0xflood1", "text": "Floor water detected", "tone": "critical"}
    ]
    update_fleet_state(fleet)
    save_zigbee_policies(
        {
            "0xflood1": {
                "recipe_id": "floor_flood_alert",
                "enabled": True,
                "params": {"problem_when": "active", "banner": "Floor water detected"},
            }
        }
    )
    out = evaluate_device_policies(
        ieee="0xflood1",
        friendly_name="desk_flood",
        payload={"occupancy": False},
    )
    assert out and out["changed"] is True and out["problem"] is False
    banners = get_fleet_state().system.get("critical_banners") or []
    assert not any(b.get("id") == "zb-policy-0xflood1" for b in banners)


def test_floor_flood_inactive_polarity(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("dsc_brain.settings.DEFAULT_DB", temp_db)
    from dsc_brain.fleet_state import get_fleet_state, update_fleet_state
    from dsc_brain.zigbee_policies import evaluate_device_policies, save_zigbee_policies

    fleet = get_fleet_state()
    fleet.system = dict(fleet.system)
    fleet.system["zigbee_policy_state"] = {}
    fleet.system["critical_banners"] = []
    update_fleet_state(fleet)
    save_zigbee_policies(
        {
            "0xflood2": {
                "recipe_id": "floor_flood_alert",
                "enabled": True,
                "params": {
                    "problem_when": "inactive",
                    "banner": "Floor dry alarm — check sensor",
                },
            }
        }
    )
    out = evaluate_device_policies(
        ieee="0xflood2",
        friendly_name="inv",
        payload={"occupancy": False},
    )
    assert out and out["problem"] is True and out["changed"] is True
    banners = get_fleet_state().system.get("critical_banners") or []
    assert any(b.get("id") == "zb-policy-0xflood2" for b in banners)


def test_flood_banner_template() -> None:
    from dsc_brain.zigbee_policies import flood_banner_template

    assert flood_banner_template("active") == "Floor water detected"
    assert "dry" in flood_banner_template("inactive").lower() or "Dry" in flood_banner_template("inactive")
```

Append to `brain/tests/test_zigbee_capability.py` (or extend existing filter test):

```python
def test_floor_space_roles_in_safety_filter() -> None:
    from dsc_brain.zigbee_mqtt import filter_roles_for_class, get_role_catalog

    roles = get_role_catalog()
    ids = {r["id"] for r in filter_roles_for_class("liquid", roles)}
    assert "leak_floor_room" in ids
    assert "leak_floor_4x8" in ids
    assert "leak_floor_2x4" in ids
    assert "leak_floor" in ids
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd brain && python -m pytest tests/test_zigbee_policies.py::test_floor_flood_wet_banner_no_oos tests/test_zigbee_policies.py::test_flood_banner_template tests/test_zigbee_capability.py::test_floor_space_roles_in_safety_filter -v
```

Expected: FAIL (unknown recipe / missing roles / missing `flood_banner_template`)

- [ ] **Step 3: Implement catalog + helper**

In `zigbee_mqtt.py` `ZIGBEE_ROLE_CATALOG`, after `leak_floor` / `leak_tank`:

```python
{"id": "leak_floor_room", "label": "Water leak (floor · room)", "consume": False, "kind": "safety"},
{"id": "leak_floor_4x8", "label": "Water leak (floor · 4×8)", "consume": False, "kind": "safety"},
{"id": "leak_floor_2x4", "label": "Water leak (floor · 2×4)", "consume": False, "kind": "safety"},
```

In `zigbee_policies.py` add:

```python
def flood_banner_template(problem_when: str) -> str:
    polarity = str(problem_when or "active").strip().lower()
    if polarity == "inactive":
        return "Floor dry alarm — check sensor"
    return "Floor water detected"
```

Add recipe to `RECIPE_CATALOG` (after `tank_full_appliance`):

```python
{
    "id": "floor_flood_alert",
    "label": "Floor flood → alert",
    "when": "active",
    "clear_when": "inactive",
    "default_params": {
        "problem_when": "active",
        "banner": "Floor water detected",
        "banner_tone": "critical",
    },
    "device_classes": ["liquid", "safety"],
    "suggested_roles": [
        "leak_floor_room",
        "leak_floor_4x8",
        "leak_floor_2x4",
        "leak_floor",
    ],
    "param_schema": {
        "problem_when": {"type": "enum", "values": ["active", "inactive"]},
        "banner": {"type": "string"},
    },
    "description": "When floor sensor hits problem polarity: critical banner + grow-log only. No appliance OOS. Clear on opposite edge.",
},
```

No evaluator fork required if flood params omit `seat_id` / `force_relay` (existing `_apply_active` / `_apply_clear` already skip empty seat).

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd brain && python -m pytest tests/test_zigbee_policies.py tests/test_zigbee_capability.py -v
```

Expected: all PASS (including tank regressions)

- [ ] **Step 5: Commit** (only if user asked)

```bash
git add brain/dsc_brain/zigbee_policies.py brain/dsc_brain/zigbee_mqtt.py brain/tests/test_zigbee_policies.py brain/tests/test_zigbee_capability.py
git commit -m "feat(zigbee): floor_flood_alert recipe and space floor roles"
```

---

### Task 2: Settings — shared task params + safety role helper

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
  if (polarity === "inactive") return "Floor dry alarm — check sensor";
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

Expected: exit 0; new hashed assets under spa-dist (or project’s usual SPA out dir)

- [ ] **Step 4: Commit** (only if user asked)

```bash
git add homeassistant/custom_components/dsc_hub/frontend/src/lib/fleetApi.ts homeassistant/custom_components/dsc_hub/frontend/src/pages/SettingsPage.tsx
git commit -m "feat(spa): Settings task params for floor flood alert"
```

---

### Task 3: Climate safety honesty (Wet/Dry + Problem/Clear)

**Files:**
- Modify: `homeassistant/custom_components/dsc_hub/frontend/src/pages/ClimatePage.tsx`

**Interfaces:**
- Consumes: `fleet.system.zigbee_by_role`, `fleet.system.zigbee_device_bindings`, `fleet.system.zigbee_device_policies`, `fleet.system.zigbee_policy_state`
- Produces: Climate safety rows with wet chip + optional problem chip

- [ ] **Step 1: Split climate vs safety rows**

Import `isZigbeeSafetyLeakRole` from `../lib/fleetApi`.

```typescript
const bindings = (fleet.system.zigbee_device_bindings ?? {}) as Record<
  string,
  { role?: string; zone?: string; recipe_id?: string }
>;
const policies = (fleet.system.zigbee_device_policies ?? {}) as Record<
  string,
  { recipe_id?: string }
>;
const policyState = (fleet.system.zigbee_policy_state ?? {}) as Record<
  string,
  { problem?: boolean; active?: boolean }
>;

function ieeeForRole(roleId: string): string | null {
  for (const [ieee, row] of Object.entries(bindings)) {
    if (String(row?.role ?? "") === roleId) return ieee;
  }
  return null;
}

const zigbeeClimateRows = useMemo(() => {
  if (!zigbeeByRole) return [];
  return Object.entries(zigbeeByRole)
    .filter(([role]) => !isZigbeeSafetyLeakRole(role))
    .map(([role, row]) => ({
      role,
      zone: String(row.zone ?? "—"),
      temp: row.temperature,
      rh: row.humidity,
      name: String(row.friendly_name ?? role),
    }));
}, [zigbeeByRole]);

const zigbeeSafetyRows = useMemo(() => {
  if (!zigbeeByRole) return [];
  return Object.entries(zigbeeByRole)
    .filter(([role]) => isZigbeeSafetyLeakRole(role))
    .map(([role, row]) => {
      const ieee = ieeeForRole(role);
      const recipe =
        (ieee && policies[ieee]?.recipe_id) ||
        (ieee && bindings[ieee] && (bindings[ieee] as { recipe_id?: string }).recipe_id) ||
        "none";
      // Prefer zigbee_device_policies from fleet (brain mirrors policies onto fleet)
      const recipeId = ieee ? String(policies[ieee]?.recipe_id ?? "none") : "none";
      const st = ieee ? policyState[ieee] : undefined;
      const wet = typeof row.wet === "boolean" ? row.wet : typeof row.active === "boolean" ? row.active : null;
      const showProblem = Boolean(ieee && recipeId !== "none" && st && typeof st.problem === "boolean");
      return {
        role,
        zone: String(row.zone ?? "—"),
        name: String(row.friendly_name ?? role),
        wet,
        showProblem,
        problem: showProblem ? Boolean(st?.problem) : null,
      };
    });
}, [zigbeeByRole, bindings, policies, policyState]);
```

Fix any dead `recipe` variable — use only `recipeId` from `policies`.

Gate card visibility on climate **or** safety rows (not climate-only).

- [ ] **Step 2: Render safety subsection**

Below the climate table (or second table):

```tsx
{zigbeeSafetyRows.length ? (
  <>
    <p className="dsc-muted" style={{ fontSize: 12, marginTop: 12, marginBottom: 8 }}>
      Safety — Wet/Dry is the raw sensor. Problem/Clear appears only when a Task is bound.
    </p>
    <div className="dsc-chip-row">
      {zigbeeSafetyRows.map((row) => (
        <React.Fragment key={row.role}>
          <StatusChip
            label={`${row.role} · ${row.zone} · ${row.name}`}
            tone="muted"
          />
          <StatusChip
            label={row.wet === true ? "Wet" : row.wet === false ? "Dry" : "Wet/Dry —"}
            tone={row.wet === true ? "warn" : "ok"}
          />
          {row.showProblem ? (
            <StatusChip
              label={row.problem ? "Problem" : "Clear"}
              tone={row.problem ? "critical" : "ok"}
            />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  </>
) : null}
```

Use existing `StatusChip` tone names already used on Climate (adjust `critical` → `warn` if tone enum lacks critical).

Ensure climate table maps `zigbeeClimateRows` (not all roles).

- [ ] **Step 3: Rebuild SPA**

```bash
cd homeassistant/custom_components/dsc_hub/frontend && npm run build:spa
```

Expected: exit 0

- [ ] **Step 4: Commit** (only if user asked)

```bash
git add homeassistant/custom_components/dsc_hub/frontend/src/pages/ClimatePage.tsx
git commit -m "feat(spa): Climate Zigbee safety Wet/Dry and Problem chips"
```

---

### Task 4: FOLLOWUPS + docs status

**Files:**
- Modify: `docs/FOLLOWUPS.md` (2026-08-30 Zigbee device tasks section)
- Optionally mark related rows in one-pass section if needed

- [ ] **Step 1: Update FOLLOWUPS**

In `## 2026-08-30 — Zigbee device tasks`:

| Item | Status |
|------|--------|
| Policy problem vs raw wet in UI | **done** (Climate safety chips; this plan) |
| Recipe `floor_flood_alert` | **done (Pi evidence pending Task 5)** then **done (live)** after Task 5 |
| Roles `leak_floor_room` / `_4x8` / `_2x4` | **done (catalog)** |
| Multi-sensor per space (`*_b` roles) | **next-plan** |
| `leak_floor_2x4` live bind | **deferred** until hardware in 2×4 |

Add dated note pointing at this plan + spec.

- [ ] **Step 2: Commit** (only if user asked)

---

### Task 5: Pi hotpatch + desk flood evidence

**Files:**
- Create (optional audit): `.audit/zb-flood-desk-bind.sh`, `.audit/zb-flood-evidence.sh`
- Hotpatch on Pi `192.168.86.48` (user `dsc`)

**Interfaces:**
- Consumes: Task 1–3 code on disk
- Produces: evidence that both desk ieee fire independent banners; Climate chips match; tank unchanged

- [ ] **Step 1: Deploy brain modules**

Copy `zigbee_policies.py` + `zigbee_mqtt.py` into the running brain container (same path used in prior hotpatches). Restart with:

```bash
timeout 25 docker restart <brain_container>
```

Never bare `docker kill`.

- [ ] **Step 2: Deploy SPA**

`docker cp` built SPA assets (or full spa-dist) into brain/nginx static path used previously; hard-reload operator browser.

- [ ] **Step 3: Bind desk sensors**

Via API/Settings (Show all if class is motion):

| ieee | role | zone | recipe |
|------|------|------|--------|
| one of `0xa4c1385a686af7df`, `0xa4c1380d734f2033` | `leak_floor_room` | `room` | `floor_flood_alert` |
| the other | `leak_floor_4x8` | `4x8` | `floor_flood_alert` |

Confirm tank ieee `0xa4c138b9e2b9b690` still `leak_tank` + `tank_full_appliance`.

- [ ] **Step 4: Smoke**

1. Wet room desk → banner id `zb-policy-<room_ieee>`; dehum/humidifier `in_service` unchanged; Climate shows Wet + Problem for room role.
2. Dry room desk → that banner clears; Clear chip.
3. Wet 4×8 desk → separate banner id; room banner stays clear if dry.
4. Optionally MQTT inject if physical wet awkward.
5. Confirm Overview critical strip shows flood text; tank path still OOS on wet if exercised.

- [ ] **Step 5: Write evidence**

Append to `.superpowers/sdd/` or `.audit/` short report with fleet JSON snippets (banners, policy_state, inventory seats). Update FOLLOWUPS flood row to **done (live)**.

- [ ] **Step 6: Commit** (only if user asked)

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Wet primary + Problem badge when Task bound | Task 3 |
| `floor_flood_alert` opposite-edge, banner+log, no OOS | Task 1 |
| Params `problem_when` + `banner` | Tasks 1–2 |
| Roles room / 4×8 / 2×4 + suggested_roles | Task 1 |
| Shared Settings task params | Task 2 |
| Desk sensors room + 4×8 evidence | Task 5 |
| Multi-sensor / 2×4 live deferred | Task 4 FOLLOWUPS |
| Tank regressions | Task 1 pytest full files |

No TBD placeholders; commit steps gated on user ask.
