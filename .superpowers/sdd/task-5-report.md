# Task 5 report — Pi hotpatch + evidence

**Date:** 2026-08-30  
**Pi:** 192.168.86.48 (dsc-hub-brain 7.3.0)

## Prep (desk)

- Rebuilt SPA: `npm run build:spa` ? `spa-dist/assets/index-nLu-U8CF.js` (SettingsPage unbound-params fix included).
- Staged brain modules: `zigbee_policies.py`, `zigbee_mqtt.py`.

## Hotpatch (live)

- Uploaded `/tmp/task5-spa.tgz`, `/tmp/task5-brain.tgz` via pscp.
- `docker cp` ? `dsc-hub-brain:/app/static/` and `/app/dsc_brain/{zigbee_policies,zigbee_mqtt}.py`.
- `timeout 25 docker restart dsc-hub-brain` (no bare kill).
- Verified: `GET /` serves `assets/index-nLu-U8CF.js`; `/health` ok.

**Note:** First run hung on `sudo -S` over plink while Pi briefly dropped SSH/ping (~5 min); recovered; rerun used docker-with-sudo fallback in `.audit/task5-pi-hotpatch-evidence.sh`.

## Evidence — `problem_when=inactive` (QA ieee `0xqa_task5_inactive`)

Policy: `seat_id=humidifier`, `problem_when=inactive`, role `leak_tank`, MQTT topic `zigbee2mqtt/qa_task5_inactive`.

| Inject | `qa_problem` | Banners |
|--------|----------------|---------|
| `occupancy: false` (dry) | `True` | critical banner present |
| `occupancy: true` (wet) | `False` | `[]` |

## Evidence — live tank `0xa4c138b9e2b9b690`

- Binding already `leak_tank` / Dehumidifier tank; **policy was missing** on disk ? restored with `.audit/zb-bind-tank-occ.sh` (`tank_full_appliance`, `seat_id=dehumidifier`, default `problem_when=active`).
- MQTT `occupancy: true` ? `live_problem True`, `problem_when active`, critical banner `Dehumidifier tank FULL - empty tank`.
- MQTT `occupancy: false` ? `live_problem False`, banners cleared.

## Recipes API (post-hotpatch)

`tank_full_appliance` exposes `param_schema` for `seat_id` (dehumidifier/humidifier), `problem_when` (active/inactive), `banner`; defaults include `problem_when: active`.

## Artifacts

- `.audit/task5-pi-hotpatch-evidence.sh` — hotpatch + QA inactive polarity loop
- `.audit/task5-live-smoke.sh` — live ieee wet/dry smoke

## FOLLOWUPS

Updated **Operator params + filtered selects (implement)** ? **done (live)** with evidence note.

## Not done / follow-up

- QA binding `0xqa_task5_inactive` left on Pi for soak; disable/remove if undesired.
- `capability_class` not surfaced on `/settings/zigbee/recipes` JSON (field absent); SPA filtering may use other keys — no blocker for policy params evidence.
