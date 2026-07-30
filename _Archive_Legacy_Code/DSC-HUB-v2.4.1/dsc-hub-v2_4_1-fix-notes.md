# DSC-HUB v2.4.1-alpha — Urgent Control Fixes (19 Jul 2026 incident)

**File:** `dsc-hub-v2_4_1.yaml` (drop-in replacement for the v2.4 hub config; same includes, same secrets, no HA entity renames, no dashboard changes required)

## What the 19 Jul log showed, and why the firmware did nothing

| Time | Event | Root cause in v2.4 |
|---|---|---|
| 5:28pm | 2x4 VPD 0.94 / 4x8 VPD 0.99 over ceiling, RH 63% — **no humidifier** | Both humidifier rungs fired on the **RH floor only**. VPD (the variable the strategy chases) was never an input to the ladder. Whenever RH sat above `floor − 2%` the rung stayed silent no matter how far VPD overshot. |
| 5:56pm | **AC ON** for the 2x4 — exchange fans never ramped | "Appliances only after fans failed" was **assumed, never enforced**. The fan curve chases the 4x8 sensor; the ladder arbitrates to the 2x4. When the clone tent ran hot, the AC's timer simply elapsed and fired — no fan attempt required, and no fan attempt made. |
| 6:07pm | **POT4 root zone out of range** — no heat mat response | The closed-loop mat sensed **POT1 only** (`rootzone_temp_entity`). A cold POT4 was invisible. The v2.4 changelog parked the `min()` across pots because POT3's faulted probe reads a flat 0.0 °C and would have pegged the mat on forever. |

## The fixes

### 1. Fans-first is now enforced for the AC
- The AC rung requires the arbitrated tent's fan lever to be **demonstrably saturated** before it may fire:
  - 4x8 → OUT exhaust already ≥ 80%
  - 2x4 → the intake router reports the exchange path saturated (`clone_fan_saturated`: cooling flush requested AND the protection-cap / negative-pressure-budget ceiling reached)
