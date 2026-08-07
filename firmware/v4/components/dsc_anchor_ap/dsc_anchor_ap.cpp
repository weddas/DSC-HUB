#include "dsc_anchor_ap.h"
#include "esphome/core/log.h"

#include <cstdio>
#include <cstring>

#include <esp_wifi.h>

namespace esphome {
namespace dsc_anchor_ap {

static const char *const TAG = "dsc_anchor_ap";

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

  // SoftAP + keep STA IF so ESP-NOW (which may have started STA) stays valid.
  err = esp_wifi_set_mode(WIFI_MODE_APSTA);
  if (err != ESP_OK) {
    ESP_LOGE(TAG, "set_mode APSTA failed: %s", esp_err_to_name(err));
    this->mark_failed();
    return;
  }

  wifi_config_t conf = {};
  std::strncpy(reinterpret_cast<char *>(conf.ap.ssid), this->ssid_.c_str(),
               sizeof(conf.ap.ssid) - 1);
  conf.ap.ssid_len = static_cast<uint8_t>(
      std::min(this->ssid_.size(), sizeof(conf.ap.ssid)));
  std::strncpy(reinterpret_cast<char *>(conf.ap.password), this->password_.c_str(),
               sizeof(conf.ap.password) - 1);
  conf.ap.channel = this->channel_;
  conf.ap.max_connection = 8;
  conf.ap.authmode =
      this->password_.empty() ? WIFI_AUTH_OPEN : WIFI_AUTH_WPA2_PSK;
  conf.ap.ssid_hidden = 0;
  conf.ap.beacon_interval = 100;

  err = esp_wifi_set_config(WIFI_IF_AP, &conf);
  if (err != ESP_OK) {
    ESP_LOGE(TAG, "set_config AP failed: %s", esp_err_to_name(err));
    this->mark_failed();
    return;
  }

  err = esp_wifi_start();
  if (err != ESP_OK && err != ESP_ERR_WIFI_CONN) {
    // Already started by espnow is OK.
    if (err != ESP_OK) {
      ESP_LOGW(TAG, "esp_wifi_start: %s (continuing)", esp_err_to_name(err));
    }
  }

  // Pin SoftAP channel (ESP-NOW coexists on this channel).
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_channel(this->channel_, WIFI_SECOND_CHAN_NONE);
  esp_wifi_set_promiscuous(false);

  uint8_t mac[6] = {0};
  if (esp_wifi_get_mac(WIFI_IF_AP, mac) != ESP_OK)
    esp_wifi_get_mac(WIFI_IF_STA, mac);
  char bssid[18];
  snprintf(bssid, sizeof(bssid), "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1],
           mac[2], mac[3], mac[4], mac[5]);
  ESP_LOGI(TAG, "SoftAP '%s' ch%u BSSID %s", this->ssid_.c_str(),
           (unsigned) this->channel_, bssid);

  if (this->bssid_sensor_ != nullptr)
    this->bssid_sensor_->publish_state(bssid);
  if (this->channel_sensor_ != nullptr)
    this->channel_sensor_->publish_state(this->channel_);
  if (this->up_sensor_ != nullptr)
    this->up_sensor_->publish_state(true);
}

void DscAnchorAp::dump_config() {
  ESP_LOGCONFIG(TAG, "DSC Anchor SoftAP:");
  ESP_LOGCONFIG(TAG, "  SSID: %s", this->ssid_.c_str());
  ESP_LOGCONFIG(TAG, "  Channel: %u", (unsigned) this->channel_);
}

}  // namespace dsc_anchor_ap
}  // namespace esphome
