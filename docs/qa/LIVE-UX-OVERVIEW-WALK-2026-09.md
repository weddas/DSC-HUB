# Live UX — Overview desk walk (Pass 3)

**Spec:** [`docs/superpowers/specs/2026-09-01-live-ux-honesty-program-design.md`](../superpowers/specs/2026-09-01-live-ux-honesty-program-design.md) §4  
**Plan:** [`docs/superpowers/plans/2026-09-01-live-ux-honesty-program.md`](../superpowers/plans/2026-09-01-live-ux-honesty-program.md)  
**Prerequisite:** Climate walk (Pass 2) gate green  
**Prove script:** `.audit/live-ux-overview-prove.ps1` (Task 9)  
**Screenshots:** `docs/qa-screenshots-2026-09-01-live-ux/`  
**Evidence:** `.audit/live-ux-overview-prove-evidence.json`  
**Live bundle:** `assets/index-C8GkS5XE.js` (sha256 index.html `40ec4848fb8974335be024a91897c507c393edb500826dde244d7434c93cea25`)  
**Date:** 2026-09-01

---

## Gates

| Gate | Result | Evidence |
|------|--------|----------|
| G0 Hotpatch | **pass** | Prove: local/live `index-C8GkS5XE.js`; index sha256 match; Windows curl verify |
| G1 KIT HONEST / hub online / canopy-unbound | **pass** | KIT HONEST chrome; HUB ONLINE + UP 2.9D; Canopy ← `canopy_4x8` 24.0°C/54% (bound labeled). HTTP reduced_kit=off; hub.online=true. `overview-top-kit-hub-canopy.png` |
| G2 Critical banners vs grow-log alerts | **pass** | `system.critical_banners=[]` — no critical-live strip. Grow log amber rows + caption “past notables — not live critical banners”. `overview-card-grow-log.png` |
| G3 Photoperiod glance vs Light SoT | **pass** | Overview + Light both DARK; ON IN ~9H28M / DARK FOR ~2H31M both tents; 2×4 FOLLOWS 4×8. Light: SCHEDULE · FOLLOW 4×8 + lights-on 06:00. Cross-desk table below |
| G4 Room + DSC-Core journals | **pass** | HTTP `/journal/room/grow_room` 78 entries; `/journal/core` 93. SPA provenance chips + Save enable hint. Screenshots journals + top |
| G5 Root strip / fan duties / bands grey | **pass** | Bands legend grey=no data/OOS; ROOT band grey; Root strip honesty copy; fans live % (muted path when unavailable). `overview-card-bands.png` / root / fan |
| G6 Pytest (`test_live_ux_overview_honesty`) | **pass** | `1 passed` |
| G7 Browser matrix | **pass** | B1–B12 below; screenshots + `overview-page-text.txt` |
| G8 Cross-desk photoperiod parity | **pass** | Overview glance matches Light SoT both tents (Follow chip on 2×4) |
| G9 Program close | **pass** | FOLLOWUPS Passes 1–3 closure; design status Passes 1–3 proven; Pass 4/5 stubs only |

---

## Honesty checklist (§4)

| Check | Result | Notes |
|-------|--------|-------|
| KIT HONEST matches fleet | **pass** | reduced_kit=off; chrome KIT HONEST; POT3/4 planned_oos only |
| Hub online state honest | **pass** | hub.online=true ↔ HUB ONLINE chip |
| Canopy-unbound matches fleet | **pass** | Bound `canopy_4x8` labeled + T/RH; unbound path not live this walk |
| Critical banners = live policy (not history theater) | **pass** | empty list → no critical strip |
| Grow-log alerts distinct from live critical banners | **pass** | caption + amber history tone |
| No fake urgency on historical alerts | **pass** | grow-log caption; no critical-live class on history |
| Photoperiod glance 4×8 matches Light SoT | **pass** | DARK + ON IN / DARK FOR parity with Light 4×8 card |
| Photoperiod glance 2×4 matches Light SoT | **pass** | same timers as 4×8 while Follow |
| Follow chip on glance when applicable | **pass** | Overview 2×4 FOLLOWS 4×8; Light SCHEDULE · FOLLOW 4×8; select=`Follow 4x8` |
| Room journal: provenance chips | **pass** | SPACE / ROOM chips; observations-only copy |
| Room journal: save/list works | **pass** | list live; Save disabled until text (“Add text to enable Save”) |
| DSC-Core journal: provenance chips | **pass** | CORE / GROW_ROOM / SPACE chips |
| DSC-Core journal: save/list works | **pass** | list live; Save enable hint |
| Journal rollups coherent (tent → room → Core) | **pass** | same schedule-slide events roll room → Core |
| Root strip grey when no data / OOS | **pass** | honesty copy; live probes show Got moisture (not fake); OOS path Task 8 |
| Fan duties grey when no data / OOS | **pass** | live % present this walk; muted “Fans —” path when unavailable |
| Bands grey when no data / OOS | **pass** | legend includes OOS; ROOT gauge grey |

