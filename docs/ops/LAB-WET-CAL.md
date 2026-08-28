# Lab wet calibration (N-016)

Peer median aligns pots relative to each other; **lab wet** stamps one channel against a known buffer solution.

## Procedure

1. Mark the pot **out of grow service** if it is a probe station — use Settings inventory, not ad-hoc YAML.
2. Remove the soil probe; rinse with distilled water.
3. Immerse in a documented buffer (typical mid-range moisture reference for your probe family).
4. On Pi SPA → **Tune → Calibrate → Soil**, run **Lab wet calibration wizard** with pot id and buffer %.
5. Script `script.dsc_potN_lab_wet_cal` runs on the hub; ESP stores a lab_buffer mark until Reset.
6. Re-seat probe in the **idle home pot** for safety; verify reading is within expected tolerance on Root Zone.

## Honesty

- Peer median **does not** substitute for lab wet.
- SoftCal (HA Got offsets) **does not** substitute for lab wet — see [`SOFT-CAL.md`](SOFT-CAL.md).
- Until lab wet, treat Got moisture as fleet-relative, not absolute lab truth.
- pot3 (F-003) and probe stations follow inventory `in_service` gates — do not calibrate OOS hardware as if live.
- Rebuild note: SPA may still reference dead `script.dsc_potN_lab_wet_cal` paths — prefer the real two-point ESP stamp path before treating wizard success as lab SoT.

## Related

- [`SOFT-CAL.md`](SOFT-CAL.md) — soft HA offsets (not ESP NVS)
- [`PROBE-PLANT-MODEL.md`](../brain/PROBE-PLANT-MODEL.md) — idle home vs plant assignment
- [`CalibratePage.tsx`](../../homeassistant/custom_components/dsc_hub/frontend/src/pages/CalibratePage.tsx) — UI wizard
- [`docs/FOLLOWUPS.md`](../FOLLOWUPS.md) — N-016 tracking
