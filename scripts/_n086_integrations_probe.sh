#!/bin/sh
echo "=== panel registry (custom panels / integrations UI) ==="
jq -r '.data.panels // .data | keys? // empty' /config/.storage/core.panels 2>/dev/null | head -5
# HA stores panels differently; try frontend panels
ls /config/.storage/ | grep -i panel
echo "=== hacs status ==="
ls /config/custom_components/hacs 2>/dev/null | head -3
echo "=== frigate / music assistant components ==="
ls /config/custom_components 2>/dev/null | tr ' ' '\n' | grep -Ei 'frigate|music|mass|esphome|browser' || true
ls /config/custom_components 2>/dev/null | wc -l
echo "=== config entries domains (top) ==="
jq -r '.data.entries[].domain' /config/.storage/core.config_entries | sort | uniq -c | sort -nr | head -30
echo "=== dsc yaml package load sanity ==="
ls /config/packages/dsc_v4_*.yaml | wc -l
grep -l "fixtures" /config/packages/dsc_v4_*.yaml
echo "=== www bundle size ==="
wc -c /config/www/DSC-HUB.js /config/www/dsc-system-map-card.js
