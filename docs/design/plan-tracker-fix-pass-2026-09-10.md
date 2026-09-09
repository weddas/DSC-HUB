# Plan — tracker fix pass, 2026-09-10

**Source:** DSC-HUB Issue & Recommendation Tracker, queue
`Status = Open AND "Safe to fix?" = y AND "Fixed/No longer applicable" <> y` → **26 rows**.
**Skipped as held/blocked:** 4 (below). **Owned by another 2026-09-10 plan:** 1 (C6).
**Planned here:** 21.
**Not in scope:** the 13 `Safe to fix? = n` Open rows (live-seat reflash / live control change /
host downtime — never worked without asking), the 2 `Safe = n` Needs-Verification rows, and the
🐛 Bug Box (gated on `Ok For Agent To Fix`, unchecked on all but the 9 already-in-progress rows).

---

## 0. Held — deliberately skipped this pass

| Row | Why it stays held |
|---|---|
| USB flash non-functional in the containerised deployment (High, Architecture) | Blocked on `/dev/serial` passthrough into the brain container; the SkyConnect shares the bus, so the passthrough is a live-radio risk, not a code change. |
| Settings restructure plan — knob catalogue + 12-section IA (High, Settings) | Anchor row for the S2+ programme in `docs/design/plan-settings-2026-09-07.md`; it is a plan, not a fix. |
| Room shell is a 3.6×2.4×2.4 placeholder (Low, Dashboard) | Needs real room measurements plus a modelling pass (BRIEFS-3 § G), not code. |
| ~660 hand-synced HA-shaped entity ids (Medium, Architecture) | Now owned by `plan-entity-resolution-ssot-2026-09-10.md`, which shows the row's framing is stale — the static id tables are already an SSoT with drift tests. The live problem is *runtime* resolution. See the correction in §0.5. Batch A5 chips one concrete piece off it. |

---

## 0.5 Relationship to the other 2026-09-10 plans

**Eight** further plan docs from the same live-8.2.0 walkthrough now exist (nine with this one):
`plan-improvements-batch`, `plan-unified-want-editor`, `plan-harvest-window`, `plan-estimated-dli`,
and — landed after this doc's first draft — `plan-entity-resolution-ssot`, `plan-pot-probe-model`,
`plan-irrigation-loop`, `plan-flood-resilience`. They spec the **improvement / feature / architecture**
side of the walkthrough. This doc is the **bug / UX-fix** side — the `Open` queue. Where they meet:

| This plan | Owning doc | How they divide |
|---|---|---|
| **C1** tent cockpit Want bands | `plan-unified-want-editor` | That doc owns the fix — `effective_want` computed brain-side, one canonical editor, and the same in-band bug. **C1 here shrinks to the honesty half only.** |
| **C6** "Probe 2" means two entities | `plan-pot-probe-model` | **Removed from this pass.** That doc owns the seat/probe/pot/plant/station split *and* the operator-facing naming — which is one of its four open questions. Renaming the labels here would pre-empt that answer and have to be redone. |
| **C2** VPD ring colour basis | `plan-unified-want-editor` §5 | That doc explicitly scopes the ring colour out and pairs it with this row. Colouring on the band the label prints is correct now and survives the `effective_want` migration. |
| **A3** leaf-VPD advisory, **A4** zigbee jargon | `plan-improvements-batch` A4 (Alerts filtering) | That spec names these two rows as its pair. A3/A4 remove the noise at the source; the filter handles what remains. Land the bug fixes first — they shrink the problem the filter has to solve. |
| **A5** last Sonoff table copy | `plan-entity-resolution-ssot` §4 | A5 is one concrete instance of that doc's "one resolver, table-driven" brain-side goal. Small, independent, behaviour-preserving — take it now; the broader runtime-resolution refactor stays that doc's. |
| **F1** equipment tile clipping | `plan-improvements-batch` C2 (fan-cal coverage badge) | Both edit `EquipmentTiles`. Let the reason line wrap first so C2's "est (nameplate)" badge has room. |
| **F3** preview proxies at the live Pi | `plan-flood-resilience` | Different layers of one hazard: that doc makes the brain un-saturatable server-side; F3 stops *our own verification step* aiming load at the live grow. Independent, both worth doing. |

