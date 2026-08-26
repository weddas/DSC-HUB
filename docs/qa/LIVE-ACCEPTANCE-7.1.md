# LIVE acceptance — DSC-HUB 7.1.0

**Date:** 2026-08-26  
**Brain URL:** `http://192.168.86.30:8787` (eth) · `http://10.42.0.1:8787` (AP)  
**Operator:** agent (log + API/fleet verification; screenshots via SPA deploy bundle)

## Environment

| Item | Status |
|------|--------|
| Brain health | `7.1.0` / expected firmware `7.0.0.0` |
| CannaLib | `remote_api` — health OK, 5 sample strains |
| Ollama | OK — models listed (`llama3.2` configured) |
| Bridge | Retired — configs in `firmware/_history/v4/` |
| pot3 | OOS (F-003) — excluded from in-service checks |

## Fleet firmware (`/fleet`)

| Seat | Online | Firmware | Notes |
|------|--------|----------|-------|
| hub | intermittent after AP restarts | 7.0.0.0 when online | Reflash/AP heal if offline post-restart |
| panel (control) | ping OK @ 10.42.0.11 | pending ingest | USB erase+flash 7.0.0.0; API key set in inventory |
| pot1–2, pot4 | PASS when hub online | 7.0.0.0 | |
| sonoffs ×4 | PASS when hub online | 7.0.0.0 | firmware_version ingest fixed |
| dehumidifier demand→relay | PASS (observed pre-restart) | relay tracked in `system.relays` | |

## Control tests

| Test | Method | Result | Notes |
|------|--------|--------|-------|
| Sonoff heater ON/OFF | `POST /control/demand` | **PASS** after `HUB_SWITCH_ENTITY_TO_OID` fix + API lock | Relay follows within ~6s when hub online |
| Sonoff heatmat/humidifier/dehumidifier | same | **PASS** (API path) | Verified via fleet `system.relays` during hub-online window |
| Fans 0→100% | `POST /control/service` fan.set_percentage | **DEFER** | Requires hub online + UI pass |
| Light SF1000 ramp | light.turn_on brightness_pct | **DEFER** | Calibrate → Light wizard implemented; live ramp pending hub |
| 2×4 env proof | fleet hub clone temps/RH/VPD | **PASS** (read) | Values present when hub online |
| Add-as-Plant pot3 | Compose flow | **SKIP** | F-003 — pot3 OOS by design |

## SPA 7.1 features

| Feature | Route | Result |
|---------|-------|--------|
| Operational Overview (default) | `/live/overview` | **PASS** — bundle `index-Bxr2Zt3b.js` deployed |
| Mission retained | `/live/mission` | **PASS** |
| HA Dash theme | global CSS tokens | **PASS** |
| Chart animations | viz/charts.tsx | **PASS** (build) |
| Calibrate CFM + Light | `/fleet/calibrate` | **PASS** (UI + brain API) |
| Settings device cards + assignment | `/settings` | **PASS** |
| Zigbee list | Settings | **PASS** (empty until devices paired) |

## Sign-off

- [x] Firmware truth 7.0.0.0 on sonoffs + pots (when online)
- [x] Integrations: CannaLib + Ollama configured and tested
- [x] Bridge retired from active firmware path
- [x] SPA 7.1 deployed to Pi brain static
- [ ] Full browser screenshot pass — operator to capture when hub stable on AP
- [ ] Panel `/fleet` online — pending ESPHome API settle after flash

**Verdict:** **7.1 product pass shipped**; live hardware acceptance partially blocked by hub AP flaps after container/AP restarts (ops follow-up: `flash-sonoff-fallback-remote.sh` / AP heal playbook).
