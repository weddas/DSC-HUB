# Lab wet calibration (N-016)

**In one line:** Peer median aligns probes relative to each other; **lab wet** stamps one channel against a known buffer into **ESP NVS** (not SoftCal Got offsets).

Verified against tip `6a89efa` SPA path: `#/fleet/calibrate` → Soil → Lab wet (`CalibratePage.tsx` → `script.dsc_pots_apply_lab_wet_to_esp`).

## Intent

SoftCal writes Got-plane `input_number.dsc_probeN_offset_*`. Lab wet pushes scale/offset onto the probe ESP (`lab_buffer` method) so Raw→calibrated lives on one plane. Do **not** stack SoftCal offsets on top of an unpushed lab stamp — clear or gate `dual_cal_stack` first.

## Prerequisites

- Kit probe firmware with Mark Soil Cal Lab Buffer / Soil \* Raw entities
- Buffers: pH 4.0 / 7.0 (or lab pair); EC known solution (e.g. 1413 µS/cm); moisture dry/wet points if doing moisture
- Probe marked appropriately in Settings inventory if taking a station OOS for the procedure

## Procedure (Pi SPA)

1. Open **Tune → Calibrate → Soil** → Lab wet panel.
2. Select **Probe** (kit 1–2) and **Channel** (`ph` / `ec` / `moisture`).
3. Rinse; place in **low** buffer. Wait until Raw settles (≥60 s).
4. Enter **Measured** = `sensor.dsc_probeN_soil_*_raw` (or reset cal to scale 1 / offset 0 first).
5. Enter **Expected** = buffer certificate value.
6. Rinse; place in **high** buffer; repeat Measured / Expected.
7. Confirm SoftCal / peer offsets are ~0 (or enable Lab Wet Force).
8. Run **Apply lab wet → ESP** (`script.dsc_pots_apply_lab_wet_to_esp`). Status shows scale/offset; method stamps `lab_buffer`.
9. Verify Got/soil reading near expected; `dual_cal_stack` warn should stay off.

Lab wet uses its **own** in-flight flag on CalibratePage — SoftCal / peer-median busy must not disable Apply.

## Math

```
scale  = (exp_hi - exp_lo) / (meas_hi - meas_lo)
offset = exp_lo - scale * meas_lo
calibrated = raw * scale + offset
```

## EC / moisture honesty

- EC lab wet needs a **known conductive solution** — dry medium EC **0 µS** is physics, not a failed probe (see [`SOFT-CAL.md`](SOFT-CAL.md) pitfall + QA tip `6a89efa`).
- Peer median **does not** substitute for lab wet.
- pot3/4 are kit OOS (Advanced restore only) — do not calibrate OOS hardware as if live.

## Related

- SoftCal (Got offsets): [`SOFT-CAL.md`](SOFT-CAL.md)
- Root copy of older HA-era notes: [`../LAB-WET-CAL.md`](../LAB-WET-CAL.md) (prefer this ops doc)
- SPA: `frontend/src/pages/CalibratePage.tsx` (`LabWetCalPanel`)
