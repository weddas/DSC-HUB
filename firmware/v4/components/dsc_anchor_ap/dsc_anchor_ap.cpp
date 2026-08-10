#include "dsc_anchor_ap.h"
#include "esphome/core/log.h"

#include <cstdio>
#include <cstring>
#include <vector>

#include <esp_netif.h>
#include <esp_now.h>
#include <esp_wifi.h>

namespace esphome {
namespace dsc_anchor_ap {

static const char *const TAG = "dsc_anchor_ap";

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
    esp_now_del_peer(p.peer_addr);
    p.ifidx = ifidx;
    p.encrypt = false;
    esp_err_t err = esp_now_add_peer(&p);
    if (err == ESP_OK) {
      rebound++;
    } else {
      char mac[18];
      snprintf(mac, sizeof(mac), "%02X:%02X:%02X:%02X:%02X:%02X", p.peer_addr[0],
               p.peer_addr[1], p.peer_addr[2], p.peer_addr[3], p.peer_addr[4],
               p.peer_addr[5]);
      ESP_LOGW(TAG, "rebind peer %s failed: %s", mac, esp_err_to_name(err));
    }
  }
  ESP_LOGI(TAG, "Rebound %d ESP-NOW peer(s) onto ifidx=%d", rebound,
           (int) ifidx);
}

void DscAnchorAp::configure_ap_netif_() {
  esp_netif_t *ap_netif = esp_netif_get_handle_from_ifkey("WIFI_AP_DEF");
  if (ap_netif == nullptr) {
    ap_netif = esp_netif_create_default_wifi_ap();
  }
  if (ap_netif == nullptr) {
    ESP_LOGW(TAG, "No WIFI_AP_DEF netif — SoftAP radio up, IP/NAPT skipped");
    return;
  }

  esp_netif_ip_info_t ip_info = {};
  ip_info.ip.addr = esp_ip4addr_aton(this->ap_ip_.c_str());
  ip_info.netmask.addr = esp_ip4addr_aton(this->ap_netmask_.c_str());
  if (ip_info.ip.addr == 0 || ip_info.netmask.addr == 0) {
    ESP_LOGW(TAG, "Bad ap_ip/netmask %s / %s — leaving ESP-IDF SoftAP defaults",
             this->ap_ip_.c_str(), this->ap_netmask_.c_str());
    return;
  }
  ip_info.gw = ip_info.ip;

  // Fleet members use static SoftAP IPs. Avoid esp_netif_dhcps_* — ESPHome
  // builds often omit LWIP DHCPS. SoftAP radio must stay up even if IP fails.
  esp_err_t err = esp_netif_dhcpc_stop(ap_netif);
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

  esp_netif_dns_info_t dns = {};
  dns.ip.type = ESP_IPADDR_TYPE_V4;
  dns.ip.u_addr.ip4 = ip_info.ip;
  esp_netif_set_dns_info(ap_netif, ESP_NETIF_DNS_MAIN, &dns);

  if (this->enable_napt_) {
#if defined(CONFIG_LWIP_IPV4_NAPT) || defined(IP_NAPT)
    err = esp_netif_napt_enable(ap_netif);
    if (err != ESP_OK) {
      ESP_LOGW(TAG, "napt_enable: %s (IP forward may still work with HA route)",
               esp_err_to_name(err));
    } else {
      ESP_LOGI(TAG, "NAPT enabled on SoftAP %s", this->ap_ip_.c_str());
    }
#else
    ESP_LOGW(TAG, "NAPT requested but CONFIG_LWIP_IPV4_NAPT not in build");
#endif
  }
  ESP_LOGI(TAG, "SoftAP IP %s (static client map — no DHCPS)", this->ap_ip_.c_str());
}

bool DscAnchorAp::start_softap_() {
  wifi_mode_t mode = WIFI_MODE_NULL;
  esp_err_t err = esp_wifi_get_mode(&mode);
  if (err == ESP_ERR_WIFI_NOT_INIT) {
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    err = esp_wifi_init(&cfg);
    if (err != ESP_OK) {
      ESP_LOGE(TAG, "esp_wifi_init failed: %s", esp_err_to_name(err));
      return false;
    }
    esp_wifi_set_storage(WIFI_STORAGE_RAM);
    esp_wifi_set_ps(WIFI_PS_NONE);
  }

  // APSTA matches the last known-good SoftAP on this ETH01. ESPHome espnow
  // brings up WIFI_MODE_STA first; AP-only mode was a regression vs that path.
  err = esp_wifi_set_mode(WIFI_MODE_APSTA);
  if (err != ESP_OK) {
    ESP_LOGE(TAG, "set_mode APSTA: %s", esp_err_to_name(err));
    return false;
  }

  wifi_config_t wifi_config = {};
  size_t ssid_len = this->ssid_.size();
  if (ssid_len > sizeof(wifi_config.ap.ssid))
    ssid_len = sizeof(wifi_config.ap.ssid);
  memcpy(wifi_config.ap.ssid, this->ssid_.c_str(), ssid_len);
  wifi_config.ap.ssid_len = static_cast<uint8_t>(ssid_len);
  wifi_config.ap.channel = this->channel_;
  // Requires CONFIG_ESP_WIFI_SOFTAP_MAX_NUM_STA >= max_connections_ (bridge: 10).
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

  err = esp_wifi_set_config(WIFI_IF_AP, &wifi_config);
  if (err != ESP_OK) {
    ESP_LOGE(TAG, "set_config AP: %s", esp_err_to_name(err));
    return false;
  }

  err = esp_wifi_start();
  if (err != ESP_OK && err != ESP_ERR_WIFI_CONN) {
    ESP_LOGW(TAG, "esp_wifi_start: %s (continuing)", esp_err_to_name(err));
  }

  // Pin SoftAP channel (ESP-NOW + STA clients share this).
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_channel(this->channel_, WIFI_SECOND_CHAN_NONE);
  esp_wifi_set_promiscuous(false);

  // IP/NAPT is best-effort — never tear SoftAP down if this fails.
  this->configure_ap_netif_();
  rebind_espnow_peers_(WIFI_IF_AP);
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
}

void DscAnchorAp::dump_config() {
  ESP_LOGCONFIG(TAG, "DSC Anchor SoftAP (fleet home + ESP-NOW pin):");
  ESP_LOGCONFIG(TAG, "  SSID: %s", this->ssid_.c_str());
  ESP_LOGCONFIG(TAG, "  Channel: %u", (unsigned) this->channel_);
  ESP_LOGCONFIG(TAG, "  Gateway: %s / %s", this->ap_ip_.c_str(),
                this->ap_netmask_.c_str());
  ESP_LOGCONFIG(TAG, "  Max STA: %u", (unsigned) this->max_connections_);
  ESP_LOGCONFIG(TAG, "  NAPT: %s", this->enable_napt_ ? "yes" : "no");
}

}  // namespace dsc_anchor_ap
}  // namespace esphome
