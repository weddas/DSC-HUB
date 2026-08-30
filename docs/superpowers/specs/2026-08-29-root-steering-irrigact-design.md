# Root steering (Bar 3) + IrrigAct design

**Date:** 2026-08-29  
**Status:** approved (plan Sec3 lock)

## Problem

Root UI can show moisture/EC/dryback fragments, but there is no Brain **source of truth** for P0–P3 crop-steering phases, and no honest irrigation **act** path. Shipping actuators before SoT invents control fiction.

## Goals

1. **Bar3:** Brain `root_steering` SoT — phase, dryback %, VWC/EC targets, day/night, manual override — consumed read-only by SPA Root.
2. **IrrigAct:** Brain-commanded irrigation shots with guardrails; real seat (Sonoff or Zigbee `plug_pump`) or honest **OOS**.

## Non-goals

- Client-side phase invention in the SPA
- SPA→relay shortcuts bypassing Brain
- Inventing pump hardware that is not inventoried
- SoftCal AI (separate late wave; may *read* this SoT later)

## Bar3 — `root_steering` SoT

- Module: [`brain/dsc_brain/root_steering.py`](../../../brain/dsc_brain/root_steering.py)
- Inputs: live pot probe (readingOk), photoperiod day/night, settings targets
- Outputs: P0–P3 phase, dryback %, targets, override latch; expose on `/fleet` and/or `/control/root-steering`
- SPA: `rootSteering.ts` + Root page read Brain only
- Override pattern matches tent_manual_override (latch then rejoin)
- Vocabulary peers: HA-Irrigation-Strategy / Growlink-style P0–P3 (domain language only)

## IrrigAct — act path

- All acts via Brain control APIs
- Prefer existing seats; Zigbee `plug_pump` only when bound (see Zigbee roles spec)
- If no pump seat: honest OOS row — not fake green
- Guardrails: max shot volume/time, min interval, probe `readingOk` required, override stops auto
- Audit: each commanded shot logged with seat evidence

## Sequencing

Bar3 lands and verifies **before** IrrigAct. IrrigAct may ship OOS-only if hardware absent.

## Acceptance

- Root phase + dryback match Brain fixtures/tests
- One commanded shot → audit + relay/plug evidence, **or** OOS documented with seat honesty
- No SPA-invented irrigation commands
