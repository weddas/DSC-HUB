# ==================================================================
#  HA ESPHome stubs — pull shared packages from GitHub
#  ------------------------------------------------------------------
#  Copy these YAML files into /config/esphome/ on Home Assistant.
#  Keep secrets.yaml there (never from git).
#
#  Workflow:
#    1. Edit + push in Cursor (firmware/v4/)
#    2. ESPHome Validate/Install → refreshes package from master
#    3. Flash only the devices that need that change
#    4. Hub + panel: flash as a pair if espnow_cmd_tag / wire contract changed
#
#  Repo: https://github.com/weddas/DSC-HUB  ·  ref: v4.0.0-alpha.1
#  refresh: 1d (use 0d temporarily to force a re-pull after a push)
# ==================================================================

## Devices in this folder

| Stub | Pulls from git |
|---|---|
| `dsc-hub.yaml` | `dsc-hub-v4_0.yaml` **and** `dsc-hub-espnow-primary.yaml` |
| `dsc-control.yaml` | `dsc-control-common.yaml` (+ `cyd_glyphs.yaml` via sibling `!include`) |
| `dsc-heater` / `heatmat` / `humidifier` / `de-humidifier` | `dsc-sonoff-common.yaml` |
| `dsc-pot1` … `dsc-pot4` | `dsc-pot-common.yaml` |

## Install

1. Ensure `/config/esphome/secrets.yaml` has the keys from
   `firmware/v4/secrets.yaml.template`.
2. Copy every `dsc-*.yaml` from this folder into `/config/esphome/`.
3. Validate each device, then Install as needed.
4. After a push: Validate (or set `refresh: 0d` once to force re-pull).

## Do not

- Auto-flash the fleet on every git push
- Commit HA `secrets.yaml`
- Change `espnow_cmd_tag` on only one of hub/panel

## Bundle / Validate failures

| Symptom | Likely cause | Fix |
|---|---|---|
| `Failed to load packages` · `… is not a valid YAML file` · `expected '<document start>'` | Package body header comment missing `#` (e.g. bare `v4.0.11:` before `substitutions:`) | Fix + push on GitHub; set stub `refresh: 0d`; Validate again |
| Stale package after a known-good push | ESPHome cache still on old commit | `refresh: 0d` once, Validate, then restore `1d` |

Full install / upgrade: [`../../INSTALL.md`](../../INSTALL.md) · [`../../UPGRADE.md`](../../UPGRADE.md). Panel HA tips: [`../../firmware/v4/README.md`](../../firmware/v4/README.md).
