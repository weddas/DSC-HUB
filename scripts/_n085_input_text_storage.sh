#!/bin/sh
echo "=== storage input_text items ==="
jq -r '.data.items[]?.id // .data[]?.id // empty' /config/.storage/input_text 2>/dev/null | head -50
echo "count:"
jq -r '.. | objects | select(has("id")) | .id' /config/.storage/input_text 2>/dev/null | grep -c dsc_ || true
jq 'keys' /config/.storage/input_text
echo "=== sample ==="
jq '.data|if type=="object" then (.items // .) | (if type=="array" then .[0:3] else . end) else . end' /config/.storage/input_text | head -c 1500
echo
echo "=== package input_text from build on disk ==="
grep -c 'dsc_build_nickname' /config/packages/dsc_v4_build_plant.yaml
echo "=== live package list ==="
ls /config/packages/dsc_v4_*.yaml | wc -l
