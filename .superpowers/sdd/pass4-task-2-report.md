# Pass 4 Task 2 report — Twin hybrid Got (brain)

**Status:** DONE  
**Branch:** `master`  
**Pushed:** no

## Commits

- (this commit) `feat(brain): hybrid 4x8 Got prefers Twin when history healthy`

## What landed

- `got_hours_4x8` hybrid: Twin on-hours when `light.dsc_hub_twin_sf1000` available + healthy history; else `window_4x8_open`
- History ingest: `twin_sf1000_on` (0/1) + existing brightness; `history_ops` maps Twin light → on metric for DutyStrip
- `sensor.dsc_lights_on_today_4x8` attributes: `got_source` + window-fallback honesty copy
- Tests: `brain/tests/test_live_ux_pass4_twin.py`

## Test summary

```
pytest tests/test_live_ux_pass4_twin.py tests/test_light_loop.py -q
12 passed
```

## Concerns

- Healthy history = ≥1 Twin on/brightness sample since local midnight; first poll after midnight may briefly fall back to window until ingest writes a point
- DutyStrip SPA still on window entity until Task 3; brain history path for Twin is ready
- Brightness-only legacy rows still work for Got via brightness→on (`>0.5`); new ingest writes binary on
- No physical lamp required / not tested
