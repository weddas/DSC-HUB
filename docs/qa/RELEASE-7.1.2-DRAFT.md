# DSC-HUB v7.1.2 — changelog / release draft

**Status:** closure-complete in-tree; live re-verify pending from studio LAN.  
**Date:** 2026-08-27  
**Closure:** [`AUDIT-CLOSURE-7.1.2.md`](AUDIT-CLOSURE-7.1.2.md)

Copy into [`CHANGELOG.md`](../../CHANGELOG.md) (Unreleased → **v7.1.2**) and
[`RELEASE.md`](../../RELEASE.md) (new Pi appliance section) at signoff.

---

## CHANGELOG — Pi appliance **v7.1.2** (2026-08-27)

- **Interface remediation** — design tokens declared on `:root, :host, .dsc-root` so the standalone Pi SPA resolves `var(--dsc-*)`. SPA tree wrapped in `.dsc-root`. HA jargon purged across Compose / Fleet / Learning / Climate / Settings copy. Bridge / firmware card removed from Fleet. Native control skins + `focus-visible` ring. Button hierarchy via `Button` `variant` (primary / secondary / danger).
- **Brain truth** — `online` expiry after missed polls; `list_history` newest-first; Sydney TZ for runtime-today; `lights_on_today_*` persisted; EC/soil_conductivity map; fan/light/mat duty history; room VPD in fleet extras; 2×4 lighting decoupled from SF1000 dimmer; `/fleet/computed` poll guard (5s + in-flight lock).
- **Object graph SoT** — inventory `in_service` is the seat gate (default OFF); hub pot switches sync on PATCH; retire clears compose draft; tent vocabulary 4×8/2×4; `apply_climate_want` reads `dsc_build_climate_pot`; AC/mister/tank planned-OOS rows; autoflower in computed stage.
- **Settings / workers** — PSK masked (`ap_psk_set` only); OTA worker runs ESPHome jobs to terminal state; Apply network restarts AP with 8-sta heal (`max_num_sta=32`, deny file); `control`→`panel` merge in device table; split AP vs integration drafts; `/#/settings` → `/#/fleet/settings`.
- **Zigbee** — stop z2m restart hammer; adapter/volume fix; permit-join `{"time":N}` + sqlite expiry; radio-health chip (not "empty until paired"); placement editor when radio up.
- **Command safety** — DecisionLayer on climate demand, in-service, OTA queue, SF1000/lamp, inspector toggles, permit-join, backup import, calibrate/learning start; focus trap + page inert; error boundary; alert CTAs to Climate/Light/Root.
- **Wiring honesty** — phantom AC/mister relays removed; 4×8 lamp = window proxy; CO2 demoted; HA stubs on 10.42.0.x; dead `DEMAND_TO_RELAY` removed.
- **Fallback / ops** — script defaults to `.48` / `10.42.0.x`; `iw scan` timeout 30; AP watchdog service; per-pot SoftAP SSIDs; soak alignment; pot/panel fallback flash siblings.
- **Pi AP 8-station cap (brcmfmac)** — minimal firmware + `max_num_sta=32` + MAC deny. 10/10 stations stable post-fix.
- **Appliance driver alias** — `_demands_from_discovered` reports only discovered oids; unit test `test_appliance_undiscovered_aliases_not_emitted`.
- **Tent selector + sprout auto-stage** — Compose tent picker (4×8/2×4); sprout date drives auto-stage chip (`test_stage_model_july_9_is_late_push_veg`); `apply_clone_tent` skips offline hub.
- **pot3 Add-as-Plant** — acceptance #5 PASS on `.48` (2026-08-27): Northern Lights demo, hub controls Mother/Late Veg, revert clears roster + OOS. Screens `docs/qa/screens-7.1.2/pot3-fullgrow-step*.png`.
- **UX pass 2** — shared `potWantBand` (Overview = Root); room unbanded; climate Got/Want ±2 bands; light 0.00h teal; hub online chip reconciled; TwinKeepAlive click-cage; `.dsc-grid--2`; settings accordion + table overflow; drawer rail hidden; theme token sweep (`#39ff14` removed); grow log noise filter; gauge `aria-valuetext`.

---

## RELEASE — Pi appliance **v7.1.2** (interface + island closeout)

| | |
|---|---|
| **Brain / SPA** | **7.1.0** brain · surface **7.1.2** |
| **Expected firmware** | **7.0.0.0** |
| **Primary UI** | Pi SPA at `http://10.42.0.1:8787` — **Overview** default landing |
| **Studio LAN** | `http://192.168.86.48:8787` (`dsc-brain.local`) |
| **Git tag** | `v7.1.2` _(operator request only)_ |
| **Deploy** | [`services/dsc-hub/pi/deploy-brain.ps1`](../../services/dsc-hub/pi/deploy-brain.ps1) → **`.48`** |
| **Verify** | [`verify-brain.ps1`](../../services/dsc-hub/pi/verify-brain.ps1) + [`island-proof.ps1`](../../services/dsc-hub/pi/island-proof.ps1) |
| **Acceptance** | [`docs/qa/LIVE-ACCEPTANCE-7.1.md`](LIVE-ACCEPTANCE-7.1.md) §7.1.2 |
| **Closure** | [`docs/qa/AUDIT-CLOSURE-7.1.2.md`](AUDIT-CLOSURE-7.1.2.md) |
| **Eng SoT** | [`FLEET-TRUTH.md`](../brain/FLEET-TRUTH.md) · [`SETTINGS-OPS.md`](../brain/SETTINGS-OPS.md) · [`FLEET-INGEST.md`](../brain/FLEET-INGEST.md) · [`SONOFF-FLASH.md`](../ops/SONOFF-FLASH.md) |
| **Soak** | [`docs/ops/SOAK-2026-08-26.md`](../ops/SOAK-2026-08-26.md) |

Themed island SPA, single Live home (Overview), DecisionLayer on all P0 writes, inventory in_service SoT, OTA worker + masked PSK, Zigbee radio-health honesty, 10-station AP heal, appliance driver alias fix, full 7.1 audit closure (49/49 tests, SPA `index-BoHeNp3o.js`).

**Live gate:** deploy from studio LAN and capture `closure-*` screenshots before tag.

---

## Coordinator notes (not for CHANGELOG)

- Agent-network deploy to `.48` timed out 2026-08-27 — not a code failure.
- `tsc --noEmit` cleanup landed; CI gate recommended (FOLLOWUPS §2490).
- Chunk >500 kB warning remains; route split optional.
- pot3 stays OOS in production inventory unless a proof requires temporary enable.
