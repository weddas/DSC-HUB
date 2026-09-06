#!/usr/bin/env bash
# DSC-HUB — host-side ESPHome helper (runs as root on the Pi, outside Docker).
#
# The brain runs in the `dsc-hub-brain` container: it has no `esphome`, cannot
# `pip` into the host venv and cannot restart host units. So the brain and this
# script talk through files in the ops dir the container already bind-mounts at
# /data (default /var/lib/dsc-hub/ops):
#
#   <ops>/esphome-host/capabilities.json   host → brain: helper present, venv
#                                          version, secrets present, disk free
#   <ops>/esphome-host/request.json        brain → host: {"job_id","action","target"}
#   <ops>/esphome-host/progress.log        host → brain: streamed pip output
#   <ops>/esphome-host/result.json         host → brain: {"job_id","ok","from","to",…}
#
# `dsc-esphome-update.path` watches request.json and starts
# `dsc-esphome-update.service` → `$0 update`. `$0 capabilities` is called by the
# venv provisioner and the dashboard wrapper so the brain's Settings card is
# honest without shelling anything itself.
set -euo pipefail

SUB="${1:-capabilities}"

VENV="${DSC_ESPHOME_VENV:-/opt/dsc-esphome-venv}"
PIO_DIR="${PLATFORMIO_CORE_DIR:-/var/lib/dsc-hub/platformio}"
OPS_DIR="${DSC_ESPHOME_OPS_DIR:-${DSC_DATA:-/var/lib/dsc-hub}/ops}"
HOST_DIR="${OPS_DIR}/esphome-host"
MIN_FREE_BYTES="${DSC_ESPHOME_MIN_FREE_BYTES:-1610612736}"   # 1.5 GiB
RUN_AS="${DSC_ESPHOME_USER:-dsc}"

# Project dir: explicit env (esphome.env) → the same search the dashboard wrapper does.
PROJECT_DIR="${DSC_ESPHOME_PROJECT_DIR:-}"
if [[ -z "${PROJECT_DIR}" ]]; then
  for c in /opt/dsc-hub-repo/firmware/v4 /opt/dsc-hub/firmware/v4 /opt/dsc-hub/firmware; do
    if compgen -G "${c}/*.yaml" > /dev/null 2>&1; then PROJECT_DIR="${c}"; break; fi
  done
fi

mkdir -p "${HOST_DIR}"

venv_version() {
  if [[ -x "${VENV}/bin/esphome" ]]; then
    PLATFORMIO_CORE_DIR="${PIO_DIR}" "${VENV}/bin/esphome" version 2>/dev/null \
      | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true
  fi
}

disk_free_bytes() {
  local target="${VENV}"
  [[ -d "${target}" ]] || target="$(dirname "${VENV}")"
  df --output=avail -B1 "${target}" 2>/dev/null | tail -1 | tr -d ' ' || echo 0
}

json_bool() { if [[ "$1" == "1" ]]; then echo true; else echo false; fi; }

