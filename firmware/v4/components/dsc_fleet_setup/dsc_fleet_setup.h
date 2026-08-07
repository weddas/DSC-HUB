#pragma once

#include "esphome/core/component.h"
#include "esphome/core/helpers.h"
#include "esphome/components/web_server_base/web_server_base.h"

#include <array>
#include <cstring>
#include <string>

namespace esphome {
namespace dsc_fleet_setup {

enum class FleetRole : uint8_t { HUB = 1, CONTROL = 2, POT = 3, BRIDGE = 4 };
enum class NetMode : uint8_t { UNCONFIGURED = 0, HOME_WIFI = 1, LOCAL_AP = 2 };

struct PeerSlot {
  bool present{false};
  char role[12]{};
  char name[24]{};
  uint8_t mac[6]{};
  uint32_t last_seen_ms{0};
};

class DscFleetSetup : public Component, public AsyncWebHandler {
 public:
  void setup() override;
  void loop() override;
  void dump_config() override;
  float get_setup_priority() const override { return setup_priority::AFTER_WIFI; }

  void set_web_server_base(web_server_base::WebServerBase *base) { this->base_ = base; }
  void set_enabled(bool v) { this->enabled_ = v; }
  void set_role(const std::string &role);
  void set_setup_ap_prefix(const std::string &v) { this->setup_ap_prefix_ = v; }
  void set_setup_ap_password(const std::string &v) { this->setup_ap_password_ = v; }
  void set_espnow_key(const std::string &v) { this->espnow_key_ = v; }
  void set_espnow_cmd_tag(uint16_t v) { this->espnow_cmd_tag_ = v; }
  void set_pot_index(uint8_t v) { this->pot_index_ = v; }
  void set_device_name(const std::string &v) { this->device_name_ = v; }
  void set_lab_hub_mac(uint8_t a, uint8_t b, uint8_t c, uint8_t d, uint8_t e, uint8_t f);
  void set_lab_panel_mac(uint8_t a, uint8_t b, uint8_t c, uint8_t d, uint8_t e, uint8_t f);

  // AsyncWebHandler
  bool canHandle(AsyncWebServerRequest *request) const override;
  void handleRequest(AsyncWebServerRequest *request) override;
  void handleBody(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) override;
  bool isRequestHandlerTrivial() const override { return false; }

  bool is_configured() const { return this->net_mode_ != NetMode::UNCONFIGURED; }
  bool needs_provision() const { return this->enabled_ && this->role_ != FleetRole::HUB && !this->is_configured(); }
  NetMode net_mode() const { return this->net_mode_; }
  // 0 on the lab stubs (no kit provisioning) and on any pot not yet assigned
  // a slot; 1-4 once dsc-fleet-setup-pot-kit.yaml passes fleet_pot_index.
  uint8_t pot_index() const { return this->pot_index_; }
  const uint8_t *hub_mac() const { return this->hub_mac_; }
  const uint8_t *panel_mac() const { return this->panel_mac_; }
  bool has_hub_mac() const {
    if (!this->hub_mac_valid_)
      return false;
    for (int i = 0; i < 6; i++)
      if (this->hub_mac_[i] != 0)
        return true;
    return false;
  }
  bool has_panel_mac() const {
    if (!this->panel_mac_valid_)
      return false;
    for (int i = 0; i < 6; i++)
      if (this->panel_mac_[i] != 0)
        return true;
    return false;
  }
  const uint8_t *bridge_mac() const { return this->bridge_mac_; }
  bool has_bridge_mac() const {
    if (!this->bridge_mac_valid_)
      return false;
    for (int i = 0; i < 6; i++)
      if (this->bridge_mac_[i] != 0)
        return true;
    return false;
  }
  std::string bridge_mac_str() const;
  std::string setup_status_json() const;

  void factory_reset_fleet();
  void open_add_device_window();
  void apply_espnow_peers();

 protected:
  bool load_nvs_();
  bool save_nvs_();
  void start_hub_portal_();
  void handle_hub_api_(AsyncWebServerRequest *request, const std::string &body);
  void satellite_tick_();
  bool satellite_join_setup_ap_();
  bool satellite_pull_config_();
  bool satellite_post_hello_();
  void apply_wifi_credentials_(const std::string &ssid, const std::string &password);
  static void mac_to_str_(const uint8_t *mac, char *out18);
  static bool parse_mac_(const char *s, uint8_t *out6);
  std::string make_setup_ssid_() const;
  PeerSlot *find_or_alloc_peer_(const char *role, const char *name);

  web_server_base::WebServerBase *base_{nullptr};
  bool enabled_{true};
  FleetRole role_{FleetRole::HUB};
  std::string setup_ap_prefix_{"DSC-Setup"};
  std::string setup_ap_password_;
  std::string espnow_key_;
  uint16_t espnow_cmd_tag_{54727};
  uint8_t pot_index_{0};
  std::string device_name_;

  NetMode net_mode_{NetMode::UNCONFIGURED};
  char sta_ssid_[33]{};
  char sta_pass_[65]{};
  uint8_t hub_mac_[6]{};
  uint8_t panel_mac_[6]{};
  uint8_t bridge_mac_[6]{};
  bool hub_mac_valid_{false};
  bool panel_mac_valid_{false};
  bool bridge_mac_valid_{false};
  uint8_t lab_hub_mac_[6]{};
  uint8_t lab_panel_mac_[6]{};
  bool lab_hub_mac_set_{false};
  bool lab_panel_mac_set_{false};

  std::array<PeerSlot, 8> peers_{};
  bool portal_active_{false};
  bool add_device_window_{false};
  bool handler_registered_{false};
  bool post_handled_{false};
  uint8_t sat_state_{0};
  uint32_t sat_next_ms_{0};
  std::string pending_body_;
};

}  // namespace dsc_fleet_setup
}  // namespace esphome