`plan-irrigation-loop` overlaps nothing in this queue.

The shared principle across these docs — *compute derived state once in the brain and let every
surface read it* — is the same rule A1 and the C batch apply.

### A correction to §0, from `plan-entity-resolution-ssot`

That doc establishes that the held row **"~660 hand-synced entity ids across two languages"** is
**stale as written**: the id-table half is already solved (`entity_tables.py` as the Python SSoT,
`gen_entity_maps.py` emitting the TS mirrors, `--check` plus `test_entity_maps_generated.py` /
`test_hub_maps_match_firmware_names.py` failing the build on a one-sided rename). What remains is
*runtime resolution* — the hand-written device→metric matcher that produced the pH-114 bug, and the
~12 SPA components that resolve ids themselves. So that row stays held here, but for a different and
narrower reason than "660 ids are hand-synced", and it should be re-scoped in the tracker.

---

## 1. Batch A — brain data honesty (server-side, unit-testable, no control-surface change)

Lowest risk, highest honesty value. All five land behind the brain suite; none touches an actuation
path.

**A1 — `dynamic_co2_ppm` is trustable garbage when no CO2 sensor is bound** (Bug, Low)
`brain/dsc_brain/hub_controls.py:348` maps the hub's derived ppm straight through; the hub computes
172.87 ppm from a floating 0.142 V input. The SPA suppresses it, so the honesty lives in one view
only — same class as the pH-114 bug.
*Fix:* gate the value at ingest on a CO2-bound test (voltage plausibility floor plus an explicit
`co2_bound` flag on `hub.values`); publish `None` when unbound so `/fleet`, history and any future
rule read absence, not a number. Keep `co2_sensor_voltage` raw.
*Test:* unbound → `dynamic_co2_ppm is None`, `co2_bound is False`; bound → value passes through.
*Watch:* `history_ops.py:89` lists the key — confirm a null does not upset the recorder.

**A2 — zone names stored double-encoded (`2Ã—4`)** (Bug, Low)
`brain/dsc_brain/space_model.py:18,25` seed `size_label` as `4×8` / `2×4`; the stored
`extra_json.name` read back at `zone_model.py:135` is mojibake. The SPA masks it; CSV/journal
exports will not.
*Fix:* normalise on read (defensively decode the Latin-1-re-encoded UTF-8) **and** a one-time
`db.migrate` step that rewrites the stored name; fix the write path that double-encoded it.
*Test:* migration idempotence plus `GET /zones` returning `4×8` for a mojibake fixture row.

**A3 — leaf-VPD migration advisory re-emitted on every brain restart, tagged ALERT** (UX, Medium)
`brain/dsc_brain/climate_math.py:26`. Five copies in 30 minutes; the history dedup only collapses
adjacent duplicates.
*Fix:* persist an "already announced" flag (a settings/kv row keyed on the advisory id) so it emits
once per database, and re-tag it NOTE.
*Test:* two emit calls across a simulated restart → one row, `kind=note`.

**A4 — zigbee task jargon leaks into operator Alerts** (UX, Low)
`brain/dsc_brain/zigbee_policies.py:361` records
`zigbee task CLEAR banner only seat=… ieee=0x… (OOS not policy-owned)` about 7×/24 h.
*Fix:* rewrite in operator language (seat name, no ieee, no "policy-owned"), demote to the debug
channel, and rate-limit/roll up repeats.
*Test:* the emitted string contains no `ieee=` and no internal phrasing.

**A5 — the last Sonoff relay table duplicate** (Suggested Change, Low)
Three of the four copies already import from `entity_tables` (`computed_ops.py:447`,
`control_ops.py:41`, `demo_simulator.py:53`); only `automation_rules.py:184 _SONOFF_RELAY_SEAT`
still holds its own literal.
*Fix:* import `SONOFF_RELAY_TO_SEAT` from `entity_tables`, delete the literal.
*Test:* existing automation tests plus an assert that no module defines a second table.

