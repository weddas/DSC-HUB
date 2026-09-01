### Task 4: Pass 2 â€” Climate honesty tests

**Files:**
- Create: `brain/tests/test_live_ux_climate_honesty.py`
- Reuse: `brain/tests/test_reduced_kit.py`, zigbee policy tests as reference

**Interfaces:**
- Consumes: `_reduced_kit`, fleet extras shapes
- Produces: assertions pot3/4 in `planned_oos`, never offline lead when only planned

- [ ] **Step 1: Write reduced-kit + policy display guards**

```python
def test_reduced_kit_pot34_planned_not_offline_lead(temp_db, monkeypatch):
    # point DEFAULT_DB; list_inventory; _reduced_kit
    active, attrs = _reduced_kit(list_inventory(temp_db))
    assert "POT4" not in attrs.get("offline", "")
    assert "POT3" not in attrs.get("offline", "")
    planned = attrs.get("planned_oos", "")
    assert "POT3" in planned and "POT4" in planned
```

Add a test that documents SPA must not infer problem from wet alone (comment + optional pure helper if one exists; otherwise browser-only in Task 6 â€” do not invent a new policy engine).

- [ ] **Step 2: pytest**

```powershell
cd brain; python -m pytest tests/test_live_ux_climate_honesty.py tests/test_reduced_kit.py -q --tb=short
```

Expected: PASS

---
