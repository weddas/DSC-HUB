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
  void set_bssid_sensor(text_sensor::TextSensor *s) { this->bssid_sensor_ = s; }
  void set_channel_sensor(sensor::Sensor *s) { this->channel_sensor_ = s; }
  void set_up_sensor(binary_sensor::BinarySensor *s) { this->up_sensor_ = s; }

  void setup() override;
  void dump_config() override;
  // After espnow LATE (which may init STA wifi for ESP-NOW without wifi:).
  float get_setup_priority() const override { return setup_priority::LATE - 1.0f; }

 protected:
  std::string ssid_;
  std::string password_;
  uint8_t channel_{11};
  text_sensor::TextSensor *bssid_sensor_{nullptr};
  sensor::Sensor *channel_sensor_{nullptr};
  binary_sensor::BinarySensor *up_sensor_{nullptr};
};

}  // namespace dsc_anchor_ap
}  // namespace esphome
