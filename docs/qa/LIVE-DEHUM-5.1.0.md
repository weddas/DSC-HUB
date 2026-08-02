# Live pass — DSC-De-Humidifier rewire after 5.1.0 flash

**Lab pass (192.168.86.3) — 2026-08-02**

Developer runbook (contract table + registry-drift fix):
[`../../homeassistant/README.md#sonoff-entity_id-contract`](../../homeassistant/README.md#sonoff-entity_id-contract).

Node reflashed to **5.1.0** (rotated keys, common package from GitHub master).
Repo config chain was already correct — hub demand switch, `dsc_follower_dehumidifier`,
node stub — but the **HA entity registry had drifted** from the entity contract.

## Root cause

The Sonoff had a past life as an eWeLink "Kitchen Light". Entities added by
later firmware were registered under stale device names, picking up
`kitchen_` / `grow_tent_` prefixes. `switch.dsc_de_humidifier_main_relay`
was correct (pre-dated the renames), so plain ON/OFF worked — but:

- `binary_sensor.dsc_de_humidifier_test_mode` missing → follower's test-mode
  guard + test-mode alert watched a void (a button bench test would be fought
  by the follower).
- `sensor.dsc_de_humidifier_firmware_version` missing → fleet version chip
  counted the dehumidifier as absent.

## Fix — entity registry renames (live, via WS API)

| Old (drifted) | New (contract) |
|---|---|
| `binary_sensor.grow_tent_dsc_de_humidifier_test_mode` | `binary_sensor.dsc_de_humidifier_test_mode` |
| `sensor.grow_tent_dsc_de_humidifier_firmware_version` | `sensor.dsc_de_humidifier_firmware_version` |
| `binary_sensor.kitchen_dsc_de_humidifier_physical_button` | `binary_sensor.dsc_de_humidifier_physical_button` |
| `sensor.grow_tent_dsc_de_humidifier_relay_on_time` | `sensor.dsc_de_humidifier_relay_on_time` |
| `sensor.grow_tent_dsc_de_humidifier_relay_last_on_time` | `sensor.dsc_de_humidifier_relay_last_on_time` |
| `sensor.grow_tent_dsc_de_humidifier_uptime` | `sensor.dsc_de_humidifier_uptime` |
| `sensor.grow_tent_dsc_de_humidifier_wifi_rssi` | `sensor.dsc_de_humidifier_wifi_rssi` |
| `sensor.grow_tent_dsc_de_humidifier_esphome_version` | `sensor.dsc_de_humidifier_esphome_version` |
| `button.grow_tent_dsc_de_humidifier_restart` | `button.dsc_de_humidifier_restart` |
| `update.kitchen_dsc_de_humidifier_firmware` | `update.dsc_de_humidifier_firmware` |

Now matches the sibling `dsc_humidifier_*` node exactly.

## Verification

- End-to-end trigger: `switch.dsc_hub_dehumidifier_demand` ON → relay ON
  (≤5 s); demand OFF → relay OFF. Passed live.
- Node health: uptime fresh post-flash, RSSI −56 dBm, firmware **5.1.0**.
- Fleet chip: dehumidifier now reports **5.1.0** vs expected 5.1.0.

## Notes / leftovers

- Fleet chip still `warn`: **pot3 unavailable** — unrelated to this node.
- Follower registered as `automation.dsc_hub_dehumidifier_follows_dehumidifier_demand_2`
  (`_2` suffix from an old duplicate). Nothing references the automation
  entity_id; cosmetic only, left as-is.
