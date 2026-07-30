# DSC-HUB v2.2 — "The Clone Tent Update" · Changelog & Manual Addendum

**Firmware:** `dsc-hub-v2_2.yaml` (2,800 lines) · **Base:** v2.1 (2,124 lines) · **Date:** July 2026

---

## What this update is

The 2×4 is promoted from a passive duct segment to a **second controlled environment and conditioned-air reservoir** for the 4×8. Topology: room → (4″ clone intake) → 2×4 → 4×8. The 2×4 runs the counter-cycle photoperiod, so at 4×8 lights-off it holds warm, humid air — a mini lung the 4×8 can draw from instead of cold room air. Efficiency is the design driver: heat and moisture are routed, not wasted.

## The four new behaviours (why they exist)

**1. Intake Router.** The negative-pressure budget is unchanged from v2.1 (total intake = 0.7 × mean exhaust × 2) but is now *placed* across the two intake paths instead of mirrored. The clone intake runs a source-gated mini-controller for the 2×4's own needs; the 4×8 *borrows* through the clone path (60% for heat when 2×4 air is warmer than tent and room; 50% for humidity when moister) — always bounded by **clone protection caps** (RH below floor → 20%, approaching floor → 40%, clones cold → 30%, sensor fault → 25%). Path changes are slew-limited to ±15%/10s tick so the router can't oscillate between donors.

**2. Heat Reuse.** When the tent must shed heat, the room can absorb it (room ≥1 °C cooler), and the system is heat-poor (heater/mat demand active, or room >2 °C below target), the shed goes to **RECIRC** instead of outside; the OUT fan drops to fresh-air floor + trickle. RH overflow always overrides — moisture must physically leave the building.

**3. Reality Gates.** "Fans get 5 minutes first" only makes sense if the source air can actually fix the condition. If it can't, appliance persistence shortens: dehumidifier 5 min → 60 s when room RH ≥ tent ceiling; AC 5 min → 60 s when room ≥ target+1 °C; humidifier 2 min → 60 s when no moist source exists; heater 5 min → 2 min when no warm source exists.

**4. Clone tent controls.** Clone Mode (Follow 4×8 / Clones & Seedlings / Mother / Custom — presets write the sliders once, Follow reads live main targets), Clone Photoperiod (Follow 4×8 / Independent with own on-time + hours, midnight-wrap safe), binary **Clone LED Demand** and **Clone Humidifier Demand** on the standard demand_follower contract, and a clone-dry escalation rung (RH < floor−2 for 2 min).

## Fault philosophy

Only the **tent** DHT22 can trip safe mode (unchanged). Room/clone sensors get a 3-minute **soft fault**: gates and heat-reuse revert to v2.1 behaviour; the router runs main-only with a 25% clone cap; clone humidifier demand clears (never guess wet); clone LED demand is untouched (schedule-driven, not climate-driven). A dead tent sensor does **not** blind the 2×4 — independence is resilience. The `Aux Sensor Fault` binary sensor surfaces soft faults in HA.

Emergency (>35 °C) additionally forces Clone LED + Clone Humidifier demands off — the purge path runs room → 2×4 → 4×8 → outside, and the clone LED heats that airstream. The clone schedule re-asserts within 15 s of clearing.

## Hardware — Appendix A additions

| GPIO | Function | Notes |
|------|----------|-------|
| GPIO4 | Room DHT22 (data) | 10 kΩ pull-up to 3V3. Mount at **tent intake height** — it must read the air the fans actually move. |
| GPIO13 | Clone DHT22 (data) | 10 kΩ pull-up to 3V3. Mount at **canopy height on a yoyo** in the 2×4. |

GPIO5 remains spare. GPIO12/0/2/15 remain forbidden (strapping). Data lines don't need the PWM clamp mod — that's gate-drive only.

## New entities (19)

Sensors: Room Temperature, Room Humidity, Clone Temperature, Clone Humidity, Clone VPD (kPa).
Switches: Clone Light Auto, **Clone LED Demand**, Clone Humidifier Auto, **Clone Humidifier Demand**.
Selects: Clone Mode, Clone Photoperiod.
Numbers: Clone Target Temp, Clone VPD Min, Clone VPD Max, Clone RH Min, Clone RH Max, Clone Light Hours.
Datetime: Clone Lights-On Time. Binary sensor: Aux Sensor Fault.

All clone targets persist across reboots (same semantics as the stage sliders). No v2.1 entities were renamed or removed — the migration map is additive only.

## OLED / UX

Carousel is now Home → Trends → Lights → Fans → **Clone** → WiFi (6 dots). The Clone page is read-only: T/RH/VPD vs the resolved band, clone-VPD sparkline, LED state with countdown, mode + live intake % + HUM! badge, and a sensor-offline state. Home badges add `C-HUM` / `C-LED`. The screensaver "Running:" line gained the router's voice ("drawing warm 2x4 air into the 4x8", "recycling tent heat into the room", "clone borrow capped"). System Info shows `+aux` on fault and `rev 2.2`. **Clone configuration is HA-only in v2.2** — no new dial submenu (deliberate; revisit in v2.3 if living with it demands otherwise).

## QA campaign (post-release hardening)

A 24.2M-check QA campaign (grid sweep, boundary tests, fuzzer, photoperiod sweep, 48h plant sims — see `DSC-HUB-v2_2-QA-REPORT.md`) found and fixed six issues in this build: a negative-pressure breach when clone flush exceeded the exhaust budget (now a hard clamp), an unconditional clone protection cap (cold beats damp), band-inversion guards (no humidifier/dehumidifier wars on fat-fingered sliders), 3-minute compressor anti-short-cycle for dehumidifier and AC, continuous protection caps (no boundary oscillation), and two-leg chain service (OUT lifts for clone flush when climate-safe; RECIRC lifts for borrows so borrowed heat loops through the room instead of venting outside). Final state: zero violations.

## Validation performed

- `esphome config` (ESPHome 2026.6.4): **exit 0**, no strapping warnings on GPIO4/13.
- Host-side C++ harness compiling the **exact shipped lambda bodies**: 12 scenario tests, **all passed** — heat borrow, RH-floor cap, heat reuse, overflow priority, both reality-gate paths, clone humidifier rung + clear, fault fallback, slew limit, midnight-wrap window, Follow mirroring (incl. Dry Mode), emergency freeze, negative-pressure invariant.
- The harness caught (and the release fixes) a scope bug: heat-reuse/router referenced `t_tgt` outside its braces; corrected to the fan-section local `target`.

## Flash & cutover checklist

1. **Wire GPIO4 + GPIO13 DHT22s (10 k pull-ups) before or shortly after flashing.** Boot stamps a heartbeat, so you get a 3-minute grace window — unwired sensors then raise a *soft* fault only (v2.1 behaviour continues; no safe mode).
2. Flash `dsc-hub-v2_2.yaml` OTA.
3. Append the two bindings in `dsc_hub_v2_2_demand_additions.yaml` to `dsc_hub_demand_automations.yaml`, replacing the two placeholder plug entity_ids; reload automations.
4. In HA set: Clone Mode, Clone Photoperiod (+ Clone Lights-On Time / Clone Light Hours if Independent), and enable Clone Light Auto / Clone Humidifier Auto.
5. Optional: add the new entities to the Lovelace sections view (a Clone 2×4 section mirrors the tent section pattern).
