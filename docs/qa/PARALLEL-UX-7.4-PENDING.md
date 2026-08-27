# Parallel UX research — pending

**Topic:** DSC-HUB UX polish, QoL features, value-add, blind spots, smart moves  
**Status:** **Blocked** — `parallel-cli` not installed on this machine (2026-08-28). D3 code landed locally; merge parallel output here when available.

## D3 implemented (local SPA, 2026-08-28)

| ID | Done |
|----|------|
| P0 L-01 | Lights-on banner + EntityTime fleet write when empty |
| P0 L-02 | Schedule follow vs climate follow split (Light vs Climate) |
| P0 T-01 | Stage rail from pots in tent only (no Follow 4×8 → grow_stage bleed) |
| P0 R-01 | Overview moisture uses `got_moisture` fallback |
| P0 O-01 | Hub online chip on Overview |
| P1 L-03–L-05 | DLI estimate, stage-named Want chips, manual-hold conflict banner |
| P1 T-02–T-04 | Move wizard photoperiod template + independent 2×4 lights-on |
| P1 C-01, C-03 | Stage rail on Climate Want; VPD → Climate alert route |
| P1 G-01, G-03, G-04 | Compose draft clear on retire, chemistry tier, remember tent |
| P1 P-01 | Re-home checklist on tent move |
| P2 | Airflow particles, timeline ramp/flip hint, grow log filters, Twin→Compose, nav subtitles |

**Still operator-side:** set `time.dsc_hub_lights_on_time` on hub; deploy SPA to Pi.

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

Until parallel-cli runs, triage from live audit + D3 pass:

- Set 4×8 lights-on time on hub (UI now surfaces banner; entity still empty on `.48`)
- Resolve 2×4 dark violation / manual hold before trusting clone schedule
- Deploy D3 SPA bundle to Pi (`studio-deploy.ps1` or `-SkipSpaBuild` if already built)
- Run parallel research when `/parallel-setup` completes — merge below
