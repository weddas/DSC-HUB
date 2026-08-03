# LIVE-UI — AIRFLOW STATUS card

Smoke checklist for `custom:dsc-airflow-map-card` (Climate Engine).
Verified against `homeassistant/www/dsc-airflow-map-card.js` and the publish
bundle contract after `521ac11` (ha-sync / HACS dist) + Sync add-on **5.1.3**.

## Preconditions

- [ ] **One** JS resource registers both cards:
  - HACS `/hacsfiles/DSC-HUB/DSC-HUB.js` (Redownload after bundle changes), **or**
  - `/local/dsc-system-map-card.js` published as the **concat bundle**
    (Sync ≥ **5.1.3** or `ha-sync.sh`) — not the www system-map source alone
- [ ] Resource type is **JavaScript** (IIFE), not JavaScript Module
- [ ] Prefer one path — not HACS **and** `/local` duplicates
- [ ] Packages live: `dsc_v4_climate_physics` (CFM / ACH / volumes); optional
      `dsc_v4_device_cal` curves
- [ ] Dashboard YAML includes Climate Engine card (Sync / ha-sync). Gate on
      `sensor.dsc_ha_surface_version` if waiting on runner

Quick size check on HA: bundled `/config/www/dsc-system-map-card.js` is
~33 KB and contains both `dsc-system-map-card` and `dsc-airflow-map-card`
defines. A ~10 KB file is system-map source only → AIRFLOW will miss.

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
| Custom element doesn't exist | Bundle size / Sync ≥5.1.3 / HACS redownload / resource type JavaScript |
| SYSTEM MAP ok, AIRFLOW missing | `/local` still system-map-only — re-publish bundle |
| All idle, fans commanded | `sensor.dsc_cfm_*` + `input_number.dsc_cfm_*_max` |
| Missing after git push | Sync refreshes `/local`; HACS needs **Redownload** |

Durable runbook: [`homeassistant/README.md`](../../homeassistant/README.md)
(AIRFLOW STATUS). HACS: [`scripts/HACS-FRONTEND.md`](../../scripts/HACS-FRONTEND.md).
