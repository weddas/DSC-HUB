#pragma once

#include "esphome/core/component.h"
#include "esphome/core/helpers.h"
#include "esphome/components/binary_sensor/binary_sensor.h"
#include "esphome/components/socket/socket.h"

#include <array>
#include <cstring>
#include <string>
#include <vector>

#include "noise/protocol.h"

namespace esphome {
namespace dsc_api_client {

enum class ClientPhase : uint8_t {
  IDLE = 0,
  CONNECTING,
  HELLO,
  HANDSHAKE,
  READY,
  FAILED,
};

class DscApiClient : public Component, public binary_sensor::BinarySensor {
 public:
  void setup() override;
  void loop() override;
  void dump_config() override;
  float get_setup_priority() const override { return setup_priority::AFTER_CONNECTION; }

  void set_host(const std::string &host) { this->host_ = host; }
  void set_port(uint16_t port) { this->port_ = port; }
  void set_encryption_key(const std::string &key_b64) { this->key_b64_ = key_b64; }
  void set_switch_object_id(const std::string &id) { this->switch_object_id_ = id; }
  void set_test_mode_object_id(const std::string &id) { this->test_mode_object_id_ = id; }

  /** Desired relay state from bridge demand path. */
  void set_desired(bool on);
  bool is_ready() const { return this->phase_ == ClientPhase::READY; }
  bool test_mode_active() const { return this->test_mode_; }

 protected:
  void close_socket_();
  void schedule_reconnect_(uint32_t delay_ms);
  bool decode_psk_();
  bool init_noise_initiator_();
  void free_noise_();
  bool socket_write_(const uint8_t *data, size_t len);
  bool send_frame_(const uint8_t *payload, size_t len);
  bool send_noise_hello_();
  bool send_encrypted_(uint16_t msg_type, const uint8_t *proto, size_t proto_len);
  bool read_available_();
  void handle_rx_frame_(const uint8_t *frame, size_t len);
  void handle_hello_frame_(const uint8_t *frame, size_t len);
  void handle_handshake_frame_(const uint8_t *frame, size_t len);
  void handle_data_frame_(const uint8_t *frame, size_t len);
  void on_ready_();
  void send_hello_connect_list_();
  void send_switch_command_(bool on);
  void send_ping_();
  void publish_connected_(bool on);

  static void encode_varint_(std::vector<uint8_t> &out, uint32_t v);
  static void encode_string_field_(std::vector<uint8_t> &out, uint8_t field, const char *s);
  static void encode_varint_field_(std::vector<uint8_t> &out, uint8_t field, uint32_t v);
  static void encode_fixed32_field_(std::vector<uint8_t> &out, uint8_t field, uint32_t v);
  static bool parse_string_field_(const uint8_t *data, size_t len, uint8_t field, std::string &out);
  static bool parse_fixed32_field_(const uint8_t *data, size_t len, uint8_t field, uint32_t &out);
  static bool parse_bool_field_(const uint8_t *data, size_t len, uint8_t field, bool &out);

  std::string host_;
  uint16_t port_{6053};
  std::string key_b64_;
  std::string switch_object_id_{"main_relay"};
  std::string test_mode_object_id_{"test_mode"};
  std::array<uint8_t, 32> psk_{};
  bool psk_ok_{false};

  std::unique_ptr<socket::Socket> sock_;
  ClientPhase phase_{ClientPhase::IDLE};
  uint32_t next_attempt_ms_{0};
  uint32_t connect_started_ms_{0};
  uint32_t last_ping_ms_{0};
  uint32_t backoff_ms_{2000};

  NoiseHandshakeState *handshake_{nullptr};
  NoiseCipherState *send_cipher_{nullptr};
  NoiseCipherState *recv_cipher_{nullptr};
  NoiseProtocolId nid_{};

  std::vector<uint8_t> rx_buf_;
  bool desired_{false};
  bool desired_dirty_{true};
  bool last_sent_{false};
  bool have_switch_key_{false};
  uint32_t switch_key_{0};
  bool test_mode_{false};
  uint32_t test_mode_key_{0};
  bool have_test_key_{false};
  bool listing_{false};
};

}  // namespace dsc_api_client
}  // namespace esphome
