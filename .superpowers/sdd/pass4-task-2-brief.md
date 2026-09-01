### Task 2: Phase A â€” Twin hybrid Got (brain)

**Files:**
- Modify: `brain/dsc_brain/computed_ops.py` (`_light_runtime_snapshot` / `got_hours_4x8`)
- Modify: `brain/dsc_brain/light_loop.py` if needed
- Modify: `brain/dsc_brain/esphome_client.py` / `history_ops.py` â€” ensure Twin on/brightness history
- Test: `brain/tests/test_live_ux_pass4_twin.py`

**Interfaces:**
- Produces: `got_hours_4x8` prefers Twin-derived hours when Twin available + healthy history; else `window_4x8_open` hours
- Produces: history metric for Twin suitable for DutyStrip (on/off or brightnessâ†’on)

- [ ] **Step 1: Failing tests** for hybrid preference and window fallback
- [ ] **Step 2: Implement minimal hybrid Got + history ingest**
- [ ] **Step 3: pytest PASS**
- [ ] **Step 4: Commit**

---
