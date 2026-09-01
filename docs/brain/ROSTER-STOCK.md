# Roster stock + 10-slot capacity

**In one line:** Compose can park plants on the roster **without a probe** (`status=stock`); the brain holds **10** roster slots; Delete is **slot-keyed** and clears **`plant_uuid`**; assign releases stale probe claims so 10-plant Compose/Roster stress holds.

**Tip (post-stress audit):** `a2f5f08` / `3a452f0` · SPA bundle `index-D7pAmjOB.js` (+ `calibrate-BBqbkhla.js` · `tune-fleet-BdNG_Y6Z.js`)  
**Prior refresh tip:** `149657d` (serialized computed + nickname DOM + Skip light)  
**Prior capacity tip:** `15d7016` (10 slots · stock compose · slot retire)  
**Code:** `compose_store.ROSTER_SLOT_COUNT` · `compose_ops.retire_roster_slot` · `plant_probe.release_conflicting_slot_pots` · `api.POST /roster/slots/{n}/retire` · SPA `PlantWizard` · `GrowPages.confirmRetire` · `useBrain.refreshComputed` · `fleetApi.get_fleet_computed` · `ui.flushEntityTextDrafts` · `composePlantLogic.clearComposeDraft` · `brain/tests/test_roster_stress.py`  
**Rules:** [`.cursor/rules/dsc-roster-probe.mdc`](../../.cursor/rules/dsc-roster-probe.mdc) · [`.cursor/rules/dsc-pi-hotpatch.mdc`](../../.cursor/rules/dsc-pi-hotpatch.mdc)  
**Trail:** [`../FOLLOWUPS.md`](../FOLLOWUPS.md) § *2026-09-01 — Post-stress audit* · § *2026-08-31 — 10-plant browser stress test* · `.audit/browser-compose-stock.py` · [`../ops/PI-HOTPATCH.md`](../ops/PI-HOTPATCH.md)  
**Notion:** [Catalogs and Build a Plant](https://app.notion.com/p/3b52b4cda37081a6b661f7e4697b39cf) · [Pi offline brain](https://app.notion.com/p/3b52b4cda370818e8b66f671689f7a57) · [Local webserver UI](https://app.notion.com/p/3b52b4cda37081c19048e794d4bdf819)

Related lifecycle (detach/assign/move): [PLANT-PROBE-LIFECYCLE.md](PLANT-PROBE-LIFECYCLE.md) · wizard steps: [PLANT-WIZARD.md](PLANT-WIZARD.md)

## Intent

Operators stage more plants than kit probes (Probe 1–2 live). Stock commits fill tent calendars and Keep recipes until a probe is free. Expanding 8 → **10** slots matched a browser stress pass that creates eight 4×8 stock plants plus two seated plants. Tip `3a452f0` closed audit gaps that left identity / drawer state lying after Delete.

## Capacity + migration

| Constant | Value | File |
|----------|-------|------|
| `ROSTER_SLOT_COUNT` | **10** | `brain/dsc_brain/compose_store.py` |

`get_roster_slots()` pads saved JSON shorter than 10 with empty slots and **persists** the pad (side-effect on read — intentional migrate). Lists longer than 10 reset to defaults. Slot numbers remain `1…ROSTER_SLOT_COUNT`.

```mermaid
flowchart LR
  old["Saved slots length N&lt;10"] --> pad["Pad empty  N+1…10"]
  pad --> save["save_roster_slots"]
  save --> api["API / SPA see 10"]
```

## Stock vs seated

| Assign pot | Commit script path | Slot `status` | Probe |
|------------|-------------------|---------------|-------|
| `none` | `script.dsc_build_plant_commit` only | `stock` | none |
| `1`–`4` | `commit_and_assign` (or commit + `dsc_plant_assign_to_pot`) | `active` | pot-keyed roster + `assigned_plant_id` |

SPA: Plant Wizard **Next** on the Plant step needs strain only (probe optional). Primary CTA: **Add to roster (stock)** vs **Add plant to Probe N**. Confirm modal must use the stock label when assign is none.

```mermaid
flowchart TB
  draft["Compose drafts<br/>strain nick sprout tent"]
  sync["syncComposeTextToBus + flushEntityTextDrafts"]
  draft --> sync
  sync --> branch{assign pot}
  branch -->|none| stock["dsc_build_plant_commit<br/>status=stock"]
  branch -->|1-4| seated["commit_and_assign<br/>release_conflicting_slot_pots"]
  stock --> clear["clearComposeDraft incl. sprout"]
  seated --> clear
```

## Slot retire (Delete)

| Path | Effect |
|------|--------|
| `POST /roster/slots/{slot_n}/retire` | Empties that slot (**clears `plant_uuid`** + identity fields); if the slot owns pot `1`–`4`, clears pot row + helpers + `assigned_plant_id` |
| `script.dsc_plant_retire` with `slot` | Same via `handle_script` |
| Probe-only retire (legacy) | Still `retire_plant(pot)` when no `slot` in script data |

SPA Roster Delete always sets `retireSlot` (+ optional `retirePot` when a probe drawer is open). Client: `retireRosterSlot(n)` in `fleetApi.ts`.

```bash
# Retire stock or detached slot 7 (no probe required)
curl -sS -X POST "http://dsc-brain.local:8787/roster/slots/7/retire"
```

Constraints: `slot_n` ∈ `1…10`; empty/unknown slots → HTTP 400 / `ValueError` “already empty”.

### Post-audit Delete honesty (tip `3a452f0`)

| Bug | Fix |
|-----|-----|
| Emptied slots kept stale `plant_uuid` → next compose could inherit wrong identity | `retire_roster_slot` writes `"plant_uuid": ""` with the empty-slot patch (`compose_ops.py`) |
| After `refreshBrain()`, drawer close checked **stale** `slots` closure → deleted plant drawer could stay open | Close when captured `retirePot === pot` (URL probe), then clear `retireSlot` / `retirePot` (`GrowPages.confirmRetire`) |

```mermaid
sequenceDiagram
  participant Op as Operator
  participant SPA as GrowPages
  participant API as POST /roster/slots/n/retire
  participant Comp as GET /fleet/computed
  Op->>SPA: Delete plant (slot N)
  SPA->>API: retireRosterSlot(N)
  API-->>SPA: retired + plant_uuid cleared
  SPA->>Comp: refreshBrain (serialized chain)
  Note over SPA: if retirePot == URL pot → closePot()
  SPA->>SPA: clear retireSlot + retirePot
```

## Assign conflict release

Before seating a plant on probe `P`, `release_conflicting_slot_pots(P, keep_slot)` walks other slots that still claim `pot=P` and sets `pot=none` (`status=detached` if they were `active`). Stops duplicate “two active on Probe 1” roster rows (ST-P0-1).

`assign_to_pot` / `assign_plant_to_probe` still **reject** a true incumbent on another slot (`already has a plant`) after release of stale claims only.

## Draft flush honesty

| Field | Flush rule |
|-------|------------|
| Strain / nickname | `syncComposeTextToBus` before Next (plant step) and before commit — catalog pick is async |
| Sprout `input_datetime.*` | `data-entity-id` on input; `flushEntityTextDrafts` → `input_datetime.set_datetime`; skip empty |
| Draft clear | `clearComposeDraft` clears strain, nickname, **sprout**, assign → `none` |

Without sprout clear, Review can show a stale day/stage from a prior plant (ST-P0-8).

## Crop scheduler stock lanes

`CropScheduler` overlays roster slots with `status` ∈ `{stock, detached}` onto the tent stage rail (Expected (stock) · “no probe”). Stock/detached with tent `4x8`/`2x4` no longer leave the rail saying **No plants in tent** when only stock exists (ST-P0-4).

Expected/calendar chips for stock are **not** live Got — Probe language stays for seated plants only. Stock lanes use synthetic `PlantSeat` (`pot: 0`) for display — honest for Expected, not navigable as a live probe.

## Fleet computed refresh (tip `149657d`, still tip SoT)

Roster rows (and other computed-derived chrome) come from `GET /fleet/computed`, not only `/fleet` / WS snapshots. Tip `149657d` closed the ST-P0-7 hard-reload trap:

| Before | After |
|--------|-------|
| `refreshComputed` no-op’d while a poll was in flight | Promise **chain** serializes fetches (`computedChain`) |
| Cached `/fleet/computed` could serve a stale body | Query cache-bust `?_=${Date.now()}` |
| Successful computed apply did not bump React `tick` | `setTick` after each computed apply |

```mermaid
sequenceDiagram
  participant Op as Operator
  participant SPA as useBrain
  participant API as GET /fleet/computed
  Op->>SPA: Delete / refreshBrain
  SPA->>SPA: enqueue on computedChain
  Note over SPA: prior poll finishes first (no drop)
  SPA->>API: /fleet/computed?_={now}
  API-->>SPA: slots after retire
  SPA->>SPA: setComputed + setTick
```

Poll interval remains **~5s**; WS `/ws/fleet` messages also enqueue `refreshComputed`. Residual (ST-P0-7 soft): the deleted row may linger until the next completed computed fetch (~one poll). Hard reload remains always correct. Delete confirm uses `.dsc-decision-panel` / **Delete plant**.

## Pitfalls

- **One-poll lag after slot retire** — row may sit until the next serialized computed apply (~5s). Do not double-delete; API returns “already empty” when the slot is gone (ST-P0-7 soft).
- **Stale `plant_uuid` on empty slots** — fixed tip `3a452f0`; re-compose after Delete must not inherit prior UUID.
- **Probe drawer after Delete** — close uses captured `retirePot`, not a post-refresh slots scan.
- **Light step** — footer shows **Skip light** when no fixture; Next without a pick marks light skipped (tip `149657d`).
- **Nickname DOM race** — `syncComposeTextToBus` prefers the live `input[data-entity-id=…]` value over the draft map (single wizard instance — global `querySelector` is fragile if compose mounts twice).
- **Rapid catalog → commit** without bus sync can still commit the previous strain; wait for helpers if automating.
- **Kit probes remain 1–2** for operator assign options (`KIT_PROBE_NUMBERS`); pot 3/4 are inventory/Advanced only.
- Do **not** invent height/chem/PPFD/NPK or paste AP/Wi-Fi / Pi passwords into runbooks.

## Verify

```bash
# Capacity + conflict release (existing)
pytest brain/tests/test_plant_probe.py -q

# Edge matrix from 10-plant stress (tip 3a452f0)
pytest brain/tests/test_roster_stress.py -q

# Spot-check constant + pad
python3 -c "from dsc_brain.compose_store import ROSTER_SLOT_COUNT; assert ROSTER_SLOT_COUNT==10"
```

`test_roster_stress.py` covers: 10-slot default + 8→10 migrate, full-roster commit raise, stock commit without probe, stock/active retire (incl. **`plant_uuid` clear**), empty retire raise, occupied-probe assign reject, stale claim release, API retire + out-of-range.

### Browser compose automation (Pi SPA)

Prefer **JS `.click()`** on `.dsc-catalog-hits button` (coordinate clicks fail silently). Footer Next: `.dsc-btn-primary.click()` with ~3s wait between steps. Stock commit: review **Add to roster (stock)** then modal **Add to Roster stock (no probe)**. After Delete, wait one computed poll (~5s) — hard-reload only if the row sticks. Script sketch: `.audit/browser-compose-stock.py`. Hotpatch: [`../ops/PI-HOTPATCH.md`](../ops/PI-HOTPATCH.md).
