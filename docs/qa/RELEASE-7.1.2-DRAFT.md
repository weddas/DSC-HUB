# DSC-HUB v7.1.2 — changelog / release draft

**Status:** code merged on tip `ab49dd8` (2026-08-26 push). Copy into
[`CHANGELOG.md`](../../CHANGELOG.md) / [`RELEASE.md`](../../RELEASE.md) at tag
signoff. Sibling blanks filled from live acceptance + design audit.
**Date:** 2026-08-27
**Coordinator:** 7.1.2 closure pass (Pot3/walkthrough + Design/UX pass 2 landed)

---

## CHANGELOG — Pi appliance **v7.1.2** (2026-08-27)

- **Interface remediation** — design tokens declared on `:root, :host, .dsc-root` so the standalone Pi SPA resolves `var(--dsc-*)` (was scoped to `:host, .dsc-root` only; HA panel mount was fine, island SPA rendered unstyled). SPA tree wrapped in `.dsc-root`. User-visible HA jargon purged across Compose / Fleet / Learning / Climate / Settings copy. Bridge / firmware card removed from Fleet (bridge retired; firmware truth lives on Settings device cards). Native control skins (range, select, checkbox, text/number) + `focus-visible` ring. Button hierarchy via `Button` `variant` (primary / secondary / danger) on Compose, Learning, Calibrate, Settings.
- **Pi AP 8-station cap (brcmfmac)** — Pi 4 B onboard AP was hard-capped at 8 associated stations (`cyfmac43455-sdio-standard.bin`); fleet needs 10. Pi-side: `cyfmac43455-sdio-minimal.bin` + `hostapd` `max_num_sta=32` + Digital-Matter MAC deny (`34:6f:24:da:41:77`). 10/10 stations stable post-fix. Details in FOLLOWUPS 2026-08-27.
- **Appliance driver alias** — `_read_hub_demands` / `_demands_from_discovered` report only object_ids discovered on the hub. Leftover `growmat_demand` no longer defaults `False` over live `grow_mat_demand` ON (heatmat chatter ~10 s). Module: `brain/dsc_brain/appliance_driver.py`. Unit test: `test_appliance_undiscovered_aliases_not_emitted`. Merged tip `67e08c5` / `ab49dd8`.
- **Acceptance #1 PASS** (Manual Takeover, auto restored) — heater / humidifier / heatmat / dehumidifier demand→relay proven (see soak + LIVE-ACCEPTANCE).
- **Island gates** — `verify-brain.ps1` + `island-proof.ps1` green with full AP fleet, **4/4 Sonoffs** at `7.0.0.0`.
- **Tent selector** — Compose `input_select.dsc_build_tent` (`4x8`/`2x4`); recipe stores internal `main`/`clone` via `stage_model.tent_id`.
- **Sprout-date auto-stage** — `compose_ops.derived_stage_for` + `stage_model.expected_stage`; UI Auto stage chip; clone_mode from stage family when takeover off.
- **pot3 Add-as-Plant** — Acceptance #5 PASS on `192.168.86.48` (screens `docs/qa/screens-7.1.2/pot3-fullgrow-step*.png`).
- **UX pass 2** — Unified gauge green/amber/red/grey; empty gauges no orphan handle; bundle `index-DwSYxFmR` ([`DESIGN-AUDIT-7.1.md`](DESIGN-AUDIT-7.1.md) Pass 2).

---

## RELEASE — Pi appliance **v7.1.2** (interface + island closeout)

| | |
|---|---|
| **Brain / SPA** | **7.1.0** brain · surface **7.1.0** _(bump at signoff if surface version changes)_ |
| **Expected firmware** | **7.0.0.0** |
| **Primary UI** | Pi SPA at `http://10.42.0.1:8787` — **Overview** default landing |
| **Git tag** | `v7.1.2` _(after T+24h soak)_ |
| **Deploy** | [`services/dsc-hub/pi/deploy-brain.ps1`](../../services/dsc-hub/pi/deploy-brain.ps1) — **not run this coordinator pass** |
| **Acceptance** | [`docs/qa/LIVE-ACCEPTANCE-7.1.md`](LIVE-ACCEPTANCE-7.1.md) |
| **Soak** | [`docs/ops/SOAK-2026-08-26.md`](../ops/SOAK-2026-08-26.md) |
| **Design** | [`docs/qa/DESIGN-AUDIT-7.1.md`](DESIGN-AUDIT-7.1.md) + sibling-B UX pass 2 |

Themed island SPA (token `:root` / `.dsc-root`), HA jargon purged, Bridge card gone, control skins + button hierarchy. Pi AP holds the full 10-station fleet (minimal brcmfmac + hostapd cap + MAC deny). Appliance driver no longer chatters heatmat on the leftover `growmat_demand` alias. Acceptance #1 demand→relay proven on all four Sonoff seats; verify-brain + island-proof green with 4/4 Sonoffs. Compose tent + sprout-derived stage drive 2×4 clone mode; gauges share one severity semantic (`index-DwSYxFmR`).

---

## Coordinator notes (not for CHANGELOG)

- Alias fix + compose stage + gauge pass are on tip `ab49dd8`. Engineering SoT docs: [`FLEET-INGEST.md`](../brain/FLEET-INGEST.md), [`COMPOSE-STAGE.md`](../brain/COMPOSE-STAGE.md), [`WEBUI.md`](../brain/WEBUI.md), [`SONOFF-FLASH.md`](../ops/SONOFF-FLASH.md).
- Tag `v7.1.2` when operator closes T+24h soak and copies this draft into CHANGELOG/RELEASE.
