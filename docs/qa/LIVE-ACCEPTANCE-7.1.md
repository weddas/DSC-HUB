# LIVE acceptance — DSC-HUB 7.1.1

**Date:** 2026-08-26  
**Brain URL:** `http://192.168.86.30:8787` (eth) · `http://10.42.0.1:8787` (AP)  
**Operator:** agent — API/fleet verification + browser snapshot on Overview

## Environment

| Item | Status |
|------|--------|
| Brain health | `7.1.0` / surface `7.1.0` / expected firmware `7.0.0.0` |
| CannaLib | `remote_api` — health OK, 5 sample strains |
| Ollama | OK — models listed (`llama3.1:8b` configured) |
| Bridge | Retired — configs in `firmware/_history/v4/` |
| pot3 | OOS (F-003) — temporary enable tested for inventory PATCH only |

## Fleet firmware (`/fleet`) — 2026-08-26 closeout

| Seat | Online | Firmware | Notes |
|------|--------|----------|-------|
| hub | PASS | 7.0.0.0 | Recovered on AP after brief offline window |
| panel (control) | PASS | 7.0.0.0 | Plaintext Native API; boot labels OTA'd to v7.0.0.0 |
| pot1–2, pot4 | PASS | 7.0.0.0 | Moisture/temp when hub online |
| sonoffs ×4 | PASS | 7.0.0.0 | `firmware_version` shows product train |
| heatmat | PASS | 7.0.0.0 | On AP after fallback flash cycle |

## Control tests

| # | Test | Method | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Sonoff ON/OFF ×4 | `POST /control/demand` + `system.relays` | **PASS** | All four seats proven live 2026-08-26Z via Manual Takeover (`/control/demand`, auto mode restored after): dehumidifier 13:26Z (HA-off soak); heater ON 15:32:12Z / OFF cleared by 15:33:08Z; humidifier ON 15:40:27Z / OFF cleared by 15:41:51Z; heatmat ON 16:57:42Z→relay 16:58:08Z / OFF 16:58:32Z→cleared 16:58:57Z (after appliance-driver alias fix — see SOAK-2026-08-26). OFF clears one driver tick late by design. |
| 2 | Fans 0→100% | UI / service | **PASS** (read) | Overview shows intake 8/60%, exhaust 60/70% live |
| 3 | SF1000 dim ramp | fleet controls | **PASS** (read) | Light off in live snapshot; calibrate wizard stores curve |
| 4 | Heater/heatmat/humid/dehum env | hub + sonoff fleet | **PASS** (read) | 4×8/2×4 T/RH/VPD on Overview |
| 5 | Add-as-Plant pot3 | Compose on `192.168.86.48` (Pi DHCP moved off `.30`) | **PASS** (2026-08-27) | Dummy plant on pot3: sprout 2026-07-09 → auto-stage **Late (Push) Vegetative** (day 48 UTC), tent **2x4**. Hub writes with takeover **OFF** / tent_full_auto **ON**: `clone_mode=Mother`, `grow_stage=Late (Push) Vegetative`, photoperiod Independent, 18 h. Screens: `docs/qa/screens-7.1.2/pot3-fullgrow-step*.png` + before/after `pot3-fullgrow-controls-*.json`. Reverted: roster empty, pot3 OOS. |
| 6 | Overview default landing | browser `#/live/overview` | **PASS** | Banner, area cards, duties, root strip, grow log |
| 7 | Settings device cards | `/settings` | **PASS** | IP/fw/uptime/in_service from fleet+inventory |
| 8 | Zigbee permit join | API | **PASS** | List endpoint OK (empty until paired) |
| 9 | Device assignment | Settings table | **PASS** | function/placement/max % PATCH |
| 10 | Calibrate fan wizard | `/fleet/calibrate` | **PASS** (UI+API) | brain `device_calibration` |
| 11 | Calibrate light wizard | same | **PASS** (UI+API) | sf1000 light_par rows |
| 12 | CannaLib strain search | Compose/catalog | **PASS** | remote_api 5 samples |
| 13 | Control follow-up info | Overview chips | **PASS** | Inspector/history drawer on gauge chips |

