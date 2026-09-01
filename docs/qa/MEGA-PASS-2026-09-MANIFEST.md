# Mega Pass 2026-09 — Triage manifest

**Date:** 2026-09-01 · **Pi:** `192.168.86.48:8787` · **Git:** `a307dc7` · **SPA:** `index-DlMHgtYz.js`

Register: [`MEGA-PASS-2026-09-ISSUE-REGISTER.md`](MEGA-PASS-2026-09-ISSUE-REGISTER.md) · Closure: [`AUDIT-CLOSURE-2026-09.md`](AUDIT-CLOSURE-2026-09.md) · Developer SoT: [`../brain/ROSTER-STOCK.md`](../brain/ROSTER-STOCK.md) · [`../brain/R3F-CANVAS.md`](../brain/R3F-CANVAS.md) · [`../brain/ZIGBEE-POLICY-UI.md`](../brain/ZIGBEE-POLICY-UI.md)

> Triage tables below retain pre-closure tags (`fix` / `verify-close`) as the historical work queue. Operational status SoT after land is the **Issue register** (all P0/P1 closed or deferred).

## Triage legend

| Tag | Action |
|-----|--------|
| `fix` | Full 7-step lifecycle |
| `verify-close` | Landed in git; steps 4–6 only |
| `defer` | Blocked; owner + reason |
| `out-of-scope` | HA lab / hardware / Help verify-only |

## WS assignment summary

| WS | Focus | P0/P1 open (start) |
|----|-------|---------------------|
| WS1 | Climate/Twin R3F, Sankey, Dash Cannalib, sprout/stage | 3 P0 |
| WS2 | Stress ST-P0/P1 closure, SoftCal, page audit | 8 P1 |
| WS3 | CannaLib Wave 2 offset + browse | 1 defer (prod) |
| WS4 | Zigbee recipe, policy UI, pytest flake | 1 P1 |
| WS5 | CatalogPicker, vitest, `--dsc-muted` | 2 P1 |
| WS6 | Help verify, HA OOS, 7.4 hardware | defer |

---

## Stress test — reconcile vs `15d7016`…`a2f5f08`

| Source | MP | Tag | WS | Notes |
|--------|-----|-----|-----|-------|
| ST-P0-1 duplicate probe | MP-001 | verify-close | WS2 | `release_conflicting_slot_pots`, assign guards |
| ST-P0-2 delete no-op | MP-002 | verify-close | WS2 | Slot retire API + GrowPages |
| ST-P0-3 detached undeletable | MP-003 | verify-close | WS2 | Delete on detached rows |
| ST-P0-4 stock on tent rail | MP-004 | verify-close | WS2 | CropScheduler stock lanes |
| ST-P0-5 sprout/stage W— | MP-005 | fix | WS1 | Live verify + test |
| ST-P0-6 strain bus race | MP-006 | verify-close | WS2 | `syncComposeTextToBus` |
| ST-P0-7 stale roster UI | MP-007 | verify-close | WS2 | computed chain + cache-bust |
| ST-P0-8 sprout on draft clear | MP-008 | verify-close | WS2 | `clearComposeDraft` |
| ST-P1-1 nickname flush | MP-009 | verify-close | WS2 | DOM + flush |
| ST-P1-2 soil preset review | MP-010 | fix | WS2 | Preset → review honesty |
| ST-P1-3 async Next | MP-011 | defer | WS2 | Automation recipe only |
| ST-P1-4 roster strip drift | MP-012 | fix | WS2 | vacantProbes vs roster claim |
| ST-P1-5 full page audit | MP-013 | fix | WS2 | Browser matrix |
| SoftCal E2E | MP-014 | fix | WS2 | Calibrate water session |

---

## Browser SPA red-flags (2026-08-29)

| Source | MP | Pri | Tag | WS |
|--------|-----|-----|-----|-----|
| Climate airflow blank | MP-020 | P0 | fix | WS1 |
| Twin 3D blank | MP-021 | P0 | fix | WS1 |
| Sankey mass imbalance | MP-022 | P2 | verify-close | WS1 | Already `massBalanceOk={null}` |
| Dash Cannalib stale | MP-023 | P2 | fix | WS1 |
| Compose stale until reload | MP-024 | P2 | verify-close | WS2 | computed refresh |

---

## Operator Wave 1–5 / CannaLib

| Source | MP | Tag | WS |
|--------|-----|-----|-----|
| Live CannaLib offset (prod) | MP-030 | defer | WS3 | Deploy standalone_server |
| Load more browse | MP-031 | verify-close | WS3 | Brain local OFFSET fallback |
| Strain type icons | MP-032 | verify-close | WS3 | CatalogPicker |
| Strain images upstream | MP-033 | defer | WS3 | media_n=0 honest blank |
| Wave 2 prod offset | MP-034 | defer | WS3 | Ops |

---

## Zigbee product path

| Source | MP | Tag | WS |
|--------|-----|-----|-----|
| Next recipe (one) | MP-040 | defer | WS4 | Pick after manifest — multi-sensor next |
| Multi-sensor `*_b` | MP-041 | defer | WS4 | Design only |
| leak_floor_2x4 bind | MP-042 | defer | WS4 | No HW |
| Safety policy UI | MP-043 | fix | WS4 | Climate/Settings problem chip |
| z2m save bindings flake | MP-044 | fix | WS4 | pytest isolation |
| Physical pair backlog | MP-045 | defer | WS4 | end_device_count=4 on Pi ✓ |

---

## SPA quality

| Source | MP | Tag | WS |
|--------|-----|-----|-----|
| CatalogPicker impure updater | MP-050 | fix | WS5 |
| vitest compose logic | MP-051 | fix | WS5 |
| `--dsc-muted` token | MP-052 | fix | WS5 |
| react-doctor changed scope | MP-053 | fix | WS5 | Gate on touched files |

---

## Legacy / hardware / out-of-scope

| Source | MP | Tag | WS |
|--------|-----|-----|-----|
| DSC Help v1.2 | MP-060 | verify-close | WS6 |
| HA packages / Lovelace | MP-061 | out-of-scope | WS6 |
| PLAN-7.4 F-001…F-008 | MP-062 | defer | WS6 | Hardware |
| FlowSankey 48h soak | MP-063 | defer | WS6 | Operator signoff |
| Nickname strain on live Pi | MP-064 | defer | WS2 | Data re-compose optional |
| FRITZ detached | MP-065 | defer | WS2 | Operator choice |

---

## Priority order (execution)

1. MP-020, MP-021 (P0 visual)
2. MP-005, MP-010, MP-012 (operator honesty)
3. MP-050, MP-051, MP-052 (quality)
4. MP-043, MP-044 (Zigbee)
5. MP-013, MP-014 (audit + SoftCal)
6. verify-close batch for MP-001…009, MP-022, MP-024, MP-031, MP-032
7. defer rows documented in register
