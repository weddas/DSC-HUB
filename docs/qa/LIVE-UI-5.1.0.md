# Live UI pass — DSC-HUB Pro v5.1.0

Operator click-through once Sync + helpers are live.

**Lab pass (192.168.86.3) — 2026-08-01**

| Check | Result |
|---|---|
| Sync add-on | **5.1.1** installed; `sync_esphome: true` |
| HA surface | `sensor.dsc_ha_surface_version` = **5.1.0** |
| Sync SHA | live (tracks master) |
| Fleet chip | **FLEET DRIFT** (warn) — expected until devices flash project **5.1.0** |
| Learning Phase A+B | Present; Phase B default **off**; floor/ceil/alpha OK |
| Hub ladder waits | Missing until hub firmware Install (markdown cue added) |
| Coldest root | Works after mat votes on (fallback if all votes off) |
| Notify | `input_text.dsc_notify_service` → `notify.mobile_app_chriss_iphone_max` |
| SYSTEM MAP | Fixed — www JS sync + Lovelace resource `/local/dsc-system-map-card.js` |
| Panel | OFFLINE on lab at pass time |

## Home

- [x] Pulse: Hub / Panel / uptime / alerts / **FLEET** chip
- [x] Fleet chip tap → System (navigation present)
- [x] Root / coldest path available (votes restored)
- [x] Nav chips → `/dsc-hub-pro/…`
- [x] SYSTEM MAP renders (after resource register)

## Climate / Learning / System

- [x] Learning Phase A+B status strip + Phase B section
- [x] Phase B waits hidden with cue until hub flash
- [x] System expected **5.1.0** table present
- [ ] Full chip **ok** — blocked on manual ESPHome Install fleet to project version 5.1.0

## Remaining operator steps

1. ESPHome Validate/Install hub → panel → pots → Sonoffs (Firmware Version must show **5.1.0**, not ESPHome compiler string)
2. Confirm `sensor.dsc_fleet_version_status` → **ok**
3. Optional: disable leftover sidebar **DSC** storage dashboard if unused
4. Capture screenshots into `docs/assets/` for GitHub social preview

## Sign-off

| Operator | HA host | Date | Result |
|---|---|---|---|
| Cursor live pass | 192.168.86.3 | 2026-08-01 | HA surfaces OK; firmware flash pending |
