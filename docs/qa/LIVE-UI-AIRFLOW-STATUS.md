# LIVE-UI — AIRFLOW STATUS card

Smoke checklist for `custom:dsc-airflow-map-card` (Climate Engine).
Verified against `homeassistant/www/dsc-airflow-map-card.js` on master after
commit `796847d` (replaces `power-flow-card-plus` AIRFLOW FLOW MAP).

## Preconditions

- [ ] HACS **DSC-HUB System Map** redownloaded **or** `/local/dsc-airflow-map-card.js`
      (or bundled `/local/DSC-HUB.js`) registered as **JavaScript** resource
- [ ] Prefer **one** resource path — not HACS + `/local` duplicates
- [ ] Packages live: `dsc_v4_climate_physics` (CFM / ACH / volumes); optional
      `dsc_v4_device_cal` curves
- [ ] Dashboard YAML includes Climate Engine card (ha-sync / Sync add-on, or
      manual copy). Gate on `sensor.dsc_ha_surface_version` if waiting on runner

## Visual / topology

- [ ] Card title **AIRFLOW STATUS**; four nodes: Room, Outside, 2x4, 4x8
- [ ] Five duct edges only — no generic power-flow / energy Sankey chrome
- [ ] Room appliance chips present (Heater / AC / Hum / Dehum)
- [ ] Footer narrative reads `… → Room → … → 4x8 → Outside|Recirc|blend|stalled`

## Live data (when fans moving)

- [ ] Active edge chip shows **CFM · fan %** plus **source** zone T/RH
- [ ] Idle edges dim and say `… idle`
- [ ] OUT + RECIRC both flowing → narrative **blend** with Recirc/Out %
- [ ] RECIRC-only → **closed**; OUT-only → **open**; neither → **stalled**
- [ ] Tent nodes show `~kg` / ACH when Plant Spec volumes are set
- [ ] Mat ON → `MAT ON` on 2x4; SF1000 on → `LIGHT n%` on 4x8

## Negative checks

- [ ] Card does **not** require `power-flow-card-plus`
- [ ] Cascade (2x4→4x8) tracks clone intake CFM, not a separate sensor
- [ ] Unused Sankey helpers `dsc_airflow_direct_room` /
      `dsc_airflow_room_return` are not required for the map

## Failure triage

| Symptom | Check |
|---|---|
| Custom element doesn't exist | HACS redownload / resource URL + type JavaScript |
| All idle, fans commanded | `sensor.dsc_cfm_*` + `input_number.dsc_cfm_*_max` |
| Missing after git push | HACS ≠ Sync — redownload card; Sync for dashboard YAML |

Durable runbook: [`homeassistant/README.md`](../../homeassistant/README.md)
(AIRFLOW STATUS). HACS: [`scripts/HACS-FRONTEND.md`](../../scripts/HACS-FRONTEND.md).
