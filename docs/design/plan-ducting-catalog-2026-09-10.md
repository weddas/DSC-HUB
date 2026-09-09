# Plan — CannaLib Ducting: fans, duct, filters, and the calibration that keeps them honest

**Date:** 2026-09-10
**Ask (operator):** build a CannaLib catalog of ducting fans / duct / filters. Pick your fan from
the catalog and its specs import and auto-apply — CFM, watts, duct size. Watts feeds the brain's
energy and cost model. **Calibration stays vital and encouraged**, because duct runs, bends and
filters change the real output, especially at different power. No fan in the catalog? Pick a duct
size from the common list or enter a custom diameter in mm, then calibrate.

---

## 0. The one idea this plan is built on

**The catalog is a claim. The calibration is the measurement. Never let the first impersonate the second.**

A maker's CFM figure is *free-air*: no duct, no bends, no filter, on a bench. Every real install is
lower — often far lower. So the catalog must never silently become the number the brain steers on.
It earns exactly two jobs:

1. **A starting point** — nameplate capacity, duct size and watts, so a new rig is useful before
   anyone climbs a ladder with an anemometer.
2. **A yardstick** — once a calibration exists, the gap between free-air claim and measured reality
   *is the useful number*. "Your 440 CFM fan is moving 180 through this run" is the single most
   actionable thing this feature can say, and it is impossible to say without both halves.

This is the same rule the 2026-09-10 critical pass wrote down (`plan-critical-issues`, §4.3):
**never stamp a value OK against a source it was not reconciled with.** A catalog import is
unreconciled by definition until a calibration exists.

---

## 1. Where this sits today

| Piece | State |
|---|---|
| CannaLib `equipment` catalog | **Exists** — schema, store, API, review CLI (merged 2026-09-07). `category` enum already has `fan` and `filter`. `spec` already carries `airflow_cfm`, `airflow_m3h`, `duct_mm`, `noise_db`, `ec_motor`, `speed_steps`, `carbon_kg`, `filter_length_mm`; `power` carries `wattage_w`. Indexed as real columns. |
| Records | **3 total, 1 fan** (Spider Farmer 4in inline: 348 m3/h, 27 W, 101 mm duct). Effectively empty. |
| `duct` as a thing | **Missing** — no category for the ducting itself (flex/rigid/insulated, reducers), and no way to describe a *run*. |
| Per-speed curve | **Missing** — one `airflow_cfm` for the whole fan. EC fans publish CFM **and** watts per speed step; that is what an energy model actually needs. |
| Brain to CannaLib | Search proxied at `/v1/catalogs/{kind}`; **no `/v1/catalogs/equipment/{id}` detail proxy** (lights has one, equipment does not). |
| Binding pattern | `space_device.extra.catalog_id` to a CannaLib id. Already proven by the SF1000 lamp. **Reuse verbatim.** |
| Fans in the energy model | **Absent.** `space_device` seeds only `sf1000` and `main_fixture`. Every fan in the rig contributes 0 W to cost today. |
| Duct diameter | Landed 2026-09-10 (`04f3b21`) as `input_number.dsc_duct_*_cm`, defaulted 6in/4in, used to convert the anemometer's m/s to CFM. |
| Calibration | Landed 2026-09-10 — capture path fixed (`04f3b21`), plausibility gate (`bcb8a4b`), record + clear card (`3f2fc07`). |

**So the catalog is not a green field.** The work is: extend the schema for ducting, fill it with
real records, add the detail proxy, and bind it to a *duct line* in the hub.

---

## 2. The model: a duct line

The rig has four airflow positions. Each is a **duct line** — the whole path, not just the fan:

```
  [ intake / room air ]
          |
      ( filter? )        <- carbon filter, pre-filter: the biggest single restriction
          |
       [ FAN ]           <- catalog record or manual nameplate
          |
      ( duct run )       <- diameter, length, bends: what the catalog cannot know
          |
   [ tent / outside ]
```

A duct line owns:

| Field | Source | Notes |
|---|---|---|
| `position` | fixed | `out`, `recirc`, `intake_main`, `intake_clone` |
| `fan_catalog_id` | catalog **or null** | null = manual |
| `nameplate_cfm` | catalog `spec.airflow_cfm`, else manual | the free-air claim |
| `watts` / `watts_max` | catalog `power.wattage_w` | feeds energy; **0 today** |
| `duct_mm` | catalog `spec.duct_mm`, else operator | drives the m/s to CFM conversion |
| `filter_catalog_id` | catalog or null | why measured is far under nameplate |
| `run_length_m`, `bends` | operator only | never in a catalog |
| `curve` | **calibration** | the only measured thing here |

**Duct diameter is where catalog and measurement meet.** The catalog knows the fan's *port* size;
the operator may have reduced or expanded the run. Catalog fills it in; the operator can always
override; the calibration card shows which is in force.

---

## 3. Slices

