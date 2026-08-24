# DSC-HUB firmware v4

Working directory for ESPHome configs.

| Train | Version | WiFi package | Notes |
|---|---|---|---|
| **Pi product** | **7.0.0.0** | `dsc-*-wifi-pi.yaml` | `10.42.0.0/24` via `DSC-Brain` AP; hub ESP-NOW **parked** |
| HA lab (prior) | 6.1.0.0 / SoftAP 6.0.0.0 | lab / SoftAP packages | Do not conflate IPs with Pi map |
| Kit SoftAP | kit train | `*-kit.yaml` + `dsc-*-wifi-kit.yaml` | Unbox without Pi — [`SETUP.md`](../../SETUP.md) |

Pi ops: [`docs/qa/PI-APPLIANCE-7.0.md`](../../docs/qa/PI-APPLIANCE-7.0.md).  
Firmware QA (historical): [`docs/qa/FIRMWARE-QA-5.1.0.md`](../../docs/qa/FIRMWARE-QA-5.1.0.md).  
HA lab bring-up: [`INSTALL.md`](../../INSTALL.md).

## Local vs HA vs Pi

| Where | What |
|---|---|
| Here (`firmware/v4/`) | Stubs `!include` package bodies for Cursor edits + local flash. |
| [`homeassistant/esphome/`](../../homeassistant/esphome/) | Same stubs with **git-pull** packages (lab). |
| Pi ESPHome container | Mounts this tree at `:6052` on the appliance. |

**Pi product entry points:** `dsc-hub.yaml`, `dsc-control.yaml`, `dsc-pot{1..4}.yaml`, Sonoff stubs — include `*-wifi-pi.yaml`. Hub includes `dsc-hub-espnow-parked.yaml`. Sonoffs follow hub demand via brain `appliance_driver` (not ETH01).

**Kit SoftAP:** `dsc-hub-kit.yaml`, `dsc-control-kit.yaml`, `dsc-pot{1..4}-kit.yaml`, `dsc-bridge-kit.yaml` + `components/dsc_fleet_setup/`. Bridge SoftAP `DSC-Anchor` + `dsc_api_client` remain kit/lab archaeology.

Package bodies are remote-git safe (no `!secret`). Stubs pass credentials (and hub/panel MACs + `espnow_cmd_tag`) as substitutions.

Pots (`dsc-pot-common`): soil **Cal Offset/Scale** (`raw * scale + offset`); Reset / Mark Cal buttons stamp provenance. See CHANGELOG.

## Panel (DSC-CONTROL)

Package body: [`dsc-control-common.yaml`](dsc-control-common.yaml).

On **Pi path**, glass uses Native API on `10.42.0.11` (ESP-NOW parked). Kit SoftAP builds still use ESP-NOW vitals.

| Feature | Notes |
|---|---|
| Soil cards + detail | Pot vitals / names |
| Hold-to-lock | Hold ~3 s on primary tabs |
| Demand / takeover gate | Confirm → Engage |
| Stability | Watch serial `boot` / `heap`; USB if boot-looping |

**Package header rule:** changelog lines in package bodies must stay `#` comments — an uncommented `v4.0.x:` line breaks Validate/`not a valid YAML file`.

Lab-era HA plaintext API / Nest `.177` reconnect notes apply only to older lab stubs, not Pi `wifi-pi`.

## Hub mat votes

In [`dsc-hub-v4_0.yaml`](dsc-hub-v4_0.yaml): `Mat Vote Pot 1`–`4` (`switch.dsc_hub_mat_vote_pot_N`). OFF pots are skipped by coldest/hottest root-zone voting (5–45 °C filter still applies). POT3 defaults OFF.

## Quick validate

```bash
esphome config dsc-hub.yaml
esphome config dsc-control.yaml
esphome config dsc-heater.yaml
esphome config dsc-pot1.yaml
```

Requires `secrets.yaml` in this folder (gitignored). Start from `secrets.yaml.template`.

`espnow_cmd_tag` is **54727** (`0xD5C7`) on hub + panel for kit/parked builds — flash both after changing it.

Fleet bring-up: Pi → [`docs/qa/PI-APPLIANCE-7.0.md`](../../docs/qa/PI-APPLIANCE-7.0.md) · Kit → [`SETUP.md`](../../SETUP.md) · HA lab → [`INSTALL.md`](../../INSTALL.md).
