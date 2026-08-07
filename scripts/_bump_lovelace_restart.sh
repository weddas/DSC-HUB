#!/bin/sh
set -e
BUMP="${1:-n085}"
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
echo "size=$sz"
if [ "$sz" -lt 200 ]; then echo REFUSE tiny; exit 1; fi
mv /tmp/lovelace_resources.new "$SRC"
jq -r '.data.items[] | select(.url|tostring|test("DSC-HUB|dsc-system-map|dsc-build-plant")) | .url' "$SRC"
ha core restart
