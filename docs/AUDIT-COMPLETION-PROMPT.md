# DSC-HUB — full audit, then version-completion plan

Paste this entire file as the first message in a new Cursor chat rooted on this repo:

`Y:\Digital Stealth Care\Projects\DSC-HUB`

Do not implement the completion pass until Phase 1 is written and the user accepts the Phase 2 plan.

---

You are auditing and then planning a **version completion** for DSC-HUB (grow climate fleet: ESPHome hub/pots/control, HA packages, React panel `/dsc-hub`, Lovelace fallback cards).

Today’s date context: mid-August 2026. `master` was last known at `6092459` (HACS dist sync) on `https://github.com/weddas/DSC-HUB`. Expected release string in packages: **5.2.0**. HA surface YAML last seen as **7.1.3** while CannaLib notes **7.1.8-cutover** — treat version skew as a defect until proven otherwise.

## Hard rules

- Do not invent sensor values, chemistry, CFM, height cm, or soak results.
- HELD / unavailable / OOS must stay honest (dim, dashed, no glow, no fake last-good as live).
- Physical AC, clone mister, and POT3 are **out of service** (F-001–F-003). Software must not pretend they are installed. The foolproof “fix” is gates + UX honesty, not fake actuators.
- ESP-NOW is **parked** (`d92d306`). Do not resume SoftAP/ESP-NOW deepening as the default next task.
- Do not mark a follow-up Done without a live probe, compile, or screenshot that proves it.
- Off-scope house HA work belongs in Digital-Home, not this repo’s Notion wiki.
- Do not commit or push unless the user asks.

## Phase 1 — full working audit

Audit **every** product surface that a user or operator can hit. Reading code is not enough. Probe live HA (`192.168.86.3`), the panel, Lovelace, firmware YAML compile paths, and CannaLib consumers.

### 1. Inventory

List every entry point:

- Firmware: hub, control, pots, any ETH/appliance stubs under `firmware/`
- HA packages under `homeassistant/packages/`
- Custom component + React panel (`homeassistant/custom_components/dsc_hub/`)
- Lovelace cards: `dist/` and `homeassistant/www/` (they can drift)
- Sync add-on / `scripts/ha-sync.sh`
- CannaLib live API + offline `publish`/`dsc-catalog` indexes
- Docs that operators rely on (`INSTALL.md`, `RELEASE.md`, `docs/FOLLOWUPS.md`, `docs/ASSIST-MCP.md`)

### 2. Prove it works

For each surface, record **pass / fail / blocked** with evidence (URL, entity id, compile log, screenshot path):

| Area | Must prove |
|---|---|
| Hub firmware | YAML loads; version string; Full Auto; emergency fans-only if AC OOS; light ledger; wifi roam off |
| Control / pots | In-service gates; POT3 OOS; cal / peer sync; no dead-demand alerts |
| React panel `/dsc-hub` | Every nav: Live (Twin/Main/Clone/4×8/2×4), Grow, Tune, Fleet, Research, Learning, Compose. Type/select/slider while climate ticks without snap-back. Twin canvas-only (no IIFE HUD). Tab-away pauses rAF. |
| Twin honesty | HELD freezes wisps; OOS/unassigned = dashed empty pads; no terracotta/leaflet lies; 4×8 shafts dashed Window proxy until GPIO lamp exists |
| Kit Pulse / Mission | Planned OOS is dashed inventory, not REDUCED KIT; unexpected loss only on `binary_sensor.dsc_reduced_kit` |
| Climate / Light / Root | Want/Got bars; window-proxy honesty; Room VPD entity actually exists (`sensor.dsc_hub_room_vpd_kpa` or fallback); no invented CFM |
| Compose / Research | Catalog typeahead against **live** CannaLib `https://cannalib.plausible-deniability.net` (0.3.5). DecisionLayer confirm. No merch SKU treated as a cultivar. |
| Lovelace fallback | `/dsc-hub-pro` hidden; Dash IIFE still renders if panel fails; `dist/` vs `www/` hash/drift check |
| HA cache | Live HA surface vs repo. Last known: HA may still paint **7.1.4** while repo is **7.1.8-cutover**. Hard-reload / copy `www` if needed and record what the 192.168.86.3 instance actually serves. |
| CannaLib | `/health` ok; strain `q=og kush` 200; Research chip vs typeahead refilter |
| Sync | `ha-sync` path still valid; no secrets in compose YAML |
| Stashes | Six local stashes exist (SoftAP / frontend / docker-compose). Diff each against HEAD. Keep, drop, or fold — do not apply blindly. |