---

## 2. Batch B — Kit entity ids (**decided 2026-09-10 — see §7**)

Both rows were left unfixed by the codegen pass *on purpose*: changing an entity id is a
live-behaviour change on the control surface.

**B1 — dehumidifier firmware chip can never resolve** (Bug, Medium)
`entity_tables.py` `KIT_DEFS[dehumidifier].firmware_entity` asks for
`sensor.dsc_de_humidifier_firmware_version`; both producers (`fleet_state.SONOFF_FW` and the SPA's
old `fleetFromHass.ts`) publish `sensor.dsc_dehumidifier_firmware_version`. Nothing emits the split
spelling. The *relay* id genuinely **is** `switch.dsc_de_humidifier_main_relay`
(`entity_tables.py:32,241,319`) — which is why the typo looked right beside it.
*Fix:* a one-word change to the un-split spelling; the codegen drift test then keeps both languages
in step. **Decided 2026-09-10: keep the un-split `sensor.dsc_dehumidifier_firmware_version` and
match the producers.** The relay id keeps its genuine split spelling — do not "tidy" it.

**B2 — Kit "cycles today" permanently blank for heater and humidifier** (Bug, Medium)
`entity_tables.py:286,312` ask for `sensor.dsc_{heater,humidifier}_cycles_today`; nothing in
`brain/` produces either. The brain emits `*_cycles_last_hour` (`dash_computed.py:300`) and the
`*_runtime_today` family.
**Decided 2026-09-10: compute a genuine cycles-today.** Count OFF→ON transitions per seat since
local midnight in `dash_computed`, persisted so a brain restart does not reset the count, and emit
the `*_cycles_today` ids the Kit tiles already ask for.
*Design notes:* derive transitions from the same relay/state source the `*_cycles_last_hour` counter
uses (it already sees the edges); store `{seat, local_date, count, last_state}` in a small table so
the count survives a restart; roll over on the *local* date, not UTC, since the operator reads it
against their own day. Debounce so relay chatter does not inflate the count.
*Test:* restart mid-day preserves the count; a midnight rollover resets it; a rapid OFF→ON→OFF
inside the debounce window counts once.
*Fallback if the transition source proves unreliable:* point the tiles at `*_cycles_last_hour`
relabelled honestly — but report that before switching, do not silently degrade the label.

---

## 3. Batch C — honesty labels on the live desks (SPA)

Six rows here, not seven — C6 moved to `plan-pot-probe-model` (see §0.5). The largest group, and what the live 8.2.0 walkthrough surfaced. Each is a labelling/derivation
defect, not a control change.

**C1 — Tent cockpit Want bands disagree with Overview** (Bug, Medium) — *split; see §0.5*
The 4×8 cockpit says 25–28 °C where Overview says 18–26; the 2×4 differs on both temp and RH. Worse,
the cockpit annotates Temp-min "in-band · plant Want" while Got 24.6 °C is below its own stated min
of 25.0.

Unifying the band source is **already specced in `plan-unified-want-editor-2026-09-10.md`**
(`effective_want` computed brain-side, one canonical editor, every surface reads it) and carries
three open operator questions. Do not re-plan or pre-empt it here.

*What this pass takes:* **the honesty half only** — fix the band-membership test so it compares Got
against the min/max the same view is *displaying*. A label that says "in-band" beside a number below
its own stated minimum is wrong regardless of which band wins later, and the fix survives the
`effective_want` migration intact.
*What this pass leaves:* the cockpit-vs-Overview divergence itself, which is the want-editor doc's
to resolve. Until then, add the source label ("plant Want" / "tent rail" / "stage preset") that doc
calls for, so the operator can at least see *why* two surfaces differ.
*Test:* a render test asserting label ↔ numeric agreement on every surface that prints a band.

