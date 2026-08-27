# Graph re-audit — DSC-HUB 7.3

**Date:** 2026-08-27  
**Supersedes:** [`GRAPH-AUDIT-7.1.md`](GRAPH-AUDIT-7.1.md) FAIL verdict for software closure.  
**Live target:** `http://192.168.86.48:8787` — walked 2026-08-27 post-deploy.

## Verdict

**PASS (code + unit tests + live `.48`)** — all GR-P0 fixes verified; screenshots in [`screens-7.3/`](screens-7.3/).

| ID | Fix | Evidence |
|----|-----|----------|
| GR-P0-1 | Newest-first history | `settings.list_history` DESC + reverse; `test_list_history_newest_first` |
| GR-P0-2 | Stale tail | `seriesHold.ts` + `chartStale` in `charts.tsx` |
| GR-P0-3 | Fan duty mapped | `history_ops.py` fan pct keys |
| GR-P0-4 | Room + leaf VPD | `history_ops.py` room/leaf VPD; Climate + BandChartHost; live VPD chart with leaf legend |
| GR-P0-5 | Lighting duty | `history_ops.py` window/SF1000 binaries |
| GR-P0-6 | Heat-mat strip | mat demand in ENTITY map |
| GR-P0-7 | Analytics VWC | `seatModel` + in_service |
| GR-P1-5 | 48h date ticks | `fmtTime(t, chartHours)` — live Wed/Thu labels at 48h |
| GR-P2-1 | RH axis 0–100 | fixed yDomain on RH charts |
| — | VPD axis 0–2.5 kPa | fixed yDomain + leaf series (7.3) — live PASS |
| — | Temp axis 15–35 °C preset | BandChart + Climate (7.3) |

## Live screenshots

| File | Notes |
|------|-------|
| [`screens-7.3/graph-climate-48h-air.png`](screens-7.3/graph-climate-48h-air.png) | Climate command + 48h selector |
| [`screens-7.3/graph-sankey-heat.png`](screens-7.3/graph-sankey-heat.png) | VPD 0–2.5, leaf series, FlowSankey |

## Operator note

Historical [`GRAPH-AUDIT-7.1.md`](GRAPH-AUDIT-7.1.md) captured pre-7.1.2 live state. Do not use it for ship/no-ship after 7.3 deploy.
