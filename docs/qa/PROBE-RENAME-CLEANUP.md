# Probe rename cleanup checklist (dsc_pot → dsc_probe)

**Shipped:** ESPHome device `name: dsc_probeN`, friendly `DSC-Probe #N`, hub `packet_transport` providers, SPA/brain/HA entity ids.

**Secrets (unchanged keys):** `dsc_potN_api_key` / `_ota_password` / `_ap_password` — do **not** rename secret keys; only device/entity names.

**Kit (2026-08-29):** Live probes are **pot1 + pot2** only. pot3/pot4 retired from kit (planned OOS / not flashed). YAML + flash map still exist for bench recovery.

**After OTA soak (cleanup):**

1. [x] HA/brain helper orphans: migrated `compose_helpers_json` `dsc_pot*` → `dsc_probe*` (2026-08-29); `hass_extras` pot orphan count **0**
2. [x] Confirm no live code references `dsc_pot[1-4]` entity ids (archive OK) — rename pass `654d0f8`
3. [x] Inventory `extra.assigned_plant_id`: pot1=`pot1` (Amnesia Blue); pot2/3/4 vacant `""`
4. [x] Probe NVS: plant_name no longer restores "Unassigned"; strip legacy growth_stage/strain UI from operator path (roster SoT)
5. [ ] SoftAP docs labels Pot→Probe (IPs unchanged)
6. [x] Dual resolve `dsc_pot_N` underscore form: gone
7. [x] Calibrate vs Learning: **Calibrate** owns Soft/lab/peer offsets; Learning stays climate learning only
8. [ ] Re-run REL-P1-1/2/3 relationship audit

**OTA train order:** hub (providers) → pot2 canary → pot1 → control. Skip pot3/pot4 (out of kit).

**Compose note:** brain env must use `DSC_POTN_API_KEY` (uppercase) — lowercase `dsc_potN_API_KEY` silently emptied encrypt keys (`19b5c4b`).

Ops SoT: [`../ops/ESPHOME-OTA-PI.md`](../ops/ESPHOME-OTA-PI.md) (compose DNS pin + Control ESPHome 2025.12 + API-key casing) · [`../brain/PROBE-PLANT-MODEL.md`](../brain/PROBE-PLANT-MODEL.md) (kit + Expected chips) · [`../ops/SOFT-CAL.md`](../ops/SOFT-CAL.md) · [`../brain/CLIMATE-MODE-POLICY.md`](../brain/CLIMATE-MODE-POLICY.md).
