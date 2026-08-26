#!/bin/bash
# Deprecated wrapper — use soak-check.sh (same behaviour).
exec "$(dirname "$0")/soak-check.sh" "$@"
