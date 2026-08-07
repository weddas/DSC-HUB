# DSC-HUB — Install (from scratch)

Fresh Home Assistant + ESPHome bring-up for the live train:
**firmware 5.2.0** (ETH01 bridge + SoftAP Anchor) and **HA surface 6.0.0**
(React `/dsc-hub` panel).

Repo: https://github.com/weddas/DSC-HUB · branch **`master`**
(last tagged release may still be **v5.1.0** until a 5.2 tag ships).

> **Lab scaffold path.** Product unbox without HA is SoftAP — [`SETUP.md`](SETUP.md).
> Pi brain / local webserver destination: [`docs/DSC-BRAIN.md`](docs/DSC-BRAIN.md).
> HA iteration rules: [`docs/HA-SCAFFOLD.md`](docs/HA-SCAFFOLD.md).

**Preferred ongoing delivery (lab HA):** HAOS add-on — [`scripts/ADDON.md`](scripts/ADDON.md)  
**Kit SoftAP (product / no HA first):** [`SETUP.md`](SETUP.md)  
**Upgrading an existing site:** [`UPGRADE.md`](UPGRADE.md)

---

## File → destination map

| Repo source | Destination |
|---|---|
| `homeassistant/packages/dsc_v4_*.yaml` | `/config/packages/` |
| `homeassistant/custom_components/dsc_hub/` | `/config/custom_components/dsc_hub/` (React panel) |
| `homeassistant/dashboards/dsc-hub-v4-dashboard.yaml` | `/config/dashboards/` (YAML fallback; sidebar hidden) |
| `homeassistant/dashboards/dsc-build-plant-dashboard.yaml` | `/config/dashboards/` (redirect stub) |
| `homeassistant/esphome/dsc-*.yaml` | `/config/esphome/` |
| `homeassistant/www/dsc-system-map.*` | `/config/www/` (bundled cards for LegacyCardHost) |
| `homeassistant/www/dsc-catalog/*.json` | `/config/www/dsc-catalog/` (Build a Plant typeahead) |
| `firmware/v4/secrets.yaml.template` | `/config/esphome/secrets.yaml` (fill in; never commit) |

Merge [`homeassistant/configuration.snippet.yaml`](homeassistant/configuration.snippet.yaml)
into `configuration.yaml` (`dsc_hub:` + YAML dashboards **`dsc-hub-pro`** /
**`dsc-build-plant`** with `show_in_sidebar: false`).

### Add-on (recommended)

1. Settings → Add-ons → Repositories → `https://github.com/weddas/DSC-HUB`
2. Install **DSC-HUB Sync** **5.1.4** → Start (defaults include `sync_esphome: true`)
3. Wait for “Synced to …” · confirm `/config/dsc-hub-sync.version`
4. Merge configuration snippet → **Restart HA Core once** (helpers + panel register)

Further pushes to `master` update packages / Pro dashboard / www / stubs automatically.
Firmware Install stays **manual**.

---

## 0. Prerequisites

- HAOS + ESPHome add-on
- HACS cards listed in [`homeassistant/README.md`](homeassistant/README.md)
- Fixed 2.4 GHz channel for hub + panel + pots
- Filled `/config/esphome/secrets.yaml`

### Notify target (edit once)

Set `input_text.dsc_notify_service` to your mobile notify entity, e.g.
`notify.mobile_app_your_phone`. Climate alerts call `script.dsc_notify`
([`dsc_v4_notify.yaml`](homeassistant/packages/dsc_v4_notify.yaml)).

---

## 1. Packages (all `dsc_v4_*.yaml`)

Includes core helpers, climate physics, **Learn Phase A+B**, light helpers, tank,
pots stats/correlation/alerts, alert count, automations, **version/fleet status**,
**root zone coldest/hottest**, notify.

After first 5.1 sync: restart Core once if Phase B / fleet sensors are missing.

Suggested recorder includes (optional): learn eff/samples, ladder wait numbers,
fire countdowns, fleet version status.

---

## 2. Product UI

Sidebar **DSC-HUB** opens the React panel at **`/dsc-hub`** (surface **6.0.0**).
YAML **`dsc-hub-pro`** remains a hidden Lovelace fallback. Ops checklist:
[`docs/qa/LIVE-UI-CUSTOM-PANEL.md`](docs/qa/LIVE-UI-CUSTOM-PANEL.md) ·
[`docs/qa/LIVE-UI-BUILD-A-PLANT.md`](docs/qa/LIVE-UI-BUILD-A-PLANT.md).
Disable any storage dashboard still named DSC-HUB / `dsc-hub-v4` that fights the panel.

---

## 3. ESPHome stubs

| Stub | Body | Expect after flash |
|---|---|---|
| `dsc-hub.yaml` | hub v4_0 + espnow | **5.2.0** |
| `dsc-control.yaml` | control-common | **5.2.0** |
| pots | pot-common | **5.2.0** |
| `dsc-bridge.yaml` | bridge-common + SoftAP Anchor | **5.2.0** |
| Sonoffs | sonoff-common (dual API client) | **5.2.0** |

Stub `ref: master` (or tag when cut). Kits Validate even if not flashed on lab.
Bridge needs `firmware/v4/components/dsc_api_client` beside the stub (Sync
copies components, or flash from `firmware/v4/`). Secrets: `dsc_bridge_*`,
`dsc_anchor_ap_password`, four `dsc_*_host`.

### Flash order

1. Hub · 2. Panel · 3. Pots · 4. **Bridge (ETH01)** · 5. Sonoffs

### Verify

- [ ] `sensor.dsc_hub_firmware_version` = **5.2.0** (and peers / bridge)
- [ ] `sensor.dsc_ha_surface_version` = **6.0.0**
- [ ] `input_text.dsc_expected_release` = **5.2.0** (fleet firmware train)
- [ ] `sensor.dsc_fleet_version_status` → **ok** after all flashes
- [ ] Sidebar **DSC-HUB** → `/dsc-hub` (Ops · Plant · Advanced · System)
- [ ] Panel ESP-NOW UP; Bridge Anchor SoftAP up; Sonoffs follow via bridge (HA followers fallback)
- [ ] System view shows bridge / Anchor BSSID / Sonoff API links

---

## Day-to-day

```
Cursor edit → push master
  → DSC-HUB Sync (~60s) → packages / dashboard / www / stubs
  → Restart HA once if new helpers
  → ESPHome Validate/Install (changed devices only)
```

See [`RELEASE.md`](RELEASE.md) rollout checklist · [`docs/qa/`](docs/qa/).
