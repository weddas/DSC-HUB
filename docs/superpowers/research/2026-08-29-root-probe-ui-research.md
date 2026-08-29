# Research note — Root / probe UI patterns (Pass A)

**Date:** 2026-08-29  
**Method:** Prior OSS comparison (Mycodo, HA Plant, ESPHome, Grafana) + DSC browser/interrogate evidence. Tavily Research CLI/MCP unavailable this pass (CLI needs key; MCP plan limit 432). Bright Data SERP 401.

## Patterns peers share

1. **Measure plane ≠ setup plane** — Mycodo Live/Data vs Setup; HA dashboards vs Settings. Never put inventory restore next to Got soil.
2. **One question per panel** — Grafana: status → trend → detail. Root should answer “is this probe’s soil OK?” not list four empty seats.
3. **Hide absent hardware** — Retired inputs are omitted from Live, not painted as permanent OOS furniture (Mycodo deactivate; farmOS asset not on map).
4. **Derived nutrients labeled** — Soil NPK from EC/optical proxies is not a lab assay; UIs that show it mark **derived** or hide until calibrated.
5. **Scale on instruments** — Industrial panels print min/max; unlabeled glow arcs are toys.

## Implications for DSC Pass A

| Peer idea | DSC action |
|-----------|------------|
| Kit size = installed inputs | `KIT_PROBE_NUMBERS = [1,2]` on Root/honesty/Fleet pulse |
| Plant device vs sensor | Probe card + Plant name; no Seat/POT |
| Derived NPK | Hold path + “from EC” or omit |
| Readable scale | Horizontal primary row; numeric ends; no dual glow clip |

## Sources (existing)

- [Mycodo Data Viewing](https://kizniche.github.io/Mycodo/Data-Viewing)
- [HA Plant](https://www.home-assistant.io/integrations/plant)
- [Grafana dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices)
- Session OSS table (2026-08-29); browser QA FOLLOWUPS 2026-08-29
