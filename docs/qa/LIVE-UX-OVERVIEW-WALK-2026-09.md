# Live UX — Overview desk walk (Pass 3)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md) §4  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-honesty-program.md`](../superpowers/plans/2026-09-01-live-ux-honesty-program.md)  
**Prerequisite:** Climate walk (Pass 2) gate green  
**Prove script:** `.audit/live-ux-overview-prove.ps1` (Task 9)  
**Screenshots:** `docs/qa-screenshots-2026-09-01-live-ux/`

---

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Hotpatch | | |
| G1 KIT HONEST / hub online / canopy-unbound | | |
| G2 Critical banners vs grow-log alerts | | |
| G3 Photoperiod glance vs Light SoT | | |
| G4 Room + DSC-Core journals | | |
| G5 Root strip / fan duties / bands grey | | |
| G6 Pytest (`test_live_ux_overview_honesty`) | | |
| G7 Browser matrix | | |
| G8 Cross-desk photoperiod parity | | |
| G9 Program close | | |

---

## Honesty checklist (§4)

| Check | Result | Notes |
|-------|--------|-------|
| KIT HONEST matches fleet | | |
| Hub online state honest | | |
| Canopy-unbound matches fleet | | |
| Critical banners = live policy (not history theater) | | |
| Grow-log alerts distinct from live critical banners | | |
| No fake urgency on historical alerts | | |
| Photoperiod glance 4×8 matches Light SoT | | |
| Photoperiod glance 2×4 matches Light SoT | | |
| Follow chip on glance when applicable | | |
| Room journal: provenance chips | | |
| Room journal: save/list works | | |
| DSC-Core journal: provenance chips | | |
| DSC-Core journal: save/list works | | |
| Journal rollups coherent (tent → room → Core) | | |
| Root strip grey when no data / OOS | | |
| Fan duties grey when no data / OOS | | |
| Bands grey when no data / OOS | | |

---

## Light UX checklist (§4)

| Check | Result | Notes |
|-------|--------|-------|
| Glance hierarchy: photoperiod → journals → vitals | | |
| Help tips accurate | | |
| Spacing / readability | | |

---

## HTTP checklist

| Endpoint | Result | Notes |
|----------|--------|-------|
| `/health` | | |
| `/rooms` (incl. `grow_room`) | | |
| `/journal/room/grow_room` | | |
| `/journal/core` | | |
| `/fleet/computed` (banners, KIT HONEST) | | |

---

## Browser checklist

| ID | Result | Notes |
|----|--------|-------|
| B1 KIT HONEST banner | | |
| B2 Hub online indicator | | |
| B3 Canopy-unbound state | | |
| B4 Critical banner (live policy) | | |
| B5 Grow-log alert (historical) | | |
| B6 Photoperiod glance 4×8 | | |
| B7 Photoperiod glance 2×4 | | |
| B8 Room journal UI | | |
| B9 DSC-Core journal UI | | |
| B10 Root strip grey/OOS | | |
| B11 Fan duties grey/OOS | | |
| B12 Bands grey/OOS | | |

---

## Cross-desk parity

| Check | Light SoT | Overview glance | Match? |
|-------|-----------|-----------------|--------|
| 4×8 photoperiod | | | |
| 2×4 photoperiod | | | |
| 4×8 Follow chip | | | |
| 2×4 Follow chip | | | |

---

## Restore

| Item | Pre state | Post restore | Notes |
|------|-----------|--------------|-------|
| N/A (Overview is read-mostly) | | | |
