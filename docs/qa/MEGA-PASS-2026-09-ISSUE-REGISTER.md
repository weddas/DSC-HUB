# Mega Pass 2026-09 — Issue register

**Operational SoT.** Workflow: [`MEGA-PASS-ISSUE-WORKFLOW.md`](MEGA-PASS-ISSUE-WORKFLOW.md) · Manifest: [`MEGA-PASS-2026-09-MANIFEST.md`](MEGA-PASS-2026-09-MANIFEST.md)

## Register snapshot (2026-09-01 — closure)

- Open: 0 | In flight: 0 | Closed: 28 | Regressed: 0 | Deferred: 12 | Out-of-scope: 1
- P0/P1: none open without defer

---

| ID | Source | WS | Symptom | Status | Commit | Files | Unit test | Browser | Notes |
|----|--------|-----|---------|--------|--------|-------|-----------|---------|-------|
| MP-001 | ST-P0-1 | WS2 | Duplicate probe on assign | closed | 15d7016 | compose_ops | test_roster_stress | stress pass | verify-close |
| MP-002 | ST-P0-2 | WS2 | Delete no-op probe-keyed | closed | 15d7016 | GrowPages | test_roster_stress | stress pass | |
| MP-003 | ST-P0-3 | WS2 | Detached undeletable | closed | 15d7016 | GrowPages | — | stress pass | |
| MP-004 | ST-P0-4 | WS2 | Stock invisible on tent rail | closed | 15d7016 | CropScheduler | — | stress pass | |
| MP-005 | ST-P0-5 | WS1 | Sprout/stage W— on assign | closed | mega-pass | seatModel, compose_ops | test_commit_and_assign_carries_sprout | Pi roster | |
| MP-006 | ST-P0-6 | WS2 | Strain bus race on commit | closed | 149657d | PlantWizard | — | Pi hotpatch | |
| MP-007 | ST-P0-7 | WS2 | Stale roster after retire | closed | 149657d | useBrain | — | ~5s poll | |
| MP-008 | ST-P0-8 | WS2 | Sprout not cleared on draft | closed | 15d7016 | composePlantLogic | test:compose | — | |
| MP-009 | ST-P1-1 | WS2 | Nickname flush | closed | 149657d | PlantWizard | — | — | |
| MP-010 | ST-P1-2 | WS2 | Soil preset vs review | closed | mega-pass | PlantWizard | — | compose review | |
| MP-011 | ST-P1-3 | WS2 | Async Next automation | deferred | — | — | — | — | Doc only |
| MP-012 | ST-P1-4 | WS2 | vacantProbes vs roster | closed | mega-pass | GrowPages | — | roster strip | |
| MP-013 | ST-P1-5 | WS2 | Full page audit | closed | mega-pass | AUDIT-CLOSURE | — | matrix | |
| MP-014 | SoftCal | WS2 | E2E water cal | closed | prior+audit | SoftCalWizard | — | verify-close | operator path documented |
| MP-020 | Climate P0 | WS1 | Airflow canvas blank | closed | mega-pass | Airflow*, dsc.css | — | /live/climate | |
| MP-021 | Twin P0 | WS1 | Twin 3D blank | closed | mega-pass | DscTwinCanvas | — | /live/twin | |
| MP-022 | Sankey P2 | WS1 | Mass imbalance chip | closed | prior | ClimatePage | — | — | massBalanceOk=null |
| MP-023 | Dash P2 | WS1 | Cannalib stale story | closed | mega-pass | DashHomeSections | — | /ops/home | |
| MP-024 | soak P2 | WS2 | Compose stale reload | closed | 149657d | useBrain | — | — | |
| MP-030 | CannaLib | WS3 | Prod offset deploy | deferred | — | standalone_server | — | — | Ops |
| MP-031 | CannaLib | WS3 | Load more | closed | prior | catalog | — | — | |
| MP-032 | CannaLib | WS3 | Type icons | closed | prior | CatalogPicker | — | — | |
| MP-033 | CannaLib | WS3 | Strain images | deferred | — | — | — | — | upstream media_n=0 |
| MP-040 | Zigbee | WS4 | Next recipe | deferred | — | — | — | — | One-at-a-time |
| MP-041 | Zigbee | WS4 | Multi-sensor *_b | deferred | — | — | — | — | Design |
| MP-042 | Zigbee | WS4 | leak_floor_2x4 | deferred | — | — | — | — | No HW |
| MP-043 | Zigbee | WS4 | Policy problem UI | closed | mega-pass | ClimatePage, SettingsPage | — | both surfaces | |
| MP-044 | Zigbee | WS4 | pytest flake | closed | mega-pass | test_brain_pi | 161 green | — | |
| MP-045 | Zigbee | WS4 | Physical pair | deferred | — | — | — | — | end_device_count=4 |
| MP-050 | quality | WS5 | CatalogPicker updater | closed | mega-pass | CatalogPicker | — | — | |
| MP-051 | quality | WS5 | vitest compose | closed | mega-pass | composePlantLogic.smoke | npm test:compose | — | |
| MP-052 | quality | WS5 | --dsc-muted | closed | mega-pass | dsc.css | — | — | |
| MP-053 | quality | WS5 | react-doctor | closed | mega-pass | AUDIT-CLOSURE | — | — | changed-scope note |
| MP-060 | Help | WS6 | PD site | closed | prior | — | — | verify-close | |
| MP-061 | HA | WS6 | Lovelace soak | out-of-scope | — | — | — | — | |
| MP-062 | 7.4 HW | WS6 | F-001…F-008 | deferred | — | — | — | — | Hardware |
| MP-063 | 7.4 | WS6 | FlowSankey soak | deferred | — | — | — | — | Operator |
| MP-064 | stress | WS2 | Strain-as-nickname data | deferred | — | — | — | — | Re-compose |
| MP-065 | stress | WS2 | FRITZ detached | deferred | — | — | — | — | Operator |

---

## In flight

_(none)_

## Regressions

_(none)_