**C2 — the VPD gauge ring colours on a different basis than the value it shows** (UX, Medium)
Ring green at air VPD 1.44 against want 1.2–1.4 (leaf 1.09 — also outside). RH rings redden
correctly, so the VPD ring alone appears to colour on leaf-VPD-against-leaf-band.
*Fix:* colour on the same value+band pair the label prints; if leaf is deliberately the colour
basis, disclose it in the caption. The leaf line is printed at `components/Triad.tsx:227`.

**C3 — Light 4×8 shows "LIT" and "DARK" together while the fixture is off** (UX, Medium)
The STATE pill's aria reads "4×8 lamp lit, off in 1H 22M" while the only fixture is OFF, 0 cycles,
0.0 h on, GOT 0.00, and the crop scheduler says "WINDOW OPEN · ON FOR 10H 37M".
*Fix:* split the two facts — **WINDOW OPEN/CLOSED** (schedule) versus **LAMP ON/OFF** (measured);
fix the aria-label to describe the fixture; make the scheduler's "ON FOR" read as window-elapsed,
distinct from actual on-hours. Twin PWM genuinely is not wired yet, so 0.0 h is honest — the labels
are the defect.

**C4 — Settings › Devices badges out-of-service seats "OFFLINE"** (Bug, Medium)
`pages/settings/DevicesSettingsPage.tsx`. ac/mister/tank badge OFFLINE while the same page's footer
says "0 offline · 5 out of service", the nav says ALL ONLINE, and Kit says out of service.
*Fix:* badge parked seats `OUT OF SERVICE`, reserve `OFFLINE` for unreachable in-service seats, and
reconcile the three counters against one predicate.

**C5 — Probe 2 shows a measured dryback next to `dryback_unknown`** (UX, Medium)
The string means the steering *phase* cannot be classified (no shot/wet-point reference), not that
dryback is unknown — and the same string appears on the genuinely-dark Probe 1.
*Fix:* rename to `phase unknown · no shot reference` (or hide it when dryback is measured), keeping
the dark-probe case distinct.

**C6 — "Probe 2" denotes two different entities at once** (UX, Medium) — **moved out of this pass**
An IDLE/STALE mobile station homed in the 2×4 *and* the live 4×8 Grandmommy Purple probe.
`plan-pot-probe-model-2026-09-10.md` owns this: it splits seat / probe / pot / plant / station and
specs the disambiguated labels, and its open question 3 is *exactly* what the operator-facing naming
should be ("Pot 2 / Probe P-2" versus plant-name-first). Inventing a naming scheme here would
pre-empt that decision and be redone. **Nothing to fix in this pass — the row waits on that doc.**

**C7 — probe-station chips are redundant** (UX, Low)
IDLE + HOME DARK + HOME PROBE DARK + HOME FAULT + READING STALE on one idle station.
*Fix:* collapse to a single state line, e.g. `HOME DARK · reading stale >15m`. This is chip
de-duplication, not identity, so it is safe to do ahead of `plan-pot-probe-model` — but keep it to
collapsing existing chips and do not rename the station.

---

## 4. Batch D — network and camera surface

