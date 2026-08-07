#!/bin/sh
set -e
echo "=== CORE ==="
ha core info 2>/dev/null | grep -E '^(version|state|boot):' || true
echo "=== CONFIG CHECK ==="
ha core check 2>&1 | tail -5
echo "=== LOVELace RESOURCES (count + DSC + sample others) ==="
jq -r '.data.items | length' /config/.storage/lovelace_resources
jq -r '.data.items[] | "\(.type)\t\(.url)"' /config/.storage/lovelace_resources | head -40
echo "=== LOVELace DASHBOARDS (storage) ==="
ls -la /config/.storage/lovelace* 2>/dev/null | head -30
echo "=== YAML DASHBOARDS ==="
ls -la /config/dashboards/ 2>/dev/null
echo "=== CONFIG SIDEBAR DASH ENTRIES ==="
grep -n "dsc-hub-pro\|dsc-build-plant\|show_in_sidebar\|title:" /config/configuration.yaml | head -20
echo "=== ADDONS (top) ==="
ha addons 2>/dev/null | head -5
echo "=== SURFACE / KEY ENTITIES via history? use states in HA container ==="
# Prefer ha CLI states if available
command -v ha >/dev/null
