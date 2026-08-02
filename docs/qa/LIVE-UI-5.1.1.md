# Live UI pass — DSC-HUB Pro v5.1.1 (4-col + Browser Mod popups)

Operator click-through for the dashboard v5.1.1 upgrade: 4-column layout,
Browser Mod popup layer, System command center, glass-replacement tunables.

**Prerequisites**

| Check | Result |
|---|---|
| Browser Mod | HACS Integration downloaded, HA restarted, integration added (Settings → Devices & Services) |
| HA surface | `sensor.dsc_ha_surface_version` = **5.1.1** |
| Fleet chip | `sensor.dsc_fleet_version_status` compares **major.minor** — mixed `5.1.x` patch levels stay `ok` |
| Dashboard sync | Header comment reads `DSC-HUB Pro v5.1.1` |

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
- [ ] AC / clone followers stay idle while `*_actuator_wired` flags are off

## Sign-off

| Operator | HA host | Date | Result |
|---|---|---|---|
| | | | |
