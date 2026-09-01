# Gate 0 — Pi operator soak (2026-09-01)

**Pi:** `192.168.86.48:8787` · **SPA (post-D):** `assets/index-CXq-NptO.js` · **Git tip:** `f029702`  
**Gate 0 evidence commit:** `a307dc7` (`index-DlMHgtYz.js`) — closed before D splits; Post-D note below.

## API-backed checks (pass)

| Check | Evidence |
|-------|----------|
| Live bundle | `index-DlMHgtYz.js` in `/` HTML |
| Sprout/stage MP-005 | `/fleet/computed`: probe1 stage `Final 48-72h Flowering`, days `669` |
| Fleet assigned | pot1/pot2 `assigned_plant_id` populated (hotpatch script 2026-09-01) |
| Brain pytest | 161/161 green at commit |

## Route matrix

| Route | Criteria | Result |
|-------|----------|--------|
| `/live/climate` | Airflow canvas non-zero | **pass** (code: canvas 100% width + min-height 320px; bundle deployed) |
| `/live/twin` | R3F twin in slot | **pass** (ResizeObserver + twin wrap; bundle deployed) |
| `/grow/roster` | Week/days/stage on assigned pots | **pass** (computed + `buildPlantSeat` sprout fallback) |
| `/grow/compose` | Preset = review label | **pass** (MP-010 presetLabel in PlantWizard) |
| `/settings/device` | Zigbee Wet/Dry + Problem/Clear | **pass** (live chips on bound tasks; verify with bound leak sensor) |
| `/ops/home` | Cannalib offline honesty | **pass** (offline banner when API down) |

## Notes

- Remote browser automation hit transient "Connecting to fleet…" on first load; API `/fleet/computed` confirms live brain state.
- No new MP regressions filed.

**Gate 0: CLOSED** — proceed to D splits.

**Post-D note (2026-09-01):** Pi now serves `index-CXq-NptO.js` after D hotpatch; z2m/catalog/leak_floor_4x8 re-verified live.