**D1 — Settings › Network shows the container's Docker-bridge IP as "Ethernet (LAN)"** (Bug, Medium)
It shows `172.18.0.5`; the Pi is on `192.168.86.48`. An operator bookmarking that gets an
unreachable address presented as fact — the container-versus-host blind spot again.
*Fix:* source the host LAN IP host-side (reuse the path the brain already uses for SoftAP/mDNS host
facts rather than reading the container's own interfaces). If no host-side read is available, label
the value `container IP` and show the real host IP separately — never silently print the bridge
address as the LAN one.

**D2 — a disabled camera surfaces a raw ffmpeg 401** (UX, Low)
`cameras.py:803` stores `str(exc)`; `CamerasCard.tsx:133` prints it verbatim.
*Fix:* map the common failures to operator guidance (401 → "this stream needs a username and
password in the URL: rtsp://user:pass@host…"), keep the raw string in the inspector, and state
plainly whether a disabled camera polls at all (it should not — verify, then say so on the card).

---

## 5. Batch E — catalog and search

**E1 — CannaLib browse sorts by raw unsanitised name** (UX, Low)
`"O" Lubricant`, `"VPD" for drying`, `# 38` lead a 195 k catalog.
*Fix:* order by the existing `name_norm`; filter the obvious non-strain rows. Flag the data-quality
tail back to CannaLib rather than papering over it in the proxy.

**E2 — "N hits" is a page size, not a match total** (UX, Low)
CannaLib browse says "11 hits" while the proxy returns 50 of ~195 k; Compose says "50 hits+" for the
same query (`components/CatalogPicker.tsx:140`).
*Fix:* one counter contract across both surfaces — `showing N of M` when the total is known, `N+`
when capped. Have the proxy return the true total (or an explicit `capped: true`).

**E3 — Compose strain search shows stale rows while the header has already updated** (UX, Low)
*Fix:* clear or skeleton the list while a query is in flight so list and count move together. Same
component as E2 — one commit.

---

## 6. Batch F — cosmetic and dev-loop

**F1 — Climate equipment tiles clip their reason at every width** (UX, Low)
`components/EquipmentTiles.tsx`; `out of service (F-0…`.
*Fix:* let the reason wrap to two lines plus a native `title`; the inspector stays the full detail.

**F2 — first-paint gap on Kit / Plants / Logs** (UX, Low)
Header paints, main content blank for ~1 s, no skeleton, so the page reads complete-but-empty.
*Fix:* skeleton placeholders for the KIT PULSE radial, the roster/scheduler cards and the journal
list.

**F3 — `vite preview` inherits `server.proxy`, so the pre-hotpatch check fires at the LIVE Pi** (Bug, Medium)
`frontend/vite.config.ts` proxies everything non-asset to `DSC_BRAIN_ORIGIN`, default
`http://dsc-brain.local:8787`. Our own standing note says to boot `vite preview` before a hotpatch —
which points stray GETs (about 15 last time) at the live grow, in a project that already has a
"SPA flood reboots the hub" incident on record.
*Fix:* add `preview: { proxy: {} }` so preview never proxies, **and** correct the standing memory
note to say: serve `spa-dist` statically and inspect the chunk graph offline.
**This lands first** — every other SPA batch is verified through that step.

---

## 7. Decisions — answered 2026-09-10

1. **B1** — keep the **un-split** `sensor.dsc_dehumidifier_firmware_version`; change `KIT_DEFS` to
   match the producers. The relay's split spelling is genuine and stays.
2. **B2** — **compute a real persisted cycles-today** in the brain rather than repointing the tiles
   at the last-hour counter.

Batch B is therefore unblocked. Everything in A, C, D, E and F needed no decision.

Still open, but owned by `plan-unified-want-editor-2026-09-10.md`, not by this pass: the Want
precedence order, the tent "master" plant when several share a tent, and whether a stage change
auto-adopts the new preset.

---

## 8. Sequencing and verification

| Step | Contents | Gate |
|---|---|---|
| 1 | F3 (preview proxy) plus the memory-note correction | `npm run build`, static serve, no request leaves the box |
| 2 | Batch A (5 brain rows) | `set -o pipefail`, brain suite green |
| 3 | Batch B (both decisions in hand) | brain suite plus the codegen drift test |
| 4 | Batch C (C1 honesty half + 5 rows; C6 removed) | `tsc` clean, SPA build clean, in-app browser walkthrough of Climate / Light / Root / Settings |
| 5 | Batch D, E, and F1/F2 | same |

Standing rules that apply to every step: start test chains with `set -o pipefail`; verify the
**production** build statically (per F3) before any Pi hotpatch; never `git add -A` in this checkout
(another session shares it); the Pi deploy itself stays the operator's call. Each row gets
`"Fixed/No longer applicable" = y` and Status → **Needs Verification** as it lands — not
"Fixed & Verified", which needs a live check.
