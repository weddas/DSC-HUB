# DSC-HUB — Session orientation

## 2026-09-06 — HA lab retired (Pi-only)

Repo is Pi product only:
- SPA: `frontend/` (`npm run build` → `spa-dist/`)
- Catalogs: `data/`
- Brain: `brain/` (`DATA_DIR` → `data/`)
- Removed: `homeassistant/`, HACS `dist/`, `dsc-hub-sync/`, ha-sync CI

HA-shaped entity IDs + `/control/service` remain as the brain↔SPA dialect.

## 2026-09-05 — Add-a-Plant + FleetProvider live on Pi

Hotpatched when Pi recovered; soak Add-a-Plant assign on live.
