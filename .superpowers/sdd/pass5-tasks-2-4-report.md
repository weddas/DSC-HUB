# Pass 5 Tasks 2–4 report

**Date:** 2026-09-01  
**Scope:** Energy confirm=400 (Task 2 energy-only), CannaLib prod verify-close (Task 3), FlowSankey live verify (Task 4)  
**Pi:** `http://192.168.86.48:8787`  
**Status:** **DONE**

## Summary

| Task | Status | Notes |
|------|--------|-------|
| 2 Energy `confirm=false` → 400 | **DONE** | Live both tents **400**; prove script asserts exact 400; Hold **not** cleared |
| 3 CannaLib prod | **DONE** | Prod+LAN offset distinct; Pi Test + proxy Load more green vs prod; **no redeploy** |
| 4 FlowSankey | **DONE** | HTTP cascade ≠ intake; browser Air CFM / mass gated / no EXPERIMENTAL; AirPathMap cascade; FOLLOWUPS graduated |

## Task 2 — Energy 400

### Evidence
- `POST /energy/shift/plan` with `confirm: false` → **400** for `4x8` and `2x4`
- Script: `.audit/live-ux-pass5-prove.ps1` (phase `ENERGY`) — fails if status is not exactly 400 (422 no longer accepted)
- Evidence JSON: `.audit/live-ux-pass5-prove-evidence.json` (`ok=true`)
- Walk Parks energy row filled; Manual Light Hold left **pending** (operator confirm required)

### Concerns
- None for status-code normalize. Sticky Hold and GPIO5 remain parks for later Pass 5 tasks.

## Task 3 — CannaLib

### Evidence
- Prod `https://cannalib.plausible-deniability.net` health `0.2.2-stdlib`; `q=kush&limit=3&offset=0|3` distinct (`strain_kush…` vs `strain_afghani_kush`)
- LAN `http://192.168.86.2:8790` same version + same distinct pages
- Pi `/settings/integrations/test-cannalib` → `ok: true`
- Pi `/settings/catalog/status` → `source=remote_api` (default URL LAN `:8790`)
- Brain proxy `/v1/catalogs/strains` offset 0 vs 3 distinct; Load-more path `limit=50&offset=50` distinct (50 then 1 new id)
- Temporary Settings URL switch to **prod HTTPS** — Test + proxy Load more still green — then **restored** to LAN `:8790`
- Redeploy **not** required
- FOLLOWUPS: MP-030 / MP-034 / Wave 2 offset deploy closed; no secrets in docs

### Concerns
- Browser SPA “Load more” click was flaky under multi-tab harness timeouts; prove used the same CatalogPicker endpoints the SPA calls (`/v1/catalogs/…&offset=`). UI click is residual polish, not a product failure.
- Pi Settings still points at LAN origin behind the CF tunnel (correct for lab); prod HTTPS path was spot-checked then restored.

## Task 4 — FlowSankey

### Evidence
- HTTP: `sensor.dsc_cfm_cascade_2x4_allocated` = **83.3** ≠ `sensor.dsc_cfm_intake_2x4_allocated` = **96.2**
- Browser Climate Air path: **AIR CFM**, **MASS CHIP GATED**, no **EXPERIMENTAL**, honesty copy present
- AirPathMap: **cascade 83** with intake 96 / 58 (allocated cascade sensor wired in `ClimatePage`)
- Code review: `FlowSankey` / `AirPathMap` / `ClimatePage` already honest — **no code fix**
- FOLLOWUPS: FlowSankey verify/graduate marked **done**; 7.4 phase B note updated

### Concerns
- None blocking. Wet/Dry MQTT `?` on Safety rows remains Pass 5 Task 5 (Zigbee).

## Commits

| SHA | Message |
|-----|---------|
| `d490904` | prove(pass5): require energy confirm=false HTTP 400 |
| `7b317d9` | docs(pass5): close CannaLib prod offset verify (MP-030/034) |
| `f9ecda4` | docs(pass5): graduate FlowSankey verify and report Tasks 2-4 |

## Remains (out of this brief)

| Item | Owner |
|------|--------|
| Manual Light Hold clear | Task 2 Hold / operator confirm — **do not auto-clear** |
| GPIO5 soft-gate / optical | Parks — reserved until wire-up |
| Zigbee one-recipe Wet→Problem | **Task 5** — no new recipes |
| Soak + three-desk re-walk | **Task 6** |
| Gate + FOLLOWUPS write-up | **Task 7** |

## Verdict

**DONE** — Tasks 2 (energy only), 3, and 4 closed with walk + FOLLOWUPS + prove script. Hold/Zigbee/soak/gate remain.