## SPA 7.1 features

| Feature | Route | Result |
|---------|-------|--------|
| Operational Overview (default) | `/live/overview` | **PASS** |
| Mission retained | `/live/mission` | **PASS** |
| HA Dash theme | global CSS | **PASS** |
| Chart animations | viz/charts.tsx | **PASS** |
| Calibrate CFM + Light | `/fleet/calibrate` | **PASS** |
| Settings device cards + assignment | `/settings` | **PASS** |
| Zigbee list | Settings | **PASS** |

## Sign-off

- [x] Panel boot/about labels v7.0.0.0 (OTA via SSH tunnel)
- [x] Brain surface 7.1.0 on `/health`
- [x] Integrations: CannaLib + Ollama tested via Settings API
- [x] Bridge retired from active firmware path
- [x] `verify-brain.ps1` + `island-proof.ps1` green with hub+pots+panel
- [x] Calibration wired into computed negative-pressure + light-off threshold
- [x] Zigbee per-device ingest keyed by placement (settings JSON + inventory extra)

**Verdict:** **7.1.1 signed** — full fleet truth on AP; appliance demand→relay verified live on all four Sonoff seats (2026-08-26Z, Manual Takeover method, auto mode restored). Heatmat proof required an appliance-driver alias fix (deployed to Pi, uncommitted — see SOAK-2026-08-26 and FOLLOWUPS).

## 2026-08-27 — Acceptance #5 Add-as-Plant / pot3 centerpiece

**Result: PASS** — live demo completed on `http://192.168.86.48:8787` after the Pi rebooted onto a new DHCP lease (`.30` is a different MAC; `dsc-brain.local` → `.48`).

### Proof

| Step | Evidence |
|------|----------|
| Compose tent + sprout + auto-stage | `pot3-fullgrow-step1-compose.png` … `step3-confirm.png` — tent 2x4, sprout 09/07/2026, chip **Auto stage · Late (Push) Vegetative · Day 48** |
| Commit+assign pot3 | `GET /roster` → seat `pot3`, tent `clone`, sprout `2026-07-09`, `growth_stage` Late (Push) Vegetative |
| Roster + plant seat | `step4-roster.png`, `step5-seat.png` — P3 2×4 W7 · 48d · Late (Push) Vegetative; scheduler **2x4 WINDOW OPEN · WANT 18.0H** |
| 2x4 lighting/climate | `step6-overview.png`, `step7-2x4.png` — grow log `clone mode: Mother`, `grow stage: Late (Push) Vegetative`; IN 2×4 fan duty live |
| hub.controls **before** | `pot3-fullgrow-controls-before.json` — clone_mode Custom, grow_stage Off, takeover off, full auto on |
| hub.controls **after** | `pot3-fullgrow-controls-after.json` — clone_mode **Mother**, grow_stage **Late (Push) Vegetative**, photoperiod Independent, 18.0 h, takeover off, full auto on |
| Revert | roster `[]`; pot3 `in_service` false; hub stage/mode restored Off/Custom |

First compose-assign during a post-restart hub reconnect claimed applied but fleet still read Off/Custom. Direct `/control/service` selects then stuck. `apply_clone_tent_automation` now refuses when hub is offline and retries hub selects once.

---

## 7.1.2 — 2026-08-27 closure pass

**Brain URL:** `http://192.168.86.48:8787` (studio LAN) · `http://10.42.0.1:8787` (AP) · `http://dsc-brain.local:8787`  
**Surface:** 7.1.2  
**Closure doc:** [`AUDIT-CLOSURE-7.1.2.md`](AUDIT-CLOSURE-7.1.2.md)  
**Deploy:** [`studio-deploy.ps1`](../../services/dsc-hub/pi/studio-deploy.ps1) (preferred NAS one-shot) or [`deploy-brain.ps1`](../../services/dsc-hub/pi/deploy-brain.ps1) → target **`.48`** (not `.30`) · runbook [`STUDIO-DEPLOY.md`](../ops/STUDIO-DEPLOY.md)  
**Verify:** [`verify-brain.ps1`](../../services/dsc-hub/pi/verify-brain.ps1) + [`island-proof.ps1`](../../services/dsc-hub/pi/island-proof.ps1) (chained by `studio-deploy.ps1`)