### 3. Follow-up engineering (part of the audit)

Read all of `docs/FOLLOWUPS.md`. For **every** item that is not already proven Done, write a foolproof close-out:

| ID / leftover | Required close-out shape |
|---|---|
| F-001 AC hardware | Keep in-service OFF. Prove emergency fans-only. No software “install”. |
| F-002 clone mister | Same. Demand must stay off. |
| F-003 POT3 probe | In-service OFF; mat vote excluded; no chemistry alerts from a dead pot. |
| F-004 SoftAP / BSSID | Document as out-of-scope nest lock; SoftAP-primary is the heal path, not a new campaign. |
| F-005 multi-lever learn | State what the interim air-lever gate does and what a complete engine would need (evidence only). |
| F-006 HA-link flap | Measure current flap rate; do not reopen ESP-NOW. |
| F-007 panel OOM | Heap / LVGL watch: current firmware version vs last healthy note (5.1.14). |
| F-008 SCD41 | ADC CO2 stays informational until a real sensor exists. |
| F-009 Full Auto reduced kit | UX must name missing kit; no fake capacity. |
| GPIO 4×8 lamp | Keep `entities.main_light` empty; shafts stay dashed Window proxy. Plan the 1:1 bind for when hardware exists. |
| DSC-Tank firmware | Dummy helpers vs `dsc_v4_tank.yaml` tester. Map ids 1:1; do not invent a tank. |
| R3F Twin extract | Parked until neon APIs soak. Do not rewrite a lying scene. |
| N-087 FTS | Confirm Hub cards actually use CannaLib FTS5 / `science_alias` (GSC → Girl Scout Cookies). |
| N-012–N-016 | Pumps / irrigation / AC efficacy / deeper learn / wet cal — deferred. Write the smallest honest next slice, not a fake complete climate. |
| Cookie jar in history | `_strain_database_cookies.json` gone from HEAD, still in git history. Plan BFG/`filter-repo` only if the user wants history rewrite. |
| Assist/MCP (I-25) | Opt-in only. Read `docs/ASSIST-MCP.md`. Do not silently expose the house. |
| Intake `*_allocated` CFM | Missing sensors → trust line stays nameplate/mixed. Plan Learning write path; do not invent allocated CFM. |

Also query **Notion Bug Box** if the Notion MCP is available (`collection://f18ec9d2-1ed1-4033-96b8-726971429250`). List open / approved / in-progress. If Notion is disconnected, say so and do not invent Bug Box contents.

### 4. Phase 1 deliverable

Write `docs/AUDIT-2026-08.md` (or today’s date) with:

1. Surface matrix (pass/fail/blocked + evidence)
2. Follow-up table: keep / close-with-evidence / redesign / hardware-blocked
3. Lies found (UI that claims a sensor it does not have)
4. Recommended completion version name (e.g. Hub 5.2.0 / Surface 7.2.0) and what “complete” is allowed to mean given OOS hardware

Stop and wait for the user before Phase 2 implementation.

## Phase 2 — version-completion plan (after user OK)

Using only Phase 1 evidence, write a single coherent completion plan (not a thousand-cut checklist):

- One named release
- Ordered work that closes every **software-closable** follow-up
- Hardware-blocked items stay in FOLLOWUPS as blocked, with the honesty gates already proven
- Soak / acceptance tests a cold agent can run
- What will **not** be in the version (ESP-NOW, R3F rewrite, physical AC/mister/POT3)

Do not start coding Phase 2 until the user says to execute the plan.
