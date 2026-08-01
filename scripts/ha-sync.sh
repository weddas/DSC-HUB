#!/usr/bin/env bash
# ==================================================================
#  DSC-HUB — sync homeassistant/ surfaces into a live HAOS /config
#  ------------------------------------------------------------------
#  Copies packages, YAML dashboard, www assets, and (optionally)
#  ESPHome stubs, then checks config and reloads via the HA REST API.
#
#  Required env:
#    HA_HOST          e.g. 192.168.86.3
#    HA_TOKEN         Long-lived access token (never commit)
#
#  Optional env:
#    HA_PORT          default 8123
#    HA_SSH_HOST      default HA_HOST (SSH destination for scp)
#    HA_SSH_USER      default root (HAOS Terminal & SSH add-on)
#    HA_SSH_PORT      default 22
#    HA_SSH_KEY       path to private key (optional; uses ssh-agent if unset)
#    HA_CONFIG_ROOT   remote path, default /config
#    DRY_RUN          set to 1 to print actions only
#    SYNC_ESPHOME     set to 1 to also sync homeassistant/esphome/dsc-*.yaml
#    SKIP_RELOAD      set to 1 to copy only (no check/reload)
#    REPO_ROOT        override repo root (defaults to parent of scripts/)
#
#  Never syncs secrets.yaml or .storage/
# ==================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${REPO_ROOT:-$(cd "${SCRIPT_DIR}/.." && pwd)}"
HA_SRC="${REPO_ROOT}/homeassistant"

HA_HOST="${HA_HOST:?HA_HOST is required}"
HA_TOKEN="${HA_TOKEN:?HA_TOKEN is required}"
HA_PORT="${HA_PORT:-8123}"
HA_SSH_HOST="${HA_SSH_HOST:-${HA_HOST}}"
HA_SSH_USER="${HA_SSH_USER:-root}"
HA_SSH_PORT="${HA_SSH_PORT:-22}"
HA_CONFIG_ROOT="${HA_CONFIG_ROOT:-/config}"
DRY_RUN="${DRY_RUN:-0}"
SYNC_ESPHOME="${SYNC_ESPHOME:-0}"
SKIP_RELOAD="${SKIP_RELOAD:-0}"

API_BASE="http://${HA_HOST}:${HA_PORT}"

log() { printf '==> %s\n' "$*"; }
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

[[ -d "${HA_SRC}/packages" ]] || die "Missing ${HA_SRC}/packages — wrong REPO_ROOT?"

ssh_opts=(-p "${HA_SSH_PORT}" -o StrictHostKeyChecking=accept-new -o BatchMode=yes)
scp_opts=(-P "${HA_SSH_PORT}" -o StrictHostKeyChecking=accept-new -o BatchMode=yes)
if [[ -n "${HA_SSH_KEY:-}" ]]; then
  ssh_opts+=(-i "${HA_SSH_KEY}")
  scp_opts+=(-i "${HA_SSH_KEY}")
fi

remote="${HA_SSH_USER}@${HA_SSH_HOST}"

run_ssh() {
  if [[ "${DRY_RUN}" == "1" ]]; then
    log "DRY_RUN ssh ${remote} $*"
    return 0
  fi
  ssh "${ssh_opts[@]}" "${remote}" "$@"
}

run_scp() {
  local src="$1"
  local dest="$2"
  if [[ "${DRY_RUN}" == "1" ]]; then
    log "DRY_RUN scp ${src} -> ${remote}:${dest}"
    return 0
  fi
  scp "${scp_opts[@]}" "${src}" "${remote}:${dest}"
}

ha_api() {
  local method="$1"
  local path="$2"
  local data="${3:-}"
  local url="${API_BASE}${path}"
  if [[ "${DRY_RUN}" == "1" ]]; then
    log "DRY_RUN ${method} ${url} ${data}"
    return 0
  fi
  if [[ -n "${data}" ]]; then
    curl -fsS -X "${method}" \
      -H "Authorization: Bearer ${HA_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "${data}" \
      "${url}"
  else
    curl -fsS -X "${method}" \
      -H "Authorization: Bearer ${HA_TOKEN}" \
      -H "Content-Type: application/json" \
      "${url}"
  fi
}

ha_service() {
  local domain="$1"
  local service="$2"
  log "HA service ${domain}.${service}"
  ha_api POST "/api/services/${domain}/${service}" "{}" >/dev/null
}

