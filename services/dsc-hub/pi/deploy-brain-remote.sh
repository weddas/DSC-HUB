#!/bin/bash
set -eu
PASS="$1"
run_sudo() { echo "$PASS" | sudo -S "$@"; }

REPO="/opt/dsc-hub-repo"
COMPOSE_FILE="${REPO}/services/dsc-hub/docker-compose.yml"
ENV_FILE="/tmp/dsc-hub-compose.env"

mkdir -p \
  "${REPO}/brain" \
  "${REPO}/firmware/v4" \
  "${REPO}/data" \
  "${REPO}/services/dsc-hub/brain"

tar -xzf /tmp/dsc-brain-src.tgz -C "${REPO}/brain"
cp /tmp/dsc-hub.yaml "${REPO}/firmware/v4/dsc-hub.yaml"
mkdir -p "${REPO}/services/dsc-hub/brain"
cp /tmp/docker-compose.yml "${REPO}/services/dsc-hub/docker-compose.yml"
cp /tmp/Dockerfile.prebuilt "${REPO}/services/dsc-hub/brain/Dockerfile.prebuilt"
if [ -f /tmp/dsc-spa-static.tgz ]; then
  mkdir -p "${REPO}/brain/static"
  tar -xzf /tmp/dsc-spa-static.tgz -C "${REPO}/brain/static"
  if [ -f "${REPO}/brain/static/index.html" ]; then
    SPA_HASH=$(grep -oE 'assets/index-[^"]+\.js' "${REPO}/brain/static/index.html" | head -1 || true)
    echo "=== SPA bundle: ${SPA_HASH:-unknown} ==="
  fi
fi
# Prefer dsc-data.tgz; accept legacy dsc-ha-data.tgz during cutover.
if [ -f /tmp/dsc-data.tgz ]; then
  mkdir -p "${REPO}/data"
  tar -xzf /tmp/dsc-data.tgz -C "${REPO}/data"
elif [ -f /tmp/dsc-ha-data.tgz ]; then
  mkdir -p "${REPO}/data"
  tar -xzf /tmp/dsc-ha-data.tgz -C "${REPO}/data"
fi
run_sudo install -m 600 /tmp/dsc-hub.env /opt/dsc-hub/.env
run_sudo install -m 600 /tmp/dsc-hub.env "${REPO}/services/dsc-hub/.env"
run_sudo chown -R dsc:dsc "${REPO}/brain"

echo "=== firmware ==="
grep espnow_control "${REPO}/firmware/v4/dsc-hub.yaml"
test -f "${REPO}/brain/dsc_brain/appliance_driver.py" && echo appliance_driver_ok
grep wpa_passphrase /etc/dsc-hub/hostapd.conf || true

echo "=== eth0 + docker DNS ==="
if [ -f /tmp/bring-up-eth0.sh ]; then
  tr -d '\r' < /tmp/bring-up-eth0.sh > /tmp/eth0-up.sh
  bash /tmp/eth0-up.sh "${PASS}" || true
elif [ -f "${REPO}/services/dsc-hub/pi/bring-up-eth0.sh" ]; then
  bash "${REPO}/services/dsc-hub/pi/bring-up-eth0.sh" "${PASS}" || true
fi

echo "=== reload brain env from .env ==="
run_sudo cp /opt/dsc-hub/.env "${ENV_FILE}"
run_sudo chmod 644 "${ENV_FILE}"
run_sudo rm -f $'/opt/dsc-hub/.env\r' 2>/dev/null || true

DEPLOY_MODE="hot-patch"
echo "=== try docker compose build brain (prebuilt SPA) ==="
if run_sudo docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" --project-directory "${REPO}/services/dsc-hub" build --pull brain; then
  echo "=== build OK — starting brain from image ==="
  run_sudo docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" --project-directory "${REPO}/services/dsc-hub" up -d --force-recreate brain
  DEPLOY_MODE="image-build"
else
  echo "=== build failed — force-recreate + hot-patch ==="
  run_sudo docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" --project-directory "${REPO}/services/dsc-hub" up -d --force-recreate brain
  echo "=== hot-patch brain Python ==="
  run_sudo docker cp "${REPO}/brain/dsc_brain/." dsc-hub-brain:/app/dsc_brain/
  if [ -d "${REPO}/brain/static" ]; then
    run_sudo docker cp "${REPO}/brain/static/." dsc-hub-brain:/app/static/
  fi
fi

# BuildKit can cache COPY brain/static even after we extract a new SPA. Always sync.
if [ -d "${REPO}/brain/static" ]; then
  run_sudo docker cp "${REPO}/brain/static/." dsc-hub-brain:/app/static/
  echo "=== hot-synced SPA static ==="
fi

sleep 3
echo "=== deploy mode: ${DEPLOY_MODE} ==="
curl -sf http://127.0.0.1:8787/health && echo || echo "health check failed"
echo "=== fleet ingest warmup (up to 90s) ==="
waited=0
while [ "$waited" -lt 90 ]; do
  if curl -sf http://127.0.0.1:8787/fleet | python3 -c "import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get('hub',{}).get('online') else 1)" 2>/dev/null; then
    echo "hub online after ${waited}s"
    break
  fi
  sleep 5
  waited=$((waited + 5))
  echo "waiting for hub ingest (${waited}s)..."
done
echo "=== fleet acceptance ==="
if command -v jq >/dev/null 2>&1; then
  curl -sf http://127.0.0.1:8787/fleet | jq '{
    hub_online: .hub.online,
    surface: .surface,
    version: .version,
    inventory: (.inventory | length),
    hub_temp: .hub.values.temp_c
  }' || echo "fleet check failed"
else
  curl -sf http://127.0.0.1:8787/fleet | head -c 400 || echo "fleet check failed"
  echo
fi
run_sudo docker exec dsc-hub-brain python -c "import dsc_brain.appliance_driver as a; print('driver_ok', list(a.DEMAND_TO_SEAT.keys()))" || true
run_sudo docker logs dsc-hub-brain --tail 25
