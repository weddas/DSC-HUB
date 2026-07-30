# DSC-HUB v2.3 — "Zone Control + Manual Takeover" · Changelog & Manual Addendum

**Firmware:** `dsc-hub-v2_3.yaml` · **Base:** v2.2 (2,872 lines) · **Date:** July 2026
**Validation:** `esphome config` (ESPHome 2026.6.5) exit 0 · QA rig **24,620,982 checks · 0 violations**

---

## What this update is

Two tents, one room of shared gear, and not enough gear to run both flat out. v2.3 lets you **turn a tent off**, **nominate which tent the shared room appliances serve**, and **grab full manual control from Home Assistant** without the auto logic fighting you. It also fixes a latent mis-wire (the grow mat was heating off the wrong sensor) and makes heating stop throwing money out the wall.

## The five changes (why they exist)

**1. Per-tent OFF.** `Grow Stage → Off` (4x8) and `Clone Mode → Off` (2x4) take a tent out of service. An Off tent: light darks, photoperiod suspends, intake drops to an 8% anti-stagnation trickle, and it is **excluded from room-appliance arbitration and from any borrow/donor role**. Your stage/clone target sliders are preserved untouched, so returning to a stage restores your tuning. This is the "energy goes to the tent that's on" win — the room stops conditioning air for an empty tent.

**2. Priority Tent.** A new `Priority Tent` select (`4x8 Main` / `2x4 Clone`) decides who commands the shared room appliances (heater / AC / humidifier / dehumidifier) **when both tents are running**. The room is conditioned to hit the *priority* tent's own target, read on its own sensor. The non-priority tent is **best-effort on its local levers only**: its own intake/flush, the 2x4's grow mat and clone humidifier, and the v2.2 borrow/heat-reuse routing. When only one tent is active it is priority by definition and the select is ignored. *Physical honesty: one room, one setpoint at a time — you can prioritise, you cannot give two active tents opposite climates at once.*

**3. Grow mat relocated to the 2x4 (bug fix).** In v2.2 `growmat_demand` triggered off the **4x8** sensor/target — but the mat is physically under the clone pots. It is now a **2x4-local lever**: it tracks the *clone* tent's temp/target and runs regardless of priority, whenever the clone tent is active and its sensor is live. This is what lets a cold *secondary* clone tent warm itself without needing to win the shared room heater. (A dead clone sensor now means no mat rung, correctly — see "Baseline shift" below.)

**4. Heater no-extraction interlock.** Whenever `heater_demand` is live, the OUT fan drops to the fresh-air floor (15%) and the air routes RECIRC — we never blow bought heat out the wall. Moisture overflow still overrides (RH that high *must* leave the building), and the >35 °C emergency purge sits upstream of the whole fan block, so safety is never trapped behind a closed damper.

**5. Manual Takeover (master override) + the "lights fight me from HA" fix.** A new `Manual Takeover` switch hands **every output** to Home Assistant: it suspends the fan curve, the ladder, and both photoperiods; only Emergency (>35 °C) and the sensor watchdog still override. Separately, `Manual Light Hold` now latches on **any external SF1000 change — HA slider or the OLED dial** (v2.2 only latched the dial, which is why driving the light from HA felt like wrestling the ramp). A re-entrancy guard (`light_write_guard_until`) means the device's own ramp/adjust/failsafe writes never self-latch.

## Precedence order (highest wins)

```
Emergency failsafe (>35C purge)
  > Sensor-fault safe mode
    > Manual Takeover
      > Manual (fans) / Light Hold
        > Priority-tent arbitration
          > Auto Photoperiod / Full Auto curve
```

## New entities (3)

- Switch: **Manual Takeover** (`manual_takeover_switch`)
- Select: **Priority Tent** (`4x8 Main` / `2x4 Clone`)
- Select options: **Off** added to `Grow Stage` and to `Clone Mode`

No v2.2 entities were renamed or removed — additive migration only. No new HA `demand_follower` automations are required (Priority Tent and the Off states are internal; the grow-mat follower is unchanged). Add the two new controls to your Lovelace dashboard.

