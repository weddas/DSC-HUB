# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](.). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

**Bundle concat** (`scripts/sync-hacs-dist.sh`):

`system-map` → `airflow` → `three.min` → `dsc-dash-fx` → `the-dash` →
`build-plant` → `app-nav` → `catalog-browse`.

Healthy size ~**1013 KB** (~1.0 MB). Also ships `dsc-catalog/*.json` (Build a
Plant typeahead — Sync / ha-sync copy these under `/config/www/dsc-catalog/`;
HACS alone does not).

After editing cards or catalog indexes, run:

```bash
./scripts/sync-hacs-dist.sh
git diff --stat -- dist/   # must be empty before merge
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.
PRs that touch `www/` or `dist/` fail when `dist/` is stale.

Install: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md) ·
Build a Plant: [`../docs/qa/LIVE-UI-BUILD-A-PLANT.md`](../docs/qa/LIVE-UI-BUILD-A-PLANT.md) ·
Twin keep-alive: [`../docs/qa/LIVE-UI-CUSTOM-PANEL.md`](../docs/qa/LIVE-UI-CUSTOM-PANEL.md).
