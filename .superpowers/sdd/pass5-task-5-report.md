# Pass 5 Task 5 report — Zigbee one-recipe Wet/Problem

**Date:** 2026-09-01  
**Scope:** `floor_flood_alert` Wet→Problem path; by_role/policies seed; `leak_floor_2x4` park; GPIO5 soft-gate  
**Pi:** `http://192.168.86.48:8787`  
**Status:** **BLOCKED** (Pi unreachable mid-hotpatch)

## Verdict

**BLOCKED** — brain/SPA contract + local pytest green; live Wet/Problem MQTT prove **not** completed because the Pi stopped answering ping after Task 5 `docker kill`+`start` hotpatch. Manual Light Hold **not** cleared.

## What landed (code)

| Change | Why |
|--------|-----|
| `zigbee_mqtt._reapply_bindings_to_fleet` seeds `zigbee_device_policies` | Climate SPA reads recipe_id from fleet; was null until first MQTT evaluate |
| `apply_zigbee_cache_to_state` always loads persisted policies | Survives ESPHome fleet clobber races |
| `save_zigbee_policies` mirrors onto fleet | PUT policies → immediate SPA recipe visibility |
| `test_zigbee_reapply_seeds_device_policies_for_spa_recipe` | Asserts recipe on fleet **without** inventing `policy_state.problem` |

**No new recipe ID.** Curated path remains `floor_flood_alert` (banner-only); tank stays `tank_full_appliance`.

## Pre-kill live inventory (HTTP)

| Check | Result |
|-------|--------|
| MQTT / radio | `mqtt_connected=true`, `bridge_state=online`, 4 end-devices |
| Bindings | `leak_floor_room` `0xa4c1385a686af7df`, `leak_floor_4x8` `0xa4c1380d734f2033`, `leak_tank` `0xa4c138b9e2b9b690`, `canopy_4x8` |
| Policies | Both desks `floor_flood_alert`; tank `tank_full_appliance` |
| `zigbee_by_role` | Populated stubs (not empty — Pass 4 residual superseded pre-kill) |
| `zigbee_policy_state` | null (no recent occupancy evaluate) |
| Twin | `light.dsc_hub_twin_sf1000` `off` bri=255 |
| `leak_floor_2x4` | **absent** → **parked** (no HW) |

## Live Wet/Problem evidence

**None post-hotpatch.** Prove script `.audit/live-ux-pass5-task5-zigbee-prove.ps1` intended:

1. Hotpatch `zigbee_mqtt.py` + `zigbee_policies.py`
2. `docker kill` + `docker start` (not restart)
3. Re-PUT bindings/policies
4. MQTT `occupancy` false→true→false on room + 4×8 desks
5. Assert by_role wet + `policy_state.problem` + `zb-policy-*` banners (no OOS)

Step 2 left the host dark: no ICMP, SSH timeout, `:8787` dead (~15+ min). Gateway `192.168.86.2` still up.

### Recovery (operator)

1. Power-cycle Pi `192.168.86.48`
2. Confirm `curl http://192.168.86.48:8787/health`
3. Re-run `.audit/live-ux-pass5-task5-zigbee-prove.ps1` (or plink resume without kill if modules already on disk — they may **not** be if kill raced before `docker cp` finished; script re-cps)
4. Fill walk Wet/Problem rows from evidence JSON

## GPIO5 soft-gate

| Item | Notes |
|------|-------|
| Walk Parks GPIO5 | **pass (soft-gate)** |
| Optical | N/A — unwired |
| SPA | Light page already: GPIO5 **reserved / not physically wired** |
| Twin entity | Present as software actuator — do not claim optical |

## pytest

```text
23 passed — test_brain_pi zigbee reapply/seed + test_live_ux_climate_honesty + test_zigbee_policies
```

## Walk / FOLLOWUPS

- `docs/qa/LIVE-UX-PASS5-WALK-2026-09.md` — Zigbee + GPIO5 rows filled; Wet/Problem **blocked**
- `docs/FOLLOWUPS.md` — Task 5 residuals + Pi P0 hang note; `leak_floor_2x4` parked; Pass 4 by_role-empty residual superseded

## Commits

| SHA | Message |
|-----|---------|
| `26d71a4` | fix(pass5): seed Zigbee policies on fleet for Wet/Problem path |

Not pushed.

## Concerns

1. **Pi hang on kill+start** — same class of host wedging as historical restart hangs; may need rule/skill note: verify ping after kill before long waits; prefer SPA-only / module cp without kill when only Python modules change (uvicorn reload?) or shorter kill window.
2. Live Wet≠Problem still needs occupancy inject after recovery — do not mark queue closed until evidence JSON `ok=true`.
3. SNZB-03 devices still fingerprint `capability_class=motion` — liquid occupancy path works via `normalize_binary_active`; operator override already used for safety roles.
4. Manual Light Hold still sticky — do not clear without operator confirm.

## Remains

| Item | Owner |
|------|--------|
| Pi power-cycle + prove script | Operator / Task 5 resume |
| Soak + three-desk re-walk | Task 6 |
| Gate + FOLLOWUPS write-up | Task 7 |
| Manual Light Hold clear | Operator confirm |
