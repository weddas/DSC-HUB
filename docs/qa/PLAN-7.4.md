# DSC-HUB 7.4 plan

**Baseline:** 7.3 software closed 2026-08-27 · [`AUDIT-CLOSURE-7.3.md`](AUDIT-CLOSURE-7.3.md)  
**Git:** `b84edc2` on `origin/master` · Pi SPA `index-DL1EcjhX.js` (+ `calibrate-D1D5CnxU` · `tune-fleet-IPnSFs3d`)  
**Surface target:** `7.4.0` (brain + SPA unified when pass ships)  
**WiP runbooks on tip:** [`DEMO-MODE.md`](../brain/DEMO-MODE.md) · [`PHOTOPERIOD-TIMELINE.md`](../brain/PHOTOPERIOD-TIMELINE.md) · [`PLANT-SEAT.md`](../brain/PLANT-SEAT.md) · soft/lab layers [`LAB-WET-CAL.md`](../ops/LAB-WET-CAL.md)

7.3 delivered graphs, twin, Lovelace retirement, compose wizard, per-tent photoperiod clocks, and icon motion. **7.4 is unblock → prove → polish → wire** — not another mega feature dump before the stick and soaks are green.

---

## Phase 0 — Close 7.3 operator gates (before tagging 7.4.0)

| Gate | Owner | Action | Done when |
|------|-------|--------|-----------|
| FlowSankey 48h soak | Operator | Watch Climate → Sankey air/heat/humidity through ~2026-08-29; tick [`FLOW-SANKEY-SOAK-7.3.md`](FLOW-SANKEY-SOAK-7.3.md) | Criteria checked; no false mass-balance alarms >6h |
| z2m radio + TS0201 | Operator | [`docs/ops/ZIGBEE-RECOVERY.md`](../ops/ZIGBEE-RECOVERY.md) — no factory reset without OK | `radio_up: true`, ≥1 device, permit-join pair succeeds |
| Live walk | Operator | Overview, Light, Compose, Twin, Climate on `.48` | No blockers filed as red-flag in FOLLOWUPS |

**Do not bump version to 7.4.0 until Phase 0 signoff** (or explicitly defer a gate with a dated note in FOLLOWUPS).

---

## Phase A — Unblockers (hardware / ops)

These are not polish; the UI already shows honest OOS until installed.

| ID | Item | 7.4 software hook (when hardware lands) |
|----|------|----------------------------------------|
| F-003 | POT3 probe / USB flash | Restore pot3 in mat vote; re-enable peer-MAD for pot3 |
| F-001 | AC relay + follower | Remove capacity-offline chip; wire demand path proof |
| F-002 | Clone mister | Same for clone humidifier capacity |
| F-008 | SCD41 real CO₂ | Promote from informational ADC proxy to live band |
| F-008-adj | Main tent GPIO lamp | 4×8 “Got” from window → real dimmer entity |
| N-016 | Lab wet cal soak | Run wizard on one pot; document result in LAB-WET-CAL |
| N-020..023 | Sensor trust thresholds | Collect 7+ days post-cal evidence; tune if false positives |

**Priority order:** z2m (Phase 0) → F-003 (fleet hole) → F-001/F-002 (climate capacity) → GPIO lamp → SCD41.

---

## Phase B — FlowSankey graduation

**Prerequisite:** Phase 0 FlowSankey soak signed off.

| Task | Notes |
|------|-------|
| Remove **EXPERIMENTAL** label | Climate tab + any honesty banners |
| Default tab or Overview chip | Only if soak shows stable mass-balance during fan duty |
| Alert wiring | Optional: surface mass-balance warn as StatusChip on Overview (no new automations without ops OK) |
| Docs | Add row to AUDIT-CLOSURE-7.4 when done |

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

- [ ] Phase 0 gates closed or deferred with dated owner note
- [ ] FlowSankey not experimental (or explicitly remains experimental with reason)
- [ ] z2m: `radio_up: true` OR documented blocker + UI still honest
- [ ] No regressions: 61/61 brain tests, SPA build clean
- [ ] Compose + photoperiod flows verified on `.48` post-polish
- [ ] AUDIT-CLOSURE-7.4 published

---

## References

- [`AUDIT-CLOSURE-7.3.md`](AUDIT-CLOSURE-7.3.md)
- [`FLOW-SANKEY-SOAK-7.3.md`](FLOW-SANKEY-SOAK-7.3.md)
- [`docs/ops/ZIGBEE-RECOVERY.md`](../ops/ZIGBEE-RECOVERY.md)
- [`FOLLOWUPS.md`](../FOLLOWUPS.md) — F-001–F-008, N-016, N-020..023
