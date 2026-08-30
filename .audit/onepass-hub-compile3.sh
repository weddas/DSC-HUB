#!/bin/bash
LOG=/home/dsc/hub-compile.log
PW=Digital
echo "$PW" | sudo -S bash -lc "timeout 900 docker exec -w /config dsc-hub-esphome esphome compile dsc-hub.yaml" > "$LOG" 2>&1
echo COMPILE_EXIT:$?
tail -20 "$LOG"
grep -E "Successfully compiled|Failed config|ERROR" "$LOG" | tail -20