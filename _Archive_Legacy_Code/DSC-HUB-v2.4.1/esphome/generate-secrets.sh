#!/usr/bin/env bash
# ==================================================================
#  DSC-HUB v2.4 · SECRETS GENERATOR
#  ------------------------------------------------------------------
#  Generates a complete secrets.yaml with FRESH keys for all 9 devices.
#
#  WHY THIS IS A SCRIPT AND NOT A FILE OF KEYS (six-month note):
#
#  The old keys didn't die because they were inline. They died because
#  they were inline AND the file went through chat and upload logs.
#  Moving a burned key into secrets.yaml doesn't unburn it.
#
#  So: any key handed to you through a chat window is compromised on
#  arrival. The only keys worth having are ones generated on your own
#  machine that never leave it. That's this script.
#
#  Run it once. Never paste its output anywhere.
#
#  v2.4.1: espnow_key is no longer "parked" — the ESP-NOW pot->hub
#  link is LIVE. Same key must land on the hub AND all four pots.
# ==================================================================
set -euo pipefail

OUT="secrets.yaml"

if [ -f "$OUT" ]; then
  echo "⚠  $OUT already exists."
  echo "   Refusing to overwrite — rotating keys means re-flashing every device."
  echo "   Move it aside first if you really mean to rotate:"
  echo "     mv $OUT ${OUT}.old-$(date +%Y%m%d)"
  exit 1
fi

# ESPHome API keys: 32 random bytes, base64. OTA/AP: URL-safe random.
b64key() { openssl rand -base64 32; }
pw()     { openssl rand -hex 16; }
appw()   { openssl rand -base64 12 | tr -d '/+=' | cut -c1-12; }

echo "Generating fresh keys for 9 devices..."

{
  echo "# =================================================================="
  echo "#  DSC-HUB SECRETS  —  generated $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "#  ------------------------------------------------------------------"
  echo "#  ⚠  NEVER commit this file. Never paste it into a chat, an issue,"
  echo "#     or a support thread. It is in .gitignore for a reason."
  echo "#"
  echo "#  Rotating any key below means RE-FLASHING that device — the key is"
  echo "#  compiled in. Rotate the whole set at once or you'll lose track of"
  echo "#  which node is on which key."
  echo "# =================================================================="
  echo ""
  echo "# ---- WiFi (fill these in yourself — they're your network) --------"
  echo "wifi_ssid: \"CHANGEME_YOUR_SSID\""
  echo "wifi_password: \"CHANGEME_YOUR_WIFI_PASSWORD\""
  echo ""
  echo "# ---- Hub ---------------------------------------------------------"
  echo "# The hub drives every fan, the SF1000, and all six demand rungs."
  echo "# Its OTA endpoint had NO password before v2.4. This is the one that"
  echo "# mattered most and was on no checklist."
  echo "dsc_hub_api_key: \"$(b64key)\""
  echo "dsc_hub_ota_password: \"$(pw)\""
  echo "dsc_hub_ap_password: \"$(appw)\""
  echo ""
  echo "# ---- Soil nodes --------------------------------------------------"
  for n in 1 2 3 4; do
    echo "dsc_pot${n}_api_key: \"$(b64key)\""
    echo "dsc_pot${n}_ota_password: \"$(pw)\""
    echo "dsc_pot${n}_ap_password: \"$(appw)\""
    echo ""
  done
  echo "# ---- Appliance nodes (mains-switching — treat as such) ------------"
  for n in heater heatmat humidifier dehumidifier; do
    echo "dsc_${n}_api_key: \"$(b64key)\""
    echo "dsc_${n}_ota_password: \"$(pw)\""
    echo "dsc_${n}_ap_password: \"$(appw)\""
    echo ""
  done
  echo "# ---- ESP-NOW shared key (LIVE in v2.4.1 — hub + all four pots) ----"
  echo "# 16 bytes / 32 hex chars. Same value on every peer."
  echo "espnow_key: \"$(pw)\""
} > "$OUT"

chmod 600 "$OUT"

echo ""
echo "✅ $OUT written (mode 600)."
echo ""
echo "NEXT:"
echo "  1. Edit $OUT — set wifi_ssid and wifi_password (the two CHANGEME lines)."
echo "  2. Confirm .gitignore contains 'secrets.yaml' BEFORE any git add."
echo "  3. Re-flash ALL 9 devices. A device on an old key cannot be reached"
echo "     over OTA once HA is on the new one — flash order matters:"
echo "       hub first (you're at the desk anyway), then pots, then Sonoffs."
echo "  4. Update the HA ESPHome integration if it prompts for new keys."
echo ""
echo "⚠  The OLD hub key and AP password are burned (chat/upload logs)."
echo "   Until every device is re-flashed, treat the LAN as the only thing"
echo "   standing between someone and your 750 W heater."
