# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](.). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

**Bundle concat:** system-map → airflow → three.min → dsc-dash-fx → the-dash →
**build-plant**. Healthy size ~941 KB. Also ships `dsc-catalog/*.json` (Build a
Plant typeahead — Sync / ha-sync copy these under `/config/www/dsc-catalog/`;
HACS alone does not).

After editing cards or catalog indexes, run:

```bash
./scripts/sync-hacs-dist.sh
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.

Install: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md) ·
Build a Plant: [`../docs/qa/LIVE-UI-BUILD-A-PLANT.md`](../docs/qa/LIVE-UI-BUILD-A-PLANT.md).
