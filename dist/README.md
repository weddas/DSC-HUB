# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](.). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

**Bundle concat:** system-map → airflow → three.min → dsc-dash-fx → the-dash →
build-plant → catalog-browse → app-nav (order may grow). Tip umbrella after
waves bar-raise is ~**1.0–1.02 MB** (`homeassistant/www/DSC-HUB.js`); do not treat
older “~941 KB” notes as current. Also ships `dsc-catalog/*.json` (Build a
Plant typeahead — Sync / ha-sync copy these under `/config/www/dsc-catalog/`;
HACS alone does not).

After editing cards or catalog indexes, run:

```bash
bash scripts/sync-hacs-dist.sh
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.
Verify with `git diff -- dist/` empty after a local sync.

Install: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md) ·
Build a Plant: [`../docs/qa/LIVE-UI-BUILD-A-PLANT.md`](../docs/qa/LIVE-UI-BUILD-A-PLANT.md) ·
Panel bar-raise: [`../docs/qa/LIVE-UI-BAR-RAISE.md`](../docs/qa/LIVE-UI-BAR-RAISE.md).
