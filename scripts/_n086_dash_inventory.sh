#!/bin/sh
echo "=== lovelace_dashboards ==="
jq -r '.data.items[] | "\(.id)\t\(.title)\t\(.url_path)\tshow=\(.show_in_sidebar)"' /config/.storage/lovelace_dashboards
echo "=== resource count vs bak ==="
echo "now=$(jq '.data.items|length' /config/.storage/lovelace_resources)"
echo "bak_n085=$(jq '.data.items|length' /config/.storage/lovelace_resources.bak.n085-1786128250.89282 2>/dev/null || echo n/a)"
echo "bak_pre=$(jq '.data.items|length' /config/.storage/lovelace_resources.bak.1786080312 2>/dev/null || echo n/a)"
echo "=== resource urls changed only dsc? ==="
jq -r '.data.items[] | .url' /config/.storage/lovelace_resources > /tmp/res_now.txt
jq -r '.data.items[] | .url' /config/.storage/lovelace_resources.bak.n085-1786128250.89282 > /tmp/res_old.txt 2>/dev/null || true
if [ -s /tmp/res_old.txt ]; then
  echo "-- only in now --"
  grep -Fvx -f /tmp/res_old.txt /tmp/res_now.txt || true
  echo "-- only in old --"
  grep -Fvx -f /tmp/res_now.txt /tmp/res_old.txt || true
fi
echo "=== integrations sample (config entries count) ==="
jq '.data.entries|length' /config/.storage/core.config_entries 2>/dev/null
echo "=== entity registry count ==="
jq '.data.entities|length' /config/.storage/core.entity_registry 2>/dev/null
echo "=== sample non-DSC domains present ==="
jq -r '.data.entities[].entity_id' /config/.storage/core.entity_registry 2>/dev/null | awk -F. '{print $1}' | sort | uniq -c | sort -nr | head -25
