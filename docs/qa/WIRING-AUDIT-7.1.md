# Wiring audit — DSC-HUB 7.1

**Date:** 2026-08-27  
**Scope:** Physical + firmware wiring only. Demand OID → ESPHome/Sonoff channel → relay/GPIO → named appliance. Hub sensor buses, fan/light PWM, compose/inventory `appliance_link`.  
**Not this audit:** seats/IPs/firmware census ([DEVICE-AUDIT-7.1](DEVICE-AUDIT-7.1.md)), plant/pot/hub graph (RELATIONSHIP), z2m (ZIGBEE), SPA chrome ([DESIGN-AUDIT-7.1](DESIGN-AUDIT-7.1.md)).  
**Brain:** `http://192.168.86.48:8787/` (SSH `/health` confirmed). `.30` is not the Brain.  
**Method:** code + firmware pin maps + live **read-only** `GET /health`, `GET /fleet`, `GET /roster`, `GET /settings`. No relay toggle, no `POST /control/demand`, no OTA, no Apply network, pot3 left OOS. Acceptance #1 demand→relay is **cited**, not re-run.  
**Live snapshot:** 2026-08-27 ~06:36 AEST. `appliance_link` **true**. Heatmat demand **ON** / relay **ON**; heater, humidifier, dehumidifier **OFF/OFF**.

## Verdict

An operator can **trust the four Sonoff switch names as seat identity** (which BASIC R2 clicks). Acceptance #1 proved each seat’s `main_relay`. They **cannot** treat those names as a certified physical load, or treat AC / clone mister / 4×8 “light” / “window” as wired appliances. Inventory `extra.function` / `extra.placement` are empty. The heatmat is on **clone-air proxy**, not a voted root-zone pot.

| Count | Value |
|-------|-------|
| Wired actuator channels (GPIO lands a named load) | **9** (4× Sonoff GPIO12 + 4× hub fan PWM + SF1000 PWM) |
| Wired sensor buses | **7** (3× DHT22 + CO2 ADC + 3 in-service pot RS485; pot3 OOS) |
| Named demands with **no** GPIO / no Sonoff seat | **3** (AC, clone mister, GPIO5 4×8 lamp) |
| Unproven or mismatched this pass | **8** (see Top 8) |
| Compose appliance map | **None** — no `GET /compose`; roster `[]`; inventory extras `{}` |
| `system.appliance_link` | Hub-demand poll freshness (`hub_ok`), **not** per-outlet proof |

---

## 1. Actuation path (what actually moves a load)

```text
Hub climate ladder
    → template switch  (heater_demand / humidifier_demand /
                        dehumidifier_demand / growmat_demand)
    → ESPHome name-slug OID  (grow_mat_demand, not growmat_demand)
    → Pi appliance_driver  (~2 s Native API poll)
    → Sonoff seat main_relay  (GPIO12, ALWAYS_OFF)
    → IEC outlet  → named appliance (assumed; not recorded in inventory)

ESP-NOW tx_appliance_demand  = PARKED  (dsc-hub-espnow-parked.yaml)
HA demand_follower automations = optional; Pi path is SoT
```

`POST /control/demand` writes the **hub demand switch**. The driver follows it. `binary_sensor.dsc_pi_appliance_link` is true when that poll is fresh — DEVICE-AUDIT **DV-P1-5**.

---

## 2. Wiring table

### 2.1 Demand → Sonoff relay

