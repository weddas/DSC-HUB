---
name: dsc-space-photoperiod-journal
description: >-
  DSC-HUB space-owned photoperiod, local energy estimates/Learning, approval-only
  schedule slides/flips, and plant→tent journal hierarchy. Use when editing Light
  energy, journals, spaces/devices, tariff, schedule_shift, photoperiod conflict,
  or when tempted to put lighting controls on a plant card.
---

# DSC space photoperiod + journals

Complements personal `cannabis-domain` (observation ≠ diagnosis; contested herm science labeled contested). Pi brain is SoT.

**Spec:** `docs/superpowers/specs/2026-09-01-space-energy-journal-design.md`

## Ownership

| Layer | Owns |
|-------|------|
| **Space** (`4x8` / `2x4`, extensible) | Photoperiod window + want hours, fixtures/fans watts, space journal, energy devices |
| **Plant** | Identity, stage story, plant journal, probe/space assignment |
| **Room** | Optional parent journal + rollup — not per-tent lights unless explicit |

Kit live grow stays two tents; model may grow.

## Hard gates (never violate)

1. **No silent lighting mutate** — shift plans require `confirm=true`; “Set lights-on now” is a separate confirm.
2. **No auto-apply Learning** — planning signal + re-rank only; `apply: false` always.
3. **No auto-flip** — photoperiod ratio change → pending banner; approve/deny does not itself write lights-on.
4. **No auto-move** — conflict may `suggest_move`; operator moves the plant.
5. **One plant cannot override tent mates** — conflict banner; tent-scoped photoperiod.
6. **No lighting controls on plant card** — plant UI = mini journal only.
7. **Clock honesty** — lights-on is HH:MM[:SS]; date-shaped datetime helpers ≠ schedule.
8. **Estimates labeled** — local watts × hours × tariff; not a utility bill. Learning = duty-hour proxies.

## Journal hierarchy

```text
Plant journal  →  follows plant_id for life (source: operator | system)
       ↓ (while occupying)
Space journal  →  space-native + read-time rollup of occupant plant rows
       ↓
Room journal   →  same pattern when used
```

- Collate at **read time**; provenance chips (`plant` | `space`). Never squash plant notes into one tent blob.
- System rows: dark violations, flip lifecycle, ramp start/step/cancel/complete, moves.
- Operator notes are **observations**, not diagnoses. Do not infer herm from keywords alone; contested science labeled contested.

## Ramp policies (operator picks A/B/C)

| Policy | Step | Notes |
|--------|------|-------|
| `pause` | 0 | Plan recorded; no steps |
| `flower_strict` | ≤15 min/day | Ratio-fixed slide; want_hours held (dark floor) |
| `veg_style` | ≤30 min/day | Faster slide; higher disruption if flowering |

Tick via computed path with `set_lights_on` → hub time helpers (`time.dsc_hub_lights_on_time` / `clone_…`). Cancel anytime → system journal.

## Learning

- Prefer growth over $ for short outliers (default 1–2 days).
- Sticky underperformance vs baseline → `planning_signal: true` + demote suggestion; never mutate schedule.
- Settings: enable, prefer_growth_outliers, outlier_days, norm_days.

## Code map

| Concern | Module / surface |
|---------|------------------|
| Spaces/devices | `brain/dsc_brain/space_model.py` |
| Journals | `plant_journal.py`, `space_journal.py`, `space_occupants.py` |
| Energy | `energy_model.py`, `energy_learning.py` |
| Shift/flip | `schedule_shift.py` |
| Conflict/dark | `photoperiod_conflict.py`; dark hook in `dash_computed.py` |
| HTTP | `/journal/*`, `/spaces`, `/energy/*` in `api.py` |
| SPA | `components/journal/*`, `components/energy/LightEnergyPanel.tsx`, Settings Brain `SpaceEnergySettingsCard` |
| Client | `fleetApi.ts` journal/energy helpers |

## Agent checklist

When changing this area:

- [ ] Schedule mutate path requires explicit confirm (or refuse)
- [ ] Suggestions/Learning payloads keep `apply: false`
- [ ] Plant surfaces have no lights-on / hours controls
- [ ] Journal copy stays observation-language
- [ ] New system events write plant and/or space journal with `source=system`
- [ ] Tests cover confirm-gate + no-auto-apply (see `brain/tests/test_*energy*`, `test_schedule_shift`, `test_journal_api`)

Commit / Pi hotpatch only when the operator asks.
