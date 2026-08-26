#!/bin/bash
# Install the hourly soak-check cron job (idempotent). Run on the Pi.
set -eu
install -m 0755 /tmp/soak-check-remote.sh /home/dsc/soak-check.sh
/home/dsc/soak-check.sh
( crontab -l 2>/dev/null | grep -v 'soak-check' ; echo '0 * * * * /home/dsc/soak-check.sh' ) | crontab -
echo '--- crontab now:'
crontab -l
echo '--- last log line:'
tail -1 /var/lib/dsc-hub/soak-2026-08-26.log
echo CRON_OK
