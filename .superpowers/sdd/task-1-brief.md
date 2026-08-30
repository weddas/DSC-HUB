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
                    "banner": "Floor dry alarm â€” check sensor",
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

- [ ] **Step 2: Run tests â€” expect FAIL**

```bash
cd brain && python -m pytest tests/test_zigbee_policies.py::test_floor_flood_wet_banner_no_oos tests/test_zigbee_policies.py::test_flood_banner_template tests/test_zigbee_capability.py::test_floor_space_roles_in_safety_filter -v
```

Expected: FAIL (unknown recipe / missing roles / missing `flood_banner_template`)

- [ ] **Step 3: Implement catalog + helper**

In `zigbee_mqtt.py` `ZIGBEE_ROLE_CATALOG`, after `leak_floor` / `leak_tank`:

```python
{"id": "leak_floor_room", "label": "Water leak (floor Â· room)", "consume": False, "kind": "safety"},
{"id": "leak_floor_4x8", "label": "Water leak (floor Â· 4Ã—8)", "consume": False, "kind": "safety"},
{"id": "leak_floor_2x4", "label": "Water leak (floor Â· 2Ã—4)", "consume": False, "kind": "safety"},
```

In `zigbee_policies.py` add:

```python
def flood_banner_template(problem_when: str) -> str:
    polarity = str(problem_when or "active").strip().lower()
    if polarity == "inactive":
        return "Floor dry alarm â€” check sensor"
    return "Floor water detected"
```

Add recipe to `RECIPE_CATALOG` (after `tank_full_appliance`):

```python
{
    "id": "floor_flood_alert",
    "label": "Floor flood â†’ alert",
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

- [ ] **Step 4: Run tests â€” expect PASS**

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

