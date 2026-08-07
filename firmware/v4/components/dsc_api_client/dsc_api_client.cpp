#include "dsc_api_client.h"
#include "esphome/core/application.h"
#include "esphome/core/log.h"
#include "esphome/core/helpers.h"
#include "esphome/components/socket/socket.h"

#include <cerrno>
#include <cstring>

namespace esphome {
namespace dsc_api_client {

static const char *const TAG = "dsc_api_client";

// Message types (api.proto)
static constexpr uint16_t MSG_HELLO_REQUEST = 1;
static constexpr uint16_t MSG_HELLO_RESPONSE = 2;
static constexpr uint16_t MSG_CONNECT_REQUEST = 3;
static constexpr uint16_t MSG_CONNECT_RESPONSE = 4;
static constexpr uint16_t MSG_PING_REQUEST = 7;
static constexpr uint16_t MSG_PING_RESPONSE = 8;
static constexpr uint16_t MSG_DEVICE_INFO_REQUEST = 9;
static constexpr uint16_t MSG_LIST_ENTITIES_REQUEST = 11;
static constexpr uint16_t MSG_LIST_ENTITIES_BINARY_SENSOR_RESPONSE = 12;
static constexpr uint16_t MSG_LIST_ENTITIES_SWITCH_RESPONSE = 17;
static constexpr uint16_t MSG_LIST_ENTITIES_DONE_RESPONSE = 19;
static constexpr uint16_t MSG_SUBSCRIBE_STATES_REQUEST = 20;
static constexpr uint16_t MSG_BINARY_SENSOR_STATE_RESPONSE = 21;
static constexpr uint16_t MSG_SWITCH_STATE_RESPONSE = 26;
static constexpr uint16_t MSG_SWITCH_COMMAND_REQUEST = 33;

void DscApiClient::setup() {
  this->psk_ok_ = this->decode_psk_();
  if (!this->psk_ok_) {
    ESP_LOGE(TAG, "%s: bad encryption key (need base64 32-byte PSK)", this->host_.c_str());
  }
  this->publish_connected_(false);
  this->next_attempt_ms_ = millis() + 1500;
}

void DscApiClient::dump_config() {
  ESP_LOGCONFIG(TAG, "DSC API client:");
  ESP_LOGCONFIG(TAG, "  Host: %s:%u", this->host_.c_str(), this->port_);
  ESP_LOGCONFIG(TAG, "  Switch object_id: %s", this->switch_object_id_.c_str());
}

void DscApiClient::set_desired(bool on) {
  if (this->desired_ == on && !this->desired_dirty_)
    return;
  this->desired_ = on;
  this->desired_dirty_ = true;
  if (this->phase_ == ClientPhase::READY && !this->test_mode_)
    this->send_switch_command_(on);
}

void DscApiClient::publish_connected_(bool on) {
  this->publish_state(on);
}

void DscApiClient::close_socket_() {
  this->free_noise_();
  if (this->sock_) {
    this->sock_->close();
    this->sock_.reset();
  }
  this->rx_buf_.clear();
  this->phase_ = ClientPhase::IDLE;
  this->publish_connected_(false);
}

void DscApiClient::schedule_reconnect_(uint32_t delay_ms) {
  this->close_socket_();
  this->next_attempt_ms_ = millis() + delay_ms;
  this->backoff_ms_ = std::min<uint32_t>(this->backoff_ms_ * 2, 60000u);
}

void DscApiClient::free_noise_() {
  if (this->handshake_ != nullptr) {
    noise_handshakestate_free(this->handshake_);
    this->handshake_ = nullptr;
  }
  if (this->send_cipher_ != nullptr) {
    noise_cipherstate_free(this->send_cipher_);
    this->send_cipher_ = nullptr;
  }
  if (this->recv_cipher_ != nullptr) {
    noise_cipherstate_free(this->recv_cipher_);
    this->recv_cipher_ = nullptr;
  }
}

bool DscApiClient::decode_psk_() {
  size_t n = base64_decode(this->key_b64_, this->psk_.data(), this->psk_.size());
  return n == 32;
}

bool DscApiClient::init_noise_initiator_() {
  this->free_noise_();
  memset(&this->nid_, 0, sizeof(this->nid_));
  this->nid_.pattern_id = NOISE_PATTERN_NN;
  this->nid_.cipher_id = NOISE_CIPHER_CHACHAPOLY;
  this->nid_.dh_id = NOISE_DH_CURVE25519;
  this->nid_.prefix_id = NOISE_PREFIX_STANDARD;
  this->nid_.hybrid_id = NOISE_DH_NONE;
  this->nid_.hash_id = NOISE_HASH_SHA256;
  this->nid_.modifier_ids[0] = NOISE_MODIFIER_PSK0;

  int err = noise_handshakestate_new_by_id(&this->handshake_, &this->nid_, NOISE_ROLE_INITIATOR);
  if (err != NOISE_ERROR_NONE)
    return false;
  err = noise_handshakestate_set_pre_shared_key(this->handshake_, this->psk_.data(), this->psk_.size());
  if (err != NOISE_ERROR_NONE)
    return false;
  // Prologue matches aioesphomeapi / empty client hello: NoiseAPIInit + 00 00
  static const uint8_t prologue[] = {'N', 'o', 'i', 's', 'e', 'A', 'P', 'I', 'I', 'n', 'i', 't', 0, 0};
  err = noise_handshakestate_set_prologue(this->handshake_, prologue, sizeof(prologue));
  if (err != NOISE_ERROR_NONE)
    return false;
  err = noise_handshakestate_start(this->handshake_);
  return err == NOISE_ERROR_NONE;
}

bool DscApiClient::socket_write_(const uint8_t *data, size_t len) {
  if (!this->sock_)
    return false;
  ssize_t written = this->sock_->write(data, len);
  return written == (ssize_t) len;
}

bool DscApiClient::send_frame_(const uint8_t *payload, size_t len) {
  uint8_t header[3];
  header[0] = 0x01;
  header[1] = (uint8_t) ((len >> 8) & 0xFF);
  header[2] = (uint8_t) (len & 0xFF);
  if (!this->socket_write_(header, 3))
    return false;
  if (len == 0)
    return true;
  return this->socket_write_(payload, len);
}

bool DscApiClient::send_noise_hello_() {
  // Empty client hello + first handshake write in one burst (aioesphomeapi).
  static const uint8_t hello[] = {0x01, 0x00, 0x00};
  if (!this->socket_write_(hello, sizeof(hello)))
    return false;

  if (!this->init_noise_initiator_())
    return false;

  uint8_t msg[128];
  NoiseBuffer mbuf;
  noise_buffer_init(mbuf);
  noise_buffer_set_output(mbuf, msg, sizeof(msg));
  int err = noise_handshakestate_write_message(this->handshake_, &mbuf, nullptr);
  if (err != NOISE_ERROR_NONE)
    return false;

  // Handshake frame: 0x00 preamble + noise payload
  std::vector<uint8_t> frame;
  frame.reserve(1 + mbuf.size);
  frame.push_back(0x00);
  frame.insert(frame.end(), msg, msg + mbuf.size);
  return this->send_frame_(frame.data(), frame.size());
}

bool DscApiClient::send_encrypted_(uint16_t msg_type, const uint8_t *proto, size_t proto_len) {
  if (this->send_cipher_ == nullptr)
    return false;
  // plaintext = type(2) + len(2) + payload
  std::vector<uint8_t> plain;
  plain.resize(4 + proto_len);
  plain[0] = (uint8_t) ((msg_type >> 8) & 0xFF);
  plain[1] = (uint8_t) (msg_type & 0xFF);
  plain[2] = (uint8_t) ((proto_len >> 8) & 0xFF);
  plain[3] = (uint8_t) (proto_len & 0xFF);
  if (proto_len)
    memcpy(plain.data() + 4, proto, proto_len);

  size_t mac_len = noise_cipherstate_get_mac_length(this->send_cipher_);
  std::vector<uint8_t> cipher(plain.size() + mac_len);
  NoiseBuffer buf;
  noise_buffer_init(buf);
  noise_buffer_set_inout(buf, cipher.data(), plain.size(), cipher.size());
  memcpy(cipher.data(), plain.data(), plain.size());
  int err = noise_cipherstate_encrypt(this->send_cipher_, &buf);
  if (err != NOISE_ERROR_NONE)
    return false;
  return this->send_frame_(cipher.data(), buf.size);
}

void DscApiClient::encode_varint_(std::vector<uint8_t> &out, uint32_t v) {
  while (v >= 0x80) {
    out.push_back((uint8_t) ((v & 0x7F) | 0x80));
    v >>= 7;
  }
  out.push_back((uint8_t) v);
}

void DscApiClient::encode_string_field_(std::vector<uint8_t> &out, uint8_t field, const char *s) {
  size_t n = strlen(s);
  out.push_back((uint8_t) ((field << 3) | 2));
  encode_varint_(out, (uint32_t) n);
  out.insert(out.end(), s, s + n);
}

void DscApiClient::encode_varint_field_(std::vector<uint8_t> &out, uint8_t field, uint32_t v) {
  out.push_back((uint8_t) ((field << 3) | 0));
  encode_varint_(out, v);
}

void DscApiClient::encode_fixed32_field_(std::vector<uint8_t> &out, uint8_t field, uint32_t v) {
  out.push_back((uint8_t) ((field << 3) | 5));
  out.push_back((uint8_t) (v & 0xFF));
  out.push_back((uint8_t) ((v >> 8) & 0xFF));
  out.push_back((uint8_t) ((v >> 16) & 0xFF));
  out.push_back((uint8_t) ((v >> 24) & 0xFF));
}

bool DscApiClient::parse_string_field_(const uint8_t *data, size_t len, uint8_t field, std::string &out) {
  size_t i = 0;
  while (i < len) {
    uint8_t tag = data[i++];
    uint8_t f = tag >> 3;
    uint8_t wt = tag & 7;
    if (wt == 0) {
      while (i < len && (data[i++] & 0x80)) {
      }
    } else if (wt == 2) {
      uint32_t sl = 0;
      int shift = 0;
      while (i < len) {
        uint8_t b = data[i++];
        sl |= (uint32_t) (b & 0x7F) << shift;
        if (!(b & 0x80))
          break;
        shift += 7;
      }
      if (i + sl > len)
        return false;
      if (f == field) {
        out.assign((const char *) data + i, sl);
        return true;
      }
      i += sl;
    } else if (wt == 5) {
      if (i + 4 > len)
        return false;
      i += 4;
    } else {
      return false;
    }
  }
  return false;
}

bool DscApiClient::parse_fixed32_field_(const uint8_t *data, size_t len, uint8_t field, uint32_t &out) {
  size_t i = 0;
  while (i < len) {
    uint8_t tag = data[i++];
    uint8_t f = tag >> 3;
    uint8_t wt = tag & 7;
    if (wt == 0) {
      while (i < len && (data[i++] & 0x80)) {
      }
    } else if (wt == 2) {
      uint32_t sl = 0;
      int shift = 0;
      while (i < len) {
        uint8_t b = data[i++];
        sl |= (uint32_t) (b & 0x7F) << shift;
        if (!(b & 0x80))
          break;
        shift += 7;
      }
      if (i + sl > len)
        return false;
      i += sl;
    } else if (wt == 5) {
      if (i + 4 > len)
        return false;
      if (f == field) {
        out = (uint32_t) data[i] | ((uint32_t) data[i + 1] << 8) | ((uint32_t) data[i + 2] << 16) |
              ((uint32_t) data[i + 3] << 24);
        return true;
      }
      i += 4;
    } else {
      return false;
    }
  }
  return false;
}

bool DscApiClient::parse_bool_field_(const uint8_t *data, size_t len, uint8_t field, bool &out) {
  size_t i = 0;
  while (i < len) {
    uint8_t tag = data[i++];
    uint8_t f = tag >> 3;
    uint8_t wt = tag & 7;
    if (wt == 0) {
      uint32_t v = 0;
      int shift = 0;
      while (i < len) {
        uint8_t b = data[i++];
        v |= (uint32_t) (b & 0x7F) << shift;
        if (!(b & 0x80))
          break;
        shift += 7;
      }
      if (f == field) {
        out = v != 0;
        return true;
      }
    } else if (wt == 2) {
      uint32_t sl = 0;
      int shift = 0;
      while (i < len) {
        uint8_t b = data[i++];
        sl |= (uint32_t) (b & 0x7F) << shift;
        if (!(b & 0x80))
          break;
        shift += 7;
      }
      if (i + sl > len)
        return false;
      i += sl;
    } else if (wt == 5) {
      if (i + 4 > len)
        return false;
      i += 4;
    } else {
      return false;
    }
  }
  return false;
}

void DscApiClient::send_hello_connect_list_() {
  std::vector<uint8_t> hello;
  encode_string_field_(hello, 1, "dsc-bridge");
  encode_varint_field_(hello, 2, 1);
  encode_varint_field_(hello, 3, 10);
  this->send_encrypted_(MSG_HELLO_REQUEST, hello.data(), hello.size());

  // ConnectRequest empty (Noise already authenticated)
  this->send_encrypted_(MSG_CONNECT_REQUEST, nullptr, 0);
  this->send_encrypted_(MSG_DEVICE_INFO_REQUEST, nullptr, 0);
  this->listing_ = true;
  this->have_switch_key_ = false;
  this->send_encrypted_(MSG_LIST_ENTITIES_REQUEST, nullptr, 0);
  this->send_encrypted_(MSG_SUBSCRIBE_STATES_REQUEST, nullptr, 0);
}

void DscApiClient::send_switch_command_(bool on) {
  if (!this->have_switch_key_)
    return;
  if (this->test_mode_) {
    ESP_LOGD(TAG, "%s: skip command — test mode", this->host_.c_str());
    return;
  }
  std::vector<uint8_t> body;
  encode_fixed32_field_(body, 1, this->switch_key_);
  encode_varint_field_(body, 2, on ? 1 : 0);
  if (this->send_encrypted_(MSG_SWITCH_COMMAND_REQUEST, body.data(), body.size())) {
    this->last_sent_ = on;
    this->desired_dirty_ = false;
    ESP_LOGI(TAG, "%s: switch %s", this->host_.c_str(), on ? "ON" : "OFF");
  }
}

void DscApiClient::send_ping_() {
  this->send_encrypted_(MSG_PING_REQUEST, nullptr, 0);
  this->last_ping_ms_ = millis();
}

void DscApiClient::on_ready_() {
  this->phase_ = ClientPhase::READY;
  this->backoff_ms_ = 2000;
  this->publish_connected_(true);
  this->send_hello_connect_list_();
  this->last_ping_ms_ = millis();
  ESP_LOGI(TAG, "%s: Noise ready", this->host_.c_str());
}

void DscApiClient::handle_hello_frame_(const uint8_t *frame, size_t len) {
  if (len < 1 || frame[0] != 0x01) {
    ESP_LOGW(TAG, "%s: bad server hello", this->host_.c_str());
    this->schedule_reconnect_(this->backoff_ms_);
    return;
  }
  this->phase_ = ClientPhase::HANDSHAKE;
}

void DscApiClient::handle_handshake_frame_(const uint8_t *frame, size_t len) {
  if (len < 1) {
    this->schedule_reconnect_(this->backoff_ms_);
    return;
  }
  if (frame[0] != 0) {
    ESP_LOGW(TAG, "%s: handshake reject", this->host_.c_str());
    this->schedule_reconnect_(this->backoff_ms_);
    return;
  }
  NoiseBuffer mbuf;
  noise_buffer_init(mbuf);
  noise_buffer_set_input(mbuf, const_cast<uint8_t *>(frame + 1), len - 1);
  int err = noise_handshakestate_read_message(this->handshake_, &mbuf, nullptr);
  if (err != NOISE_ERROR_NONE) {
    ESP_LOGW(TAG, "%s: handshake MAC/PSK fail (%d)", this->host_.c_str(), err);
    this->schedule_reconnect_(this->backoff_ms_);
    return;
  }
  err = noise_handshakestate_split(this->handshake_, &this->send_cipher_, &this->recv_cipher_);
  if (err != NOISE_ERROR_NONE) {
    this->schedule_reconnect_(this->backoff_ms_);
    return;
  }
  noise_handshakestate_free(this->handshake_);
  this->handshake_ = nullptr;
  this->on_ready_();
}

void DscApiClient::handle_data_frame_(const uint8_t *frame, size_t len) {
  if (this->recv_cipher_ == nullptr || len < 16)
    return;
  std::vector<uint8_t> buf(frame, frame + len);
  NoiseBuffer mbuf;
  noise_buffer_init(mbuf);
  noise_buffer_set_inout(mbuf, buf.data(), len, len);
  int err = noise_cipherstate_decrypt(this->recv_cipher_, &mbuf);
  if (err != NOISE_ERROR_NONE) {
    ESP_LOGW(TAG, "%s: decrypt fail", this->host_.c_str());
    this->schedule_reconnect_(this->backoff_ms_);
    return;
  }
  if (mbuf.size < 4)
    return;
  uint16_t msg_type = ((uint16_t) buf[0] << 8) | buf[1];
  const uint8_t *payload = buf.data() + 4;
  size_t payload_len = mbuf.size - 4;

  if (msg_type == MSG_PING_RESPONSE || msg_type == MSG_HELLO_RESPONSE || msg_type == MSG_CONNECT_RESPONSE) {
    return;
  }
  if (msg_type == MSG_LIST_ENTITIES_SWITCH_RESPONSE) {
    std::string oid;
    uint32_t key = 0;
    if (parse_string_field_(payload, payload_len, 1, oid) && parse_fixed32_field_(payload, payload_len, 2, key)) {
      if (oid == this->switch_object_id_) {
        this->switch_key_ = key;
        this->have_switch_key_ = true;
        ESP_LOGI(TAG, "%s: resolved %s key=0x%08X", this->host_.c_str(), oid.c_str(), key);
      }
    }
    return;
  }
  if (msg_type == MSG_LIST_ENTITIES_BINARY_SENSOR_RESPONSE) {
    std::string oid;
    uint32_t key = 0;
    if (parse_string_field_(payload, payload_len, 1, oid) && parse_fixed32_field_(payload, payload_len, 2, key)) {
      if (oid == this->test_mode_object_id_) {
        this->test_mode_key_ = key;
        this->have_test_key_ = true;
      }
    }
    return;
  }
  if (msg_type == MSG_LIST_ENTITIES_DONE_RESPONSE) {
    this->listing_ = false;
    if (this->desired_dirty_ || this->desired_ != this->last_sent_)
      this->send_switch_command_(this->desired_);
    return;
  }
  if (msg_type == MSG_BINARY_SENSOR_STATE_RESPONSE && this->have_test_key_) {
    uint32_t key = 0;
    bool state = false;
    if (parse_fixed32_field_(payload, payload_len, 1, key) && key == this->test_mode_key_) {
      parse_bool_field_(payload, payload_len, 2, state);
      this->test_mode_ = state;
    }
    return;
  }
  if (msg_type == MSG_SWITCH_STATE_RESPONSE && this->have_switch_key_) {
    uint32_t key = 0;
    bool state = false;
    if (parse_fixed32_field_(payload, payload_len, 1, key) && key == this->switch_key_) {
      parse_bool_field_(payload, payload_len, 2, state);
      this->last_sent_ = state;
    }
  }
}

void DscApiClient::handle_rx_frame_(const uint8_t *frame, size_t len) {
  if (this->phase_ == ClientPhase::HELLO)
    this->handle_hello_frame_(frame, len);
  else if (this->phase_ == ClientPhase::HANDSHAKE)
    this->handle_handshake_frame_(frame, len);
  else if (this->phase_ == ClientPhase::READY)
    this->handle_data_frame_(frame, len);
}

bool DscApiClient::read_available_() {
  if (!this->sock_)
    return false;
  uint8_t tmp[256];
  while (true) {
    ssize_t n = this->sock_->read(tmp, sizeof(tmp));
    if (n > 0) {
      this->rx_buf_.insert(this->rx_buf_.end(), tmp, tmp + n);
      continue;
    }
    if (n == 0) {
      ESP_LOGW(TAG, "%s: peer closed", this->host_.c_str());
      this->schedule_reconnect_(this->backoff_ms_);
      return false;
    }
    // would block / no data
    break;
  }

  while (this->rx_buf_.size() >= 3) {
    if (this->rx_buf_[0] != 0x01) {
      ESP_LOGW(TAG, "%s: bad indicator 0x%02X", this->host_.c_str(), this->rx_buf_[0]);
      this->schedule_reconnect_(this->backoff_ms_);
      return false;
    }
    size_t flen = ((size_t) this->rx_buf_[1] << 8) | this->rx_buf_[2];
    if (this->rx_buf_.size() < 3 + flen)
      break;
    this->handle_rx_frame_(this->rx_buf_.data() + 3, flen);
    this->rx_buf_.erase(this->rx_buf_.begin(), this->rx_buf_.begin() + 3 + flen);
  }
  return true;
}

void DscApiClient::loop() {
  if (!this->psk_ok_)
    return;

  uint32_t now = millis();

  if (this->phase_ == ClientPhase::IDLE || this->phase_ == ClientPhase::FAILED) {
    if (now < this->next_attempt_ms_)
      return;
    if (this->host_.empty() || this->host_ == "0.0.0.0")
      return;

    this->sock_ = socket::socket_ip(SOCK_STREAM, 0);
    if (!this->sock_) {
      this->schedule_reconnect_(this->backoff_ms_);
      return;
    }
    this->sock_->setblocking(false);
    struct sockaddr_storage saddr{};
    socklen_t sl =
        socket::set_sockaddr(reinterpret_cast<struct sockaddr *>(&saddr), sizeof(saddr), this->host_, this->port_);
    if (sl == 0) {
      ESP_LOGW(TAG, "%s: bad host address", this->host_.c_str());
      this->schedule_reconnect_(this->backoff_ms_);
      return;
    }
    int err = this->sock_->connect(reinterpret_cast<struct sockaddr *>(&saddr), sl);
    if (err != 0 && errno != EINPROGRESS && errno != EWOULDBLOCK && errno != EAGAIN) {
      ESP_LOGW(TAG, "%s: connect failed (%d)", this->host_.c_str(), errno);
      this->schedule_reconnect_(this->backoff_ms_);
      return;
    }
    this->phase_ = ClientPhase::CONNECTING;
    this->connect_started_ms_ = now;
    this->rx_buf_.clear();
    return;
  }

  if (this->phase_ == ClientPhase::CONNECTING) {
    struct sockaddr_storage peer{};
    socklen_t plen = sizeof(peer);
    if (this->sock_->getpeername(reinterpret_cast<struct sockaddr *>(&peer), &plen) != 0) {
      if (now - this->connect_started_ms_ > 8000) {
        ESP_LOGW(TAG, "%s: connect timeout", this->host_.c_str());
        this->schedule_reconnect_(this->backoff_ms_);
      }
      return;
    }
    if (this->send_noise_hello_()) {
      this->phase_ = ClientPhase::HELLO;
      this->next_attempt_ms_ = now + 8000;
    } else {
      this->schedule_reconnect_(this->backoff_ms_);
    }
    return;
  }

  if (!this->read_available_())
    return;

  if (this->phase_ == ClientPhase::HELLO || this->phase_ == ClientPhase::HANDSHAKE) {
    if (now > this->next_attempt_ms_) {
      ESP_LOGW(TAG, "%s: handshake timeout", this->host_.c_str());
      this->schedule_reconnect_(this->backoff_ms_);
    }
    return;
  }

  if (this->phase_ == ClientPhase::READY) {
    if (now - this->last_ping_ms_ > 20000)
      this->send_ping_();
    if (this->desired_dirty_ && this->have_switch_key_ && !this->test_mode_)
      this->send_switch_command_(this->desired_);
  }
}

}  // namespace dsc_api_client
}  // namespace esphome
