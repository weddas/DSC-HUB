# DSC-HUB v2.2 — Home Assistant Setup Pack

Everything HA-side, ready to go. Four files, one find-and-replace, ~15 minutes.
This pack **supersedes** `dsc_hub_v2_2_demand_additions.yaml` (the two clone bindings are included in the complete set here).

## Files in this pack

| File | Goes where |
|---|---|
| `blueprints/automation/dsc_hub/demand_follower.yaml` | `config/blueprints/automation/dsc_hub/demand_follower.yaml` (replaces the v2 blueprint — adds safe-off on hub loss + resync on HA restart) |
| `dsc_hub_demand_automations.yaml` | Contents into `automations.yaml` (all 7 demand rungs) |
| `dsc_hub_support_automations.yaml` | Contents into `automations.yaml` (safety nets + alerts) |
| `dsc_hub_dashboard.yaml` | New dashboard → Raw configuration editor → paste |

## Install order

1. **Flash** `dsc-hub-v2_2.yaml`. The device advertises as **DSC-HUB** — HA discovers it (or it updates the existing ESPHome integration entry). All 19 new entities appear under the `dsc_hub_` prefix.
2. Copy the **blueprint** into place (overwrite the old one — inputs are compatible, existing automations keep working). Developer Tools → YAML → **Reload automations** won't pick up blueprint file changes; restart HA once, or reload from Settings → Automations → Blueprints → ⋮ → Reload blueprints.
3. Paste both **automation files** into `automations.yaml`.
4. **Find & replace the placeholders** (8 unique):
   - `switch.REPLACE_WITH_HUMIDIFIER_PLUG`
   - `switch.REPLACE_WITH_DEHUMIDIFIER_PLUG`
   - `switch.REPLACE_WITH_HEATER_PLUG`
   - `switch.REPLACE_WITH_GROWMAT_PLUG`
   - `switch.REPLACE_WITH_AC_PLUG`
   - `switch.REPLACE_WITH_CLONE_LIGHT_PLUG`
   - `switch.REPLACE_WITH_CLONE_HUMIDIFIER_PLUG`  *(no mister yet? point it at an `input_boolean` for now, or delete that automation and add it when the hardware arrives)*
   - `notify.mobile_app_YOUR_PHONE`
   The heater plug appears **three times** (follower, offline safe-off list, unanswered-demand check) — replace-all catches them.
5. Reload automations, then create the **dashboard** from the raw YAML.

> **Entity ID note:** the firmware sets `friendly_name: DSC-HUB`, so entity IDs are prefixed `dsc_hub_` (e.g. `sensor.dsc_hub_tent_temperature`). If your existing install adopted the device before v2 under different IDs, do one find-and-replace of `dsc_hub_` across the pack to match — check any entity in Settings → Devices → DSC-HUB to confirm the prefix.

## Day one with 4 popped seeds

Seedlings want exactly what the **Clones & Seedlings** preset provides (24 °C, VPD 0.4–0.8, RH 70–80%, 18 h light). Two placements:

**Option A — seedlings in the 2×4 (recommended):** the small tent holds humidity easily and the 4×8 stays free.
1. `Clone Mode` → **Clones & Seedlings** (writes the preset into the clone sliders — tweak after if you like)
2. `Clone Photoperiod` → **Independent**, `Clone Lights-On Time` → **18:00**, `Clone Light Hours` → **18** (counter-cycle: the 2×4 becomes the warm humid night reservoir for the 4×8, exactly as designed)
3. Turn **ON**: `Clone Light Auto` and `Clone Humidifier Auto`
4. 4×8: set `Grow Stage` to whatever it's doing (or leave in Dry/idle) — the router protects the seedlings from 4×8 draw automatically via the RH/cold caps.

**Option B — seedlings in the 4×8:** `Grow Stage` → **Germination**, Full Auto ON, done. The 2×4 can Follow 4×8.

## 10-minute verification checklist (before trusting it overnight)

- [ ] All entities online (Settings → Devices → DSC-HUB — nothing "Unavailable")
- [ ] Toggle `Clone LED Demand` manually → clone light plug follows within a second (then toggle it back; the schedule re-asserts within 15 s anyway)
- [ ] Flip `Clone Photoperiod` between Follow/Independent → OLED Clone page countdown updates
- [ ] Unplug the **room** DHT22 for 3+ minutes → `Aux Sensor Fault` turns on, alert arrives, fans keep running normally → replug, fault clears
- [ ] Pull the hub's power for 2 minutes → offline alert arrives and **every appliance plug goes OFF** → power back, boot-resume prompt on OLED, demands resync
- [ ] Watch the screensaver "Running:" line — it should narrate the router ("holding clone tent moisture in" with fresh seedlings is the expected verb)

## How the safety layers stack (for future-you)

1. **Hub-local** (works with HA dead): emergency >35 °C purge, tent-sensor safe-vent, aux soft-faults, negative-pressure clamp, clone protection caps, compressor dwell.
2. **Blueprint** (per appliance): demand unavailable 30 s → plug OFF; HA restart → resync to demand truth.
3. **Support automations** (fleet-wide): hub offline 2 min → all plugs OFF + alert; sensor-fault, aux-fault and over-temp alerts; unanswered-heater-demand check (the winter seedling killer).

Fail dark, never stuck-on. Good luck to the four — trial by fire, minus the fire. 🌱
