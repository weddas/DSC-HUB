# DSC-HUB firmware v4

Working directory for ESPHome configs. See the repo [README](../../README.md) for the full setup.

## Local vs HA

| Where | What |
|---|---|
| Here (`firmware/v4/`) | Stubs `!include` package bodies for Cursor edits + local flash. |
| [`homeassistant/esphome/`](../../homeassistant/esphome/) | Same stubs with **git-pull** packages from GitHub. |

Entry points (local): `dsc-hub.yaml`, `dsc-control.yaml`, `dsc-heater.yaml`, `dsc-pot1.yaml`, …

Package bodies are remote-git safe (no `!secret`). Stubs pass credentials (and hub/panel MACs + `espnow_cmd_tag`) as substitutions.

Pots (`dsc-pot-common` **4.0.1+**): each soil channel has **Cal … Offset** / **Cal … Scale** config numbers (NVS). Formula `raw * scale + offset` applies before range/median and feeds HA + ESP-NOW. **Reset Sensor Calibration** restores defaults.

## Panel (DSC-CONTROL **4.0.8**)

Package body: [`dsc-control-common.yaml`](dsc-control-common.yaml).

| Feature | Notes |
|---|---|
| Soil cards + detail | 0xD3 vitals / 0xD4 names; tap pot → NPK drill-down |
| Hold-to-lock | Hold ~3 s on primary tabs; hold lock screen to unlock |
| Demand / takeover gate | Confirm → Engage (not one stray tap) |
| Connections | Wi‑Fi channel; ESP-NOW RX age + TX seq |
| Pulse VPD trend | 12×5 min ring → one label (no canvas charts) |

After UI flashes: watch serial `boot` / `heap` lines. If the panel boot-loops, use **USB** not OTA until `DSC-CONTROL 4.0.8 up — free_heap=…` prints cleanly. See [`../_history/v4/crash-logs/`](../_history/v4/crash-logs/).

### Panel HA API reconnect

The `api:` block lives in [`dsc-control-common.yaml`](dsc-control-common.yaml) (`encryption.key: ${api_key_val}` from the stub’s `!secret dsc_control_api_key`). Same pattern as hub/pots. ESPHome’s “Unable to connect… includes an `api` section” toast is **generic** — it does **not** mean the YAML is missing `api:`.

| Check | What to do |
|---|---|
| Panel boot-looping / no Wi‑Fi | USB flash; serial must show `DSC-CONTROL 4.0.8 up — free_heap=…`. OTA will not recover a looping board. |
| Host / mDNS | Prefer IP: ESPHome Logs → use panel IP, or HA → add/reconfigure `192.168.x.x` not only `dsc-control.local`. |
| Encryption key | Paste **`dsc_control_api_key`** from `/config/esphome/secrets.yaml` (include trailing `=`). Must match the key compiled into the flash. |
| Stale `dsc-cyd1` | Delete old **dsc-cyd1** ESPHome device in HA Integrations if present; re-add **dsc-control** with the current key. |
| Secrets on HA | Confirm `dsc_control_api_key` / `_ota_password` / `_ap_password` exist (aliases `dsc_cyd1_*` are the same values). |
| Stub on HA | `/config/esphome/dsc-control.yaml` should match [`homeassistant/esphome/dsc-control.yaml`](../../homeassistant/esphome/dsc-control.yaml); Validate before Install. |

ESP-NOW (glass ↔ hub) does **not** need the HA API. Fix API only for OTA, diagnostics, and HA time backup.

## Hub mat votes

In [`dsc-hub-v4_0.yaml`](dsc-hub-v4_0.yaml): `Mat Vote Pot 1`–`4` (`switch.dsc_hub_mat_vote_pot_N`). OFF pots are skipped by coldest/hottest root-zone voting (5–45 °C filter still applies). POT3 defaults OFF.

## Quick validate

```bash
esphome config dsc-hub.yaml
esphome config dsc-control.yaml
esphome config dsc-heater.yaml
esphome config dsc-pot1.yaml
g++ -std=c++17 -Wall -Wextra -O2 -o verify_v4 verify_v4.cpp && ./verify_v4
```

Requires `secrets.yaml` in this folder (gitignored). Start from `secrets.yaml.template` if needed.

`espnow_cmd_tag` is **54727** (`0xD5C7`) on hub + panel — flash both after changing it.

Fleet bring-up / cutover: [`../../INSTALL.md`](../../INSTALL.md) · [`../../UPGRADE.md`](../../UPGRADE.md).
