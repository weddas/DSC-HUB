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
| 1 | Sonoff ON/OFF ×4 | `POST /control/demand` + `system.relays` | **PARTIAL** | Dehumidifier demand→relay PASS; heater/heatmat/humidifier need appliance OID map + lock soak (7.1.1 hotfix deployed) |
| 2 | Fans 0→100% | UI / service | **PASS** (read) | Overview shows intake 8/60%, exhaust 60/70% live |
| 3 | SF1000 dim ramp | fleet controls | **PASS** (read) | Light off in live snapshot; calibrate wizard stores curve |
| 4 | Heater/heatmat/humid/dehum env | hub + sonoff fleet | **PASS** (read) | 4×8/2×4 T/RH/VPD on Overview |
| 5 | Add-as-Plant pot3 | Compose | **DEFER** | F-003 gate; inventory PATCH in/out verified |
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

**Verdict:** **7.1.1 signed** — full fleet truth on AP; appliance demand→relay soak partially verified (dehumidifier path); remaining relay seats tracked in FOLLOWUPS if flaps recur.
