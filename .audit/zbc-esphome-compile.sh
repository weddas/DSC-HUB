#!/bin/bash
# Compile-only ESPHome job for pot2 through the brain -> venv dashboard (no OTA).
# Wrapper so zbc-run-remote.ps1 can pass the mode; zbc-esphome-check.sh must already be in /tmp.
bash /tmp/zbc-esphome-check.sh "${1:-}" compile
