#!/usr/bin/with-contenv bashio
# ==================================================================
#  DSC-HUB Sync — git pull → /config (packages, dashboard, www)
#  Runs inside the HAOS add-on. Polls GitHub; syncs when ref moves.
# ==================================================================
set -euo pipefail

OPTIONS="/data/options.json"
REPO_DIR="/data/repo"
STATE_FILE="/data/last_synced_sha"
HA_CONFIG="${HA_CONFIG:-/config}"

log() { bashio::log.info "$*"; }
warn() { bashio::log.warning "$*"; }
err() { bashio::log.error "$*"; }

REPOSITORY="$(bashio::config 'repository')"
REF="$(bashio::config 'ref')"
POLL="$(bashio::config 'poll_seconds')"
SYNC_ESPHOME="$(bashio::config 'sync_esphome')"
SYNC_WWW="$(bashio::config 'sync_www')"
RELOAD="$(bashio::config 'reload_after_sync')"

ha_api() {
  local method="$1"
  local path="$2"
  curl -fsS -X "${method}" \
    -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{}" \
    "http://supervisor/core/api${path}"
}

ha_service() {
  local domain="$1"
  local service="$2"
  log "HA service ${domain}.${service}"
  ha_api POST "/services/${domain}/${service}" >/dev/null || \
    warn "service ${domain}.${service} failed (non-fatal)"
}

ensure_clone() {
  mkdir -p "${REPO_DIR}"
  if [[ ! -d "${REPO_DIR}/.git" ]]; then
    log "Cloning ${REPOSITORY} (${REF}) → ${REPO_DIR}"
    rm -rf "${REPO_DIR}"
    git clone --depth 1 --branch "${REF}" "${REPOSITORY}" "${REPO_DIR}"
  fi
}

update_repo() {
  ensure_clone
  git -C "${REPO_DIR}" remote set-url origin "${REPOSITORY}"
  git -C "${REPO_DIR}" fetch --depth 1 origin "${REF}"
  git -C "${REPO_DIR}" checkout -q -B "${REF}" "FETCH_HEAD"
  git -C "${REPO_DIR}" reset -q --hard "FETCH_HEAD"
  git -C "${REPO_DIR}" rev-parse HEAD
}

do_sync() {
  local sha="$1"
  local src="${REPO_DIR}/homeassistant"

  [[ -d "${src}/packages" ]] || {
    err "Missing homeassistant/packages in clone — wrong repo/ref?"
    return 1
  }

  mkdir -p \
    "${HA_CONFIG}/packages" \
    "${HA_CONFIG}/dashboards" \
    "${HA_CONFIG}/www" \
    "${HA_CONFIG}/esphome"

  log "Syncing packages/dsc_v4_*.yaml"
  shopt -s nullglob
  local pkgs=("${src}/packages"/dsc_v4_*.yaml)
  [[ ${#pkgs[@]} -gt 0 ]] || {
    err "No dsc_v4_*.yaml packages found"
    return 1
  }
  for f in "${pkgs[@]}"; do
    cp -f "${f}" "${HA_CONFIG}/packages/$(basename "${f}")"
  done

  local dash="${src}/dashboards/dsc-hub-v4-dashboard.yaml"
  if [[ -f "${dash}" ]]; then
    log "Syncing dashboards/dsc-hub-v4-dashboard.yaml"
    cp -f "${dash}" "${HA_CONFIG}/dashboards/dsc-hub-v4-dashboard.yaml"
  else
    warn "Dashboard YAML missing — skipped"
  fi

  if bashio::config.true 'sync_www'; then
    log "Syncing www/dsc-system-map.*"
    local www=("${src}/www"/dsc-system-map.*)
    for f in "${www[@]}"; do
      [[ -f "${f}" ]] || continue
      cp -f "${f}" "${HA_CONFIG}/www/$(basename "${f}")"
    done
  fi

  if bashio::config.true 'sync_esphome'; then
    log "Syncing esphome/dsc-*.yaml"
    local stubs=("${src}/esphome"/dsc-*.yaml)
    for f in "${stubs[@]}"; do
      [[ -f "${f}" ]] || continue
      cp -f "${f}" "${HA_CONFIG}/esphome/$(basename "${f}")"
    done
  fi

  # One-time hint file (does not rewrite configuration.yaml)
  if [[ ! -f "${HA_CONFIG}/dsc-hub-sync.HINT.txt" ]]; then
    cat >"${HA_CONFIG}/dsc-hub-sync.HINT.txt" <<'EOF'
DSC-HUB Sync add-on is writing packages / dashboards / www.

Once: merge homeassistant/configuration.snippet.yaml into configuration.yaml
(packages include + YAML-mode lovelace dashboard dsc-hub-v4), then restart HA.

Remove duplicate DSC automation ids from UI/automations.yaml if you had them
before packages/dsc_v4_automations.yaml existed.

See https://github.com/weddas/DSC-HUB — INSTALL.md · scripts/ADDON.md
EOF
  fi

  if bashio::config.true 'reload_after_sync'; then
    log "Reloading Home Assistant config surfaces"
    ha_service homeassistant reload_core_config
    ha_service automation reload
    ha_service lovelace reload || true
  fi

  echo "${sha}" >"${STATE_FILE}"
  log "Synced to ${sha:0:12}"
}

log "DSC-HUB Sync starting (repo=${REPOSITORY} ref=${REF} poll=${POLL}s)"

# Ensure git identity for reset operations (local only)
git config --global --add safe.directory "${REPO_DIR}" || true

# Always sync once on start / restart (force refresh)
if sha="$(update_repo)"; then
  if ! do_sync "${sha}"; then
    err "initial sync failed — will keep polling"
  fi
else
  err "initial git clone/fetch failed — will keep polling"
fi

while true; do
  sleep "${POLL}"

  if ! sha="$(update_repo)"; then
    err "git update failed — retrying in ${POLL}s"
    continue
  fi

  last=""
  [[ -f "${STATE_FILE}" ]] && last="$(cat "${STATE_FILE}")"

  if [[ "${sha}" != "${last}" ]]; then
    log "New commit ${sha:0:12} (was ${last:-none})"
    if ! do_sync "${sha}"; then
      err "sync failed — will retry on next poll"
    fi
  else
    bashio::log.debug "Already on ${sha:0:12} — no sync needed"
  fi
done
