# FlowSankey soak — 7.3

**Started:** 2026-08-27T06:30Z (post-deploy `.48`)  
**Closeout target:** 2026-08-29 (48h) — operator may extend if fleet duty mix is low

## Initial live pass (2026-08-27)

| Mode | Status | Evidence |
|------|--------|----------|
| Air | PASS | Cascade link uses `sensor.dsc_cfm_cascade_2x4_allocated`; mass-balance chip; screenshot [`screens-7.3/graph-sankey-heat.png`](screens-7.3/graph-sankey-heat.png) |
| Heat | PASS | Tab renders; proxy reads live when heater/mat demand + relay on |
| Humidity | PASS | Tab renders; humidify/dehum proxies from room RH gap |

**Label:** Still **EXPERIMENTAL** until 48h closeout — proxies are informational only.

## Soak criteria

- [ ] No mass-balance false alarms > 6h with live fan duty
- [ ] Heat/humidity tabs non-zero during known demand windows
- [ ] No console errors on tab switch (24h browser session)

## Signoff

- [x] Initial live render on `.48`
- [ ] 48h soak complete
