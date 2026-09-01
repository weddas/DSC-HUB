# AUDIT-CLOSURE — 7.4.0 (2026-09-01)

**Prior:** [`AUDIT-CLOSURE-7.3.md`](AUDIT-CLOSURE-7.3.md) · [`AUDIT-CLOSURE-2026-09-D-C-A-B.md`](AUDIT-CLOSURE-2026-09-D-C-A-B.md)  
**Plan:** [`PLAN-7.4.md`](PLAN-7.4.md) · **Phase 0 walk:** [`PHASE0-WALK-2026-09.md`](PHASE0-WALK-2026-09.md)  
**Git:** post-`f029702` surface bump · **SPA:** rebuild after version bump

---

## Verdict

**PASS for software / Phase 0** — version surface **7.4.0**. Git tag `v7.4.0` awaits operator signoff on this doc.

---

## Phase 0

| Gate | Status | Evidence |
|------|--------|----------|
| z2m radio | closed | `radio_up: true`, 4 end devices |
| Live walk | pass | [`PHASE0-WALK-2026-09.md`](PHASE0-WALK-2026-09.md) |
| FlowSankey soak | closed | [`FLOW-SANKEY-SOAK-7.3.md`](FLOW-SANKEY-SOAK-7.3.md) — air CFM only; mass chip gated |

## Phase A (hardware)

| Item | Status |
|------|--------|
| F-003 / POT3–4 | **retired** from kit |
| F-001 / F-002 | **on hold** indefinitely |
| F-008 / GPIO lamp | still deferred (honest OOS) |

## Phase B — FlowSankey

- No EXPERIMENTAL label in SPA (`Air CFM` chip)
- Heat/humidity estimated splits removed
- `massBalanceOk={null}` — no false imbalance theater

## Phase C — Zigbee

- Radio green; `leak_floor_4x8` recipe verified (MP-040)
- Settings live Wet/Dry + Problem chips

## Phase D (partial)

- Post-mega quality splits: Settings / PlantWizard / roster dialogs
- R3F climate/twin honesty from mega pass
- Remaining D1–D3 polish candidates stay in FOLLOWUPS / PLAN-7.4

## Version bump checklist

- [x] `brain/dsc_brain/__version__` / `SURFACE_VERSION` default → `7.4.0`
- [x] Hub `const.SURFACE_VERSION` + SPA defaults → `7.4.0`
- [x] Brain pytest version assertions updated
- [x] Pi `.env` `DSC_SURFACE_VERSION=7.4.0` + brain/SPA hotpatch (operator deploy)
- [ ] Git tag `v7.4.0` after operator OK

## Live Pi (2026-09-01 post-hotpatch)

| Check | Result |
|-------|--------|
| `/health` version | `7.4.0` |
| `/health` surface | `7.4.0` |
| SPA | `assets/index-K2_ziUnM.js` |
| z2m | `radio_up: true` |

## Tests

- Brain pytest: **161/161** green after bump
- `npm run build:spa` green → `index-K2_ziUnM.js`
