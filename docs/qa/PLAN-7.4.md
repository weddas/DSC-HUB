# DSC-HUB 7.4 plan

**Baseline:** 7.3 software closed 2026-08-27 · [`AUDIT-CLOSURE-7.3.md`](AUDIT-CLOSURE-7.3.md)  
**Git:** `f029702` on `origin/master` · Pi SPA `index-CXq-NptO.js` on `.48`  
**Surface target:** `7.4.0` (brain + SPA unified when pass ships)

7.3 delivered graphs, twin, Lovelace retirement, compose wizard, per-tent photoperiod clocks, and icon motion. **7.4 is unblock → prove → polish → wire** — not another mega feature dump before the stick and soaks are green.

---

## Phase 0 — Close 7.3 operator gates (before tagging 7.4.0)

| Gate | Owner | Action | Done when |
|------|-------|--------|-----------|
| FlowSankey 48h soak | Operator | Watch Climate → Sankey air through ~2026-08-29; tick [`FLOW-SANKEY-SOAK-7.3.md`](FLOW-SANKEY-SOAK-7.3.md) | **closed 2026-09-01** |
| z2m radio + TS0201 | Operator | [`docs/ops/ZIGBEE-RECOVERY.md`](../ops/ZIGBEE-RECOVERY.md) — no factory reset without OK | **closed 2026-09-01** (`radio_up: true`, 4 end devices) |
| Live walk | Operator | Overview, Light, Compose, Twin, Climate on `.48` | **pass** — [`PHASE0-WALK-2026-09.md`](PHASE0-WALK-2026-09.md) |

**Phase 0 signed off 2026-09-01.** See [`AUDIT-CLOSURE-7.4.md`](AUDIT-CLOSURE-7.4.md).

---

## Phase A — Unblockers (hardware / ops)

> **Operator 2026-09-01:** POT3/POT4 **retired** from kit (not pursuing). F-001 AC + F-002 clone mister **on hold indefinitely** — honest OOS UI only. Remaining Phase A items below still apply when/if hardware lands.

These are not polish; the UI already shows honest OOS until installed.

| ID | Item | 7.4 software hook (when hardware lands) |
|----|------|----------------------------------------|
| F-003 | ~~POT3 probe / USB flash~~ | **Retired** — pot3/4 out of kit; Advanced restore only |
| F-001 | AC relay + follower | **On hold** — remove capacity-offline chip when installed |
| F-002 | Clone mister | **On hold** — same for clone humidifier capacity |
| F-008 | SCD41 real CO₂ | Promote from informational ADC proxy to live band |
| F-008-adj | Main tent GPIO lamp | 4×8 “Got” from window → real dimmer entity |
| N-016 | Lab wet cal soak | Run wizard on one pot; document result in LAB-WET-CAL |
| N-020..023 | Sensor trust thresholds | Collect 7+ days post-cal evidence; tune if false positives |

**Priority order:** z2m (Phase 0) → ~~F-003~~ (retired) → ~~F-001/F-002~~ (on hold) → GPIO lamp → SCD41.

---

## Phase B — FlowSankey graduation

**Prerequisite:** Phase 0 FlowSankey soak signed off — **done 2026-09-01**.

| Task | Notes |
|------|-------|
| Remove **EXPERIMENTAL** label | **done** — SPA shows `Air CFM` chip only |
| Default tab or Overview chip | Skipped — mass chip stays gated (`massBalanceOk=null`) |
| Alert wiring | Deferred — no Overview mass-balance warn unless ops asks |
| Docs | [`AUDIT-CLOSURE-7.4.md`](AUDIT-CLOSURE-7.4.md) |

---

## Phase C — Zigbee (after radio_up)

**Prerequisite:** Phase 0 z2m green.

| Task | Notes |
|------|-------|
| Settings → Zigbee panel live test | Placement editor, modifier offsets, permit-join countdown |
| Climate/Overview chips | TS0201 readings in clone/main bands when paired |
| [`ZIGBEE-AUDIT-7.1.md`](ZIGBEE-AUDIT-7.1.md) delta | Re-run input audit against live devices |
| FOLLOWUPS | Close 7.2/7.3 “radio down” deferred rows |