| Hub OID (live slug / C++ id) | Entity | Device | Channel | Expected load | Last proof |
|------------------------------|--------|--------|---------|---------------|------------|
| `heater_demand` | `switch.dsc_hub_heater_demand` | `dsc-heater` @ 10.42.0.50 | Sonoff BASIC R2 **GPIO12** `main_relay` | 750 W fan heater (firmware comment) | **PASS** 2026-08-26 15:32:12Z ON → relay true; OFF by 15:33:08Z. [LIVE-ACCEPTANCE #1](LIVE-ACCEPTANCE-7.1.md) / [SOAK](../ops/SOAK-2026-08-26.md) |
| `humidifier_demand` | `switch.dsc_hub_humidifier_demand` | `dsc-humidifier` @ 10.42.0.54 | GPIO12 `main_relay` | Ultrasonic/humidifier at tent intakes (firmware: plume at intakes) | **PASS** 2026-08-26 15:40:27Z ON → relay true; OFF by 15:41:51Z |
| `dehumidifier_demand` | `switch.dsc_hub_dehumidifier_demand` | `dsc-de-humidifier` @ 10.42.0.55 | GPIO12 `main_relay` | Compressor dehumidifier (`api_grace_ms` 240 s) | **PASS** 2026-08-26 13:26Z HA-off soak |
| `grow_mat_demand` / id `growmat_demand` | `switch.dsc_hub_grow_mat_demand` | `dsc-heatmat` @ 10.42.0.51 | GPIO12 `main_relay` | Under-pot heat mat (2×4 root zone) | **PASS** 2026-08-26 16:57:42Z → relay 16:58:08Z (after alias fix). **Live now ON/ON** (air-proxy, see P1) |
| `growmat_demand` (legacy alias) | same entity | same seat | same GPIO12 | same | Alias must **not** be emitted as False. Fix live on Pi; **uncommitted** |
| `ac_demand` | `switch.dsc_hub_ac_demand` | **no inventory seat** | **no GPIO** | Portable AC @ 20 °C (firmware comment) | **UNWIRED** — F-001. Live `ac_in_service` off, demand off |
| `clone_humidifier_demand` / id `clone_hum_demand` | `switch.dsc_hub_clone_humidifier_demand` | **no inventory seat** | **no GPIO** | Dome / micro-mister | **UNWIRED** — F-002. Live in-service off, demand off |

Sonoff common: button **GPIO0**, status LED **GPIO13**. Restore `ALWAYS_OFF`. Brain maps only the four seats in `DEMAND_TO_SEAT`. `control_ops._SONOFF_RELAY_ENTITY_TO_SEAT` also lists `switch.dsc_ac_main_relay` → `ac` and `switch.dsc_clone_humidifier_main_relay` → `mister` — those seats do not exist in `DEFAULT_INVENTORY`. Kit Pulse still draws AC / Clone mister with `relayEntity` pointing at ghosts (`kitInventory.ts`).

`computed_ops.DEMAND_TO_RELAY` pairs heater / humidifier / grow-mat only — **dehumidifier omitted**, and the dict is unused.

### 2.2 Hub PWM — fans and light

| Firmware id / live slug | Entity | GPIO | Expected load | Last proof |
|-------------------------|--------|------|---------------|------------|
| `fan_exhaust_out` / `6_inch_exhaust__outside_` | `fan.dsc_hub_6_inch_exhaust_outside` | **GPIO16** LEDC 1 kHz | 6″ exhaust → outside (carbon 1) | **READ** live 15 %. Acceptance #2 read-only. Duct identity not re-probed |
| `fan_intake_main` / `4_inch_intake_fan__main_` | `fan.dsc_hub_4_inch_intake_fan_main` | **GPIO17** | 4″ intake 4×8 | **READ** live 15 % |
| `fan_intake_clone` / `4_inch_intake_fan__2x4_` | `fan.dsc_hub_4_inch_intake_fan_2x4` | **GPIO18** | 4″ intake 2×4 | **READ** live 15 % |
| `fan_exhaust_recirc` / `6_inch_exhaust__room_` | `fan.dsc_hub_6_inch_exhaust_room` | **GPIO19** | 6″ exhaust → room (carbon 2) | **READ** live 30 %. Firmware: **was 250 W light** — remap documented, physical re-land **not** proven this pass |
| `light_sf1000` / `sf1000_dimmer` | `light.dsc_hub_sf1000_dimmer` | **GPIO23** + 1 kΩ pull-down | Spider Farmer SF1000, **2×4 only** | **READ** state on, brightness 1 (visually dark). Acceptance #3 read-only |
| *(none)* / `entities.main_light` | — | **GPIO5 reserved empty** | Future 4×8 PWM lamp | **UNWIRED**. SPA treats 4×8 as “window”, not SF1000 — correct |

GPIO5 hard-off relay was **cancelled** (v2.4); pin is reserved for a 4×8 fixture that does not exist. `zero_means_zero` + pull-down is the dark-period story.

### 2.3 Hub sensor buses

| Firmware id | Entity / fleet key | GPIO | Expected sensor | Live |
|-------------|--------------------|------|-----------------|------|
| `temp_sensor` / `humidity_sensor` | tent T/RH / `temp_c` `rh_pct` | **GPIO27** DHT22 | 4×8 canopy | 22.6 °C / 62.3 % — bus alive |
| `room_temp` / `room_rh` | room T/RH | **GPIO4** DHT22 | Intake-height room air | 23.8 °C / 60.6 % — bus alive |
| `clone_temp` / `clone_rh` | clone T/RH | **GPIO13** DHT22 | 2×4 canopy (yoyo) | 23.7 °C / 63.5 % — bus alive |
| `co2_voltage` | `co2_sensor_voltage` / `dynamic_co2_ppm` | **GPIO34** ADC | Analog estimate, **not** SCD41 | 0.14 V → ~173 ppm (uncalibrated). F-008 |
| I2C | — | GPIO21/22 **freed** | SH1106 / SCD41 never landed | Empty |

VPD rows are computed, not extra wires. Window binaries are **schedule flags**, not sash GPIOs:

| Binary | GPIO | Live | Honesty |
|--------|------|------|---------|
| `4x8_window_open` | none | **true** | Grow stage **Off** should close this (`apply_stage`). DEVICE-AUDIT **DV-P1-6** |
| `2x4_window_open` | none | **true** | Clone Custom 18 h Independent — matches clock, not a contact |

### 2.4 Pot probe buses (not appliance demand)

| Seat | Board pins | Bus | Expected | Live |
|------|------------|-----|----------|------|
| pot1–4 | UART TX **GPIO17**, RX **GPIO16**, DE/RE **GPIO4**, 4800 8N1, slave 1 | JXCT-style RS485 | Soil moisture / T / EC / pH | pot1 21.8 % / 18.4 °C / pH 6.3; pot2 19.4 % / 18.5 °C / pH 7.2; pot4 **null**; pot3 OOS (F-003) |

EC live-null on pot1/2 is DEVICE/RELATIONSHIP, not a missing GPIO.

### 2.5 Coordination switches (no extra copper)

| OID / entity | Firmware default | Live | Meaning |
|--------------|------------------|------|---------|
| `humidifier_intake_routing` | **ON** (“matches confirmed physical placement”) | **OFF** | Routing will **not** starve the wet tent’s intake. Either the humidifier moved and extras were never written, or the toggle drifted |
| `recirc_de_strat_pulse` | ON | **OFF** | RECIRC burst logic armed-off. Control proxy OID `recirc_de-strat_pulse` (hyphen) may not match live slug |
| `mat_vote_pot_1`…`4` | 1/2/4 ON, 3 OFF | **all OFF** | Closed-loop pot vote empty → air-proxy mat |
| `pot1`…`4_in_service` (hub) | — | **all OFF** | Inventory pot1/2/4 **in_service true**. Dual SoT — DEVICE **DV-P1-1**; wiring effect below |

---

## 3. Live vs expected (read-only)

| Check | Expected | Live 2026-08-27 | Result |
|-------|----------|-----------------|--------|
| Brain health | 7.1.0 @ .48 | SSH + HTTP `7.1.0` / expected FW `7.0.0.0` | PASS |
| `.30` | not Brain | `:8787` refused | PASS (do not use) |
| `appliance_link` | hub poll fresh | true | PASS as freshness; not load proof |
| Four Sonoffs online | 7.0.0.0 | all online, `relay_on` matches demand | PASS |
| Demand↔relay | 1:1 | heatmat on/on; others off/off | MATCH (state), not a new slam |
| AC / mister | OOS, no relay | in-service off, no seats | Honest OOS; UI still has relay entity ids |
| Compose / roster | plant→appliance if any | roster `[]` | No compose wiring |
| Inventory extras | function / placement / `capability_max_pct` | `{}` on every seat | **No appliance map** |
| HA ESPHome stubs | Pi AP 10.42.0.x | `homeassistant/esphome/*.yaml` still `192.168.86.50/.51/.54/.184/.180` | Stale land-IP if anyone OTAs from HA |

There is **no** `GET /control` or `GET /compose`. Control truth is `hub.values.controls` on `/fleet`. Compose is roster + helpers; both empty of appliance links.

---

## 4. Alias, remap, undocumented

**`growmat_demand` chatter (fixed live, uncommitted).** Firmware C++ id stays `growmat_demand`. ESPHome 2026+ publishes name-slug `grow_mat_demand`. `DEMAND_TO_SEAT` keeps both. Pre-fix, the undiscovered alias defaulted False and overwrote ON every ~2 s — heatmat physically chattered ~10 s (16:52–16:55Z 2026-08-26). `_demands_from_discovered` is on the Pi; workspace matches; **not git-committed**. Clean-checkout deploy regresses.

**GPIO19 remap.** Comment: “was 250W light → now 6″ exhaust → ROOM”. Names match current YAML. If the physical wire was not moved with the firmware, **Room exhaust** drives the old light circuit. Not proven this pass.

**Humidifier at intakes.** Firmware says ON matches placement. Live routing **OFF**. No `extra.placement`.

**Heatmat name vs why it is on.** Votes all off + hub pot in-service all off → `rz_ok` false → clone-air rung. Clone air 23.7 °C < target 25 °C → demand ON. Pots are 18.4 / 18.5 °C (colder than mat band 20–22) but **are not in the vote**. The switch still says root-zone warmth.

**Parked ESP-NOW.** Hub `on_turn_on` still calls `tx_appliance_demand`; parked package logs only. AC / clone-hum demands do not even call it. Pi poll is the only live follower.

---

## 5. Findings

### P0

| ID | Item | Notes |
|----|------|-------|
| WR-P0-1 | Uncommitted `growmat_demand` alias fix | Already in FOLLOWUPS 2026-08-27 appliance-driver note. Signoff commit must include `appliance_driver.py` + `test_appliance_undiscovered_aliases_not_emitted` or a clean deploy chatters the heatmat again. **Not re-slammed.** |

No new live-safety P0 (no swapped channel proven; four proven seats match demand).

### P1

| ID | Item | Notes |
|----|------|-------|
| WR-P1-1 | Mat closed-loop disconnected from in-service pots | Hub pot in-service + all mat votes OFF while inventory pot1/2/4 in service. Heatmat ON via **air proxy**. Name “Grow Mat / root-zone” is false for this tick. Consequence of **DV-P1-1**. |
| WR-P1-2 | Intake-routing toggle ≠ documented placement | Default ON = humidifier at intakes. Live OFF. Inventory has no placement. Ladder will not steer the plume. |
| WR-P1-3 | Phantom AC / mister relay entities | `control_ops` + Kit Pulse `relayEntity` name loads that have no GPIO and no inventory seat. Demand switches are honest-off; a service call to `switch.dsc_ac_main_relay` 503s. |
| WR-P1-4 | GPIO5 4×8 lamp still empty | Keep-open hardware. 4×8 Got-light is a **window flag**, and that flag is true while Grow Stage is Off (**DV-P1-6**). Do not bind `entities.main_light`. |
| F-001 / F-002 | AC + clone mister unwired | Keep-open. Do not invent followers. |

### P2

| ID | Item | Notes |
|----|------|-------|
| WR-P2-1 | `DEMAND_TO_RELAY` misses dehumidifier and is unused | Incomplete dead map in `computed_ops.py` |
| WR-P2-2 | GPIO19 historical light→RECIRC | Documented remap; physical re-land unverified |
| WR-P2-3 | HA ESPHome stubs on `192.168.86.x` | Firmware/v4 stubs are 10.42.0.x. HA copies would OTA the wrong subnet |
| WR-P2-4 | CO2 GPIO34 analog | F-008 SCD41 not installed; ppm is theatre |
| WR-P2-5 | De-strat hyphen OID | Control map `recirc_de-strat_pulse` vs likely underscore slug |
| WR-P2-6 | Fan/light PWM | Commanded live; duct/fixture identity not field-probed this pass |

---

## 6. Can you trust the name on the switch?

**Four Sonoffs: yes for “which box clicks.”** Heater, humidifier, dehumidifier, heatmat — demand OID → that seat’s GPIO12 — proven 2026-08-26, matching live now.

**No for “what is plugged in.”** No function/placement extras. No compose appliance map. Heatmat’s *reason* is air, not a voted pot.

**No for AC, clone mister, 4×8 light, 4×8 window.** Template switches / schedule binaries. Kit Pulse “Not installed” is the honest AC/mister line; the relay entity ids are not.

**Fans / SF1000: firmware-named, live PWM, physical ducts unproven.** SPA correctly labels SF1000 as 2×4 and 4×8 as window. GPIO19 remap is the only documented historical swap.

---

## 7. Sources

| Source | Role |
|--------|------|
| `brain/dsc_brain/appliance_driver.py` | `DEMAND_TO_SEAT`, `main_relay`, alias fix |
| `brain/dsc_brain/hub_controls.py` | OID ↔ entity maps (slug + legacy) |
| `brain/dsc_brain/control_ops.py` | Control proxy + phantom AC/mister relays |
| `brain/dsc_brain/fleet_state.py` / `esphome_client.py` | `appliance_link`, synthetic relay entities |
| `brain/dsc_brain/settings.py` | Inventory hosts; no GPIO map |
| `services/dsc-hub/docker-compose.yml` | API-key env only — not a pinout |
| `firmware/v4/dsc-hub-v4_0.yaml` | PWM / DHT / ADC / demand ids |
| `firmware/v4/dsc-sonoff-common.yaml` + stubs | GPIO12 relay |
| `firmware/v4/DSC-Probe-common.yaml` | RS485 pinout |
| `firmware/v4/dsc-hub-espnow-parked.yaml` | `tx_appliance_demand` no-op |
| `homeassistant/custom_components/dsc_hub/frontend/src/lib/kitInventory.ts` | UI demand/relay pairing |
| [LIVE-ACCEPTANCE-7.1](LIVE-ACCEPTANCE-7.1.md) §1 | Demand→relay proof (do not re-slam) |
| [SOAK-2026-08-26](../ops/SOAK-2026-08-26.md) | Heatmat chatter + timestamps |
| Live `GET /fleet` | Controls, relays, sensors |

**Not edited:** DEVICE / RELATIONSHIP / ZIGBEE / DESIGN audit files.
