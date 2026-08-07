#!/bin/sh
set -e
cp -a /config/configuration.yaml /config/configuration.yaml.bak.n086

# Rename Pro title
sed -i 's/title: DSC-HUB Pro/title: DSC-HUB/' /config/configuration.yaml

# Hide Build a Plant from sidebar (first show_in_sidebar under dsc-build-plant)
awk '
  /dsc-build-plant:/ { bp=1 }
  bp && /show_in_sidebar: true/ {
    sub(/show_in_sidebar: true/, "show_in_sidebar: false")
    bp=0
  }
  { print }
' /config/configuration.yaml > /tmp/cfg.n086
mv /tmp/cfg.n086 /config/configuration.yaml

echo "=== relevant config ==="
grep -n "dsc-hub-pro\|dsc-build-plant\|show_in_sidebar\|title: DSC" /config/configuration.yaml

echo "=== www assets ==="
ls -la /config/www/DSC-HUB.js /config/www/dsc-system-map-card.js /config/www/dsc-app-nav-card.js /config/www/dsc-catalog-browse-card.js
wc -c /config/www/DSC-HUB.js /config/www/dsc-system-map-card.js /config/www/dsc-app-nav-card.js /config/www/dsc-catalog-browse-card.js

echo "=== dashboard includes ==="
grep -n "view_ops\|view_plant\|view_catalog\|view_plant_build\|view_advanced" /config/dashboards/dsc-hub-v4-dashboard.yaml

BUMP="n086-$(date -u +%Y%m%d%H%M%S)"
SRC=/config/.storage/lovelace_resources
cp -a "$SRC" "$SRC.bak.$BUMP"
jq --arg v "$BUMP" '
  .data.items |= map(
    if (.url|tostring|test("DSC-HUB|dsc-system-map|dsc-build-plant"))
    then .url = ((.url|split("?")[0]) + "?v=" + $v) | .type = "js"
    else .
    end)
' "$SRC" > /tmp/lovelace_resources.new
sz=$(wc -c < /tmp/lovelace_resources.new)
echo "lovelace_resources size=$sz"
test "$sz" -gt 200
mv /tmp/lovelace_resources.new "$SRC"
jq -r '.data.items[] | select(.url|tostring|test("DSC-HUB|dsc-system-map|dsc-build-plant")) | .url' "$SRC"

ha core check
ha core restart
echo "restart issued"