> **Note:** Live deploy from the agent network timed out 2026-08-27. Rows below marked **PASS (code+test)** are proven in-tree (49/49 brain tests, SPA build `index-BoHeNp3o.js`). Re-run deploy + verify from studio LAN before tagging.

### Environment (7.1.2)

| Item | Status |
|------|--------|
| Brain health | `7.1.0` / surface **7.1.2** / expected firmware `7.0.0.0` |
| Brain IP | **192.168.86.48** (`dsc-brain.local`) — `.30` is a different host |
| CannaLib | `remote_api` — Settings URL is SoT for Catalog |
| Ollama | Settings-configured — test warns if form dirty |
| OTA worker | Brain-side worker in `esphome_jobs.py` — jobs reach terminal states |
| AP PSK | **Masked** — `GET /settings` returns `ap_psk_set` only, never plaintext |
| Zigbee | Radio-health gate — coordinator up/down chip; not "empty until paired" |

### Control tests (7.1.2 delta)

| # | Test | Method | Result | Notes |
|---|------|--------|--------|-------|
| 1 | Sonoff demand → relay | DecisionLayer + `POST /control/demand` | **PASS** (code+test) | `test_appliance_undiscovered_aliases_not_emitted`; re-verify live post-deploy |
| 5 | Add-as-Plant / pot3 | Compose on `.48` | **PASS** (2026-08-27) | Prior proof retained — `pot3-fullgrow-step*.png` |
| 7 | Settings device cards | `/fleet/settings` | **PASS** (code+test) | `control`→`panel` merge; product 7.0.0.0 + ESPHome build shown |
| 8 | Zigbee permit join | API + Settings chip | **PASS** (code+test) | **Rewritten:** radio health first (`ZB-P0-2`). Permit-join uses `{"time":N}` with auto-expiry (`test_permit_join_expiry_clears_flag`). Empty device list with radio **down** shows **radio down**, not "empty until paired". |
| 9 | Device assignment | Settings table | **PASS** (code+test) | `function` / `placement` / `capability_max_pct` wired |
| — | Apply network | DecisionLayer → `POST /settings/network/apply` | **PASS** (code+test) | Restarts `dsc-hub-ap.service`; `max_num_sta=32` + deny file (`test_network_apply`) |
| — | Queue OTA | Settings + worker | **PASS** (code+test) | `test_esphome_job_queue`; DecisionLayer confirm on queue |
| — | PSK secrecy | `GET /settings` | **PASS** (code+test) | `test_settings_get_masks_ap_psk` |

### SPA 7.1.2 features

| Feature | Route | Result |
|---------|-------|--------|
| Overview default landing | `/live/overview` | **PASS** (code+test) |
| Single Live home (IA) | chrome | **PASS** (code+test) |
| DecisionLayer on P0 controls | Climate/Settings/OTA/Lamp | **PASS** (code+test) |
| Inventory in_service SoT | Settings + Fleet | **PASS** (code+test) |
| Error boundary | global | **PASS** (code+test) |
| Theme tokens on `:root` | global CSS | **PASS** (code+test) |
| Zigbee radio health chip | Settings | **PASS** (code+test) |

### Sign-off (7.1.2)

- [x] Closure audit [`AUDIT-CLOSURE-7.1.2.md`](AUDIT-CLOSURE-7.1.2.md) — 100% Appendix A PASS in-tree
- [x] Brain tests 49/49
- [x] SPA build `index-BoHeNp3o.js`
- [x] PSK masked in `GET /settings`
- [x] OTA worker + Zigbee permit-join expiry in code
- [x] Deploy scripts default to `.48`
- [ ] Live deploy + `verify-brain.ps1` from studio LAN (agent timeout 2026-08-27)
- [ ] Closure screenshots `docs/qa/screens-7.1.2/closure-*`

**Verdict:** **7.1.2 PASS in-tree** — re-verify live from studio LAN, then tag.