### D1 — CannaLib schema: make ducting first-class *(this pass)*
- Add `duct` to the `category` enum: flexible / semi-rigid / rigid / insulated, plus reducers.
  `spec` gains `duct_mm`, `run_length_m`, `insulated`, `material`, `wall` — enough to describe a
  product, not a specific install.
- Add **`spec.speed_curve`**: per speed step `{step, pct, airflow_cfm, wattage_w, noise_db}`. This is
  the single highest-value addition — it is what an EC fan's manual prints, it makes the energy
  model duty-aware instead of "always-on at nameplate", and it gives the calibration something
  shaped like itself to be compared against.
- Filters gain `spec.pressure_drop_pa` (at a stated airflow) — the honest reason a calibration comes
  in under nameplate.
- Keep every new field nullable with its own `provenance`; a gap must stay a gap.

### D2 — Seed real records *(next pass: the operator's own kit; then broaden)*
Start with what is actually in the rig, so the first import is verifiable against a live
calibration rather than trusted blind. Then the common AU/EU/US inline fans (AC Infinity T-series,
Vivosun, Spider Farmer, Hyperfan, TerraBloom) and the filters that pair with them.

### D3 — Brain: the equipment detail proxy + duct-line store
- `GET /v1/catalogs/equipment/{id}` proxy (mirror `light_detail_proxy`, including its
  "known but not transcribed" 404 shape).
- Persist duct lines. **Reuse `space_device`**: one row per fan, `extra.catalog_id` for the fan,
  `extra.filter_catalog_id`, `extra.duct_mm`, `extra.run_length_m`. No new table — the energy model
  already reads `space_device.watts`, so a bound fan starts costing money the moment it is bound.

### D4 — Import and auto-apply
`POST /ducting/{position}/bind {catalog_id}`:
- `input_number.dsc_cfm_<position>_max` from `spec.airflow_cfm`
- `input_number.dsc_duct_<position>_cm` from `spec.duct_mm / 10` **only when the operator has not set
  one** (an operator's measured duct always beats a catalog port size)
- `space_device.watts` from `power.wattage_w`, `extra.catalog_id` from the record
- Each applied field records `source: "catalog:<id>"` so the desk can show provenance and offer
  "revert to manual".

### D5 — Manual path: common sizes or custom mm *(this pass)*
No catalog fan? Pick from the common list — **100 / 125 / 150 / 200 / 250 / 300 mm (4/5/6/8/10/12 in)**
— or type a custom diameter in mm. Then calibrate. This is the floor every other path degrades to,
and it must never be the poor relation: a manual duct size plus a real calibration is *better* data
than a catalog import with no calibration, and the desk should say so.

### D6 — Say the gap out loud
Once a line has both a catalog fan and a curve, the Calibrate desk shows:

> **OUT exhaust** — Vivosun 6in rated **440 CFM** free-air, measured **182 CFM** at 100 %.
> **41 % of rating.** Carbon filter + 3 m run + 2 bends. This is normal and it is the number
> the brain steers on.

That line is the whole point of the feature. It is also the honest answer to "why is my expensive
fan underperforming" — it is not; it is ducted.

### D7 — Energy, duty-aware
With `speed_curve`, cost stops being "watts x 24 h". An EC fan at 40 % draws far less than at 100 %,
and the brain already knows the duty it commanded. Replaces the `duty_source != photoperiod`
24h-at-nameplate approximation in `energy_model.py`, which is currently the only thing fans would
get if they were added to the model at all.

---

## 4. Risks and rules

1. **A catalog import must never silently move a live control number.** Binding writes nameplate and
   duct size; it does not touch a stored calibration, and a curve always beats a nameplate.
2. **Nameplate is not calibration.** The desk must never show a catalog CFM in a way that reads as
   measured. `honesty` already distinguishes `measured_curve` from `capacity_proxy_nameplate` —
   catalog-sourced nameplates stay firmly in the proxy family.
3. **Free-air vs installed is a factor of 2-3, not a rounding error.** Any "your fan is
   underperforming" language must account for the filter and the run, or it will send the operator
   chasing a fault that does not exist.
4. **Do not let the catalog discourage calibration.** That is the opposite of the intent: an imported
   fan should raise the prompt to calibrate, not satisfy it. A bound-but-uncalibrated line is
   `capacity_proxy_nameplate` and should say "catalog claim — not measured on your run".
5. **mm is the operator's unit** (they said so). The UI takes mm; the existing `_cm` helper stays the
   wire format for now and is converted at the edge, so the conversion that just landed keeps
   working. Rename in a later pass, not mid-flight.

---

## 5. This pass

- **D1** — schema: `duct` category, `speed_curve`, filter `pressure_drop_pa`.
- **D5** — manual duct size: common sizes + custom mm, on the Calibrate desk.

Everything else is specified above and deliberately left for the next pass, because D3/D4 change
what the brain steers on and D2 is data entry that wants the schema settled first.
