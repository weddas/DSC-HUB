#!/bin/bash
# Deploy dsc-brain-demo on Digital-Gateway (Unraid). Run on the NAS as root.
set -euo pipefail
COMPOSE_DIR="/mnt/user/Digital-Documents/Digital Stealth Care/Projects/DSC-HUB/services/dsc-hub"
cd "$COMPOSE_DIR"
docker compose -f docker-compose.demo.yml up -d --build
docker ps --filter name=dsc-brain-demo --format '{{.Names}}\t{{.Status}}\t{{.Ports}}'
curl -sf "http://127.0.0.1:8788/health" | head -c 400
echo
