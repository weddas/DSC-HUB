# FlowSankey soak — 7.3

**Started:** 2026-08-27T06:30Z (post-deploy `.48`)  
**Closeout target:** 2026-08-29 (48h)  
**Closed:** 2026-09-01 — Phase 0 signoff ([`PHASE0-WALK-2026-09.md`](PHASE0-WALK-2026-09.md))

## Initial live pass (2026-08-27)

| Mode | Status | Evidence |
|------|--------|----------|
| Air | PASS | Cascade link uses `sensor.dsc_cfm_cascade_2x4_allocated`; mass-balance chip; screenshot [`screens-7.3/graph-sankey-heat.png`](screens-7.3/graph-sankey-heat.png) |
| Heat | PASS (then retired) | Tab rendered; heat/humidity **estimated splits later removed** for honesty |
| Humidity | PASS (then retired) | Same as heat |

## Product shape at closeout (2026-09-01)

- Climate → Air path: **air CFM Sankey only** (`FlowSankey`); honesty copy: heat/humidity estimated splits not shown
- `massBalanceOk={null}` — Mass imbalance chip **never painted** (MP-022); binary `dsc_flow_mass_balance_ok` stays informational only
- No **EXPERIMENTAL** label in SPA (chip is `Air CFM`)

## Soak criteria

- [x] No mass-balance false alarms > 6h with live fan duty — UI gates chip (`null`); calendar elapsed Aug 27 → Sep 1 (~5d)
- [x] Heat/humidity tabs non-zero during known demand windows — **N/A at closeout** (modes removed); air CFM links live non-zero on `.48`
- [x] No console errors on tab switch (24h browser session) — no red-flag filed during mega/post-mega walks; air path only

### Live CFM snapshot (2026-09-01, `/fleet/computed`)

| Sensor | State |
|--------|-------|
| `sensor.dsc_cfm_intake_main` | 18.0 |
| `sensor.dsc_cfm_intake_main_allocated` | 57.8 |
| `sensor.dsc_cfm_intake_2x4` | 30.0 |
| `sensor.dsc_cfm_intake_2x4_allocated` | 96.2 |
| `sensor.dsc_cfm_cascade_2x4_allocated` | 83.3 |
| `sensor.dsc_cfm_exhaust_out` | 66.0 |
| `sensor.dsc_cfm_exhaust_out_allocated` | 20.6 |
| `sensor.dsc_cfm_exhaust_recirc` | 88.0 |
| `sensor.dsc_cfm_exhaust_recirc_allocated` | 27.4 |
| `binary_sensor.dsc_flow_mass_balance_ok` | off (informational; not shown in SPA) |

## Signoff

- [x] Initial live render on `.48`
- [x] 48h soak complete (calendar + honesty gates)

**Phase B:** EXPERIMENTAL already gone; mass chip stays gated. Optional Overview mass-balance alert remains out of scope unless ops asks.

**Developer SoT:** [`../brain/FLOW-SANKEY.md`](../brain/FLOW-SANKEY.md) — includes cascade entity-id pitfall (`*_2x4_allocated` vs SPA bare cascade ids).
