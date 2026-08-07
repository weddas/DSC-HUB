#!/bin/bash
set +e
echo "=== Sync before ==="
ha apps info df65166e_dsc_hub_sync | grep -E 'state:|boot:|version:'
curl -sS -X POST -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" -H "Content-Type: application/json" \
  -d '{"boot":"auto"}' "http://supervisor/addons/df65166e_dsc_hub_sync/options"
echo
ha apps start df65166e_dsc_hub_sync
sleep 8
echo "=== Sync after start ==="
ha apps info df65166e_dsc_hub_sync | grep -E 'state:|boot:|version:'
# wait for a sync cycle
for i in 1 2 3 4 5 6 7 8 9 10; do
  sleep 6
  if grep -q 'fixtures: "' /config/packages/dsc_v4_light_catalog.yaml 2>/dev/null; then
    echo "fixtures JSON present at poll $i"
    break
  fi
  echo "poll $i waiting for packages..."
done
echo "=== Verify packages ==="
grep -n 'state:' /config/packages/dsc_v4_version.yaml | head -3
head -c 80 /config/packages/dsc_v4_light_catalog.yaml; echo
grep -n 'fixtures:' /config/packages/dsc_v4_light_catalog.yaml | head -1 | cut -c1-100
grep -n 'want_bands:' /config/packages/dsc_v4_strain_catalog.yaml | head -1 | cut -c1-100
wc -c /config/packages/dsc_v4_build_plant.yaml
