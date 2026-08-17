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

# Stage to dest.dscnew then mv (F-015 atomic promote).
run_scp_atomic() {
  local src="$1"
  local dest="$2"
  if [[ "${DRY_RUN}" == "1" ]]; then
    log "DRY_RUN atomic scp ${src} -> ${remote}:${dest}"
    return 0
  fi
  scp "${scp_opts[@]}" "${src}" "${remote}:${dest}.dscnew"
  ssh "${ssh_opts[@]}" "${remote}" "mv -f '${dest}.dscnew' '${dest}'"
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
run_ssh "mkdir -p '${HA_CONFIG_ROOT}/packages' '${HA_CONFIG_ROOT}/dashboards' '${HA_CONFIG_ROOT}/www' '${HA_CONFIG_ROOT}/esphome' '${HA_CONFIG_ROOT}/custom_components'"

# --- custom_components/dsc_hub (React panel) ------------------------------
cc_src="${HA_SRC}/custom_components/dsc_hub"
if [[ -d "${cc_src}" ]]; then
  log "Syncing custom_components/dsc_hub (panel + assets)"
  run_ssh "mkdir -p '${HA_CONFIG_ROOT}/custom_components/dsc_hub/www/assets'"
  # Python + manifest
  for f in manifest.json const.py frontend.py __init__.py; do
    [[ -f "${cc_src}/${f}" ]] || continue
    run_scp "${cc_src}/${f}" "${HA_CONFIG_ROOT}/custom_components/dsc_hub/${f}"
  done
  # Built panel + assets tree
  if [[ -f "${cc_src}/www/dsc-hub-panel.js" ]]; then
    run_scp "${cc_src}/www/dsc-hub-panel.js" "${HA_CONFIG_ROOT}/custom_components/dsc_hub/www/dsc-hub-panel.js"
  fi
  if [[ -d "${cc_src}/www/assets" ]]; then
    run_ssh "rm -rf '${HA_CONFIG_ROOT}/custom_components/dsc_hub/www/assets' && mkdir -p '${HA_CONFIG_ROOT}/custom_components/dsc_hub/www/assets'"
    # OpenSSH 9+ scp (SFTP) rejects a source of "dir/." with: unexpected filename: .
    if [[ "${DRY_RUN}" == "1" ]]; then
      log "DRY_RUN sync dsc_hub www/assets"
    else
      tar -C "${cc_src}/www/assets" -cf - . | ssh "${ssh_opts[@]}" "${remote}" \
        "tar -C '${HA_CONFIG_ROOT}/custom_components/dsc_hub/www/assets' -xf -"
    fi
  fi
else
  log "No custom_components/dsc_hub — skip panel sync"
fi

# --- packages (dsc_v4_* only) ---------------------------------------------
log "Syncing packages/dsc_v4_*.yaml"
shopt -s nullglob
pkg_files=("${HA_SRC}/packages"/dsc_v4_*.yaml)
[[ ${#pkg_files[@]} -gt 0 ]] || die "No dsc_v4_*.yaml packages found"
for f in "${pkg_files[@]}"; do
  run_scp_atomic "${f}" "${HA_CONFIG_ROOT}/packages/$(basename "${f}")"
done

# --- dashboard ------------------------------------------------------------
dash="${HA_SRC}/dashboards/dsc-hub-v4-dashboard.yaml"
[[ -f "${dash}" ]] || die "Missing ${dash}"
log "Syncing dashboards/dsc-hub-v4-dashboard.yaml + modules/"
run_scp "${dash}" "${HA_CONFIG_ROOT}/dashboards/dsc-hub-v4-dashboard.yaml"
build_dash="${HA_SRC}/dashboards/dsc-build-plant-dashboard.yaml"
if [[ -f "${build_dash}" ]]; then
  log "Syncing dashboards/dsc-build-plant-dashboard.yaml"
  run_scp "${build_dash}" "${HA_CONFIG_ROOT}/dashboards/dsc-build-plant-dashboard.yaml"
fi
run_ssh "mkdir -p '${HA_CONFIG_ROOT}/dashboards/modules'"
mod_dir="${HA_SRC}/dashboards/modules"
[[ -d "${mod_dir}" ]] || die "Missing ${mod_dir}"
mod_files=("${mod_dir}"/view_*.yaml)
[[ ${#mod_files[@]} -gt 0 ]] || die "No view_*.yaml modules found"
for f in "${mod_files[@]}"; do
  run_scp "${f}" "${HA_CONFIG_ROOT}/dashboards/modules/$(basename "${f}")"
done

# --- www ------------------------------------------------------------------
# System map SVG + bundled JS (system map + airflow + The Dash + Build + Nav + Catalog)
# as dsc-system-map-card.js so the existing /local Lovelace resource registers
# all custom elements. Standalone files also published for optional resources.
log "Syncing www Lovelace cards (system map + airflow + Three.js + The Dash + Build + Nav + Catalog)"
svg="${HA_SRC}/www/dsc-system-map.svg"
sys_js="${HA_SRC}/www/dsc-system-map-card.js"
air_js="${HA_SRC}/www/dsc-airflow-map-card.js"
three_js="${HA_SRC}/www/vendor/three.min.js"
dash_fx="${HA_SRC}/www/vendor/dsc-dash-fx.js"
dash_js="${HA_SRC}/www/dsc-the-dash-card.js"
build_js="${HA_SRC}/www/dsc-build-plant-card.js"
nav_js="${HA_SRC}/www/dsc-app-nav-card.js"
catalog_js="${HA_SRC}/www/dsc-catalog-browse-card.js"
[[ -f "${svg}" ]] || die "Missing ${svg}"
[[ -f "${sys_js}" ]] || die "Missing ${sys_js}"
[[ -f "${air_js}" ]] || die "Missing ${air_js}"
[[ -f "${three_js}" ]] || die "Missing ${three_js}"
[[ -f "${dash_fx}" ]] || die "Missing ${dash_fx}"
[[ -f "${dash_js}" ]] || die "Missing ${dash_js}"
[[ -f "${build_js}" ]] || die "Missing ${build_js}"
[[ -f "${nav_js}" ]] || die "Missing ${nav_js}"
[[ -f "${catalog_js}" ]] || die "Missing ${catalog_js}"

run_scp "${svg}" "${HA_CONFIG_ROOT}/www/dsc-system-map.svg"
run_scp "${air_js}" "${HA_CONFIG_ROOT}/www/dsc-airflow-map-card.js"
run_scp "${dash_js}" "${HA_CONFIG_ROOT}/www/dsc-the-dash-card.js"
run_scp "${build_js}" "${HA_CONFIG_ROOT}/www/dsc-build-plant-card.js"
run_scp "${nav_js}" "${HA_CONFIG_ROOT}/www/dsc-app-nav-card.js"
run_scp "${catalog_js}" "${HA_CONFIG_ROOT}/www/dsc-catalog-browse-card.js"
run_ssh "mkdir -p '${HA_CONFIG_ROOT}/www/vendor' '${HA_CONFIG_ROOT}/www/dsc-catalog'"
run_scp "${dash_fx}" "${HA_CONFIG_ROOT}/www/vendor/dsc-dash-fx.js"
catalog_dir="${HA_SRC}/www/dsc-catalog"
if [[ -d "${catalog_dir}" ]]; then
  for f in "${catalog_dir}"/*.json; do
    [[ -f "${f}" ]] || continue
    run_scp "${f}" "${HA_CONFIG_ROOT}/www/dsc-catalog/$(basename "${f}")"
  done
fi

bundle="$(mktemp)"
trap 'rm -f "${bundle}"' RETURN
cat "${sys_js}" > "${bundle}"
printf '\n' >> "${bundle}"
cat "${air_js}" >> "${bundle}"
printf '\n' >> "${bundle}"
cat "${three_js}" >> "${bundle}"
printf '\n' >> "${bundle}"
cat "${dash_fx}" >> "${bundle}"
printf '\n' >> "${bundle}"
cat "${dash_js}" >> "${bundle}"
printf '\n' >> "${bundle}"
cat "${build_js}" >> "${bundle}"
printf '\n' >> "${bundle}"
cat "${nav_js}" >> "${bundle}"
printf '\n' >> "${bundle}"
cat "${catalog_js}" >> "${bundle}"
run_scp "${bundle}" "${HA_CONFIG_ROOT}/www/dsc-system-map-card.js"
run_scp "${bundle}" "${HA_CONFIG_ROOT}/www/DSC-HUB.js"

# Bust browser cache for the existing Lovelace resource URL.
# HA serves /local with Cache-Control max-age ~31d — query must change.
# Never replace lovelace_resources with an unvalidated jq write (empty/corrupt
# file wipes every HACS card). Require non-trivial output before install.
bust_ver="7.2.0"
log "Bumping Lovelace resource cache-buster to ${bust_ver}"
if [[ "${DRY_RUN}" == "1" ]]; then
  log "DRY_RUN resource bump"
else
  run_ssh "set -e; LR=${HA_CONFIG_ROOT}/.storage/lovelace_resources; test -s \"\${LR}\" || { echo 'lovelace_resources missing/empty — skip bump' >&2; exit 0; }; jq --arg v \"${bust_ver}\" '
    (.data.items[] | select(.url|test(\"dsc-system-map\")).url) |= (sub(\"\\\\?.*$\"; \"\") + \"?v=\" + \$v) |
    (.data.items[] | select(.url|test(\"dsc-catalog-browse-card\\\\.js\")).url) |= (sub(\"\\\\?.*$\"; \"\") + \"?v=\" + \$v) |
    (.data.items[] | select(.url|test(\"dsc-build-plant-card\\\\.js\")).url) |= (sub(\"\\\\?.*$\"; \"\") + \"?v=\" + \$v) |
    (.data.items[] | select(.url|test(\"dsc-hub-panel\\\\.js\")).url) |= (sub(\"\\\\?.*$\"; \"\") + \"?v=\" + \$v)
  ' \"\${LR}\" > /tmp/lr.json; BYTES=\$(wc -c < /tmp/lr.json); test \"\${BYTES}\" -gt 500 || { echo \"jq output too small (\${BYTES}) — abort\" >&2; exit 1; }; cp -a \"\${LR}\" \"\${LR}.bak.\$(date +%s)\"; mv /tmp/lr.json \"\${LR}\""
fi

# --- esphome stubs (optional) ---------------------------------------------
if [[ "${SYNC_ESPHOME}" == "1" ]]; then
  log "Syncing esphome/dsc-*.yaml (SYNC_ESPHOME=1)"
  esphome_files=("${HA_SRC}/esphome"/dsc-*.yaml)
  [[ ${#esphome_files[@]} -gt 0 ]] || die "No dsc-*.yaml stubs in esphome/"
  for f in "${esphome_files[@]}"; do
    run_scp_atomic "${f}" "${HA_CONFIG_ROOT}/esphome/$(basename "${f}")"
  done
  # F-015: bridge stubs need dsc_api_client + dsc_anchor_ap beside /config/esphome.
  fw_comp="${REPO_ROOT}/firmware/v4/components"
  for comp in dsc_api_client dsc_anchor_ap dsc_fleet_setup; do
    if [[ -d "${fw_comp}/${comp}" ]]; then
      log "Syncing esphome/components/${comp}"
      if [[ "${DRY_RUN}" == "1" ]]; then
        log "DRY_RUN rsync components/${comp}"
      else
        run_ssh "mkdir -p '${HA_CONFIG_ROOT}/esphome/components' && rm -rf '${HA_CONFIG_ROOT}/esphome/components/${comp}'"
        tar -C "${fw_comp}" -cf - "${comp}" | ssh "${ssh_opts[@]}" "${remote}" \
          "tar -C '${HA_CONFIG_ROOT}/esphome/components' -xf -"
      fi
    else
      log "WARN: missing ${fw_comp}/${comp} (F-015)"
    fi
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
