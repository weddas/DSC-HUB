# Multi-model review — DSC polish pass

**Lineage:** NAS polish on `origin/master` through `c1eaedd`, plus wave-2 honesty/nav cherry-pick (HubLink Age, ZoneFocus, Honesty overflow, CFM, tips, deslop).  
**Live help:** 1.2.2 verified earlier; PD 1.2.3 on WordPress-PD `1064b0d` — **live publish/verify pending** (public tunnel intermittent 502/530).  
**Reviewers:** grok + composer (prior Act-on); wave-2 fix-first after SlideDrawer inert regression.

## Verdict

**SHIP-WITH-NOTES** for SPA polish after wave-2 fix-first (SlideDrawer `.dsc-shell` inert reverted — drawer is inside the shell).  
**Full `/goal` still not complete** — live PD help 1.2.3 unverified; hardware/Phase0 deferred.

## Consensus — Act-on (closed)

| Finding | Resolution |
|---------|------------|
| Beat chip formatted fleet `heartbeat` (tick) with `fmtUptimeSeconds` → lied as duration | **Fixed:** `HS` handshake duration; `HB #` tick count |
| Age Up while offline / Down while online residual | **Fixed:** Age gated on `online` |
| `useHeldReading` / `useHass` effect lag | **Fixed:** clear/sync during render |
| Overview HelpTips wrong placement | **Fixed:** beside climate bands |
| Nested Escape / HelpTip remount | **Fixed:** opaque `modalLayer` symbols |
| Honesty `+N` only opened gap #7 | **Fixed:** overflow list |
| ZoneFocus wipe on bare Climate | **Fixed:** sync only when `tent`/`zone` present |
| Demoted Mission honesty CTAs | **Fixed:** Fleet / Overview |
| TentTargets stale Got as dash | **Fixed:** held values + `· held` |
| CFM nameplate invisible to Honesty | **Fixed:** `resolveCfm` kind gap → Learning |
| SlideDrawer shell inert | **Reverted** — would lock drawer inside `.dsc-shell` |

## Evidence gate (goal)

| Gate | Status |
|------|--------|
| FOLLOWUPS addressed or re-triaged | Polish triage merged; hardware/Phase0 deferred |
| Live help verified | 1.2.2 yes; **1.2.3 not live-verified** |
| React health on touched SPA | Smoke ok; Doctor ~38–41 full-tree baseline; intentional render-time refs |
| Multi-model review recorded | This file |
| Full objective | **Not complete** |

## Next coherent slices (keep goal open)

1. Publish + browser-verify PD help 1.2.3 when WP/tunnel is up.
2. Focused React Doctor on remaining `src/` criticals (exclude spa-dist / intentional refs).
3. Soft-cal Got history, Phase 0 z2m/Sankey, F-001–F-008: stay deferred — do not fake.
