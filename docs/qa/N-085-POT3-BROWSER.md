# N-085 Build a Plant Full Inclusion — POT3 browser evidence

**Date:** 2026-08-07  
**HA:** `192.168.86.3` · surface **5.1.11** · Core **2026.8.0**  
**Test plant:** POT3  
**Sync add-on:** **5.1.4** installed, **stopped**, **boot=manual** (do not auto-start until N-085 is on `master` or Sync will overwrite live packages)

## Blockers found and fixed mid-pass

| Issue | Effect | Fix |
|---|---|---|
| `input_text` `max: 512` on light URL helpers | Entire `input_text` domain failed setup | Cap at **255** in pack + generator |
| Nested YAML attrs `fixtures` / `want_bands` | Template sensors rejected on HA 2026.8 | Store as **JSON strings**; Want templates use `\|from_json` |
| Sync add-on **boot=auto** during Core restart | Pulled GitHub `master` → wiped N-085 packages (surface fell to 5.1.10) | Redeploy local packages; set Sync **boot=manual**; update image to **5.1.4** but keep stopped |
| Want temp/RH templates emitted `'unknown'` with UoM | Numeric template validator noise | Generator now uses **0** as unset sentinel |
| Assign confirm required ESP `select.dsc_potN_strain` | False fail when ESP offline | Confirm **`input_select` only** |

## Browser / API suite

| Step | Result |
|---|---|
| T-043 Build typeahead | Catalog chip **59 items**; Blue Dream selectable; **PPFD map** chip after sensors healthy |
| T-044 Commit+assign POT3 | Roster: nick `POT3 Test`, strain `Blue Dream`, pot `3`, status `active`; seat: `input_select.dsc_pot3_strain=Custom 1`, `custom_1_name=Blue Dream`, `strain_display=Blue Dream` |
| T-045 Pro Strains | Roster **occupied**; Build a Plant deep-link present; POT3 expander opens (plant_name **unavailable** — ESP offline) |
| T-046 Climate Want | Helpers 22–26°C / 50–60% RH → Want sensors **22/26/50/60**; Apply script run; hub `number.dsc_hub_*` **unavailable** (hub offline) — write path not live-proven |
| T-047 Mix short-stock | `short_stock_any=true`; stock1 held at **5 ml** through Accept (Base A skipped); other covered lines burned (`last_accepted` 90 ml) — soak did not require Accept to burn the short line |
| T-048 Lighting PPFD | Fixture SF1000; `sensor.dsc_light_ppfd_map` URL live on Lighting fixture catalog card |
| T-049 API assert | Matches UI for Custom 1 / Blue Dream / Want / PPFD / short-stock |
| T-050 Restore | POT3 → Generic Photoperiod; Custom 1 cleared; climate helpers 0; stock1 1000; roster slot 1 emptied |

## Honesty leftovers

- `text.dsc_pot3_plant_name` stays **unavailable** while pot ESP is offline — nickname lives on roster + Custom slot until F-003/pot online.
- Chemistry chip on Build card depends on typeahead hit (`has_chemistry` / `thc_range`); catalog promote/want_bands path is live; index chem fields should be re-checked after next index rebuild if chip empty.
- Full ~36k Herbies merge remains best-effort (MVP gate used).
- Deferred unchanged: plant_id DB, Dash merge, pumps, PPFD OCR.

## Screenshots (session)

Captured via browser automation into Cursor temp screenshots (operator can archive):

- `n085-strains.png` — Strains roster + catalog
- `n085-strains-pot3.png` — POT3 expander
- `n085-lighting-ppfd.png` — Fixture catalog PPFD URL

## Ops note

Keep Sync **stopped / manual** until this tree is committed and pushed to the Sync `ref`, then start Sync once and confirm surface stays **5.1.11** with JSON `fixtures`/`want_bands`.
