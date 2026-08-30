# Task 5 report — Pi hotpatch + desk flood evidence

**Date:** 2026-08-31  
**Status:** DONE  
**Pi:** 192.168.86.48 (power-cycled by operator after prior sudo hang)

## Deploy

- SPA: `index-Cj_Rsb-d.js` → `dsc-hub-brain:/app/static/`
- Brain: `zigbee_policies.py` + `zigbee_mqtt.py` → `/app/dsc_brain/`
- Restart: `timeout 25 docker restart dsc-hub-brain` (sudo -S)
- Health: `health_ok 7.3.0`
- Script: `.audit/task5-desk-flood-run.sh`

## Bind

| ieee | role | zone | recipe |
|------|------|------|--------|
| `0xa4c1385a686af7df` | `leak_floor_room` | `room` | `floor_flood_alert` |
| `0xa4c1380d734f2033` | `leak_floor_4x8` | `4x8` | `floor_flood_alert` |
| `0xa4c138b9e2b9b690` | `leak_tank` | `4x8` | `tank_full_appliance` (preserved) |

## MQTT evidence (occupancy)

1. **Baseline dry** — both flood policies `problem=False`; `banners=[]`
2. **WET room** — `zb-policy-0xa4c1385a686af7df` present; 4×8 banner absent; room `problem=True`
3. **DRY room** — banners cleared; room `problem=False`
4. **WET 4×8** — `zb-policy-0xa4c1380d734f2033` present; room banner absent; room `problem=False`
5. **DRY 4×8** — banners cleared

## Honesty / OOS

- Post-run inventory: `dehumidifier in_service=true`, `humidifier in_service=true` (flood did not OOS)
- Fleet `zigbee_by_role`: `leak_floor_room` zone=room wet=False; `leak_floor_4x8` zone=4x8 wet=False (independent rows, no clobber)

## Log

Remote log: `/tmp/task5-desk-flood.log` on Pi; EXIT:0
