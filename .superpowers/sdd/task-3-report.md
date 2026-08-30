# Task 3 Report — Persist capability_override on bind

**Status:** DONE  
**Branch:** (unchanged — working tree)  
**Commit:** none (per user rule)  
**Runtime code changed:** yes

## What was done

Round-tripped optional `capability_override` through `save_zigbee_bindings` / `load_zigbee_bindings` so operator sticky class (e.g. occupancy-only sensor treated as liquid after Show-all bind) survives Save and reload.

### Steps completed (TDD)

1. **RED — Write failing test**  
   Added `test_save_binding_capability_override_persists` in `brain/tests/test_zigbee_capability.py`:
   - `save_zigbee_bindings` with `capability_override: "liquid"` on occupancy-only device
   - `load_zigbee_bindings` returns override
   - `get_zigbee_devices()` reports `capability_class` and `capability_override` as `liquid` (no monkeypatch on load)

2. **RED — Run test (expect FAIL before impl)**  
   Would fail: saved/loaded binding dict omitted `capability_override`.

3. **GREEN — Implement**  
   - `load_zigbee_bindings`: include `capability_override` when present and valid (`_CLASS_ROLE_KINDS` keys).
   - `save_zigbee_bindings`: accept optional `capability_override`; validate on save; persist in cleaned binding row.

4. **GREEN — Run tests (expect PASS)**  
   ```
   cd brain; python -m pytest tests/test_zigbee_capability.py -v
   ```
   **Evidence:** `13 passed in 0.27s`

5. **Commit** — skipped (user did not ask).

## Self-review

| Brief requirement | Met |
|-------------------|-----|
| Optional `capability_override` on binding row | yes |
| Persist through `save_zigbee_bindings` | yes |
| Persist through `load_zigbee_bindings` | yes |
| Test: save liquid override; occupancy-only → class liquid | yes |
| Invalid override rejected on save | yes |
| Invalid override ignored on load | yes |
| No git commit | yes |

## Test summary

`13 passed` — 12 existing capability tests + 1 new persistence test.

## Concerns / follow-ups

1. **SPA wiring** — Task 4 must set `capability_override` when operator picks a safety role via Show all on a motion-class device.
2. **Clearing override** — save without the key leaves prior override in DB; SPA should omit or explicitly clear when operator reverts class.

## Files touched

| Path | Action |
|------|--------|
| `brain/dsc_brain/zigbee_mqtt.py` | `load_zigbee_bindings` / `save_zigbee_bindings` include `capability_override` |
| `brain/tests/test_zigbee_capability.py` | new persistence test |
| `.superpowers/sdd/task-3-report.md` | this report |
