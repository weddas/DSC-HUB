# Probe rename cleanup checklist (dsc_pot → dsc_probe)

**Shipped:** ESPHome device `name: dsc_probeN`, friendly `DSC-Probe #N`, hub `packet_transport` providers, SPA/brain/HA entity ids.

**Secrets (unchanged keys):** `dsc_potN_api_key` / `_ota_password` / `_ap_password` — do **not** rename secret keys; only device/entity names.

**After OTA soak (cleanup):**

1. [ ] HA Entity Registry: delete orphan `sensor.dsc_potN_*` if still present after rediscovery
2. [ ] Confirm no live code references `dsc_pot[1-4]` entity ids (archive OK)
3. [ ] Inventory `extra.assigned_plant_id` populated; vacant = empty string
4. [ ] Probe NVS: plant_name no longer restores "Unassigned"; strip legacy growth_stage/strain UI from operator path (roster SoT)
5. [ ] SoftAP docs labels Pot→Probe (IPs unchanged)
6. [ ] Dual resolve `dsc_pot_N` underscore form: gone
7. [ ] Calibrate vs Learning: **Calibrate** owns Soft/lab/peer offsets; Learning stays climate learning only (don't duplicate fan/light commit)
8. [ ] Re-run REL-P1-1/2/3 relationship audit

**OTA train order:** hub (providers) → pot2 canary → pot1,3,4 → control (if not already on Climate Mode v2).
