# Soft calibrate (HA Got offsets)

**In one line:** SoftCal averages live soil sensors for ~15s, then writes **HA** `input_number.dsc_potN_offset_*` — it does **not** stamp ESP lab NVS.

Verified tip: `906ad71` against `softCalibrate.ts`, `SoftCalWizard.tsx`, `firmware/v4/dsc-pot-common.yaml` (`update_interval: 60s`).

## Where it lives

- SPA: **Tune → Calibrate → Soil → Soft calibrate**
- Lib: `homeassistant/custom_components/dsc_hub/frontend/src/lib/softCalibrate.ts`
- Wizard: `.../components/SoftCalWizard.tsx`

## Workflow

1. Select pots (1–4).
2. Enter known tap-water pH (3–10); optional EC µS/cm.
3. Capture **15 samples @ 1s** while probes sit in tap water.
4. Confirm → write soft offsets: `offset_ph`, `offset_moisture`, `offset_ec_us`.
5. Optional second capture after watering (averages; refine offsets if pH entered).

Offset math: `Got ≈ raw + offset` → `offset = known − average`.

## Honesty constraints

| Claim | Reality |
|-------|---------|
| SoftCal σ from 15×1s | Modbus soil bus polls **60s**. Fifteen 1 Hz reads often sample the **same holding register** → false variance. Prefer burst Modbus / `state_changed` / unique timestamps (≥3) before treating σ as real. |
| Sensors sampled | Calibrated `sensor.dsc_potN_soil_*` (moisture, temp, EC, pH, NPK) — **not** `Soil * Raw`. Soft offsets stack on top of ESP `calibrate_linear`. |
| NPK | EC-derived on many sticks — SoftCal must **not** treat N/P/K as independent measured channels for offsets (UI shows them; offsets only for pH / moisture / EC helpers). |
| vs lab wet | Lab wet → ESP NVS / script path. SoftCal → HA helpers only. Do not claim SoftCal is a lab stamp. |
| Dual stack | If ESP cal + HA offsets both non-identity, Got is double-corrected. Rebuild goal: one cal plane (prefer ESP NVS; zero HA after push) + gate SoftCal commit when `dual_cal_stack` is on. |

```mermaid
flowchart LR
  Modbus["Modbus soil<br/>60s poll"]
  ESP["ESP calibrate_linear<br/>NVS lab SoT"]
  HA["HA soil_* sensors"]
  Soft["SoftCal 15×1s avg"]
  Off["input_number<br/>dsc_potN_offset_*"]
  Got["Operator Got"]
  Modbus --> ESP --> HA --> Soft --> Off
  HA --> Got
  Off --> Got
```

## Operator tips

- Soft ≠ peer median ≠ lab wet ≠ probe idle home ≠ tent unassign ≠ plant retire.
- OOS / probe-station hardware: do not SoftCal as if live grow truth.
- After SoftCal, verify Root Zone Got moves; if readings look “stuck”, wait for a real Modbus edge or enable a future cal_session burst firmware.

## Rebuild targets (from pre-rebuild interrogate)

- Firmware `cal_session`: burst Modbus 2–5s for 30–60s, then restore 60s; median/MAD on device.
- SoftCal average Raw (or push scale/offset to ESP then zero HA).
- Pause / flag ESP-NOW during burst so mats do not chase mid-cal values.
- Persist soft-cal session history in brain DB.
- Wire lab wet SPA to real two-point path (see [`LAB-WET-CAL.md`](LAB-WET-CAL.md)).

## Related

- [`LAB-WET-CAL.md`](LAB-WET-CAL.md) — buffer / ESP stamp
- [`PROBE-PLANT-MODEL.md`](../brain/PROBE-PLANT-MODEL.md)
- [`CLIMATE-MODE-POLICY.md`](../brain/CLIMATE-MODE-POLICY.md)
- Interrogate plan: Act-on item 8 (false σ / dual stack)