write_capabilities() {
  local ver secrets
  ver="$(venv_version)"
  secrets=0
  [[ -n "${PROJECT_DIR}" && -f "${PROJECT_DIR}/secrets.yaml" ]] && secrets=1
  local tmp="${HOST_DIR}/.capabilities.json.tmp"
  cat > "${tmp}" <<EOF
{
  "schema": 1,
  "helper": true,
  "venv": "${VENV}",
  "esphome_version": "${ver}",
  "project_dir": "${PROJECT_DIR}",
  "secrets_present": $(json_bool "${secrets}"),
  "platformio_dir": "${PIO_DIR}",
  "disk_free_bytes": $(disk_free_bytes),
  "min_free_bytes": ${MIN_FREE_BYTES},
  "written_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
  chmod 0644 "${tmp}"
  mv -f "${tmp}" "${HOST_DIR}/capabilities.json"
}

json_field() {  # json_field FILE KEY  → raw string value ("" if absent)
  python3 - "$1" "$2" <<'PY' 2>/dev/null || true
import json, sys
try:
    d = json.load(open(sys.argv[1], encoding="utf-8"))
    v = d.get(sys.argv[2], "")
    print("" if v is None else v)
except Exception:
    pass
PY
}

write_result() {  # write_result JOB_ID OK FROM TO EXIT MESSAGE
  local tmp="${HOST_DIR}/.result.json.tmp"
  local tail_txt=""
  if [[ -f "${HOST_DIR}/progress.log" ]]; then
    tail_txt="$(tail -c 3000 "${HOST_DIR}/progress.log" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')"
  else
    tail_txt='""'
  fi
  cat > "${tmp}" <<EOF
{
  "job_id": "$1",
  "ok": $(json_bool "$2"),
  "from": "$3",
  "to": "$4",
  "exit_code": $5,
  "message": $(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$6"),
  "log_tail": ${tail_txt},
  "finished_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
  chmod 0644 "${tmp}"
  mv -f "${tmp}" "${HOST_DIR}/result.json"
}

do_update() {
  local req="${HOST_DIR}/request.json"
  if [[ ! -f "${req}" ]]; then
    echo "dsc-esphome-host: no request.json — nothing to do"
    write_capabilities
    return 0
  fi
  local job_id action target from
  job_id="$(json_field "${req}" job_id)"
  action="$(json_field "${req}" action)"
  target="$(json_field "${req}" target)"
  from="$(venv_version)"
  : > "${HOST_DIR}/progress.log"
  chmod 0644 "${HOST_DIR}/progress.log"
  exec > >(tee -a "${HOST_DIR}/progress.log") 2>&1

  # Consume the request NOW (rename, not delete-later): the EXIT trap runs after
  # this function's locals are gone, and a request.json left behind makes the
  # .path unit re-fire the service in a loop (seen live 2026-09-06).
  mv -f "${req}" "${HOST_DIR}/.request.done" 2>/dev/null || rm -f "${req}"
  REQ_DONE="${HOST_DIR}/.request.done"
  finish() { rm -f "${REQ_DONE}" "${HOST_DIR}/request.json"; write_capabilities; }
  trap finish EXIT

  echo "dsc-esphome-host: job ${job_id} action=${action} target=${target:-latest} (installed ${from:-none})"

  if [[ -z "${job_id}" ]]; then
    write_result "" 0 "${from}" "${from}" 2 "malformed request.json (no job_id)"
    return 0
  fi
  if [[ "${action}" != "update" && "${action}" != "rollback" ]]; then
    write_result "${job_id}" 0 "${from}" "${from}" 2 "unknown action '${action}'"
    return 0
  fi
  if [[ ! -x "${VENV}/bin/pip" ]]; then
    write_result "${job_id}" 0 "${from}" "${from}" 3 "venv ${VENV} not provisioned (run dsc-esphome-venv-setup)"
    return 0
  fi

  local free
  free="$(disk_free_bytes)"
  if [[ "${free}" -lt "${MIN_FREE_BYTES}" ]]; then
    write_result "${job_id}" 0 "${from}" "${from}" 4 \
      "refusing: only $((free / 1048576)) MiB free on $(dirname "${VENV}"), need $((MIN_FREE_BYTES / 1048576)) MiB (PlatformIO cache lives in ${PIO_DIR})"
    return 0
  fi

  local pkg="esphome"
  [[ -n "${target}" ]] && pkg="esphome==${target}"
  if ! getent hosts pypi.org >/dev/null 2>&1; then
    write_result "${job_id}" 0 "${from}" "${from}" 5       "refusing: this host cannot resolve pypi.org (check /etc/resolv.conf — the brain container resolves via Docker's DNS, the host does not)"
    return 0
  fi
  echo "$ ${VENV}/bin/pip install -U ${pkg}"
  set +e
  if id "${RUN_AS}" >/dev/null 2>&1 && [[ "$(stat -c %U "${VENV}")" == "${RUN_AS}" ]]; then
    runuser -u "${RUN_AS}" -- "${VENV}/bin/pip" install -U "${pkg}"
  else
    "${VENV}/bin/pip" install -U "${pkg}"
  fi
  local rc=$?
  set -e
  local to
  to="$(venv_version)"
  if [[ ${rc} -ne 0 ]]; then
    write_result "${job_id}" 0 "${from}" "${to}" "${rc}" \
      "pip exited ${rc}; venv still on ${to:-?}. Roll back: ${VENV}/bin/pip install esphome==${from:-<last-good>}"
    return 0
  fi

  echo "dsc-esphome-host: ESPHome ${from:-?} -> ${to:-?}; restarting dsc-esphome-dashboard"
  systemctl restart dsc-esphome-dashboard.service || echo "warn: dashboard restart failed (is the unit installed?)"
  write_result "${job_id}" 1 "${from}" "${to}" 0 "ESPHome ${from:-?} -> ${to:-?}; dashboard restarted"
}

case "${SUB}" in
  capabilities) write_capabilities; echo "dsc-esphome-host: wrote ${HOST_DIR}/capabilities.json" ;;
  update)       do_update ;;
  *) echo "usage: $0 capabilities|update" >&2; exit 2 ;;
esac
