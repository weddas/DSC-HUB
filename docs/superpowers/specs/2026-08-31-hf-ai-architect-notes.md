# Operator polish — Hugging Face / AI architect notes (2026-08-31)

**Status:** research snapshot for Wave 5 (not install/deploy)  
**Product SoT:** Pi SoftCal + Ollama / `decision_tick` remains control AI path.

## Findings (Hub MCP search)

| Asset | Link | Fit for DSC Want→Got |
|-------|------|----------------------|
| Greenhouse MBRL paper | https://huggingface.co/papers/2108.11645 · arXiv [2108.11645](https://arxiv.org/abs/2108.11645) | Closest research: model-based RL for greenhouse climate; sample efficiency + safety. Offline reference only. |
| Adaptive mgmt + RL | https://huggingface.co/papers/2303.08731 | Framing for adaptive environmental decisions — not tent-ready weights. |
| N management DRL | https://huggingface.co/papers/2204.10394 | Crop sim / DSSAT nitrogen — adjacent to feed steering, not soil probe SoftCal. |
| Greenhouse sensors DS | https://huggingface.co/datasets/Okyanus/greenhouse-sensor-data | TS sensor logs for offline experiments. |
| Cannlytics lab/strain DS | https://huggingface.co/datasets/cannlytics/cannabis_results | Lab chemistry / strains — CannaLib-adjacent, not climate control. |
| Irrigation logs model | https://huggingface.co/jadhavmanasi70/adaption_crop_irrigation_logs | Low downloads; not kit-validated. |

No HF “crop-steering Want→Got” leaderboard or tent-ready weights found for SF1000 / dual-tent kit.

## Architect gaps

1. **Control loop:** Keep Pi SoftCal + guardrailed Ollama; do not swap in unvalidated HF models for live fan/light/irrigation.
2. **Offline later:** Greenhouse MBRL paper + sensor datasets for simulation / eval harness (FOLLOWUPS), not production act.
3. **CannaLib:** Cannlytics datasets may enrich search haystack offline — separate from climate AI.
4. **Honesty:** Any future HF assist must show provenance (model id + offline vs live) — no theater gauges.

## Brainstorm (stability / polish / features)

- Page/card motion: short fade + depth on `.dsc-glass` (respect `prefers-reduced-motion`) — **shipped**
- Gauge load: animate needle/value only when real reading arrives (`is-progress` / first paint) — **shipped**
- Icons: responsive SVG already inline; strain type icons shipped Wave 2
- Twin: moisture fill + HELD + shadows shipped; Window-proxy shafts still thinner than AirPath honesty
- Performance: CannaLib Load more + local PPFD static; avoid 85MB strain index in browser
- Stability: `/fleet/computed` must never 500 on sparse history (`sensor_trust` None-guard + tests)
- Gauge extrema: clone VPD arc max aligned to 2.5 kPa with 4×8 (no clipped Want band)
- Operator honesty: every Calibrate tab (Fan / Light / Tank / SoftCal / lab / peer) owns What→Process→Expected
- When kit has an idle probe: full Build-a-Plant commit + Detach round-trip soak; until then SoftCal-OK-while-assigned is the verified SoftCal-ready path
- Upstream: CannaLib CDN `offset` + licensed media (`media_n>0`) before plant-image theater
