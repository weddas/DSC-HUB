#pragma once
#include "esphome/core/component.h"
#include "esphome/components/binary_sensor/binary_sensor.h"
#include "esphome/components/sensor/sensor.h"
#include "esphome/components/text_sensor/text_sensor.h"
#include <string>

namespace esphome {
namespace dsc_anchor_ap {

class DscAnchorAp : public Component {
 public:
  void set_ssid(const std::string &ssid) { this->ssid_ = ssid; }
  void set_password(const std::string &password) { this->password_ = password; }
  void set_channel(uint8_t channel) { this->channel_ = channel; }
  void set_ap_ip(const std::string &ip) { this->ap_ip_ = ip; }
  void set_ap_netmask(const std::string &mask) { this->ap_netmask_ = mask; }
  void set_max_connections(uint8_t n) { this->max_connections_ = n; }
  void set_enable_napt(bool enable) { this->enable_napt_ = enable; }
  void set_hub_mac(const std::string &mac) { this->hub_mac_ = mac; }
  void set_bssid_sensor(text_sensor::TextSensor *s) { this->bssid_sensor_ = s; }
  void set_channel_sensor(sensor::Sensor *s) { this->channel_sensor_ = s; }
  void set_up_sensor(binary_sensor::BinarySensor *s) { this->up_sensor_ = s; }

  void setup() override;
  void loop() override;
  void dump_config() override;
  // After espnow LATE: espnow forces WIFI_MODE_STA and would kill SoftAP if we
  // start first. SoftAP re-asserts APSTA after that.
  float get_setup_priority() const override { return setup_priority::LATE - 1.0f; }

 protected:
  bool start_softap_();
  // Best-effort SoftAP IP + NAPT; SoftAP beacon must not depend on this.
  void configure_ap_netif_();
  void log_sta_list_();
  void ensure_apsta_mode_();
  void ensure_espnow_ap_peers_();

  std::string ssid_;
  std::string password_;
  std::string ap_ip_{"192.168.4.1"};
  std::string ap_netmask_{"255.255.255.0"};
  // Hub STA MAC — always force ESP-NOW peer onto WIFI_IF_AP after SoftAP.
  std::string hub_mac_;
  uint8_t channel_{11};
  // SoftAP STA budget: hub+control+4 sonoffs+4 pots (+headroom).
  uint8_t max_connections_{14};
  bool enable_napt_{true};
  uint32_t last_sta_log_ms_{0};
  text_sensor::TextSensor *bssid_sensor_{nullptr};
  sensor::Sensor *channel_sensor_{nullptr};
  binary_sensor::BinarySensor *up_sensor_{nullptr};
};

}  // namespace dsc_anchor_ap
}  // namespace esphome
