# Lab wet two-point calibration (N-016)

Use **raw** probe readings (or reset cal first) against known buffers. Do **not**
stack HA peer offsets with lab scale — Push/zero peers first, or enable Lab Wet Force.

Full ops checklist: [`docs/qa/LIVE-UI-SENSING-LEARN-5.1.8.md`](qa/LIVE-UI-SENSING-LEARN-5.1.8.md).

## Prerequisites

- Pot firmware **5.1.6+** (`Mark Soil Cal Lab Buffer`, `Soil * Raw` entities)
- HA surface **5.1.8+** (`script.dsc_pots_apply_lab_wet_to_esp`)
- Buffers: pH 4.0 / 7.0 (or your lab pair); EC known solution (e.g. 1413 µS/cm);
  moisture dry/wet points if doing moisture

## Procedure

1. Select **Target Pot** and **Channel** (ph / ec / moisture) on Root Zone → Lab wet.
2. Rinse probe; place in **low** buffer. Wait until Raw reading settles (≥60 s).
3. Enter **Measured** = `sensor.dsc_potN_soil_*_raw` (or published value if cal reset
   to scale 1 / offset 0).
4. Enter **Expected** = buffer certificate value.
5. Rinse; place in **high** buffer; repeat Measured / Expected.
6. Confirm HA peer offsets are ~0 (or enable Force).
7. Run **Apply lab wet → ESP**. Status text shows scale/offset; method stamps `lab_buffer`.
8. Verify Got/soil reading near expected; dual-stack warn should stay off.

## Math

```
scale  = (exp_hi - exp_lo) / (meas_hi - meas_lo)
offset = exp_lo - scale * meas_lo
calibrated = raw * scale + offset
```

## Abort / constraints (from script)

| Guard | Behavior |
|---|---|
| HA peer offsets non-zero and Force off | Abort; status explains Push/zero or Force |
| Measured span `|hi − lo| < 0.001` | Abort — span too small |
| After success | Force auto-off; status `Lab wet POTn channel → scale … offset … (lab_buffer)` |
| Mark button missing (old pot FW) | Scale/offset still written; provenance stamp skipped |

**Moisture UI gap:** Root Zone lists pH/EC measured/expected helpers only.
Channel `moisture` reads `input_number.dsc_lab_wet_m_{lo,hi}_{meas,exp}` — set those
via Developer Tools if running a moisture lab wet until the card lists them.

Entity dual-form for Mark: `button.dsc_potN_mark_soil_cal_lab_buffer` or
`button.dsc_pot_N_mark_soil_cal_lab_buffer`.

## Honesty

Peer-median alignment is **not** lab truth. After lab wet, treat that channel as
buffer-calibrated until the next Reset. Hold-to-reset peer captures clears **HA**
offsets only — it does not undo ESP lab_buffer scale/offset.
