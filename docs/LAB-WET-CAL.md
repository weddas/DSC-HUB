# Lab wet two-point calibration (N-016)

**Durable HA / package procedure.** For Pi SPA Calibrate wizard status and honesty gap, see [`docs/ops/LAB-WET-CAL.md`](ops/LAB-WET-CAL.md).

Use **raw** probe readings (or reset cal first) against known buffers. Do **not** stack HA peer offsets with lab scale — Push/zero peers first, or enable Lab Wet Force.

## Prerequisites

- Pot firmware **5.1.6+** (`Mark Soil Cal Lab Buffer`, `Soil * Raw` entities)
- HA surface **5.1.8+** (`script.dsc_pots_apply_lab_wet_to_esp`)
- Buffers: pH 4.0 / 7.0 (or your lab pair); EC known solution (e.g. 1413 µS/cm); moisture dry/wet points if doing moisture

## Procedure

1. Select **Target Pot** and **Channel** (ph / ec / moisture) on Root Zone → Lab wet.
2. Rinse probe; place in **low** buffer. Wait until Raw reading settles (≥60 s).
3. Enter **Measured** = `sensor.dsc_potN_soil_*_raw` (or published value if cal reset to scale 1 / offset 0).
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

## Honesty

Peer-median alignment is **not** lab truth. After lab wet, treat that channel as buffer-calibrated until the next Reset.
