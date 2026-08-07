#!/bin/sh
jq -r '.data.items[] | select(.url|tostring|test("dsc-system-map|DSC-HUB|dsc-build-plant")) | .url' /config/.storage/lovelace_resources
