# Fleet ingest + appliance path (7.1.1)

**Intent:** Document how Pi brain turns hub/panel/pot/Sonoff Native API traffic and Zigbee MQTT into fleet truth and Sonoff relays — including the 7.1.1 closeout fixes. Verified against tip `eded53c`.

**Acceptance / soak:** [`LIVE-ACCEPTANCE-7.1.md`](../qa/LIVE-ACCEPTANCE-7.1.md) · [`SOAK-2026-08-26.md`](../ops/SOAK-2026-08-26.md)  
**Flash / AP heal:** [`SONOFF-FLASH.md`](../ops/SONOFF-FLASH.md) · **Cutover:** [`DSC-HUB-DOCKER.md`](../ops/DSC-HUB-DOCKER.md)

## Architecture

```mermaid
flowchart LR
  hub[Hub ESPHome] -->|Noise Native API| ingest[esphome_client]
  panel[DSC-CONTROL] -->|plaintext Native API| ingest
  pots[Pots] -->|Noise Native API| ingest
  sonoffs[Sonoffs] -->|Noise Native API| ingest
  z2m[Zigbee2MQTT] -->|MQTT| zig[zigbee_mqtt]
  ingest --> fleet[FleetState]
  zig --> fleet
  hub -->|demand OIDs| appl[appliance_driver]
  appl -->|host_lock + main_relay| sonoffs
  cal[device_calibration] --> computed[computed_ops]
  fleet --> computed
  computed --> spa[SPA /fleet/computed]
```

ETH01 bridge is **retired** (`firmware/_history/v4/`). Product Sonoff path is `appliance_driver` only.

## Panel plaintext ingest

Panel firmware disables Noise (RAM). Ingest must not force a Noise PSK from env:

| Codepath | Behavior |
|---|---|
| `esphome_client` seat loop | If `role == "panel"`, use inventory `api_key` only — **never** `DSC_*_API_KEY` env |
| `native_api.make_api_client` | Empty key → `APIClient(host, 6053)` (plaintext); non-empty → `noise_psk=` |
| Firmware | `dsc-control-common.yaml` `api:` block — no encryption; boot/about UI strings **v7.0.0.0** / “Pi island” |

**Pitfall:** Leaving a Noise key in HA/ESPHome integration for the panel causes handshake failures. Brain inventory may store an empty panel key; that is correct for plaintext.

## Appliance driver (demand → relay)

| Item | Detail |
|---|---|
| Module | `brain/dsc_brain/appliance_driver.py` |
| Map | Hub switch object_id → seat: `heater_demand`, `humidifier_demand`, `dehumidifier_demand`, **`grow_mat_demand`** / `growmat_demand` → `heatmat` |
| Relay OID | Sonoff `main_relay` |
| Stale | No fresh hub demand for **45s** → command relays OFF |
| Poll | ~2s |
| Concurrency | `api_lock.host_lock(host)` around hub read **and** each Sonoff write (devices are single-client) |

**7.1.1 fix:** Missing `grow_mat_demand` left heatmat silent; concurrent Native API sessions without `host_lock` raced hub/Sonoff commands. Soak evidence: dehumidifier demand→relay PASS; other seats fixed in map + lock (see soak table).

```bash
# HA climate followers OFF; hub online on AP
curl -s -X POST http://10.42.0.1:8787/control/demand \
  -H 'content-type: application/json' \
  -d '{"seat":"dehumidifier","state":true}'
# Expect fleet system.relays.dehumidifier true within ~6s
```

## Calibration → computed entities

Wizards write rows via `GET|POST /settings/calibration/{device_id}`. `computed_ops.build_computed_hass_states` consumes them:

| Entity | Source | Honesty |
|---|---|---|
| `number.dsc_hub_sf1000_effective_off_pct` | Lowest dim % on `sf1000` / `light_par` curve where lux < 5 and PAR < 10 (or 0) | `measured_curve` · else `ramp_floor_fallback` |
| `binary_sensor.dsc_light_effectively_off` | Live SF1000 brightness % ≤ effective-off | — |
| `binary_sensor.dsc_live_intake_over_exhaust` | Sum intake CFM > exhaust CFM × **1.02** | Hub live gated |
| `binary_sensor.dsc_plant_specs_intake_over_exhaust` | Same breach flag for plant-specs consumers | Hub live gated |

**Constraint:** Do not invent PAR/PPFD/height from ordinal labels — curves only use measured calibration rows.

## Zigbee placement ingest

| Item | Detail |
|---|---|
| Module | `brain/dsc_brain/zigbee_mqtt.py` |
| Placement map | Setting `zigbee_placements` (JSON friendly_name→placement) **plus** inventory `extra.zigbee_friendly_name` / `friendly_name` + `extra.placement` |
| Per-device | MQTT `zigbee2mqtt/<friendly>` → `system.zigbee_device_states` |
| By placement | `system.zigbee_by_placement[placement]` |
| Canopy | Legacy aggregate; prefers payloads whose placement starts with `canopy` |
| API helpers | `get_zigbee_devices`, `get_zigbee_device_states`, `get_zigbee_by_placement` |

Empty device list until paired is OK — Settings permit-join still exercises the bridge API.

## Developer checks

```bash
pip install -r brain/requirements.txt pytest
pytest brain/tests/test_brain_pi.py -q   # includes grow_mat_demand → heatmat
# Panel API smoke (optional against live Pi)
python brain/scripts/test_panel_api.py
python brain/scripts/test_panel_fetch.py
```

## Related archaeology

Superseded ETH01 design notes: [`F010_APPLIANCE_BRIDGE.md`](F010_APPLIANCE_BRIDGE.md) (archive paths only).
