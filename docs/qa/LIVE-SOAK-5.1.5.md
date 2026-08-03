# Live soak — HA surface 5.1.5 (post-deploy / N-010)

Timed soak after **5.1.5** packages + dashboard are on HAOS, and (when flashing)
after pot **5.1.3** identity lands. Complements
[`LIVE-UI-5.1.5.md`](LIVE-UI-5.1.5.md) and [`FOLLOWUPS.md`](../FOLLOWUPS.md) **N-010**.

**Do not start** until the deploy gate passes:

| Gate | Expect |
|---|---|
| Delivery | Sync add-on tip **or** GHA **HA sync** success |
| Surface | `sensor.dsc_ha_surface_version` = **5.1.5** |
| Views | `/dsc-hub-pro/strains` + `/dsc-hub-pro/nutrient-science` navigate |
| Core | Restarted once after 5.1.5 helpers / migrate script |
| Runner (GHA path) | `unraid-ha-deploy` online; Autostart ON |

```mermaid
flowchart LR
  gate["Surface = 5.1.5"] --> ui["Strains + Nutrient Science OK"]
  ui --> t0["T0 baseline"]
  t0 --> mid["T+10"]
  mid --> end["T+25"]
  end --> pots["Optional: pot 5.1.3 + migrate"]
  pots --> sign["Sign soak / FOLLOWUPS"]
```

## Window

Soak **25–30 min** after the HA gate. Record T0 / T+10 / T+25.

## Fleet regression

| Check | T0 | T+10 | T+25 |
|---|---|---|---|
| Hub link | | | |
| Full Auto | | | |
| Tent T / RH | | | |
| Dehum / hum demand | | | |
| Alert count | | | |
| AC / mister / POT3 in-service | | | |
| In-service pots | | | |

Expect: no climate regression; reduced-kit soft cues only.

## New 5.1.5 checks

- [ ] Strains / Nutrient Science stay loadable through the window
- [ ] Want / Need / Got entities present for in-service pots
- [ ] Accept mix still bookkeeping-only (no pump side effects)
- [ ] Temp OOS entities exist (`input_boolean.dsc_*_temp_oos`); do not force a fail
- [ ] Dryback / coherence sensors present (track-only)

## Pot flash sub-soak (when N-017 flashing)

After each pot reaches **5.1.3**:

- [ ] Migrate once from Strains; confirm pot strain/sprout match intended HA values (when defaults allowed copy)
- [ ] Want / days-since / expected stage still coherent
- [ ] Pot offline briefly → catalog falls back to HA `input_*` without template errors

## Sign-off

| Role | Date | Notes |
|---|---|---|
| | | Gate SHA / run id: |
| | | Pots flashed / migrate: |
| | | N-010 carry: |
