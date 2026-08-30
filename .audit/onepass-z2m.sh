#!/bin/bash
set -e
CFG=/var/lib/dsc-hub/z2m/configuration.yaml
SZ=$(echo Digital | sudo -S wc -c < "$CFG" | tr -d ' ')
if [ "$SZ" = "0" ] || [ -z "$SZ" ]; then
  echo Digital | sudo -S cp /var/lib/dsc-hub/z2m/configuration_backup_v4.yaml "$CFG"
  echo Digital | sudo -S chmod 644 "$CFG"
  echo restored_config
else
  echo config_bytes=$SZ
fi
echo Digital | sudo -S grep -E 'adapter|port' "$CFG" || true
echo Digital | sudo -S timeout 8 docker kill -s KILL dsc-hub-z2m || true
sleep 1
echo Digital | sudo -S timeout 20 docker start dsc-hub-z2m
sleep 8
echo Digital | sudo -S docker ps --filter name=z2m --format '{{.Names}} {{.Status}}'
echo '--- z2m logs ---'
echo Digital | sudo -S docker logs dsc-hub-z2m --tail 25 2>&1 | tail -25
