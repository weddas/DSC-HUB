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
  void set_bssid_sensor(text_sensor::TextSensor *s) { this->bssid_sensor_ = s; }
  void set_channel_sensor(sensor::Sensor *s) { this->channel_sensor_ = s; }
  void set_up_sensor(binary_sensor::BinarySensor *s) { this->up_sensor_ = s; }

  void setup() override;
  void dump_config() override;
  // After espnow LATE (which may init STA wifi for ESP-NOW without wifi:).
  float get_setup_priority() const override { return setup_priority::LATE - 1.0f; }

 protected:
  bool start_softap_();
  // Best-effort SoftAP IP + NAPT; SoftAP beacon must not depend on this.
  void configure_ap_netif_();

  std::string ssid_;
  std::string password_;
  std::string ap_ip_{"192.168.4.1"};
  std::string ap_netmask_{"255.255.255.0"};
  uint8_t channel_{11};
  // SoftAP STA budget: hub+control+4 sonoffs (+headroom). Match bridge sdkconfig.
  uint8_t max_connections_{10};
  bool enable_napt_{true};
  text_sensor::TextSensor *bssid_sensor_{nullptr};
  sensor::Sensor *channel_sensor_{nullptr};
  binary_sensor::BinarySensor *up_sensor_{nullptr};
};

}  // namespace dsc_anchor_ap
}  // namespace esphome