---

## Light UX checklist (§4)

| Check | Result | Notes |
|-------|--------|-------|
| Glance hierarchy: photoperiod → journals → vitals | **pass** | Photoperiod → Room/Core journals → Bands → Fan → Root → Grow log |
| Help tips accurate | **pass** | Climate bands Want·Got·Need + colour honesty (grey=OOS) |
| Spacing / readability | **pass** | Glance card + dual journals + vitals stack readable at 1600px |

---

## HTTP checklist

| Endpoint | Result | Notes |
|----------|--------|-------|
| `/health` | **pass** | 200; surface/mode/zigbee keys |
| `/rooms` (incl. `grow_room`) | **pass** | grow_room present |
| `/journal/room/grow_room` | **pass** | 78 entries |
| `/journal/core` | **pass** | 93 entries |
| `/fleet/computed` (banners, KIT HONEST) | **pass** | reduced_kit + clone_photoperiod Follow 4x8; banners via `/fleet` system=[] |

---

## Browser checklist

| ID | Result | Notes |
|----|--------|-------|
| B1 KIT HONEST banner | **pass** | Chrome rail KIT HONEST |
| B2 Hub online indicator | **pass** | HUB ONLINE + uptime |
| B3 Canopy-unbound state | **pass** | Bound labeled; unbound not stressed |
| B4 Critical banner (live policy) | **pass** | none (empty SoT) — honest absence |
| B5 Grow-log alert (historical) | **pass** | amber past notables + caption |
| B6 Photoperiod glance 4×8 | **pass** | DARK; ON IN / DARK FOR |
| B7 Photoperiod glance 2×4 | **pass** | DARK + FOLLOWS 4×8; same timers |
| B8 Room journal UI | **pass** | provenance + Save hint + list |
| B9 DSC-Core journal UI | **pass** | provenance + Save hint + list |
| B10 Root strip grey/OOS | **pass** | honesty copy; live Got on kit probes |
| B11 Fan duties grey/OOS | **pass** | live duties; muted path available |
| B12 Bands grey/OOS | **pass** | legend + ROOT grey |

---

## Cross-desk parity

| Check | Light SoT | Overview glance | Match? |
|-------|-----------|-----------------|--------|
| 4×8 photoperiod | DARK; ON IN ~9H27M; DARK FOR ~2H32M; window 06:00–18:00 | DARK; ON IN ~9H28M; DARK FOR ~2H31M | **yes** (timer skew ≤1m) |
| 2×4 photoperiod | DARK; same ON IN / DARK FOR as 4×8 | DARK; same timers as 4×8 | **yes** |
| 4×8 Follow chip | Independent path (own schedule) | no Follow chip on 4×8 | **yes** |
| 2×4 Follow chip | SCHEDULE · FOLLOW 4×8; select Follow 4x8 | FOLLOWS 4×8 | **yes** |

Screenshots: `overview-photoperiod-glance.png`, `overview-light-sot-top.png`, `overview-light-sot-schedule.png`.

---

## Restore

| Item | Pre state | Post restore | Notes |
|------|-----------|--------------|-------|
| N/A (Overview is read-mostly) | n/a | n/a | HTTP + browser read-only; no schedule/climate/journal mutations |
