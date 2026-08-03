# Live UI pass — DSC-HUB Pro v5.1.x (4-col + Browser Mod popups)

Operator click-through for the dashboard 4-column layout, Browser Mod popup
layer, System command center, glass-replacement tunables, and (5.1.3)
in-service / learn Activity surfaces.

**Prerequisites**

| Check | Result |
|---|---|
| Browser Mod | HACS Integration downloaded, HA restarted, integration added (Settings → Devices & Services) |
| HA surface | `sensor.dsc_ha_surface_version` = **5.1.3** (was 5.1.1 at first 4-col ship) |
| Fleet chip | `sensor.dsc_fleet_version_status` compares **major.minor** — mixed `5.1.x` patch levels stay `ok` |
| Dashboard sync | Pro dashboard live; header may still say `v5.1.2` while `sensor.dsc_ha_surface_version` is **5.1.3** |

## Layout (all 10 views)

- [ ] Every view renders 4 columns wide on desktop/tablet (incl. Trends)
- [ ] Full-width strips (Pulse, headings) span all 4 columns
- [ ] Root Zone pot matrix is a true 4-across (one column per pot)
- [ ] Trends: chart stacks side by side (2+2), no scroll tunnel

## Popup layer (Browser Mod)

- [ ] Home: tent temp / RH / VPD gauges → 24 h chart popup
- [ ] Home: clone temp / RH / VPD gauges → 24 h chart popup
- [ ] Home: room temp / RH + coldest-root gauges → 24 h chart popup
- [ ] Home: pot moisture gauges → plant console popup (entities + 48 h chart)
- [ ] Climate: appliance tiles (heater / AC / hum / dehum / mat / clone mister) → console popup with switches, tunables, 24 h chart
- [ ] Climate: Rung 1 Fans tile → fan bank popup (4 fans + 48 h chart)
- [ ] 4x8: VPD + CO2 mini-graphs → 48 h chart popup; enlarge chips work
- [ ] 2x4: SF1000 brightness graph → ramp popup; clone VPD → 48 h popup
- [ ] Root Zone: pot gauges → pot console; moisture graph → 7 d popup
- [ ] Tank: EC gauge + EC/pH graph → 7 d tank popup
- [ ] System: RSSI graph → fleet RSSI popup; panel heap graph → heap popup
- [ ] Popups close cleanly; no view navigation happens underneath

## System command center

- [ ] LINK & HEARTBEAT: HA link, WiFi associated, heartbeat + stale age, HA handshake, Panel Link, pot ESP-NOW links
- [ ] WiFi AP PINNING: lock switch, current vs preferred BSSID, Remember / Clear buttons work
- [ ] PANEL HEALTH: panel firmware, free heap + largest free block, ambient light raw, backlight control
- [ ] FLEET VERSIONS: table shows firmware + ESPHome versions, drift chip state correct

## Glass replacement (panel lean-cut coverage)

- [ ] Grow Profile: stage / strategy / clone mode / clone photoperiod / priority tent editable
- [ ] 4x8 + clone climate setpoints editable
- [ ] Lighting drill: SF1000 target / ramp floor, sunrise / sunset, lights-on times, clone hours
- [ ] Mat settings + 4 vote switches (Root Zone)
- [ ] Cycle Timers: min-offs, hysteresis, 5 ladder waits
- [ ] De-Strat tunables: period / length / level + routing / pulse toggles
- [ ] Probe calibration: 14 offset/scale numbers per pot under Root Zone expanders

## Dead taps / conditionals

- [ ] No card opens an "Unknown entity" dialog anywhere
- [ ] Site-specific cards (water tester, Zigbee room light, door lock, sync SHA) hidden when entities absent
- [ ] Every nav chip lands on a `/dsc-hub-pro/…` view (never the HA homepage)

## Automations

- [ ] `dsc_climate_learn_ema_sample` runs without template errors (intake ref fixed to `dsc_fan_intake_main_pct`)
- [ ] AC / clone followers stay idle while `input_boolean.dsc_*_in_service` flags are off (replaces former `*_actuator_wired`)
- [ ] Toggling In Service pushes to hub switches via `dsc_sync_in_service_to_hub` when hub link is up

## In-service + learn (5.1.3)

- [ ] Home shows reduced-kit cue when any lever is OOS (`binary_sensor.dsc_reduced_kit`) — soft capacity, not alert chip
- [ ] Climate / System In-service toggles: AC, clone mister, POT1–4; defaults AC/mister/POT3 off
- [ ] `sensor.dsc_active_alert_count` does **not** rise solely because capacity_offline is on
- [ ] Learning card uses `sensor.dsc_learn_activity` (gate open alone is not “measuring”)
- [ ] Full Auto with AC OOS still runs fans; emergency ≥35 °C does not assert AC demand

## Sign-off

| Operator | HA host | Date | Result |
|---|---|---|---|
| | | | |