## New globals

`main_active`, `clone_active` (persist), `priority_tent_main` (persist), `ha_takeover_active` (persist), `light_write_guard_until` (runtime). All safe-default to "both tents active, 4x8 priority, no takeover."

## Fault behaviour (unchanged philosophy, extended)

- Only the **tent** DHT22 trips safe mode. Room/clone sensors remain 3-minute soft faults.
- Arbitration never runs on a blind sensor: if the 2x4 is priority but its sensor soft-faults, arbitration falls back to the 4x8.
- The grow mat requires a live clone sensor (never guess root-zone heat).
- Master Takeover does **not** disable the watchdog or the >35 °C purge — safety layers are above it in the chain.

## Baseline shift you should know about (honest note)

The 48h winter sim now shows the **v2.1-fallback** heater hours rising (≈3 h → ≈8 h) versus the v2.2 report. That is *not* a regression — it is the grow-mat fix surfacing. In v2.2 the mat ran off the always-present 4x8 sensor and silently pre-heated the 4x8 (a rung that tent doesn't physically have). With the mat correctly bound to the clone tent, a dead-aux fallback leaves the 4x8 with the heater as its only heat rung — which is the physical truth. The v2.3-vs-fallback delta is therefore apples-to-oranges on that one metric; the real-world 4x8 was never getting mat heat. Everything else (VPD in-band, fan duty, negative-pressure, compressor dwell) is unchanged from v2.2.

## QA campaign

The rig extracts the **exact** `run_climate_logic` and `run_clone_photoperiod` lambda bodies from this YAML and executes them host-side (`#define id(x) (x)`), so the code that passed QA is the code that ships.

**24,620,982 checks · 0 violations**, comprising the v2.2 suites (grid sweep 2,096,640 states, boundary, 200k fuzz, photoperiod sweep, 48h plant sims) plus a new **Suite 6** of 9 v2.3 scenarios:

1. Master Takeover freezes the fan curve (user-set speeds untouched).
2. Master Takeover suspends the ladder (no demands fire).
3. 2x4 Off → clone intake trickle, no clone-local demands.
4. Grow mat fires from a cold **clone** tent while the 4x8 is warm.
5. A cold **4x8** does *not* fire the (2x4) grow mat — it fires the room heater.
6. Heater interlock → OUT at floor, air on RECIRC.
7. 2x4-priority both-on → AC serves the hot clone tent.
8. 4x8-priority both-on → a hot *secondary* clone does not command the AC.
9. 4x8 Off, lone 2x4 cold → room heater serves the clone tent; main intake trickles; negative-pressure invariant holds with a tent off.

## Flash & cutover checklist

1. Flash `dsc-hub-v2_3.yaml` OTA (no new wiring; GPIO map unchanged from v2.2).
2. In HA, add **Manual Takeover** (switch) and **Priority Tent** (select) to your dashboard.
3. Set `Priority Tent` for your normal both-running case (default `4x8 Main`).
4. Verify the override fix: with Full Auto on, drag the SF1000 in HA → it should now hold (banner flashes "LIGHT HELD"); toggle `Manual Light Hold` off to release. Then flip `Manual Takeover` and confirm fans + light both obey HA directly.
5. Test an Off: set `Clone Mode → Off` → the 2x4 intake should fall to a trickle and its LED demand clear.

## Known simplification (revisit if real-world data asks)

When the **4x8 is Off and the 2x4 is running solo**, the shared 6" exhaust still modulates on the 4x8's own (now-empty, cool) sensor rather than being fully re-plumbed onto the clone tent. In practice the 2x4 is serviced by the room appliances (which follow it), the grow mat, the clone humidifier, and its own intake flush — with the exhaust providing negative pressure and air removal via the cascade. If living with a solo-2x4 winter shows the clone tent wants harder exhaust, a dedicated clone-driven exhaust curve is the v2.4 candidate. Flagged here so future-you isn't surprised.
