# QA — DSC-HUB firmware verification rig

`qa_rig_v241.cpp` compiles the **exact lambda bodies extracted from
`esphome/dsc-hub-v2_4_1.yaml`** against lightweight ESPHome stubs and runs
nine suites (~24.3M checks):

1. **Grid sweep** — ~2.1M steady states, hard invariants (fan ranges,
   fresh-air floor, negative pressure, clone protection cap, appliance
   wars, demand correctness)
2. **Boundary/edge cases** — band inversion, exact thresholds, NaN aux,
   emergency freeze, slew convergence
3. **Fuzzer** — 200k random transitions with spikes, dropouts, faults
   (POT3's probe pinned at 0.0 °C throughout)
6. **v2.3 regression** — OFF states, priority arbitration, grow-mat
   relocation, heater interlock, master takeover
7. **v2.4.1 incident scenarios** — the 19 Jul replays (VPD-silent
   humidifier, AC-before-fans, cold POT4, root-zone runaway, min-off)
8. **Photoperiod + SF1000 ramp engine** — window truth across all
   schedules incl. midnight wrap, ramp monotonicity/target-reach,
   overlap scaling, manual-hold self-heal, Follow-4×8, dead clock
9. **ESP-NOW source-select** — fresh direct link beats HA mirror, stale
   falls back, runaway via direct link, implausible values filtered

## Run it

```bash
python3 extract_bodies.py            # re-extract lambdas from the YAML
g++ -O2 -std=c++17 -Wall qa_rig_v241.cpp -o qa_rig
./qa_rig                             # exit 0 = all invariants hold
```

The three `*_body.cpp` files are **generated** — never edit them by
hand; edit the YAML and re-extract. If you change `run_climate_logic`,
`run_photoperiod` or `run_clone_photoperiod` in the firmware, re-run
this rig before flashing.

(The older `qa_rig.cpp` from v2.2/v2.3 is superseded by this rig, which
carries all its suites forward.)
