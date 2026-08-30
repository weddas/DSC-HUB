#!/bin/bash
for i in $(seq 1 48); do
  if grep -q "Successfully compiled" /home/dsc/hub-compile.log 2>/dev/null; then
    echo COMPILE_OK
    grep -E "Successfully compiled|Took" /home/dsc/hub-compile.log | tail -5
    exit 0
  fi
  if grep -qE "Failed config|ERROR Error compiling|FATAL" /home/dsc/hub-compile.log 2>/dev/null; then
    echo COMPILE_FAIL
    grep -E "Failed config|ERROR|error:" /home/dsc/hub-compile.log | tail -20
    exit 1
  fi
  if ! pgrep -f "esphome compile" >/dev/null; then
    echo COMPILE_EXITED_NO_MARKER
    tail -30 /home/dsc/hub-compile.log
    exit 2
  fi
  sleep 10
done
echo COMPILE_TIMEOUT
tail -20 /home/dsc/hub-compile.log
exit 3