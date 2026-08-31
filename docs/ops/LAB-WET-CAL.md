# Lab wet calibration (N-016)

Peer median aligns probes relative to each other; **lab wet** stamps one channel against a known buffer solution on the **ESP**.

## Procedure

1. Mark the probe **out of grow service** if it is a probe station — use Settings inventory, not ad-hoc YAML.
2. Remove the soil probe; rinse with distilled water.
3. Immerse in a documented buffer (typical mid-range moisture reference for your probe family).
4. Fill lab-wet helpers as needed (`input_number.dsc_lab_wet_*`, `input_select.dsc_lab_wet_channel`).
5. On Pi SPA → **Tune → Calibrate → Soil**, run **Lab wet calibration**:
   - Sets `input_number.dsc_lab_wet_pot` to the probe id (1–4)
   - Runs **`script.dsc_pots_apply_lab_wet_to_esp`** (shared apply path — **not** dead per-pot `script.dsc_potN_lab_wet_cal`)
6. Re-seat probe in the **idle home pot** for safety; verify reading on Root Zone.

## Honesty

- Peer median **does not** substitute for lab wet.
- SoftCal writes HA offsets only — see [`SOFT-CAL.md`](SOFT-CAL.md). Do not stack SoftCal + ESP cal without clearing `dual_cal_stack`.
- Until lab wet, treat Got moisture as fleet-relative, not absolute lab truth.
- pot3/pot4 are planned OOS (retired from kit) — do not calibrate OOS hardware as if live.
- Entity ids after rename: SoftCal/offsets use `dsc_probeN_*`; script name still `dsc_pots_apply_lab_wet_to_esp`.

## Related

- Two-point buffer procedure (helpers + Push): [`../LAB-WET-CAL.md`](../LAB-WET-CAL.md)
- SoftCal honesty + cal_session: [`SOFT-CAL.md`](SOFT-CAL.md)
- [`CalibratePage.tsx`](../../homeassistant/custom_components/dsc_hub/frontend/src/pages/CalibratePage.tsx) — UI wizard
- Package: `homeassistant/packages/dsc_v4_sensor_cal.yaml` (`dsc_pots_apply_lab_wet_to_esp`)
- [`docs/FOLLOWUPS.md`](../FOLLOWUPS.md) — N-016 tracking