---

## Phase D — UX polish (7.4 scope)

**Priority reorder (2026-08-27):** Tents / photoperiod **before** generic polish. Airflow viz Phase D2 after tent deploy is green.

| Track | Tasks | Done when |
|-------|-------|-----------|
| **D1 Tents & light** | Per-tent clocks (done in src); `PhotoperiodTimeline` scheduled 24h; split `CropScheduler`; per-tent stage chips; redeploy Pi | [`LIGHT-AUDIT-7.4-live.md`](LIGHT-AUDIT-7.4-live.md) checklist |
| **D2 Airflow viz** | R3F particle lung-room per [`AIRFLOW-VIZ-7.4.md`](AIRFLOW-VIZ-7.4.md); fan trim when override; retire SVG ribbons | Climate tab parity sign-off |
| **D3 QoL pass** | Parallel research suggestions → triage into FOLLOWUPS | Research doc reviewed |

Live with 7.3 UI first (~1 week), then one coherent pass — not death-by-a-thousand-cuts.

| Area | Candidates (pick during pass planning) |
|------|--------------------------------------|
| Compose wizard | Default coco preset; Research → Compose jump to step 2; remember last tent |
| Photoperiod | Overview card deep-link (done); optional cockpit-only compact mode |
| Icons / motion | Extend to Climate, Root, Mission where chips lack icons; audit `prefers-reduced-motion` |
| Catalog | Strain filter presets; recent picks row |
| Twin | Pot select → Compose handoff |

**Out of 7.4:** net-new graph types, Lovelace revival, Phase E brain rewrites.

---

## Phase E — Version + closure

1. Bump `7.4.0` in brain surface, SPA package, Pi `.env` (`DSC_SURFACE_VERSION`).
2. `studio-deploy.ps1` → verify-brain → island-proof.
3. `pytest brain/tests/test_brain_pi.py` — must stay green.
4. [`AUDIT-CLOSURE-7.4.md`](AUDIT-CLOSURE-7.4.md) (create at end).
5. Git tag `v7.4.0` after operator signoff on closure doc.
6. Append dated section to [`FOLLOWUPS.md`](../FOLLOWUPS.md).

---

## Suggested sequence (calendar)

| When | Focus |
|------|-------|
| **Now → Aug 29** | Phase 0 soaks only; file red-flags in FOLLOWUPS |
| **Aug 29–Sep 2** | Phase 0 signoff; start Phase B if Sankey green |
| **Sep (ops window)** | z2m + F-003/F-001 as hardware allows |
| **Sep (dev)** | Phase D polish pass after live feedback |
| **Ship** | Phase E when A–D acceptance criteria met or explicitly deferred |

---

## Success criteria (7.4.0)

- [x] Phase 0 gates closed or deferred with dated owner note
- [x] FlowSankey not experimental (or explicitly remains experimental with reason)
- [x] z2m: `radio_up: true` OR documented blocker + UI still honest
- [x] Hardware F-001/F-002/F-003 retired or on-hold with dated note
- [x] Surface version strings `7.4.0` in brain + SPA defaults
- [x] Pi hotpatch / `.env` (`DSC_SURFACE_VERSION=7.4.0`, SPA `index-K2_ziUnM.js`)
- [ ] Operator git tag `v7.4.0`
- [x] Brain pytest green after bump; SPA `build:spa` clean
- [x] AUDIT-CLOSURE-7.4 published
- [ ] Compose + photoperiod smoke on `.48` post-deploy (operator)

---

## References

- [`AUDIT-CLOSURE-7.3.md`](AUDIT-CLOSURE-7.3.md)
- [`FLOW-SANKEY-SOAK-7.3.md`](FLOW-SANKEY-SOAK-7.3.md)
- [`docs/ops/ZIGBEE-RECOVERY.md`](../ops/ZIGBEE-RECOVERY.md)
- [`FOLLOWUPS.md`](../FOLLOWUPS.md) — F-001–F-008, N-016, N-020..023
