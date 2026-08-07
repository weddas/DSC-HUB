#!/bin/sh
set -e
BUMP="n086b-$(date -u +%Y%m%d%H%M%S)"
SRC=/config/.storage/lovelace_resources
cp -a "$SRC" "$SRC.bak.$BUMP"
jq --arg v "$BUMP" '
  .data.items |= map(
    if (.url|tostring|test("DSC-HUB|dsc-system-map"))
    then .url = ((.url|split("?")[0]) + "?v=" + $v) | .type = "js"
    else .
    end)
' "$SRC" > /tmp/lr.json
sz=$(wc -c < /tmp/lr.json)
echo "size=$sz bump=$BUMP"
test "$sz" -gt 200
mv /tmp/lr.json "$SRC"
jq -r '.data.items[] | select(.url|tostring|test("dsc-system-map")) | .url' "$SRC"
