#!/usr/bin/env bash
# ==================================================================
#  DSC-HUB v4 · SECRETS GENERATOR
#  ------------------------------------------------------------------
#  Generates a complete secrets.yaml with FRESH keys for the fleet
#  (hub + 4 pots + 4 Sonoffs + DSC-CONTROL panel).
#
#  Any key handed through a chat window is compromised on arrival.
#  Run this on your own machine; never paste its output anywhere.
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

b64key() { openssl rand -base64 32; }
pw()     { openssl rand -hex 16; }
appw()   { openssl rand -base64 12 | tr -d '/+=' | cut -c1-12; }

echo "Generating fresh keys for hub + pots + Sonoffs + panel..."

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
  echo "# ---- WiFi (lab builds — kit SoftAP setup does not need these) ----"
  echo "wifi_ssid: \"CHANGEME_YOUR_SSID\""
  echo "wifi_password: \"CHANGEME_YOUR_WIFI_PASSWORD\""
  echo ""
  echo "# ---- Kit SoftAP (phone joins DSC-Setup-XXXX) --------------------"
  echo "dsc_setup_ap_password: \"$(appw)\""
  echo ""
  echo "# ---- Hub ---------------------------------------------------------"
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
    echo "dsc_${n}_host: \"192.168.86.XX\"          # static IP — bridge native API client"
    echo ""
  done
  echo "# ---- DSC-BRIDGE (WT32-ETH01 · F-010/F-012/F-013) ------------------"
  echo "dsc_bridge_api_key: \"$(b64key)\""
  echo "dsc_bridge_ota_password: \"$(pw)\""
  echo "dsc_bridge_ap_password: \"$(appw)\""
  echo "dsc_anchor_ap_password: \"$(appw)\"     # SoftAP DSC-Anchor (fleet channel pin)"
  echo ""
  CTRL_API="$(b64key)"
  CTRL_OTA="$(pw)"
  CTRL_AP="$(appw)"
  echo "# ---- DSC-CONTROL (CYD panel) -------------------------------------"
  echo "dsc_cyd1_api_key: \"$CTRL_API\""
  echo "dsc_cyd1_ota_password: \"$CTRL_OTA\""
  echo "dsc_cyd1_ap_password: \"$CTRL_AP\""
  echo "dsc_control_api_key: \"$CTRL_API\""
  echo "dsc_control_ota_password: \"$CTRL_OTA\""
  echo "dsc_control_ap_password: \"$CTRL_AP\""
  echo ""
  echo "# ---- ESP-NOW shared key (LIVE — hub + all four pots) --------------"
  echo "# 16 bytes / 32 hex chars. Same value on every peer."
  echo "espnow_key: \"$(pw)\""
} > "$OUT"

chmod 600 "$OUT"

echo ""
echo "✅ $OUT written (mode 600)."
echo ""
echo "NEXT:"
echo "  1. Edit $OUT — set wifi_ssid/wifi_password (lab) and note dsc_setup_ap_password (kit card)."
echo "  2. Confirm .gitignore contains 'secrets.yaml' BEFORE any git add."
echo "  3. Lab: flash dsc-hub.yaml / dsc-control.yaml / DSC-ProbeN.yaml"
echo "     Kit: flash dsc-hub-kit.yaml then dsc-control-kit.yaml / DSC-ProbeN-kit.yaml"
echo "  4. See SETUP.md for phone SoftAP unboxing (no Home Assistant)."
echo "  5. Update the HA ESPHome integration if it prompts for new keys."