- …OR fans are **physically useless** (room air ≥ target + 1 °C — venting can't cool below source temperature; same physics as the existing reality gate), OR the room sensor is blind, OR the fan curve isn't running (manual/standby).
- The 2x4 gets a **graded cooling escalation**: exchange 50% at +1 °C over target, 75% at +2 °C, 100% at +3 °C (when room air is cooler). Overheat outranks the dry-hold.
- The chain-service OUT lift now permits **emergency cooling of the 2x4** (air > target + 2 °C or root-zone runaway) even when the 4x8 is under target — lift ceiling 60% instead of 45%. Heater/mat/hot-room guards unchanged.
- The clone protection cap's RH leg relaxes to a 50% floor during 2x4 emergency cooling (moisture protection must not block cooling of the tent it protects). The cold leg never relaxes.

### 2. VPD-aware humidifier rungs (room + clone)
- Under the VPD strategy, "too dry" is now **either** `RH < floor − 2` **or** arbitrated `VPD > ceiling + 0.05`.
- Release requires **both** healthy (RH above floor + hysteresis AND VPD at/under ceiling) — no chatter between two half-recovered signals.
- The clone rung uses the clone VPD sensor and the clone ceiling (Follow-4x8 resolves to the live main band, same as the router).
- Reality gates, min-off times and the v2.4 anti-short-cycle hysteresis all unchanged.

### 3. Multi-probe root zone + runaway flush
- All four pot probes are mirrored (`rootzone_temp_entity` … `_4`, substitutions at the top of the file).
- **Plausibility filter (5–45 °C)**: POT3's faulted 0.0 °C probe is simply ignored — the exact blocker that parked `min()` in v2.4 is gone. A faulted probe can neither peg the mat on nor blind the loop.
- Mat heats on the **coldest** valid pot (< Mat Root-Zone Low for 1 min → mat ON), cuts when the coldest pot reaches Mat Root-Zone High.
- **Runaway** (hottest valid pot ≥ High + 1 °C): mat cut immediately and the router **flushes the 2x4 with cooler room air** — fans handle runaway heat; the mat only ever adds it. Runaway wins over a simultaneous cold pot (heat kills faster).
- Root-zone soft fault now means "no pot delivered a plausible reading in 5 min" — one healthy probe keeps the closed loop alive. Fallback chain unchanged: probes → clone-air rung → mat OFF.

### 4. HA-drop resilience + sensor efficiency
- **`api.reboot_timeout: 0s`** — the default is 15 min, meaning every longer HA outage **rebooted the hub mid-grow** (fans bounce through safe-boot, resume prompt arms, ladder timers reset). Very likely the "HA occasionally drops connection" symptom's worst consequence. The hub is local-first by design; it never self-reboots on HA loss now.
- **`wifi.power_save_mode: none`** — ESP32 modem power-save (default LIGHT) naps between beacons; the classic cause of dropped/half-dead HA API sockets. Mains-powered device, no reason to nap.
- Publish-rate cleanup (~80% less steady-state API traffic + HA recorder churn):
  - WiFi RSSI 15s → 60s + 3 dB delta filter
  - Uptime 60s → 300s
  - 10× ladder telemetry sensors: keep 10s responsiveness but add `delta: 0.5` — the idle zeros stop re-publishing every tick; live countdowns still update every 10s
  - Runtime-tunable numbers (min-offs, mat band, hysteresis, sunrise/sunset): poll 10s → 60s (`set_action` remains instant; SF1000 Target keeps 10s because the OLED dial writes it live)
- DHT22s stay at 30s (sensor-appropriate), climate loop stays at 10s, failsafe/watchdog unchanged.

## Verification done
- `esphome config` validates clean (ESPHome 2026.6.5).
- Full `esphome compile` of the C++ lambdas.
- Cross-checks: every `id()` reference defined, substitutions resolved, brace balance, new-logic markers present.

## Flash checklist
1. Same `secrets.yaml` as v2.4 — no new secrets.
2. Confirm the four pot soil-temp entity ids at the top of the file match HA (`sensor.dsc_potN_soil_temperature`).
3. After flash: watch the first ladder events in the log — new tags read e.g. `RH 63% (floor 70%) VPD 0.94 (ceil 0.80) ... -> HUMIDIFIER` and `Root zone (coldest pot) ...`.
4. Optional retune: `Mat Root-Zone Low/High` band still 20/24 °C defaults; runaway trips at High + 1 °C.

## Round 2 — full-system audit (19 Jul, evening)

**Base verified against your uploads.** Diffed the canonical `dschubv2_4.yaml` you uploaded against this build: every hunk is an intended v2.4.1 change — the patch base exactly matches the deployed v2.4.

**New bug found & fixed — Manual Light Hold latch was dead.** v2.4's clone photoperiod stamped a blanket 15.5 s light-write-guard on *every* 15 s tick, so the guard was permanently live whenever the schedule was armed. Consequence: an external SF1000 change (HA slider or dial) could **never** latch Manual Light Hold, and the ramp silently overwrote it on the next tick — the v2.2 "lights fight me from HA" bug reintroduced. The guard is now stamped per-write (2 s, immediately before each light call): device writes still never self-latch, and the ~13 s gap between ticks is where your touch gets heard.

**Photoperiod engine now under test.** Extended the QA rig with a Suite 8 that runs the extracted `run_photoperiod` + `run_clone_photoperiod` bodies: window-truth sweep across on-times × durations (incl. midnight wrap and 24 h), ramp monotonicity and target-reach, sunrise/sunset overlap scaling, manual-hold hand-off + self-heal at the off edge, Follow-4×8 mirroring, disarm/takeover/emergency hands-off, and dead-clock hold. Total across all suites: **24.29 M checks, 0 violations**.

**More performance:** `logger: level: INFO` — the default DEBUG level logs every sensor update to UART and to any API log subscriber; the ladder/watchdog/failsafe all speak at INFO/WARN so nothing operational is lost.

**ESP-NOW prepped with your real MACs.** The parked hub block now carries the full device inventory (HUB 84:1F:E8:16:E6:60 · POT1 8C:4F:00:27:E0:10 · POT2 F0:24:F9:59:C3:14 · POT3 A0:A3:B3:90:DA:B0 · POT4 EC:E3:34:7B:E7:A8) plus a ready pot-side snippet (peers at the hub MAC; ships `soil_temperature`/`soil_moisture`). It stays commented because of real prerequisites: generate `espnow_key` into secrets on all five nodes, lock the router's AP channel, roll out the pot package with the provider block — and one hard one: **the espnow component needs ESP-IDF; the pots already run esp-idf but the hub builds on arduino.** Switching the hub's framework is its own bench-tested migration (display, DHT, LEDC ramp floor, OTA) — don't flip it casually on the live controller. When it does go live, the remote sensors reuse the same `rootzone_temp*` ids, so the closed-loop mat logic needs zero changes.

**Sonoff/appliance layer audited — sound.** `restore_mode: ALWAYS_OFF`, per-node API-loss failsafe, bounded test mode all correct, and the Rev B follower automations cover every outage permutation I traced (demand edge, HA restart resync, node-reconnect-from-unavailable). No changes needed there.

## Round 3 — ESP-NOW is LIVE (both halves implemented)

Checked the actual component schemas in ESPHome 2026.6.5 first: the `espnow` component is **ESP32-only, any framework** — the earlier "hub needs ESP-IDF" caveat was wrong, the hub's arduino build runs it as-is. No framework migration needed.

**Hub (`dsc-hub-v2_4_1.yaml`):** `espnow` peers = all four pot MACs; `packet_transport` consumer with providers `dsc-pot1..4` (xxtea-authenticated via `espnow_key`); four internal remote sensors (`remote_id: soil_temperature`); per-pot freshness stamps; and four `POTn ESP-NOW Link` binary sensors (connectivity/diagnostic — deliberately excluded from the alert auto-include). The closed-loop mat now runs a **per-pot source-select**: ESP-NOW reading if fresh (<150 s = 2.5 missed sends) → HA mirror otherwise → clone-air rung → mat OFF. Same 5–45 °C plausibility filter on every path, so a faulted probe is ignored no matter which link carried it. An HA restart no longer touches the mat's sense loop at all.

**Pots (`dsc-pot-common.yaml` v2.4.1):** provider block live — unicasts `soil_temperature` + `soil_moisture` to the hub MAC (84:1F:E8:16:E6:60) every 60 s (matched to the probe poll), encrypted with `espnow_key`. Provider names come from the stub `name:` fields and already match the hub's list.

**Rollout order:**
1. Generate one random `espnow_key` and add it to `secrets.yaml` on the hub **and** all four pots (same key everywhere).
2. Lock the AP channel on the router (ESP-NOW rides the WiFi channel; a channel hop splits the link — with the fallback chain that only degrades to the HA path, but lock it anyway).
3. Flash the **hub first** — it only listens, and hearing nothing is the designed fallback; nothing changes until pots arrive.
4. Flash **POT2 as canary** (per install instructions — not POT1 which drives the mat, not POT3 which is faulted), check `binary_sensor.dsc_hub_pot2_esp_now_link` goes ON, then roll the rest.

**QA:** rig extended with Suite 9 (source-select): fresh ESP-NOW overrides a disagreeing HA mirror, stale ESP-NOW falls back to HA, runaway detected via the direct link cuts the mat + flushes, implausible direct-link values filtered. Both configs pass `esphome config` (hub arduino + pot esp-idf). Grand total: **24.29 M checks, 0 violations.**

## Known HA-side items (not firmware — flag for the next automations pass)
- The 19 Jul alerts printed "**below its 0% floor**" and "**exceeded its unavailable kPa ceiling**" — the alert templates are reading clone threshold entities that are returning `unavailable` in HA (template defaults to 0/`unavailable` in the message). The firmware reads its own globals so control was unaffected, but the alert automations should be pointed at the current `number.dsc_hub_clone_*` entities and given `| float(default)` guards.
