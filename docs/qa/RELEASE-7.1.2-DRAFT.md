# DSC-HUB v7.1.2 — changelog / release draft

**Status:** uncommitted draft for 7.1.2 signoff. Do not treat as shipped.
**Date:** 2026-08-27
**Coordinator:** 7.1.2 closure pass (parallel with Pot3/walkthrough + Design/UX pass 2)

Copy into [`CHANGELOG.md`](../../CHANGELOG.md) (Unreleased → **v7.1.2**) and
[`RELEASE.md`](../../RELEASE.md) (new Pi appliance section) at signoff. Sibling
workers fill the [SIBLING] blanks; do not invent those results here.

---

## CHANGELOG — Pi appliance **v7.1.2** (2026-08-27)

- **Interface remediation** — design tokens declared on `:root, :host, .dsc-root` so the standalone Pi SPA resolves `var(--dsc-*)` (was scoped to `:host, .dsc-root` only; HA panel mount was fine, island SPA rendered unstyled). SPA tree wrapped in `.dsc-root`. User-visible HA jargon purged across Compose / Fleet / Learning / Climate / Settings copy. Bridge / firmware card removed from Fleet (bridge retired; firmware truth lives on Settings device cards). Native control skins (range, select, checkbox, text/number) + `focus-visible` ring. Button hierarchy via `Button` `variant` (primary / secondary / danger) on Compose, Learning, Calibrate, Settings.
- **Pi AP 8-station cap (brcmfmac)** — Pi 4 B onboard AP was hard-capped at 8 associated stations (`cyfmac43455-sdio-standard.bin`); fleet needs 10. Pi-side: `cyfmac43455-sdio-minimal.bin` + `hostapd` `max_num_sta=32` + Digital-Matter MAC deny (`34:6f:24:da:41:77`). 10/10 stations stable post-fix. Details in FOLLOWUPS 2026-08-27.
- **Appliance driver alias** — `_read_hub_demands` reports only object_ids actually discovered on the hub. Leftover `growmat_demand` alias no longer defaults `False` and overwrites live `grow_mat_demand` ON (heatmat chatter ~10 s). Workspace source: `brain/dsc_brain/appliance_driver.py`. Unit test: `test_appliance_undiscovered_aliases_not_emitted`. Live on Pi since 16:57Z 2026-08-26; still **not git-committed** at draft time.
- **Acceptance #1 PASS** (Manual Takeover, auto restored) — heater ON 15:32:12Z / cleared by 15:33:08Z; humidifier ON 15:40:27Z / cleared by 15:41:51Z; heatmat ON 16:57:42Z → relay 16:58:08Z / OFF 16:58:32Z → cleared 16:58:57Z; dehumidifier proven 13:26Z (HA-off soak).
- **Island gates** — `verify-brain.ps1` + `island-proof.ps1` green with full AP fleet, **4/4 Sonoffs** at `7.0.0.0`.
- **[SIBLING A] Tent selector** — _blank — Pot3 & Walkthrough Verifier fills._
- **[SIBLING A] Sprout-date auto-stage** — _blank — Pot3 & Walkthrough Verifier fills._
- **[SIBLING A] pot3 Add-as-Plant / ComposePlant** — _blank — Pot3 & Walkthrough Verifier fills (acceptance #5 + #13 + interactive walkthrough)._
- **[SIBLING B] UX pass 2** — _blank — Design & UX Pass 2 fills (gauges / tiles / color semantics / empty states / sparkline colors)._

---

## RELEASE — Pi appliance **v7.1.2** (interface + island closeout)

| | |
|---|---|
| **Brain / SPA** | **7.1.0** brain · surface **7.1.0** _(bump at signoff if surface version changes)_ |
| **Expected firmware** | **7.0.0.0** |
| **Primary UI** | Pi SPA at `http://10.42.0.1:8787` — **Overview** default landing |
| **Git tag** | `v7.1.2` _(do not tag until siblings land + commit)_ |
| **Deploy** | [`services/dsc-hub/pi/deploy-brain.ps1`](../../services/dsc-hub/pi/deploy-brain.ps1) — **not run this coordinator pass** |
| **Acceptance** | [`docs/qa/LIVE-ACCEPTANCE-7.1.md`](LIVE-ACCEPTANCE-7.1.md) |
| **Soak** | [`docs/ops/SOAK-2026-08-26.md`](../ops/SOAK-2026-08-26.md) |
| **Design** | [`docs/qa/DESIGN-AUDIT-7.1.md`](DESIGN-AUDIT-7.1.md) + sibling-B UX pass 2 |

Themed island SPA (token `:root` / `.dsc-root`), HA jargon purged, Bridge card gone, control skins + button hierarchy. Pi AP holds the full 10-station fleet (minimal brcmfmac + hostapd cap + MAC deny). Appliance driver no longer chatters heatmat on the leftover `growmat_demand` alias. Acceptance #1 demand→relay proven on all four Sonoff seats; verify-brain + island-proof green with 4/4 Sonoffs.

**[SIBLING A]** tent selector / sprout-date auto-stage / pot3 Add-as-Plant — _blank._
**[SIBLING B]** gauges / tiles / color semantics / empty states / sparkline colors — _blank._

---

## Coordinator notes (not for CHANGELOG)

- Workspace `appliance_driver.py` **does** contain the discovered-only-oids fix (confirmed 2026-08-27). No overwrite. Helper `_demands_from_discovered` extracted so the unit test hits the real contract.
- Pi already runs the fix (container recreate 16:57Z 2026-08-26). This pass does **not** deploy-brain, restart the AP, flash, or write grow state.
- FOLLOWUPS section retitled: source is in the tree; still needs a signoff commit.
- `LIVE-ACCEPTANCE-7.1.md` / `SOAK-2026-08-26.md` still say “uncommitted” as 7.1.1-era history — leave them; they were true at that signoff.
