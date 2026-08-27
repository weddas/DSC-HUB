# Light / photoperiod live audit — 7.4

**When:** 2026-08-27 ~22:05 AEST  
**Target:** `http://192.168.86.48:8787/#/live/light`  
**Brain health:** `/health` OK · surface `7.3.0` · bundle `index-IOZwdpgy.js`

## Verdict

**NOT VERIFIED** against 7.4 tent/clock predicate on live Pi — browser served **pre-clock Light page** (subtitle “equal 4×8 / 2×4 cards”, no `TentLightClock`, no scheduled timeline). Source on `master` already has clocks + split cards; **redeploy required** after this pass.

## Observations (live `.48`)

| Area | 4×8 | 2×4 |
|------|-----|-----|
| Status | DARK · window 0.0h on today | SF1000 **ON** during DARK → **2×4 DARK VIOLATION** |
| Got / Want | 0.00 / 12 h | 2.16 / 12 h |
| Window source | N/A (main) | **Independent** |
| Lights-on field | Empty `--:--` (disabled) | Empty `--:--` (disabled) |
| Stage chip | “outside · stage rail” | “outside · stage rail” |
| 24h strip | Duty history only · 0 cycles | Duty history only · 0 cycles |

## Root issues (product, not just UI)

1. **4×8 `time.dsc_hub_lights_on_time` unset/unavailable** → schedule math invalid; clocks/timeline show “No schedule”.
2. **2×4 lamp on during dark** with Manual light hold + Auto photoperiod ON — operator state mismatch; violation sensor correctly fires.
3. **Tents still read as one stage rail** on live chips (“outside stage rail”) because global grow stage / empty main pots dominate fallback — fixed in working tree via per-tent `tentStageRailLabel` + split `CropScheduler`.
4. **DutyStrip ≠ schedule graph** — shows actual binary history only; 7.4 adds `PhotoperiodTimeline` (scheduled lit window + now marker + actual overlay).
5. **Follow vs Independent** — two hub concepts: `select.dsc_hub_clone_photoperiod` (schedule) vs `select.dsc_hub_clone_mode` (climate). UI must keep them visually distinct (partially done in `TentTargets` + Light follow banner).

## Predicate (7.4 Phase D — tents first)

Done when on live Pi after deploy:

- [ ] Each tent card shows **count-up / count-down clocks** (`TentLightClock`)
- [ ] Each tent shows **scheduled 24h on/off strip** (`PhotoperiodTimeline`) with amber now marker
- [ ] **Actual** duty strip labeled separately under schedule
- [ ] Crop scheduler **split columns** — stage track per tent, pots filtered by tent
- [ ] 4×8 and 2×4 stage chips name **that tent’s** plants/stage, not a merged rail
- [ ] Hard refresh shows new bundle hash (not `index-IOZwdpgy.js` only)

## Next deploy

```powershell
services/dsc-hub/pi/studio-deploy.ps1
```

Then re-run this checklist on `#/live/light`, `#/live/overview`, `#/live/4x8`, `#/live/2x4`.
