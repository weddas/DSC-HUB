# DSC-HUB firmware v4

ESPHome configs for the whole kit. **Train 8.0.0.0** — ESPHome-only (no
`platform: homeassistant` anywhere), pinned `esphome: min_version: "2026.6.5"`.
The Pi brain is the control source of truth; devices talk to it over the ESPHome
native API and to each other over ESP-NOW.

| Device | Stub (lab / Pi LAN) | Stub (kit SoftAP setup) | Package body |
|---|---|---|---|
| Hub | `dsc-hub.yaml` | `dsc-hub-kit.yaml` | `dsc-hub-v4_0.yaml` + `dsc-hub-fleet-heal.yaml` + `dsc-hub-espnow-{parked,primary}.yaml` |
| DSC-CONTROL panel (CYD) | `dsc-control.yaml` | `dsc-control-kit.yaml` | `dsc-control-common.yaml` (+ `cyd_glyphs.yaml`) |
| Probes 1–4 | `dsc-pot{1..4}.yaml` | `dsc-pot{1..4}-kit.yaml` | `dsc-pot-common.yaml` |
| Sonoffs | `dsc-heater.yaml` `dsc-heatmat.yaml` `dsc-humidifier.yaml` `dsc-de-humidifier.yaml` | — (LAN WiFi) | `dsc-sonoff-common.yaml` |

Probe devices are named `dsc_probeN` on the wire; their YAML files stayed
`dsc-potN.yaml` (the brain's job map and every script use those names).
The WT32-ETH01 appliance bridge is retired to [`../_history/v4/`](../_history/v4/)
— the Pi drives the Sonoffs directly.

Wi‑Fi is split into `dsc-*-wifi-pi.yaml` / `-lab.yaml` / `-kit.yaml` so kit builds
carry no compile-time SSID. Package bodies are `!secret`-free; stubs pass
credentials, `espnow_key`, hub/panel MACs and `espnow_cmd_tag` (**54727**) as
substitutions. Custom components: [`components/`](components/) (`dsc_fleet_setup`
phone portal, `dsc_anchor_ap`, `dsc_api_client`).

## Build & flash

Day to day this happens on the Pi: **Settings → Device → ESPHome** (compile, OTA,
canary → fleet rollout, toolchain update). The Pi keeps a copy of this folder
(`/opt/dsc-hub/firmware/v4` on a baked kit, `/opt/dsc-hub-repo/firmware/v4` on a
remote deploy) and serves it from the ESPHome dashboard on `:6052`.
[`../../docs/ops/ESPHOME-TOOLCHAIN.md`](../../docs/ops/ESPHOME-TOOLCHAIN.md).

Locally (bench, USB):

```bash
cd firmware/v4            # needs secrets.yaml here (gitignored)
esphome run dsc-hub-kit.yaml
esphome run dsc-control-kit.yaml
esphome run dsc-pot1-kit.yaml
```

Kit binaries for the USB flash wizard are produced by
[`../../services/dsc-hub/image/bake-firmware.sh`](../../services/dsc-hub/image/bake-firmware.sh)
from the `-kit` stubs (factory image for ESP32, plain image for ESP8266) — the
bake owns `secrets.yaml` and ships the same file in the SD image.

## Validate before a re-cut

```bash
cd firmware/v4
for y in dsc-hub.yaml dsc-hub-kit.yaml dsc-control.yaml dsc-control-kit.yaml \
         dsc-pot1.yaml dsc-pot1-kit.yaml dsc-heater.yaml dsc-heatmat.yaml \
         dsc-humidifier.yaml dsc-de-humidifier.yaml; do esphome config "$y" >/dev/null && echo "ok $y"; done
python ../../scripts/cyd_glyph_audit.py && python ../../scripts/cyd_layout_check.py && python ../../scripts/fleet_fix_sim.py
g++ -std=c++17 -Wall -Wextra -O2 -o verify_v4 verify_v4.cpp && ./verify_v4
```

`verify_v4.cpp` checks the ESP-NOW wire contract (0xD1–0xD4, 0xDC pack/unpack
sizes, shared tag). On Windows, compile from a local (non-UNC) copy of this
folder — PlatformIO cannot build from a network path.

Bumping the train: `project: version` in the four package bodies **and** the
`firmware_version` text-sensor lambdas (hub, panel, probe, Sonoff) **and** the
panel boot-log / about-screen strings, then `EXPECTED_FIRMWARE` in
`brain/dsc_brain/paths.py` and the compose default. Add a `CHANGELOG.md` line.

## Panel (DSC-CONTROL)

Package body [`dsc-control-common.yaml`](dsc-control-common.yaml). ESP-NOW-fed
glass: vitals/config/soil/names (0xD1–0xD4) in, commands (0xDC) out via
`homeassistant.event` → brain (the panel → hub command channel; an ESPHome
dialect, not a Home Assistant). Runs with the API peer down. Native API is
**plaintext** (no Noise — LVGL RAM) and **mDNS off** — add by IP.

| Feature | Notes |
|---|---|
| Soil cards + detail | 0xD3 vitals / 0xD4 names; tap a probe → NPK drill-down |
| Hold-to-lock | Hold ~3 s on primary tabs; hold lock screen to unlock |
| Demand / takeover gate | Confirm → Engage (not one stray tap) |
| Connections | Wi‑Fi channel; ESP-NOW RX age + TX seq; silent → ping/WiFi bounce |
| AP pin | Runtime only: hub **Lock WiFi AP** learns the preferred BSSID into NVS. Stubs stay `00:00:00:00:00:00` — never bake a site MAC into YAML. |
| Boot | Page-gated `refresh_ui`; serial shows `DSC-CONTROL 8.0.0.0 … free_heap=…`. A boot-looping panel needs **USB**, not OTA. |

Crash archaeology: [`../_history/v4/crash-logs/`](../_history/v4/crash-logs/).

**Package header rule:** changelog lines in the package bodies must stay `#`
comments — an uncommented `v4.0.11:`-style line is parsed as YAML and the build
dies before `substitutions:`.

## Probes

`dsc-pot-common.yaml`: RS485 Modbus 7-in-1 NPK soil probe. Each soil channel has
**Cal … Offset** / **Cal … Scale** config numbers (NVS); `raw * scale + offset`
applies before range/median and feeds the brain + ESP-NOW. **Reset Sensor
Calibration** restores defaults; **Mark Soil Cal …** buttons stamp provenance.
Entity ids `sensor.dsc_probeN_soil_*` are a contract with the brain.

## Hub mat votes

`Mat Vote Pot 1`–`4` (`switch.dsc_hub_mat_vote_pot_N`): OFF pots are skipped by
coldest/hottest root-zone voting (5–45 °C filter still applies). Root-zone input
is ESP-NOW-only (150 s freshness gate).

Fleet bring-up: [`../../SETUP.md`](../../SETUP.md) · upgrades:
[`../../UPGRADE.md`](../../UPGRADE.md).
