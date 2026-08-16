# DSC-HUB — HACS Dashboard plugin

Published from [`dist/`](.). Source of truth: [`homeassistant/www/`](../homeassistant/www/).

**Bundle concat:** system-map → airflow → three.min → dsc-dash-fx → the-dash →
**build-plant**. Healthy size ~**1.05 MB** tip (`DSC-HUB.js` after HACS sync).
Also ships `dsc-catalog/*.json` (Build a Plant typeahead — Sync / ha-sync copy
these under `/config/www/dsc-catalog/`; HACS alone does not).

After every `chore(hacs): sync dist/` commit, confirm `git diff -- dist/` is
empty locally before trusting the packaging. Twin / Dash IIFE lives in
`dsc-the-dash-card.js` — keep www and `dist/` copies aligned (see
[`docs/qa/LIVE-UI-KIT-PULSE.md`](../docs/qa/LIVE-UI-KIT-PULSE.md)).

After editing cards or catalog indexes, run:

```bash
./scripts/sync-hacs-dist.sh
```

Or push to `master` and let [`.github/workflows/hacs-dist.yml`](../.github/workflows/hacs-dist.yml) sync.

Install: [`../scripts/HACS-FRONTEND.md`](../scripts/HACS-FRONTEND.md) ·
Build a Plant: [`../docs/qa/LIVE-UI-BUILD-A-PLANT.md`](../docs/qa/LIVE-UI-BUILD-A-PLANT.md).
