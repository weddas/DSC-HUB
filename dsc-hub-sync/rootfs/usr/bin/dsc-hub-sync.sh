#!/usr/bin/with-contenv bashio
# ==================================================================
#  DSC-HUB Sync — git pull → /config (packages, dashboard, www, stubs)
#  Runs inside the HAOS add-on. Polls GitHub; syncs when ref moves.
#  v5.1.0: sync_esphome default true, broader reloads, version marker,
#  atomic staging copy with last-good rollback.
#  v5.1.2: also sync firmware/v4/components → /config/esphome/components.
# ==================================================================
set -euo pipefail

OPTIONS="/data/options.json"
REPO_DIR="/data/repo"
STATE_FILE="/data/last_synced_sha"
LAST_GOOD="/data/last_good_sync"
HA_CONFIG="${HA_CONFIG:-/config}"
STAGE="/data/sync_stage"
SURFACE_VERSION="5.1.0"

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

ha_notify() {
  local title="$1"
  local message="$2"
  curl -fsS -X POST \
    -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"${title}\",\"message\":\"${message}\",\"notification_id\":\"dsc_hub_sync\"}" \
    "http://supervisor/core/api/services/persistent_notification/create" >/dev/null 2>&1 || true
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

backup_last_good() {
  rm -rf "${LAST_GOOD}"
  mkdir -p "${LAST_GOOD}/packages" "${LAST_GOOD}/dashboards" "${LAST_GOOD}/www" "${LAST_GOOD}/esphome"
  shopt -s nullglob
  local f
  for f in "${HA_CONFIG}/packages"/dsc_v4_*.yaml; do
    [[ -f "${f}" ]] && cp -f "${f}" "${LAST_GOOD}/packages/"
  done
  [[ -f "${HA_CONFIG}/dashboards/dsc-hub-v4-dashboard.yaml" ]] && \
    cp -f "${HA_CONFIG}/dashboards/dsc-hub-v4-dashboard.yaml" "${LAST_GOOD}/dashboards/"
  for f in "${HA_CONFIG}/www"/dsc-system-map.*; do
    [[ -f "${f}" ]] && cp -f "${f}" "${LAST_GOOD}/www/"
  done
  for f in "${HA_CONFIG}/esphome"/dsc-*.yaml; do
    [[ -f "${f}" ]] && cp -f "${f}" "${LAST_GOOD}/esphome/"
  done
}

restore_last_good() {
  [[ -d "${LAST_GOOD}/packages" ]] || return 1
  warn "Rolling back to last-good sync snapshot"
  shopt -s nullglob
  local f
  for f in "${LAST_GOOD}/packages"/dsc_v4_*.yaml; do
    cp -f "${f}" "${HA_CONFIG}/packages/"
  done
  [[ -f "${LAST_GOOD}/dashboards/dsc-hub-v4-dashboard.yaml" ]] && \
    cp -f "${LAST_GOOD}/dashboards/dsc-hub-v4-dashboard.yaml" "${HA_CONFIG}/dashboards/"
  if bashio::config.true 'sync_www'; then
    for f in "${LAST_GOOD}/www"/dsc-system-map.*; do
      [[ -f "${f}" ]] && cp -f "${f}" "${HA_CONFIG}/www/"
    done
  fi
  if bashio::config.true 'sync_esphome'; then
    for f in "${LAST_GOOD}/esphome"/dsc-*.yaml; do
      [[ -f "${f}" ]] && cp -f "${f}" "${HA_CONFIG}/esphome/"
    done
  fi
  return 0
}

stage_and_commit() {
  local src="$1"
  rm -rf "${STAGE}"
  mkdir -p "${STAGE}/packages" "${STAGE}/dashboards" "${STAGE}/www" "${STAGE}/esphome"

  shopt -s nullglob
  local pkgs=("${src}/packages"/dsc_v4_*.yaml)
  [[ ${#pkgs[@]} -gt 0 ]] || {
    err "No dsc_v4_*.yaml packages found"
    return 1
  }
  local f
  for f in "${pkgs[@]}"; do
    cp -f "${f}" "${STAGE}/packages/$(basename "${f}")"
  done

  local dash="${src}/dashboards/dsc-hub-v4-dashboard.yaml"
  if [[ -f "${dash}" ]]; then
    cp -f "${dash}" "${STAGE}/dashboards/dsc-hub-v4-dashboard.yaml"
  else
    warn "Dashboard YAML missing — skipped"
  fi

  if bashio::config.true 'sync_www'; then
    log "Syncing www system-map SVG + bundled cards (system map + airflow)"
    if [[ -f "${src}/www/dsc-system-map.svg" ]]; then
      cp -f "${src}/www/dsc-system-map.svg" "${STAGE}/www/dsc-system-map.svg"
      log "Staged www/dsc-system-map.svg"
    else
      warn "Missing repo www/dsc-system-map.svg"
    fi
    # Bundle both cards into dsc-system-map-card.js (existing Lovelace resource)
    # and DSC-HUB.js (HACS filename). Standalone airflow optional.
    if [[ -f "${src}/www/dsc-system-map-card.js" && -f "${src}/www/dsc-airflow-map-card.js" ]]; then
      {
        cat "${src}/www/dsc-system-map-card.js"
        printf '\n'
        cat "${src}/www/dsc-airflow-map-card.js"
      } > "${STAGE}/www/dsc-system-map-card.js"
      cp -f "${STAGE}/www/dsc-system-map-card.js" "${STAGE}/www/DSC-HUB.js"
      cp -f "${src}/www/dsc-airflow-map-card.js" "${STAGE}/www/dsc-airflow-map-card.js"
      log "Staged bundled www/dsc-system-map-card.js ($(wc -c <"${STAGE}/www/dsc-system-map-card.js") bytes)"
    else
      warn "Missing system-map and/or airflow card — www sync incomplete"
    fi
  fi

  if bashio::config.true 'sync_esphome'; then
    local stubs=("${src}/esphome"/dsc-*.yaml)
    for f in "${stubs[@]}"; do
      [[ -f "${f}" ]] || continue
      cp -f "${f}" "${STAGE}/esphome/$(basename "${f}")"
    done
    # Local external_components path used by firmware/v4/dsc-fleet-setup-*.yaml
    if [[ -d "${src}/../firmware/v4/components/dsc_fleet_setup" ]]; then
      mkdir -p "${STAGE}/esphome/components"
      rm -rf "${STAGE}/esphome/components/dsc_fleet_setup"
      cp -a "${src}/../firmware/v4/components/dsc_fleet_setup" \
        "${STAGE}/esphome/components/dsc_fleet_setup"
      log "Staged esphome/components/dsc_fleet_setup"
    elif [[ -d "${src}/firmware/v4/components/dsc_fleet_setup" ]]; then
      # When src is repo root (typical Sync clone layout)
      mkdir -p "${STAGE}/esphome/components"
      rm -rf "${STAGE}/esphome/components/dsc_fleet_setup"
      cp -a "${src}/firmware/v4/components/dsc_fleet_setup" \
        "${STAGE}/esphome/components/dsc_fleet_setup"
      log "Staged esphome/components/dsc_fleet_setup"
    else
      warn "Missing firmware/v4/components/dsc_fleet_setup — ESPHome Install will fail"
    fi
  fi

  # Promote stage → /config
  mkdir -p \
    "${HA_CONFIG}/packages" \
    "${HA_CONFIG}/dashboards" \
    "${HA_CONFIG}/www" \
    "${HA_CONFIG}/esphome"

  for f in "${STAGE}/packages"/dsc_v4_*.yaml; do
    cp -f "${f}" "${HA_CONFIG}/packages/$(basename "${f}")"
  done
  if [[ -f "${STAGE}/dashboards/dsc-hub-v4-dashboard.yaml" ]]; then
    cp -f "${STAGE}/dashboards/dsc-hub-v4-dashboard.yaml" \
      "${HA_CONFIG}/dashboards/dsc-hub-v4-dashboard.yaml"
  fi
  if bashio::config.true 'sync_www'; then
    for name in dsc-system-map.svg dsc-system-map-card.js DSC-HUB.js dsc-airflow-map-card.js; do
      if [[ -f "${STAGE}/www/${name}" ]]; then
        cp -f "${STAGE}/www/${name}" "${HA_CONFIG}/www/${name}"
        log "Installed /config/www/${name}"
      fi
    done
  fi
  if bashio::config.true 'sync_esphome'; then
    for f in "${STAGE}/esphome"/dsc-*.yaml; do
      [[ -f "${f}" ]] || continue
      cp -f "${f}" "${HA_CONFIG}/esphome/$(basename "${f}")"
    done
    if [[ -d "${STAGE}/esphome/components/dsc_fleet_setup" ]]; then
      mkdir -p "${HA_CONFIG}/esphome/components"
      rm -rf "${HA_CONFIG}/esphome/components/dsc_fleet_setup"
      cp -a "${STAGE}/esphome/components/dsc_fleet_setup" \
        "${HA_CONFIG}/esphome/components/dsc_fleet_setup"
      log "Installed /config/esphome/components/dsc_fleet_setup"
    fi
  fi
}

write_version_marker() {
  local sha="$1"
  local short="${sha:0:12}"
  cat >"${HA_CONFIG}/dsc-hub-sync.version" <<EOF
version=${SURFACE_VERSION}
sha=${sha}
short_sha=${short}
ref=${REF}
synced_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
  # Companion package fragment consumed by template sensors via file? HA can't read arbitrary files.
  # Write a tiny helper YAML that template package can stay in sync with via packages include.
  cat >"${HA_CONFIG}/packages/dsc_v4_sync_marker.yaml" <<EOF
# Auto-written by DSC-HUB Sync — do not edit by hand.
template:
  - sensor:
      - name: "DSC Hub Sync SHA"
        unique_id: dsc_hub_sync_sha
        icon: mdi:source-branch
        state: "${short}"
        attributes:
          full_sha: "${sha}"
          surface_version: "${SURFACE_VERSION}"
          ref: "${REF}"
EOF
  log "Wrote version marker ${SURFACE_VERSION} @ ${short}"
}

do_sync() {
  local sha="$1"
  local src="${REPO_DIR}/homeassistant"

  [[ -d "${src}/packages" ]] || {
    err "Missing homeassistant/packages in clone — wrong repo/ref?"
    return 1
  }

  backup_last_good || true

  log "Syncing packages/dsc_v4_*.yaml (+ dashboard/www/stubs per options)"
  if ! stage_and_commit "${src}"; then
    err "stage/copy failed — attempting rollback"
    restore_last_good || true
    return 1
  fi

  write_version_marker "${sha}"

  # One-time hint file (does not rewrite configuration.yaml)
  if [[ ! -f "${HA_CONFIG}/dsc-hub-sync.HINT.txt" ]]; then
    cat >"${HA_CONFIG}/dsc-hub-sync.HINT.txt" <<'EOF'
DSC-HUB Sync add-on is writing packages / dashboards / www / esphome stubs.

Once: merge homeassistant/configuration.snippet.yaml into configuration.yaml
(packages include + YAML-mode lovelace dashboard dsc-hub-pro), then restart HA.

After a major cut (e.g. 5.1.0) with new input_* helpers: Restart Home Assistant
Core once — reload alone often does not create new helpers.

Remove duplicate DSC automation ids from UI/automations.yaml if you had them
before packages/dsc_v4_automations.yaml existed.

See https://github.com/weddas/DSC-HUB — INSTALL.md · UPGRADE.md · dsc-hub-sync/DOCS.md
EOF
  fi

  if bashio::config.true 'reload_after_sync'; then
    log "Reloading Home Assistant config surfaces"
    ha_service homeassistant reload_core_config
    ha_service automation reload
    ha_service script reload || true
    ha_service template reload || true
    # YAML dashboards refresh on navigation; lovelace.reload is gone/400 on newer HA.
    ha_service frontend reload_themes || true
  fi

  echo "${sha}" >"${STATE_FILE}"
  log "Synced to ${sha:0:12}"
  ha_notify "DSC-HUB synced" \
    "Synced to ${sha:0:12} (surface ${SURFACE_VERSION}). Restart HA Core once if new Learning helpers are missing."
}

log "DSC-HUB Sync starting (repo=${REPOSITORY} ref=${REF} poll=${POLL}s sync_esphome=${SYNC_ESPHOME})"

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
