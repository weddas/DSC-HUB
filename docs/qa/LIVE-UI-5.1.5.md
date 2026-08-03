# Live UI pass — DSC-HUB Pro v5.1.5 (crop UI + pot-native strain)

Operator click-through after HA surface **5.1.5** lands the Strains / Nutrient
Science UI that **5.1.4** packages claimed but never shipped, plus pot-native
strain/sprout identity (FW **5.1.3**). Builds on layout / Browser Mod checks in
[`LIVE-UI-5.1.1.md`](LIVE-UI-5.1.1.md).

**Prerequisites**

| Check | Result |
|---|---|
| Deploy path | Sync add-on **or** GHA **HA sync** succeeded — not merely pushed to GitHub |
| HA surface | `sensor.dsc_ha_surface_version` = **5.1.5** |
| Dashboard header | Comment reads `DSC-HUB Pro v5.1.5` |
| Core restart | Done once after 5.1.5 packages (migrate script + catalog prefer) |
| Pot flash (when ready) | `sensor.dsc_potN_firmware_version` = **5.1.3** for in-service pots |

## Deploy gate

- [ ] System versions table shows HA surface **5.1.5**
- [ ] **Strains** loads: `/dsc-hub-pro/strains` (no missing-view / dead Tank chip)
- [ ] **Nutrient Science** loads: `/dsc-hub-pro/nutrient-science`
- [ ] Home / Root Zone plant consoles show strain + sprout + Need
- [ ] Root Zone **Dryback & coherence** strip present
- [ ] Climate Temp OOS (flash) vs Operator Lockout (solid) — hum / dehum / **Clone Mister**
- [ ] Entities exist: `sensor.dsc_pot*_got_*`, `script.dsc_migrate_strain_sprout_ha_to_pot`

## Strains / Want·Need·Got

- [ ] Want bands populate from catalog / custom slot
- [ ] Got moves when peer offset changes (raw unchanged)
- [ ] Need summary readable when off-band
- [ ] Capture peer baseline / Apply expected stage run without errors (advisory only)
- [ ] Dashboard shows **both** pot `select`/`datetime` and HA `input_*` fallbacks

## Pot-native identity + migrate (N-017 / N-018)

Flash order: **POT2 canary → POT1 → POT4 → POT3** (USB if POT3 still down).

- [ ] After each pot online: firmware text = **5.1.3**; `select.dsc_potN_strain` + `datetime.dsc_potN_sprout_date` exist
- [ ] Strains → **Migrate HA→pot** copies only when pot still at defaults (`Generic Photoperiod` / empty or `1970-01-01` sprout)
- [ ] Re-run migrate does **not** overwrite a pot already set to a non-default strain
- [ ] Catalog Prefer: with pot online, changing pot strain updates Want / expected stage; HA `input_*` ignored until pot offline

## Nutrient Science

- [ ] Next-mix recipe / stock / purchase list render
- [ ] Accept mix burns stock when inventory sufficient; refuses when short
- [ ] No pump / dosing hardware expected

## Fluctuations (track-only)

- [ ] Dryback % for in-service pots
- [ ] Coherence flag / summary + learned ΔEC/Δmoisture present
- [ ] No automatic irrigation from dryback

## Temp OOS / Lockout

- [ ] Lockout keeps `*_available` off and demand forced off
- [ ] Clear Temp OOS script clears Temp OOS only (lockout unchanged)
- [ ] Clone mister `*_available` also requires in-service ON

## Regression smoke (reduced kit)

- [ ] Hub link / Full Auto unchanged vs pre-deploy
- [ ] In-service OOS devices soft-cue only (not alert spam)
- [ ] Alert count not attributed to missing crop UI entities

Soak log / carry: [`../FOLLOWUPS.md`](../FOLLOWUPS.md) (**N-010** / **N-017** / **N-018**) ·
[`LIVE-SOAK-5.1.5.md`](LIVE-SOAK-5.1.5.md).
