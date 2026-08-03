# Live soak — HA surface 5.1.4 (post-deploy / N-010)

Timed soak after packages + dashboard are **actually on HAOS**. Complements the
click-through checklist (`LIVE-UI-5.1.4.md` when merged) and
[`FOLLOWUPS.md`](../FOLLOWUPS.md) **N-010**.

**Do not start this soak** until the deploy gate passes:

| Gate | Expect |
|---|---|
| Delivery | Sync add-on tip **or** GHA **HA sync** success (e.g. run `30809723980`) |
| Surface | `sensor.dsc_ha_surface_version` = **5.1.4** |
| Runner (GHA path) | `unraid-ha-deploy` online; Autostart ON on Unraid |
| Core | Restarted once after new `input_*` helpers |

Incident close (**N-009**): runner outage left `e0ffeaf` on GitHub only until
evening recovery; both add-on and Actions paths then reported tip / surface
**5.1.4**. Bootstrap recover steps:
[`../../scripts/HA-SYNC-BOOTSTRAP.md`](../../scripts/HA-SYNC-BOOTSTRAP.md).

## Window

Soak **25–30 min** after the gate. Record T0 / T+10 / T+25 (or similar).

```mermaid
flowchart LR
  gate["Surface = 5.1.4"] --> t0["T0 baseline"]
  t0 --> mid["T+10"]
  mid --> end["T+25"]
  end --> sign["Sign soak / carry FOLLOWUPS"]
```

## Fleet regression (must stay healthy)

| Check | T0 | T+10 | T+25 |
|---|---|---|---|
| Hub link | | | |
| Full Auto | | | |
| Tent T / RH | | | |
| Dehum / hum demand | | | |
| Alert count | | | |
| AC / mister / POT3 in-service | | | |
| In-service pots | | | |

Expect: no climate regression vs pre-deploy soak; reduced-kit soft cues only
(no OOS alert spam). Alert count should not jump solely from missing entities.

## New 5.1.4 entities (presence + sanity)

- [ ] `sensor.dsc_pot*_got_ph` / `_ec` / `_moisture` for in-service pots
- [ ] `sensor.dsc_pot*_dryback_pct` present (track-only — no irrigation)
- [ ] `sensor.dsc_next_mix_recipe` renders; Accept mix is bookkeeping only
- [ ] `binary_sensor.dsc_humidifier_available` /
      `dsc_dehumidifier_available` /
      `dsc_clone_humidifier_available` exist
- [ ] Strains + Nutrient Science views load without missing-entity red cards
- [ ] Climate Temp OOS (flash) vs Operator Lockout (solid) cards present

## Efficacy / Temp OOS (observe, do not force)

Only if a humidity appliance actually runs ≥5 min during the window:

- [ ] Pass path: no false Temp OOS; learned ΔRH may update
- [ ] Fail path (if seen): Temp OOS latches, demand forced off, notify fired
- [ ] Lockout left untouched by Temp OOS clear scripts

If no appliance runs, note “no efficacy sample” — do not invent a fail.

## Dual delivery (optional cross-check)

- [ ] If both paths exist: add-on log tip ≈ Actions head SHA (same surface)
- [ ] HACS / local `DSC-HUB.js` still loads if airflow / system map cards used
      (separate from package sync — see [`HACS-FRONTEND.md`](../../scripts/HACS-FRONTEND.md))

## Sign-off

| Role | Date | Notes |
|---|---|---|
| | | Gate SHA / run id: |
| | | N-010 carry: |

Append results under a dated section in [`../FOLLOWUPS.md`](../FOLLOWUPS.md).
