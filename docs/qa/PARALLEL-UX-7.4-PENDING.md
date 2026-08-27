# Parallel UX research — pending

**Topic:** DSC-HUB UX polish, QoL features, value-add, blind spots, smart moves  
**Status:** **Blocked** — `parallel-cli` not installed on this machine (2026-08-27)

## To run

1. Install: `/parallel-setup` (or Cursor Parallel plugin setup)
2. Kick off:

```bash
parallel-cli research run "DSC-HUB grow tent UI: UX polish, QoL features, and value-add for HA cannabis grow panel with per-tent photoperiod, climate, compose wizard, digital twin, fleet monitoring. Two tents (4x8 main, 2x4 clone), lung room airflow, SF1000 dimmer, independent schedules. Focus operator workflows, blind spots, smart moves, anti-patterns." --processor pro-fast --no-wait --json
```

3. Poll:

```bash
parallel-cli research poll "$RUN_ID" -o dsc-hub-ux-qol-7.4 --timeout 540
```

4. Move executive summary + `dsc-hub-ux-qol-7.4.md` into this folder and link from PLAN-7.4 Phase D3.

## Interim placeholder

Until parallel-cli runs, triage from live audit:

- Set 4×8 lights-on time (hub entity empty → no schedule UX)
- Resolve 2×4 dark violation before tuning clone schedule
- Deploy tent/clock bundle to Pi (live still on pre-clock Light page)
- Split tent mental model in copy when plants move (4×8 flower → 2×4 veg clones)
