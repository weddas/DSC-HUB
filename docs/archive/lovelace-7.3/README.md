# Lovelace YAML archive (7.3)

Copied from `homeassistant/dashboards/` when Lovelace `/dsc-hub-pro` was retired (7.3).

Source tree copies were removed from the repo in 7.3 polish (tip `73143f3`) — this archive is the canonical backup.

**SoT:** Pi SPA at `http://192.168.86.48:8787` (studio LAN) or `http://10.42.0.1:8787` (AP).

**Ops runbook:** [`docs/ops/LOVELACE-RETIRED.md`](../../ops/LOVELACE-RETIRED.md) · parity [`docs/qa/LOVELACE-PARITY-7.3.md`](../../qa/LOVELACE-PARITY-7.3.md).

Restore only for disaster recovery — re-enable `lovelace.dashboards` in `configuration.snippet.yaml` and sync via legacy `ha-sync.sh` dashboard block (git history). Do **not** re-enable product sync by default.
