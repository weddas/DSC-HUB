#include "dsc_anchor_ap.h"
#include "esphome/core/log.h"
#include "esphome/core/helpers.h"

#include <cstdio>
#include <cstring>
#include <vector>

#include <esp_netif.h>
#include <esp_now.h>
#include <esp_wifi.h>
#include <esp_wifi_default.h>

namespace esphome {
namespace dsc_anchor_ap {

static const char *const TAG = "dsc_anchor_ap";

// Must exist *before* esp_wifi_start(): WIFI_EVENT_AP_START only brings the
// lwIP SoftAP iface up when s_wifi_netifs[WIFI_IF_AP] is already attached.
// Creating WIFI_AP_DEF after start left SoftAP radio up but .4.1 dead on eth.
static esp_netif_t *ensure_ap_netif_() {
  esp_netif_t *ap_netif = esp_netif_get_handle_from_ifkey("WIFI_AP_DEF");
  if (ap_netif != nullptr)
    return ap_netif;
  ap_netif = esp_netif_create_default_wifi_ap();
  if (ap_netif == nullptr) {
    ESP_LOGW(TAG, "esp_netif_create_default_wifi_ap failed");
  }
  return ap_netif;
}

static void rebind_espnow_peers_(wifi_interface_t ifidx) {
  esp_now_peer_num_t num = {};
  if (esp_now_get_peer_num(&num) != ESP_OK || num.total_num == 0) {
    ESP_LOGW(TAG, "No ESP-NOW peers to rebind (ifidx=%d)", (int) ifidx);
    return;
  }

  std::vector<esp_now_peer_info_t> peers;
  peers.reserve(num.total_num);
  esp_now_peer_info_t peer = {};
  if (esp_now_fetch_peer(true, &peer) != ESP_OK) {
    ESP_LOGW(TAG, "esp_now_fetch_peer failed");
    return;
  }
  do {
    peers.push_back(peer);
  } while (esp_now_fetch_peer(false, &peer) == ESP_OK);

  int rebound = 0;
  for (auto &p : peers) {
    // Preserve encrypt/lmk — only move ifidx onto SoftAP radio.
    wifi_interface_t old = p.ifidx;
    esp_now_del_peer(p.peer_addr);
    p.ifidx = ifidx;
    esp_err_t err = esp_now_add_peer(&p);
    if (err == ESP_OK) {
      rebound++;
    } else {
      char mac[18];
      snprintf(mac, sizeof(mac), "%02X:%02X:%02X:%02X:%02X:%02X", p.peer_addr[0],
               p.peer_addr[1], p.peer_addr[2], p.peer_addr[3], p.peer_addr[4],
               p.peer_addr[5]);
      ESP_LOGW(TAG, "rebind peer %s (was ifidx=%d) failed: %s", mac, (int) old,
               esp_err_to_name(err));
    }
  }
  ESP_LOGI(TAG, "Rebound %d ESP-NOW peer(s) onto ifidx=%d", rebound,
           (int) ifidx);
}

static bool parse_mac6_(const std::string &s, uint8_t out[6]) {
  unsigned int b[6] = {};
  if (sscanf(s.c_str(), "%02x:%02x:%02x:%02x:%02x:%02x", &b[0], &b[1], &b[2],
             &b[3], &b[4], &b[5]) != 6)
    return false;
  for (int i = 0; i < 6; i++)
    out[i] = static_cast<uint8_t>(b[i]);
  return true;
}

static void ensure_peer_ifidx_(const uint8_t mac[6], wifi_interface_t ifidx) {
  esp_now_peer_info_t p = {};
  bool exists = esp_now_get_peer(mac, &p) == ESP_OK;
  if (exists && p.ifidx == ifidx)
    return;
  if (exists)
    esp_now_del_peer(mac);
  memset(&p, 0, sizeof(p));
  memcpy(p.peer_addr, mac, 6);
  p.channel = 0;  // current SoftAP channel
  p.ifidx = ifidx;
  p.encrypt = false;
  esp_err_t err = esp_now_add_peer(&p);
  char m[18];
  snprintf(m, sizeof(m), "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2],
           mac[3], mac[4], mac[5]);
  if (err == ESP_OK) {
    ESP_LOGI(TAG, "ESP-NOW peer %s on ifidx=%d", m, (int) ifidx);
  } else {
    ESP_LOGW(TAG, "ESP-NOW peer %s ifidx=%d failed: %s", m, (int) ifidx,
             esp_err_to_name(err));
  }
}

static void log_espnow_peers_() {
  esp_now_peer_num_t num = {};
  if (esp_now_get_peer_num(&num) != ESP_OK) {
    ESP_LOGW(TAG, "esp_now_get_peer_num failed");
    return;
  }
  ESP_LOGI(TAG, "ESP-NOW peers=%u", (unsigned) num.total_num);
  if (num.total_num == 0)
    return;
  esp_now_peer_info_t peer = {};
  if (esp_now_fetch_peer(true, &peer) != ESP_OK)
    return;
  do {
    ESP_LOGI(TAG,
             "  peer %02X:%02X:%02X:%02X:%02X:%02X ifidx=%d ch=%u enc=%d",
             peer.peer_addr[0], peer.peer_addr[1], peer.peer_addr[2],
             peer.peer_addr[3], peer.peer_addr[4], peer.peer_addr[5],
             (int) peer.ifidx, (unsigned) peer.channel, (int) peer.encrypt);
  } while (esp_now_fetch_peer(false, &peer) == ESP_OK);
}

void DscAnchorAp::ensure_espnow_ap_peers_() {
  // esp_wifi_stop() during SoftAP bring-up can leave peers on WIFI_IF_STA or
  // empty. SoftAP RX of hub 0xD8/0xD1 requires WIFI_IF_AP.
  rebind_espnow_peers_(WIFI_IF_AP);
  static const uint8_t kBcast[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
  ensure_peer_ifidx_(kBcast, WIFI_IF_AP);
  uint8_t hub[6] = {};
  if (!this->hub_mac_.empty() && parse_mac6_(this->hub_mac_, hub)) {
    ensure_peer_ifidx_(hub, WIFI_IF_AP);
  } else if (!this->hub_mac_.empty()) {
    ESP_LOGW(TAG, "Bad hub_mac '%s' — SoftAP ESP-NOW peer not forced",
             this->hub_mac_.c_str());
  }
  log_espnow_peers_();
}

void DscAnchorAp::configure_ap_netif_() {
  esp_netif_t *ap_netif = ensure_ap_netif_();
  if (ap_netif == nullptr) {
    ESP_LOGW(TAG, "No WIFI_AP_DEF netif — SoftAP radio up, IP/NAPT skipped");
    return;
  }

  // Do NOT call esp_netif_action_start here — AP_START's wifi_default handler
  // already adds the lwIP netif. A second add asserts ("netif already added")
  // and safe_mode rolls back the OTA.

  esp_netif_ip_info_t ip_info = {};
  ip_info.ip.addr = esp_ip4addr_aton(this->ap_ip_.c_str());
  ip_info.netmask.addr = esp_ip4addr_aton(this->ap_netmask_.c_str());
  if (ip_info.ip.addr == 0 || ip_info.netmask.addr == 0) {
    ESP_LOGW(TAG, "Bad ap_ip/netmask %s / %s — leaving ESP-IDF SoftAP defaults",
             this->ap_ip_.c_str(), this->ap_netmask_.c_str());
    return;
  }
  ip_info.gw = ip_info.ip;

  // SoftAP defaults to DHCPS when built in. Stop it before pinning our static
  // SoftAP map — set_ip_info while DHCPS owns the iface often leaves .4.1
  // unreachable from eth. Fleet STAs use static SoftAP IPs (no SoftAP DHCP).
  esp_err_t err = ESP_OK;
#if defined(CONFIG_LWIP_DHCPS)
  err = esp_netif_dhcps_stop(ap_netif);
  if (err != ESP_OK && err != ESP_ERR_ESP_NETIF_DHCP_ALREADY_STOPPED &&
      err != ESP_ERR_ESP_NETIF_IF_NOT_READY) {
    ESP_LOGW(TAG, "dhcps_stop: %s", esp_err_to_name(err));
  }
#endif
  err = esp_netif_dhcpc_stop(ap_netif);
  if (err != ESP_OK && err != ESP_ERR_ESP_NETIF_DHCP_ALREADY_STOPPED &&
      err != ESP_ERR_ESP_NETIF_IF_NOT_READY) {
    ESP_LOGW(TAG, "dhcpc_stop: %s", esp_err_to_name(err));
  }
  err = esp_netif_set_ip_info(ap_netif, &ip_info);
  if (err != ESP_OK) {
    ESP_LOGW(TAG, "set_ip_info: %s (SoftAP beacon still up)",
             esp_err_to_name(err));
    return;
  }

  esp_netif_ip_info_t got = {};
  if (esp_netif_get_ip_info(ap_netif, &got) == ESP_OK) {
    ESP_LOGI(TAG, "SoftAP netif IP " IPSTR " mask " IPSTR " up=%d",
             IP2STR(&got.ip), IP2STR(&got.netmask),
             (int) esp_netif_is_netif_up(ap_netif));
  }

  esp_netif_dns_info_t dns = {};
  dns.ip.type = ESP_IPADDR_TYPE_V4;
  dns.ip.u_addr.ip4 = ip_info.ip;
  esp_netif_set_dns_info(ap_netif, ESP_NETIF_DNS_MAIN, &dns);

  if (this->enable_napt_) {
#if defined(CONFIG_LWIP_IPV4_NAPT) || defined(IP_NAPT)
    // ESP-IDF: NAPT goes on the iface toward the *target* network. SoftAP
    // STAs need LAN/HA via Ethernet → enable on ETH_DEF (WAN), not SoftAP.
    // NAPT is single-iface; SoftAP-side enable was the wrong direction.
    esp_netif_t *wan = esp_netif_get_handle_from_ifkey("ETH_DEF");
    if (wan == nullptr)
      wan = esp_netif_get_handle_from_ifkey("WIFI_STA_DEF");
    if (wan == nullptr) {
      ESP_LOGW(TAG, "NAPT: no ETH_DEF/WIFI_STA_DEF — SoftAP clients may lack LAN");
    } else {
      err = esp_netif_napt_enable(wan);
      if (err != ESP_OK) {
        ESP_LOGW(TAG,
                 "napt_enable(WAN): %s (IP forward may still work with HA route)",
                 esp_err_to_name(err));
      } else {
        ESP_LOGI(TAG, "NAPT enabled on WAN (eth/sta) for SoftAP→LAN");
      }
    }
#else
    ESP_LOGW(TAG, "NAPT requested but CONFIG_LWIP_IPV4_NAPT not in build");
#endif
  }
  ESP_LOGI(TAG, "SoftAP IP %s (static client map — no DHCPS)", this->ap_ip_.c_str());
}

bool DscAnchorAp::start_softap_() {
  wifi_mode_t mode_before = WIFI_MODE_NULL;
  esp_err_t err = esp_wifi_get_mode(&mode_before);
  bool wifi_was_running = (err == ESP_OK && mode_before != WIFI_MODE_NULL);

  if (err == ESP_ERR_WIFI_NOT_INIT) {
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    err = esp_wifi_init(&cfg);
    if (err != ESP_OK) {
      ESP_LOGE(TAG, "esp_wifi_init failed: %s", esp_err_to_name(err));
      return false;
    }
    esp_wifi_set_storage(WIFI_STORAGE_RAM);
    esp_wifi_set_ps(WIFI_PS_NONE);
    wifi_was_running = false;
  }

  // Attach SoftAP netif + default AP_START handlers before enabling AP.
  if (ensure_ap_netif_() == nullptr) {
    ESP_LOGW(TAG, "Continuing without WIFI_AP_DEF — SoftAP L3 will fail");
  }

  wifi_config_t wifi_config = {};
  size_t ssid_len = this->ssid_.size();
  if (ssid_len > sizeof(wifi_config.ap.ssid))
    ssid_len = sizeof(wifi_config.ap.ssid);
  memcpy(wifi_config.ap.ssid, this->ssid_.c_str(), ssid_len);
  wifi_config.ap.ssid_len = static_cast<uint8_t>(ssid_len);
  wifi_config.ap.channel = this->channel_;
  wifi_config.ap.max_connection = this->max_connections_;
  wifi_config.ap.beacon_interval = 100;
  wifi_config.ap.ssid_hidden = 0;
  if (this->password_.empty()) {
    wifi_config.ap.authmode = WIFI_AUTH_OPEN;
  } else {
    wifi_config.ap.authmode = WIFI_AUTH_WPA2_PSK;
    size_t pw_len = this->password_.size();
    if (pw_len > sizeof(wifi_config.ap.password) - 1)
      pw_len = sizeof(wifi_config.ap.password) - 1;
    memcpy(wifi_config.ap.password, this->password_.c_str(), pw_len);
  }

  // espnow leaves WIFI_MODE_STA already started. Changing STA→APSTA then
  // set_config can emit two AP_START events and double netif_add (assert).
  // Clean path: stop → APSTA → config → single start.
  if (wifi_was_running) {
    ESP_LOGI(TAG, "wifi was mode=%d — stop before SoftAP bring-up",
             (int) mode_before);
    esp_wifi_stop();
    delay(50);
  }

  err = esp_wifi_set_mode(WIFI_MODE_APSTA);
  if (err != ESP_OK) {
    ESP_LOGE(TAG, "set_mode APSTA: %s", esp_err_to_name(err));
    return false;
  }

  err = esp_wifi_set_config(WIFI_IF_AP, &wifi_config);
  if (err != ESP_OK) {
    ESP_LOGE(TAG, "set_config AP: %s", esp_err_to_name(err));
    return false;
  }

  err = esp_wifi_start();
  if (err != ESP_OK && err != ESP_ERR_WIFI_CONN) {
    ESP_LOGW(TAG, "esp_wifi_start: %s (continuing)", esp_err_to_name(err));
  }

  esp_wifi_set_promiscuous(true);
  esp_wifi_set_channel(this->channel_, WIFI_SECOND_CHAN_NONE);
  esp_wifi_set_promiscuous(false);

  esp_netif_t *ap_netif = esp_netif_get_handle_from_ifkey("WIFI_AP_DEF");
  for (int i = 0; i < 40 && ap_netif != nullptr && !esp_netif_is_netif_up(ap_netif);
       i++) {
    delay(25);
  }

  this->configure_ap_netif_();
  this->ensure_espnow_ap_peers_();
  return true;
}

void DscAnchorAp::setup() {
  if (!this->start_softap_()) {
    this->mark_failed();
    if (this->up_sensor_ != nullptr)
      this->up_sensor_->publish_state(false);
    return;
  }

  uint8_t ch = 0;
  wifi_second_chan_t second = WIFI_SECOND_CHAN_NONE;
  esp_wifi_get_channel(&ch, &second);

  uint8_t mac[6] = {0};
  if (esp_wifi_get_mac(WIFI_IF_AP, mac) != ESP_OK)
    esp_wifi_get_mac(WIFI_IF_STA, mac);
  char bssid[18];
  snprintf(bssid, sizeof(bssid), "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1],
           mac[2], mac[3], mac[4], mac[5]);
  ESP_LOGI(TAG,
           "SoftAP '%s' ch%u (radio ch%u) AP MAC %s gw %s — NAPT=%d ESP-NOW on "
           "WIFI_IF_AP",
           this->ssid_.c_str(), (unsigned) this->channel_, (unsigned) ch, bssid,
           this->ap_ip_.c_str(), (int) this->enable_napt_);

  if (this->bssid_sensor_ != nullptr)
    this->bssid_sensor_->publish_state(bssid);
  if (this->channel_sensor_ != nullptr)
    this->channel_sensor_->publish_state(ch ? ch : this->channel_);
  if (this->up_sensor_ != nullptr)
    this->up_sensor_->publish_state(true);
  this->log_sta_list_();
}

void DscAnchorAp::log_sta_list_() {
  wifi_mode_t mode = WIFI_MODE_NULL;
  esp_wifi_get_mode(&mode);
  wifi_sta_list_t stas = {};
  esp_err_t err = esp_wifi_ap_get_sta_list(&stas);
  if (err != ESP_OK) {
    ESP_LOGW(TAG, "SoftAP STA list unavailable: %s (wifi_mode=%d)",
             esp_err_to_name(err), (int) mode);
    return;
  }
  ESP_LOGI(TAG, "SoftAP STAs=%d (wifi_mode=%d)", stas.num, (int) mode);
  for (int i = 0; i < stas.num; i++) {
    const uint8_t *m = stas.sta[i].mac;
    ESP_LOGI(TAG, "  STA[%d] %02X:%02X:%02X:%02X:%02X:%02X rssi=%d", i, m[0],
             m[1], m[2], m[3], m[4], m[5], (int) stas.sta[i].rssi);
  }
}

void DscAnchorAp::ensure_apsta_mode_() {
  // ESPHome espnow (no wifi:) starts WIFI_MODE_STA. SoftAP must stay APSTA.
  wifi_mode_t mode = WIFI_MODE_NULL;
  if (esp_wifi_get_mode(&mode) != ESP_OK)
    return;
  if (mode == WIFI_MODE_APSTA || mode == WIFI_MODE_AP)
    return;

  ESP_LOGW(TAG, "wifi_mode=%d (want APSTA) — restoring SoftAP via stop/start",
           (int) mode);
  esp_wifi_stop();
  delay(50);
  if (ensure_ap_netif_() == nullptr)
    return;

  esp_err_t err = esp_wifi_set_mode(WIFI_MODE_APSTA);
  if (err != ESP_OK) {
    ESP_LOGW(TAG, "set_mode APSTA restore: %s", esp_err_to_name(err));
    return;
  }

  wifi_config_t wifi_config = {};
  size_t ssid_len = this->ssid_.size();
  if (ssid_len > sizeof(wifi_config.ap.ssid))
    ssid_len = sizeof(wifi_config.ap.ssid);
  memcpy(wifi_config.ap.ssid, this->ssid_.c_str(), ssid_len);
  wifi_config.ap.ssid_len = static_cast<uint8_t>(ssid_len);
  wifi_config.ap.channel = this->channel_;
  wifi_config.ap.max_connection = this->max_connections_;
  wifi_config.ap.beacon_interval = 100;
  if (this->password_.empty()) {
    wifi_config.ap.authmode = WIFI_AUTH_OPEN;
  } else {
    wifi_config.ap.authmode = WIFI_AUTH_WPA2_PSK;
    size_t pw_len = this->password_.size();
    if (pw_len > sizeof(wifi_config.ap.password) - 1)
      pw_len = sizeof(wifi_config.ap.password) - 1;
    memcpy(wifi_config.ap.password, this->password_.c_str(), pw_len);
  }
  err = esp_wifi_set_config(WIFI_IF_AP, &wifi_config);
  if (err != ESP_OK) {
    ESP_LOGW(TAG, "set_config AP restore: %s", esp_err_to_name(err));
    return;
  }
  err = esp_wifi_start();
  if (err != ESP_OK && err != ESP_ERR_WIFI_CONN) {
    ESP_LOGW(TAG, "esp_wifi_start restore: %s", esp_err_to_name(err));
  }
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_channel(this->channel_, WIFI_SECOND_CHAN_NONE);
  esp_wifi_set_promiscuous(false);
  this->ensure_espnow_ap_peers_();
}

void DscAnchorAp::loop() {
  uint32_t now = millis();
  if (now - this->last_sta_log_ms_ < 15000)
    return;
  this->last_sta_log_ms_ = now;
  this->ensure_apsta_mode_();
  this->ensure_espnow_ap_peers_();
  this->log_sta_list_();
}

void DscAnchorAp::dump_config() {
  ESP_LOGCONFIG(TAG, "DSC Anchor SoftAP (fleet home + ESP-NOW pin):");
  ESP_LOGCONFIG(TAG, "  SSID: %s", this->ssid_.c_str());
  ESP_LOGCONFIG(TAG, "  Channel: %u", (unsigned) this->channel_);
  ESP_LOGCONFIG(TAG, "  Gateway: %s / %s", this->ap_ip_.c_str(),
                this->ap_netmask_.c_str());
  ESP_LOGCONFIG(TAG, "  Max STA: %u", (unsigned) this->max_connections_);
  ESP_LOGCONFIG(TAG, "  NAPT: %s", this->enable_napt_ ? "yes" : "no");
  if (!this->hub_mac_.empty())
    ESP_LOGCONFIG(TAG, "  Hub ESP-NOW MAC: %s", this->hub_mac_.c_str());
}

}  // namespace dsc_anchor_ap
}  // namespace esphome
