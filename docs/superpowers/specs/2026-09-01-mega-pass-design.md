# Mega Pass 2026-09 — Design

**Date:** 2026-09-01  
**Status:** approved for implementation (user execute request)  
**Plan:** [`../plans/2026-09-01-mega-pass.md`](../plans/2026-09-01-mega-pass.md)

## Problem

[`docs/FOLLOWUPS.md`](../../FOLLOWUPS.md) mixes done, stale, and open items. Recent stress-test and operator passes landed fixes without reconciling the ledger or proving live Pi state. Completion requires exhaustive per-issue tracking, not workstream feelings.

## Approach

**Approach A:** Triage manifest + living issue register + mandatory 7-step lifecycle per [`MEGA-PASS-ISSUE-WORKFLOW.md`](../../qa/MEGA-PASS-ISSUE-WORKFLOW.md).

## Artifacts

| File | Role |
|------|------|
| [`MEGA-PASS-2026-09-MANIFEST.md`](../../qa/MEGA-PASS-2026-09-MANIFEST.md) | Prioritized backlog, WS tags |
| [`MEGA-PASS-2026-09-ISSUE-REGISTER.md`](../../qa/MEGA-PASS-2026-09-ISSUE-REGISTER.md) | Operational SoT with lifecycle + evidence |
| [`AUDIT-CLOSURE-2026-09.md`](../../qa/AUDIT-CLOSURE-2026-09.md) | Pass closure summary |

## Workstreams

- **WS1:** R3F Climate/Twin resize, Dash Cannalib honesty, sprout/stage (MP-005, MP-020–023)
- **WS2:** Stress ST closure verify + preset/roster/vacant + page audit + SoftCal (MP-010–014)
- **WS3:** CannaLib verify-close; prod offset deferred (MP-030–033)
- **WS4:** Policy UI, pytest flake; recipes deferred (MP-043–045)
- **WS5:** CatalogPicker, vitest, CSS token, react-doctor (MP-050–053)
- **WS6:** Help verify-close; HA/hardware defer (MP-060–063)

## Gates

1. User approved manifest (implicit via execute plan).
2. Each P0/P1 fix: steps 1–7 with register evidence.
3. Final: pytest green, react-doctor no regression on changed scope, Pi hotpatch, register P0/P1 closed or deferred.

## Non-goals

- HA package productization
- Hardware install (F-001…F-008)
- Production CannaLib deploy (ops)
- New Zigbee recipe without operator HW pick

## Version

Defer 7.4.0 bump until AUDIT-CLOSURE signoff.
