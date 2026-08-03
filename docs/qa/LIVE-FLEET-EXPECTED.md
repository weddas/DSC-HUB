# Live check — fleet expected vs HA surface

Operator check after an HA surface bump that does **not** raise the firmware
train. Triggered by keeping `input_text.dsc_expected_release` on **5.1.3** while
`sensor.dsc_ha_surface_version` stays **5.1.5** (`e818568`).

Full runbook: [`../../homeassistant/README.md`](../../homeassistant/README.md)
(Fleet expected vs HA surface).

## Intent

| String | Entity | Expect now |
|---|---|---|
| Firmware train | `input_text.dsc_expected_release` | **5.1.3** |
| HA packages / dashboard | `sensor.dsc_ha_surface_version` | **5.1.5** |
| Aggregate chip | `sensor.dsc_fleet_version_status` | `ok` when all reporting devices + surface share major.minor **5.1** and none missing |

Do not bump expected release just because the surface patch moved.

```mermaid
flowchart LR
  sync["Sync lands packages"] --> surf["Confirm surface 5.1.5"]
  surf --> exp["Confirm expected 5.1.3"]
  exp --> table["System fleet table"]
  table --> chip["Home FLEET chip"]
```

## Deploy gate

- [ ] `sensor.dsc_ha_surface_version` = **5.1.5**
- [ ] `input_text.dsc_expected_release` = **5.1.3**
  (package `initial:` does **not** rewrite an existing helper — edit on System
  → Fleet version table if Sync left 5.1.4 / 5.1.5)
- [ ] Fleet table **Expected** attribute matches **5.1.3**; **HA surface** row shows **5.1.5**
- [ ] Home pulse chip label uses expected (`FLEET 5.1.3` when `ok`), not the surface patch

## Drift vs missing

- [ ] Hub / in-service pots report Firmware Version on **5.1.x** (hub/pots target **5.1.3**)
- [ ] Panel lean-cut **5.1.x** (e.g. 5.1.14) counts as on-train — not drift
- [ ] If chip is `warn`, open fleet table: off-train version **or** `unknown`/`unavailable` (e.g. POT3 offline) — do not “fix” by setting expected to 5.1.5

## Pitfalls

| Symptom | Likely cause | Fix |
|---|---|---|
| Expected still 5.1.5 after Sync | `input_text` `initial` only on first create | Set Expected release tag to **5.1.3** |
| Chip `warn` with all FW on 5.1.x | Missing device in checks | Bring device online or accept reduced-kit warn |
| Chip shows `FLEET 5.1.5` when ok | Expected was set to surface patch | Set expected to firmware train **5.1.3** |

Carry: [`../FOLLOWUPS.md`](../FOLLOWUPS.md).
