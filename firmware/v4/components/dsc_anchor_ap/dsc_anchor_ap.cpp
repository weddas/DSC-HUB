#include "dsc_anchor_ap.h"
#include "esphome/core/log.h"

#include <cstdio>
#include <cstring>
#include <vector>

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

void DscAnchorAp::setup() {
  wifi_mode_t mode = WIFI_MODE_NULL;
  esp_err_t err = esp_wifi_get_mode(&mode);
  if (err == ESP_ERR_WIFI_NOT_INIT) {
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    err = esp_wifi_init(&cfg);
    if (err != ESP_OK) {
      ESP_LOGE(TAG, "esp_wifi_init failed: %s", esp_err_to_name(err));
      this->mark_failed();
      return;
    }
    esp_wifi_set_storage(WIFI_STORAGE_RAM);
    esp_wifi_set_ps(WIFI_PS_NONE);
  }

  // Bring-up path: do NOT flip to SoftAP/APSTA. ESPHome espnow already
  // started WIFI_MODE_STA + peers on WIFI_IF_STA. SoftAP set_mode(APSTA)
  // was killing RX of hub 0xD8/0xD1. Pin channel only; SoftAP returns once
  // ESP-NOW link is proven (F-012 deferred).
  if (mode != WIFI_MODE_STA && mode != WIFI_MODE_NULL) {
    err = esp_wifi_set_mode(WIFI_MODE_STA);
    if (err != ESP_OK) {
      ESP_LOGW(TAG, "set_mode STA: %s", esp_err_to_name(err));
    }
  }

  err = esp_wifi_start();
  if (err != ESP_OK && err != ESP_ERR_WIFI_CONN) {
    ESP_LOGW(TAG, "esp_wifi_start: %s (continuing)", esp_err_to_name(err));
  }

  esp_wifi_set_promiscuous(true);
  esp_wifi_set_channel(this->channel_, WIFI_SECOND_CHAN_NONE);
  esp_wifi_set_promiscuous(false);

  // Keep peers on WIFI_IF_STA (ESPHome default).
  rebind_espnow_peers_(WIFI_IF_STA);

  uint8_t ch = 0;
  wifi_second_chan_t second = WIFI_SECOND_CHAN_NONE;
  esp_wifi_get_channel(&ch, &second);

  uint8_t mac[6] = {0};
  esp_wifi_get_mac(WIFI_IF_STA, mac);
  char bssid[18];
  snprintf(bssid, sizeof(bssid), "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1],
           mac[2], mac[3], mac[4], mac[5]);
  ESP_LOGI(TAG,
           "ESP-NOW channel pin ch%u (radio ch%u) STA MAC %s — SoftAP deferred",
           (unsigned) this->channel_, (unsigned) ch, bssid);

  if (this->bssid_sensor_ != nullptr)
    this->bssid_sensor_->publish_state(bssid);
  if (this->channel_sensor_ != nullptr)
    this->channel_sensor_->publish_state(ch ? ch : this->channel_);
  if (this->up_sensor_ != nullptr)
    this->up_sensor_->publish_state(true);
}

void DscAnchorAp::dump_config() {
  ESP_LOGCONFIG(TAG, "DSC Anchor (ESP-NOW channel pin, SoftAP deferred):");
  ESP_LOGCONFIG(TAG, "  Channel: %u", (unsigned) this->channel_);
}

}  // namespace dsc_anchor_ap
}  // namespace esphome
