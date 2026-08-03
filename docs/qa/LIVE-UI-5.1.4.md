# Live UI pass — DSC-HUB Pro v5.1.4 (crop-steering + response learning)

Operator click-through after HA surface **5.1.4** packages + dashboard land.
Builds on [`LIVE-UI-5.1.1.md`](LIVE-UI-5.1.1.md) layout / Browser Mod checks.

**Prerequisites**

| Check | Result |
|---|---|
| Deploy path | Sync add-on **or** GHA **HA sync** succeeded — not merely pushed to GitHub |
| HA surface | `sensor.dsc_ha_surface_version` = **5.1.4** |
| Dashboard header | Comment reads `DSC-HUB Pro v5.1.4` |
| Core restart | Done once after new `input_*` helpers (strain / nutrient / efficacy) |
| Runner | If GHA path: `unraid-ha-deploy` online (queued forever ⇒ surface stale) |

## Deploy gate

- [ ] System versions table shows HA surface **5.1.4**
- [ ] Strains view loads: `/dsc-hub-pro/strains`
- [ ] Nutrient Science view loads (Tank chips navigate there)
- [ ] Climate shows Temp OOS (flash) vs Operator Lockout (solid) cards
- [ ] Entities exist: `sensor.dsc_pot1_got_ph` (or pot2/4), `binary_sensor.dsc_humidifier_available`

## Strains / Want·Need·Got

- [ ] Per-pot sprout date editable; days-since + expected stage update
- [ ] Want bands populate from catalog / custom slot
- [ ] Got = raw + peer offset (offset change moves Got without touching raw)
- [ ] Need summary readable when off-band
- [ ] Capture peer baseline / Apply expected stage run without errors (advisory only)

## Nutrient Science

- [ ] Next-mix recipe / stock summary / purchase list render
- [ ] Accept mix burns stock when inventory sufficient; refuses when short
- [ ] No pump / dosing hardware expected (QA bookkeeping only)

## Fluctuations

- [ ] Dryback % sensors present for in-service pots
- [ ] Coherence flag / summary present; learned ΔEC/Δmoisture numbers exist
- [ ] Track-only — no automatic irrigation from dryback

## Temp OOS / Lockout

- [ ] Lockout toggle keeps `*_available` off and demand forced off
- [ ] Clear Temp OOS script clears Temp OOS only (lockout unchanged)
- [ ] Clone mister `*_available` also requires in-service ON

## Regression smoke (reduced kit)

- [ ] Hub link / Full Auto unchanged vs pre-deploy soak
- [ ] In-service OOS devices still soft-cue only (not alert spam)
- [ ] Alert count not attributed to missing crop-steering entities

Soak log / carry: [`../FOLLOWUPS.md`](../FOLLOWUPS.md) (**N-009** / **N-010**).
