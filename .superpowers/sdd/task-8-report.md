# Task 8 Report: Pass 3 — Overview SPA honesty + light UX

**Status:** complete  
**Branch:** master  
**Date:** 2026-09-01

## Summary

Inventoried live `#/live/overview` against `/fleet` + `/fleet/computed` + room/core journals (Pi `192.168.86.48:8787`) and design §4. Fixed Overview honesty/UX gaps in journals, root-strip OOS greying, grow-log vs live-banner distinction, and photoperiod glance copy. Rebuilt SPA → `index-C8GkS5XE.js`. Overview walk left empty for Task 9. Did not push.

## Inventory (live Pi)

| Check | Fleet / API | SPA before | Verdict |
|-------|-------------|------------|---------|
| KIT HONEST | `reduced_kit` **off**; HonestyRail empty → "Kit honest" | App chrome rail (not Overview body) | match (none-found on OverviewPage) |
| Hub online | `/fleet` hub.online **true**; uptime present | HUB ONLINE chip | match |
| Canopy | fleet.canopy `canopy_4x8` 24°C / 54% RH | Canopy ← role chip | match |
| Critical banners | `system.critical_banners` **[]** | no critical-live strip | match |
| Grow log vs live | grow-log history events; dark_viol **off** | amber history rows could read as live urgency | **fixed** — history caption |
| Photoperiod 4×8 / 2×4 | lights-on SoT; clone photoperiod **Follow 4x8** | TentLightClockStrip + Follows 4×8 | match; **UX** glance SoT sentence |
| Room / Core journals | `/journal/room/grow_room` + `/journal/core` reachable; provenance mix room/space/core | all-room `ok` / all-core `warn`; no Save hint | **fixed** |
| Root strip grey | kit probes 1–2; moisture Got absent; inventory in_service true | NaN → grey, but no OOS gate | **fixed** — OOS forces No data |
| Fan duties grey | fan pct sensors live | muted when unavailable | match (none-found) |
| Bands grey copy | HelpTip already OOS-aware | bands subtitle said “no data” only | **fixed** |
| Glance hierarchy | design: photoperiod → journals → vitals | already ordered that way | match |
| Mission Triage | out of scope | untouched | n/a |

## Gaps fixed

1. **Room / Core journal provenance** — Native vs rollup tones; space/room/plant id chips; Save enable hint; empty state (parity with tent occupancy journal).
2. **Root strip OOS honesty** — `DashRootTankSection` uses `isPotInServiceWithFleet`; OOS probes paint muted chips + grey “No data” gauges (never leftover Got).
3. **Grow log vs critical banners** — Grow log caption states amber rows are past notables, not live policy strips.
4. **Photoperiod glance UX** — Card copy: glance-only, same SoT as Light including Follow.
5. **Bands legend** — Subtitle includes “out of service” to match HelpTip.

## None-found (evidence)

- KIT HONEST / hub online / canopy already matched fleet SoT on Overview status strip + App HonestyRail.
- Critical banners empty when `critical_banners=[]`; fault banner only when live alert binaries on.
- Fan chips already muted when pct entity unavailable.
- Photoperiod Follow chip already on `TentLightClock` when `select.dsc_hub_clone_photoperiod` = Follow 4x8.
- Glance hierarchy already photoperiod → journals → bands.

## Files changed

| Path | Change |
|------|--------|
| `.../src/pages/OverviewPage.tsx` | photoperiod glance SoT sentence |
| `.../src/components/journal/RoomJournal.tsx` | provenance / Save UX |
| `.../src/components/journal/CoreJournal.tsx` | provenance / Save UX |
| `.../src/components/DashHomeSections.tsx` | root OOS grey; grow-log caption; bands legend |
| `.../spa-dist/*` | `build:spa` → `index-C8GkS5XE.js` |
| `docs/FOLLOWUPS.md` | Pass 3 SPA row |
| `.superpowers/sdd/task-8-report.md` | this report |
| `.superpowers/sdd/progress.md` | Task 8 complete |

## Build

```powershell
cd homeassistant\custom_components\dsc_hub\frontend
npm.cmd run build:spa
```

Exit 0 → `spa-dist/assets/index-C8GkS5XE.js`.

## Commit

_(filled after commit)_

## Concerns / parks

- **Live SPA not hotpatched** — repo `spa-dist` only; Pi still serves prior Climate-era bundle until Task 9 prove.
- **Browser MCP** — Cursor browser tab did not mount reliably; inventory used HTTP fleet/computed/journals. Task 9 browser matrix still required.
- **Walk doc** — intentionally not filled (Task 9).
- **Moisture band 30–70 vs Root Want** — still parked (FOLLOWUPS GAUGE-P0-1); not this brief’s honesty gap for OOS/no-data greying.
- **`switch.dsc_hub_pot*_in_service` off while inventory pot1/2 in_service** — dual SoT; Overview now prefers fleet inventory (same as Root/honesty).

## Out of scope (not done)

- Push to remote
- Overview walk fill / Pi hotpatch / program close (Task 9)
- Mission Triage rewrite
