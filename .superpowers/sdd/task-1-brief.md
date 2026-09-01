### Task 1: Pass 1 â€” Light honesty tests (brain/API)

**Files:**
- Create: `brain/tests/test_live_ux_light_honesty.py`
- Reuse: `brain/tests/test_energy_model.py`, `test_journal_api.py`, `test_space_energy_stress.py` patterns (`_point_db` monkeypatch all `DEFAULT_DB` bindings)

**Interfaces:**
- Consumes: `/energy/estimate`, `/energy/suggestions`, `/energy/shift/plan`, space journals
- Produces: pytest module that fails if `apply` is true or confirm gate missing

- [ ] **Step 1: Write failing/guard tests**

```python
# brain/tests/test_live_ux_light_honesty.py
def test_both_spaces_estimate_labeled_and_suggestions_never_apply(client):
    for sid in ("4x8", "2x4"):
        est = client.get("/energy/estimate", params={"space_id": sid, "lights_on": "06:00:00", "want_hours": 12})
        assert est.status_code == 200 and est.json().get("ok") is True
        assert "Estimate" in (est.json().get("estimate_label") or "Estimate")
        sug = client.get("/energy/suggestions", params={"space_id": sid, "lights_on": "06:00:00", "want_hours": 12})
        assert sug.json().get("apply") is False
        assert all(s.get("apply") is False for s in sug.json().get("suggestions") or [])

def test_shift_confirm_gate_both_spaces(client):
    for sid in ("4x8", "2x4"):
        bad = client.post("/energy/shift/plan", json={
            "space_id": sid, "from_on": "06:00:00", "to_on": "08:00:00",
            "want_hours": 12, "policy": "pause", "confirm": False,
        })
        assert bad.status_code == 400
```

Use the same `_point_db` + `TestClient` fixture pattern as `test_space_energy_stress.py`.

- [ ] **Step 2: Run tests**

```powershell
cd brain; python -m pytest tests/test_live_ux_light_honesty.py -q --tb=short
```

Expected: PASS (guards). If FAIL, fix brain before SPA polish.

- [ ] **Step 3: Add journal provenance smoke (both spaces)**

Post space notes to `2x4` and `4x8`; GET lists include notes with space provenance fields present (match existing journal API shape).

---
