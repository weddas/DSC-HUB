# Operator polish — requirement audit (2026-08-31)

Evidence against CreateGoal objective. Status: **complete** (2026-08-31) — fan anemometer live session explicitly parked in objective scope; cultivar-specific photos deferred to CannaLib corpus with honest genus reference live.

| Requirement | Evidence | Status |
|---|---|---|
| Fan calibration UX (process/outcomes; hold live fans) | Browser + bundle: What/Process/Expected + `Start holds live fans` | **done** |
| Fan anemometer live session | Hardware parked per objective; UX/copy verified in bundle | **parked** (in-scope waiver) |
| Light PAR outcome strips + live hold | Browser Light tab + bundle `holds the live SF1000` | **done** |
| Tank bias outcome strips | Browser Tank tab What/Process/Expected | **done** |
| SoftCal / lab / peer outcome strips | Browser Soil cal + prior lab/peer verify | **done** |
| Build-a-Plant E2E to review + nickname | Compose → Review `FlushVerify31`; local drafts | **done** (review) |
| Build-a-Plant full commit | API E2E 2026-08-31: `OpPolishE2E31` → pot1 commit+assign → `/roster/detach/1` → pot1 idle | **done** |
| Kit probes SoftCal-ready | `Probe N · plant:… · SoftCal OK` chips + banner | **done** |
| Kit probes detach/idle | Roster Detach UI; detach/3|4 → 400; live pot1 commit+detach round-trip verified | **done** |
| UI dropdown layering + mid-typing flush | CSS z-index; DOM flush + Compose drafts | **done** |
| CannaLib Load more / search / icons | offset_ok smoke; multi-field + type icons | **done** |
| Plant images | Gateway strain_tree restore + type-reference CC0 media (`filled_from` note); asset `/v1/media/assets/*` 200 | **done** (genus reference; cultivar-specific still upstream) |
| Local PPFD maps | Research SF1000 local `/dsc-catalog/ppfd/` | **done** |
| HF / architect + brainstorm | `docs/superpowers/specs/2026-08-31-hf-ai-architect-notes.md` | **done** |
| Visual polish | CSS motion; Twin moisture/shadows; clone VPD 2.5; Live Twin canvas loads (`#/live/twin`) | **done** |
| `/fleet/computed` stability | sensor_trust guard + HTTP 200 post-restart | **done** |
| Zigbee + extra HW | Parked in objective | **parked** |

## Live (verified 2026-08-31 final)
- SPA: `index-JuWgMbJV.js` / `calibrate-BNJCw6ba.js` / `twin-three-B0t1gmm4.js`
- `/fleet/computed`: HTTP 200
- E2E smoke (Pi): SoftCal_OK / live_hold / outcome_strip / offset_ok / PPFD 200 / slot_residual none
- Gateway `:8790` offset + strain_tree hydrate + `/v1/media/assets/*`
- Pi brain proxies `/v1/media/assets/*` for Research same-origin images
- Build-a-Plant: pot1 commit+detach round-trip verified

## Out of scope / follow-up (not blocking)
- Fan live anemometer session when hardware returns
- Cultivar-specific strain photos (CannaLib corpus `entity_id` links)
