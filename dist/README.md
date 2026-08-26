# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](.). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

**Bundle concat** (`scripts/sync-hacs-dist.sh`):

`system-map` → `airflow` → `three.min` → `dsc-dash-fx` → `the-dash` →
`build-plant` → `app-nav` → `catalog-browse`.

Healthy tip size ~**1011 KB** (1 035 171 B). Also ships standalone
`dsc-*-card.js` + `dsc-catalog/*.json` (Build a Plant typeahead — Sync / ha-sync
copy indexes under `/config/www/dsc-catalog/`; HACS alone does not).

After editing cards or catalog indexes, run:

```bash
bash scripts/sync-hacs-dist.sh   # keep +x on the script
git diff --stat -- dist/         # must be empty before merge / before trusting CI sync
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.
PRs that touch `www/` or `dist/` fail when `dist/` is stale.

Install: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md) ·
Airflow LIGHT entities: [`../docs/qa/AIRFLOW-MAP-LIGHT-ENTITIES.md`](../docs/qa/AIRFLOW-MAP-LIGHT-ENTITIES.md) ·
Build a Plant: [`../docs/qa/LIVE-UI-BUILD-A-PLANT.md`](../docs/qa/LIVE-UI-BUILD-A-PLANT.md) ·
Twin / panel: [`../docs/qa/LIVE-UI-CUSTOM-PANEL.md`](../docs/qa/LIVE-UI-CUSTOM-PANEL.md).
