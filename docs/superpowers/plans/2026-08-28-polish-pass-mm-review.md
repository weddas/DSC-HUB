# Multi-model review — DSC polish pass

**Diff package:** `docs/superpowers/plans/2026-08-28-polish-pass-review.diff`  
**Commits reviewed:** `39d7f88`..`8208461`  
**Act-on follow-up:** working tree after mm-review fixes (HubLinkLine / useHass / useHeldReading / Overview HelpTips / HelpTip Escape)  
**Live help:** verified `data-ver=1.2.2` on hub + dashboard (Want/Got/Need + Full Auto tips present)  
**Reviewers:** grok + composer (gpt usage-capped that run)

## Verdict

**Act-on items from the first pass are fixed in tree.** Do not claim the larger polish `/goal` complete — hardware/Phase 0 remain deferred, React Doctor full-tree baseline is still weak, and more SPA/PD QoL remains.

## Consensus — Act-on (was critical / important)

| Finding | Resolution |
|---------|------------|
| Beat chip formatted fleet `heartbeat` (tick) with `fmtUptimeSeconds` → lied as duration | **Fixed:** handshake age → duration; heartbeat → integer count only |
| Age used `api_down_age` via `fmtUptimeSeconds(≤0)` → `"—"` while tip said healthy uptime | **Fixed:** positive down-age → `Down …`; else `Up …` from uptime; `0` → `0S` |
| `useHeldReading` cleared hold in effect → prior pot leak one frame+ | **Fixed:** clear during render on `entityId` change |
| `useHass` synced `hassRef` in effect → children one update behind | **Fixed:** `hassRef.current = hass` during render |
| Overview HelpTips next to hub strip (wrong job) | **Fixed:** tips sit above `DashBandsGrid` under “Climate bands” |
| Absolute HelpTip popover fragile (clip / no Escape) | **Hardened:** open z-index, max-height scroll, last-in-row opens left, Escape closes |

## Consider / noted (not blocking this Act-on)

- Dual duration helpers still exist; consolidate later if touch surface grows.
- PD `?` tips live in WordPress-PD (1.2.2) — outside the SPA diff package; FOLLOWUPS already marks them done.
- React Doctor ~38/100 is a full-tree baseline, not a regression from this pass; keep hook/honesty fixes first.
- Soft-cal Got history, Phase 0 z2m/Sankey soak, F-001–F-008 hardware: **deferred** — do not fake.

## Evidence gate (goal)

| Gate | Status |
|------|--------|
| FOLLOWUPS addressed or re-triaged | Partial — polish triage updated through Fleet/Learning/Research tips + ZoneFocus; hardware/Phase0 deferred |
| Live help verified | Hub Want/Got + Colour tips; Dashboard Full Auto + Tabs tips present (browser 2026-08-28) |
| React health on touched SPA | Act-on regressions closed; LungLoop deslop; ZoneFocus URL ownership; Doctor ~40 full-tree (spa-dist noise) |
| Multi-model review recorded | This file + Act-on closed |
| Full objective (spectacular UX pass, all gaps) | **Not complete** — continue goal |

## Next coherent slices (keep goal open)

1. ~~More SPA desks with `?` tips~~ — Climate / Light / SoftCal / Root / Settings / Compose / Roster / Fleet / Learning / Research done.
2. ~~Tent cockpit `?tent=` sticky nav~~ + ZoneFocus URL ownership fixed.
3. Calibrate desks / Analytics / Mission (demoted) tips if operators still land there.
4. Focused React Doctor on remaining src/ criticals excluding intentional render-time refs; exclude spa-dist.
5. Re-run adversarial multi-model review after the next non-tip UX slice.