# --- remote dirs ----------------------------------------------------------
log "Ensuring remote directories under ${HA_CONFIG_ROOT}"
run_ssh "mkdir -p '${HA_CONFIG_ROOT}/packages' '${HA_CONFIG_ROOT}/dashboards' '${HA_CONFIG_ROOT}/www' '${HA_CONFIG_ROOT}/esphome'"

# --- packages (dsc_v4_* only) ---------------------------------------------
log "Syncing packages/dsc_v4_*.yaml"
shopt -s nullglob
pkg_files=("${HA_SRC}/packages"/dsc_v4_*.yaml)
[[ ${#pkg_files[@]} -gt 0 ]] || die "No dsc_v4_*.yaml packages found"
for f in "${pkg_files[@]}"; do
  run_scp "${f}" "${HA_CONFIG_ROOT}/packages/$(basename "${f}")"
done

# --- dashboard ------------------------------------------------------------
dash="${HA_SRC}/dashboards/dsc-hub-v4-dashboard.yaml"
[[ -f "${dash}" ]] || die "Missing ${dash}"
log "Syncing dashboards/dsc-hub-v4-dashboard.yaml"
run_scp "${dash}" "${HA_CONFIG_ROOT}/dashboards/dsc-hub-v4-dashboard.yaml"

# --- www ------------------------------------------------------------------
log "Syncing www/dsc-system-map.*"
www_files=("${HA_SRC}/www"/dsc-system-map.*)
[[ ${#www_files[@]} -gt 0 ]] || die "No dsc-system-map.* assets in www/"
for f in "${www_files[@]}"; do
  run_scp "${f}" "${HA_CONFIG_ROOT}/www/$(basename "${f}")"
done

# --- esphome stubs (optional) ---------------------------------------------
if [[ "${SYNC_ESPHOME}" == "1" ]]; then
  log "Syncing esphome/dsc-*.yaml (SYNC_ESPHOME=1)"
  esphome_files=("${HA_SRC}/esphome"/dsc-*.yaml)
  [[ ${#esphome_files[@]} -gt 0 ]] || die "No dsc-*.yaml stubs in esphome/"
  for f in "${esphome_files[@]}"; do
    run_scp "${f}" "${HA_CONFIG_ROOT}/esphome/$(basename "${f}")"
  done
else
  log "Skipping ESPHome stubs (set SYNC_ESPHOME=1 to include)"
fi

if [[ "${SKIP_RELOAD}" == "1" ]]; then
  log "SKIP_RELOAD=1 — copy done, not checking/reloading"
  exit 0
fi

# --- API reachability -----------------------------------------------------
log "Checking HA API at ${API_BASE}"
if [[ "${DRY_RUN}" != "1" ]]; then
  curl -fsS -H "Authorization: Bearer ${HA_TOKEN}" "${API_BASE}/api/" >/dev/null \
    || die "HA API unreachable at ${API_BASE}/api/ — check HA_HOST/HA_PORT/HA_TOKEN"
fi

# Prefer Core check over SSH (catches YAML errors before reload).
# Falls back to reload_core_config alone if `ha` CLI is unavailable.
log "Running config check"
if [[ "${DRY_RUN}" == "1" ]]; then
  log "DRY_RUN ha core check"
else
  if run_ssh "command -v ha >/dev/null && ha core check"; then
    log "ha core check passed"
  else
    log "WARN: ha core check unavailable or failed — proceeding to reload; watch HA logs"
  fi
fi

log "Reloading packages (homeassistant.reload_core_config)"
ha_service homeassistant reload_core_config

log "Reloading automations"
ha_service automation reload

# YAML Lovelace dashboards usually pick up file changes; reload if service exists.
log "Reloading Lovelace (best-effort)"
if [[ "${DRY_RUN}" == "1" ]]; then
  log "DRY_RUN lovelace.reload"
else
  if curl -fsS -X POST \
      -H "Authorization: Bearer ${HA_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{}" \
      "${API_BASE}/api/services/lovelace/reload" >/dev/null 2>&1; then
    log "lovelace.reload ok"
  else
    log "lovelace.reload skipped (service missing or failed — hard-refresh browser)"
  fi
fi

log "DSC-HUB HA sync complete"
