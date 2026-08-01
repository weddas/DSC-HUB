#include "dsc_fleet_setup.h"
#include "setup_page.h"

#include "esphome/core/application.h"
#include "esphome/core/log.h"
#include "esphome/components/json/json_util.h"
#include "esphome/components/wifi/wifi_component.h"

#include <algorithm>
#include <cstdio>
#include <cstring>

#ifdef USE_ESP32
#include <esp_wifi.h>
#include <nvs_flash.h>
#include <nvs.h>
#if defined(USE_ESP_IDF)
#include <esp_http_client.h>
#else
#include <HTTPClient.h>
#endif
#endif

#ifdef USE_ESPNOW
#include "esphome/components/espnow/espnow_component.h"
#endif

namespace esphome {
namespace dsc_fleet_setup {

static const char *const TAG = "dsc_fleet";
static const char *const NVS_NS = "dsc_fleet";

void DscFleetSetup::set_role(const std::string &role) {
  if (role == "control")
    this->role_ = FleetRole::CONTROL;
  else if (role == "pot")
    this->role_ = FleetRole::POT;
  else
    this->role_ = FleetRole::HUB;
}

void DscFleetSetup::set_lab_hub_mac(uint8_t a, uint8_t b, uint8_t c, uint8_t d, uint8_t e, uint8_t f) {
  uint8_t m[6] = {a, b, c, d, e, f};
  memcpy(this->lab_hub_mac_, m, 6);
  this->lab_hub_mac_set_ = true;
}

void DscFleetSetup::set_lab_panel_mac(uint8_t a, uint8_t b, uint8_t c, uint8_t d, uint8_t e, uint8_t f) {
  uint8_t m[6] = {a, b, c, d, e, f};
  memcpy(this->lab_panel_mac_, m, 6);
  this->lab_panel_mac_set_ = true;
}

void DscFleetSetup::mac_to_str_(const uint8_t *mac, char *out18) {
  snprintf(out18, 18, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
}

bool DscFleetSetup::parse_mac_(const char *s, uint8_t *out6) {
  unsigned int m[6];
  if (sscanf(s, "%02x:%02x:%02x:%02x:%02x:%02x", &m[0], &m[1], &m[2], &m[3], &m[4], &m[5]) != 6 &&
      sscanf(s, "%02X:%02X:%02X:%02X:%02X:%02X", &m[0], &m[1], &m[2], &m[3], &m[4], &m[5]) != 6)
    return false;
  for (int i = 0; i < 6; i++)
    out6[i] = (uint8_t) m[i];
  return true;
}

std::string DscFleetSetup::hub_mac_str() const {
  char b[18];
  if (!this->hub_mac_valid_)
    return "";
  mac_to_str_(this->hub_mac_, b);
  return std::string(b);
}

std::string DscFleetSetup::panel_mac_str() const {
  char b[18];
  if (!this->panel_mac_valid_)
    return "";
  mac_to_str_(this->panel_mac_, b);
  return std::string(b);
}

std::string DscFleetSetup::make_setup_ssid_() const {
  uint8_t mac[6];
  get_mac_address_raw(mac);
  char buf[32];
  snprintf(buf, sizeof(buf), "%s-%02X%02X", this->setup_ap_prefix_.c_str(), mac[4], mac[5]);
  return std::string(buf);
}

bool DscFleetSetup::load_nvs_() {
  nvs_handle_t h;
  if (nvs_open(NVS_NS, NVS_READONLY, &h) != ESP_OK)
    return false;
  uint8_t mode = 0;
  if (nvs_get_u8(h, "net_mode", &mode) == ESP_OK)
    this->net_mode_ = static_cast<NetMode>(mode);
  size_t len = sizeof(this->sta_ssid_);
  nvs_get_str(h, "sta_ssid", this->sta_ssid_, &len);
  len = sizeof(this->sta_pass_);
  nvs_get_str(h, "sta_pass", this->sta_pass_, &len);
  size_t mlen = 6;
  if (nvs_get_blob(h, "hub_mac", this->hub_mac_, &mlen) == ESP_OK && mlen == 6)
    this->hub_mac_valid_ = true;
  mlen = 6;
  if (nvs_get_blob(h, "panel_mac", this->panel_mac_, &mlen) == ESP_OK && mlen == 6)
    this->panel_mac_valid_ = true;
  for (size_t i = 0; i < this->peers_.size(); i++) {
    char key[12];
    snprintf(key, sizeof(key), "peer%u", (unsigned) i);
    PeerSlot slot{};
    size_t blen = sizeof(slot);
    if (nvs_get_blob(h, key, &slot, &blen) == ESP_OK && blen == sizeof(slot) && slot.present)
      this->peers_[i] = slot;
  }
  nvs_close(h);
  return this->net_mode_ != NetMode::UNCONFIGURED;
}

bool DscFleetSetup::save_nvs_() {
  nvs_handle_t h;
  if (nvs_open(NVS_NS, NVS_READWRITE, &h) != ESP_OK)
    return false;
  nvs_set_u8(h, "net_mode", static_cast<uint8_t>(this->net_mode_));
  nvs_set_str(h, "sta_ssid", this->sta_ssid_);
  nvs_set_str(h, "sta_pass", this->sta_pass_);
  if (this->hub_mac_valid_)
    nvs_set_blob(h, "hub_mac", this->hub_mac_, 6);
  if (this->panel_mac_valid_)
    nvs_set_blob(h, "panel_mac", this->panel_mac_, 6);
  for (size_t i = 0; i < this->peers_.size(); i++) {
    char key[12];
    snprintf(key, sizeof(key), "peer%u", (unsigned) i);
    if (this->peers_[i].present)
      nvs_set_blob(h, key, &this->peers_[i], sizeof(PeerSlot));
    else
      nvs_erase_key(h, key);
  }
  esp_err_t err = nvs_commit(h);
  nvs_close(h);
  return err == ESP_OK;
}

void DscFleetSetup::apply_wifi_credentials_(const std::string &ssid, const std::string &password) {
  if (wifi::global_wifi_component == nullptr)
    return;
  wifi::global_wifi_component->save_wifi_sta(ssid.c_str(), password.c_str());
}

void DscFleetSetup::apply_espnow_peers() {
#ifdef USE_ESPNOW
  auto *esp = espnow::global_esp_now;
  if (esp == nullptr)
    return;
  auto add = [&](const uint8_t *mac, bool valid) {
    if (!valid)
      return;
    esp->add_peer(mac);
  };
  if (this->role_ == FleetRole::HUB) {
    add(this->panel_mac_, this->panel_mac_valid_);
    for (auto &p : this->peers_) {
      if (p.present)
        add(p.mac, true);
    }
  } else {
    add(this->hub_mac_, this->hub_mac_valid_);
  }
#endif
}

PeerSlot *DscFleetSetup::find_or_alloc_peer_(const char *role, const char *name) {
  for (auto &p : this->peers_) {
    if (p.present && strncmp(p.role, role, sizeof(p.role)) == 0 && strncmp(p.name, name, sizeof(p.name)) == 0)
      return &p;
  }
  for (auto &p : this->peers_) {
    if (!p.present)
      return &p;
  }
  return &this->peers_[0];
}

void DscFleetSetup::factory_reset_fleet() {
  this->net_mode_ = NetMode::UNCONFIGURED;
  memset(this->sta_ssid_, 0, sizeof(this->sta_ssid_));
  memset(this->sta_pass_, 0, sizeof(this->sta_pass_));
  this->hub_mac_valid_ = false;
  this->panel_mac_valid_ = false;
  for (auto &p : this->peers_)
    p = PeerSlot{};
  nvs_handle_t h;
  if (nvs_open(NVS_NS, NVS_READWRITE, &h) == ESP_OK) {
    nvs_erase_all(h);
    nvs_commit(h);
    nvs_close(h);
  }
  this->add_device_window_ = true;
  this->start_hub_portal_();
  ESP_LOGW(TAG, "Fleet config factory-reset");
}

void DscFleetSetup::open_add_device_window() {
  this->add_device_window_ = true;
  this->start_hub_portal_();
  ESP_LOGI(TAG, "Add-device window open");
}

void DscFleetSetup::start_hub_portal_() {
  if (this->role_ != FleetRole::HUB || !this->enabled_)
    return;
  if (this->base_ == nullptr)
    return;
#ifdef USE_ESP32
  // Rename SoftAP to DSC-Setup-XXXX so the printed card matches scan results.
  {
    wifi_config_t conf{};
    if (esp_wifi_get_config(WIFI_IF_AP, &conf) == ESP_OK) {
      std::string ssid = this->make_setup_ssid_();
      memset(conf.ap.ssid, 0, sizeof(conf.ap.ssid));
      memcpy(conf.ap.ssid, ssid.c_str(), std::min(ssid.size(), sizeof(conf.ap.ssid) - 1));
      conf.ap.ssid_len = ssid.size();
      if (!this->setup_ap_password_.empty()) {
        strncpy((char *) conf.ap.password, this->setup_ap_password_.c_str(), sizeof(conf.ap.password) - 1);
        conf.ap.authmode = WIFI_AUTH_WPA2_PSK;
      }
      esp_wifi_set_config(WIFI_IF_AP, &conf);
    }
  }
#endif
  this->base_->init();
  if (!this->handler_registered_) {
    this->base_->add_handler_without_auth(this);
    this->handler_registered_ = true;
  }
  this->portal_active_ = true;
  ESP_LOGI(TAG, "Setup portal listening on SoftAP (%s)", this->make_setup_ssid_().c_str());
}

bool DscFleetSetup::canHandle(AsyncWebServerRequest *request) const {
  (void) request;
  return this->portal_active_ || this->add_device_window_;
}

void DscFleetSetup::handleBody(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
  if (index == 0)
    this->pending_body_.clear();
  this->pending_body_.append(reinterpret_cast<const char *>(data), len);
  if (index + len >= total) {
    this->handle_hub_api_(request, this->pending_body_);
    this->pending_body_.clear();
    this->post_handled_ = true;
  }
}

void DscFleetSetup::handleRequest(AsyncWebServerRequest *request) {
  if (this->post_handled_) {
    this->post_handled_ = false;
    return;  // POST already answered in handleBody
  }
#ifdef USE_ESP32
  char url_buf[AsyncWebServerRequest::URL_BUF_SIZE];
  StringRef url = request->url_to(url_buf);
  std::string path(url.c_str());
#else
  std::string path(request->url().c_str());
#endif

  // GET routes only here
  if (path == "/" || path == "/index.html" || path == "/generate_204" || path == "/hotspot-detect.html" ||
      path == "/connectivitycheck.html" || path == "/ncsi.txt" || path == "/fwlink" || path == "/canonical.html") {
    request->send(200, "text/html", SETUP_PAGE_HTML);
    return;
  }
  if (path == "/setup/status") {
    request->send(200, "application/json", this->setup_status_json().c_str());
    return;
  }
  if (path == "/setup/config") {
    char hub_mac[18] = "";
    if (this->hub_mac_valid_)
      mac_to_str_(this->hub_mac_, hub_mac);
    else {
      uint8_t mac[6];
      get_mac_address_raw(mac);
      mac_to_str_(mac, hub_mac);
    }
    std::string ssid = this->sta_ssid_;
    std::string pass = this->sta_pass_;
    const char *mode = "unconfigured";
    if (this->net_mode_ == NetMode::HOME_WIFI)
      mode = "home";
    else if (this->net_mode_ == NetMode::LOCAL_AP) {
      mode = "local";
      ssid = this->make_setup_ssid_();
      pass = this->setup_ap_password_;
      if (this->sta_ssid_[0] != '\0')
        ssid = this->sta_ssid_;
      if (this->sta_pass_[0] != '\0')
        pass = this->sta_pass_;
    }
    json::JsonBuilder jb;
    JsonObject root = jb.root();
    root["mode"] = mode;
    root["ssid"] = ssid;
    root["password"] = pass;
    root["hub_mac"] = hub_mac;
    root["espnow_key"] = this->espnow_key_;
    root["espnow_cmd_tag"] = this->espnow_cmd_tag_;
    root["setup_ssid"] = this->make_setup_ssid_();
    auto buf = jb.serialize();
    request->send(200, "application/json", buf.c_str());
    return;
  }
  if (path.rfind("/setup/", 0) == 0) {
    request->send(404, "text/plain", "not found");
    return;
  }
  request->send(200, "text/html", SETUP_PAGE_HTML);
}

std::string DscFleetSetup::setup_status_json() const {
  json::JsonBuilder jb;
  JsonObject root = jb.root();
  const char *mode = "unconfigured";
  if (this->net_mode_ == NetMode::HOME_WIFI)
    mode = "home";
  else if (this->net_mode_ == NetMode::LOCAL_AP)
    mode = "local";
  root["net_mode"] = mode;
  root["setup_ssid"] = this->make_setup_ssid_();
  root["hub_ssid"] = this->sta_ssid_[0] ? this->sta_ssid_ : this->make_setup_ssid_();
  char hub_mac[18];
  uint8_t mac[6];
  get_mac_address_raw(mac);
  mac_to_str_(mac, hub_mac);
  root["hub_mac"] = hub_mac;
  root["channel_note"] =
      "ESP-NOW needs every device on the same 2.4 GHz channel. Prefer a fixed-channel AP.";
  root["add_device_window"] = this->add_device_window_ || this->net_mode_ == NetMode::UNCONFIGURED;
  JsonArray peers = root["peers"].to<JsonArray>();
  for (const auto &p : this->peers_) {
    if (!p.present)
      continue;
    JsonObject o = peers.add<JsonObject>();
    o["role"] = p.role;
    o["name"] = p.name;
    char m[18];
    mac_to_str_(p.mac, m);
    o["mac"] = m;
  }
  JsonArray aps = root["aps"].to<JsonArray>();
  if (wifi::global_wifi_component != nullptr) {
    wifi::ScanResultsLock lock(wifi::global_wifi_component);
    for (const auto &scan : wifi::global_wifi_component->get_scan_result()) {
      if (scan.get_is_hidden())
        continue;
      JsonObject o = aps.add<JsonObject>();
      o["ssid"] = scan.get_ssid();
      o["rssi"] = scan.get_rssi();
    }
  }
  auto buf = jb.serialize();
  return std::string(buf.c_str());
}

void DscFleetSetup::handle_hub_api_(AsyncWebServerRequest *request, const std::string &body) {
#ifdef USE_ESP32
  char url_buf[AsyncWebServerRequest::URL_BUF_SIZE];
  StringRef url = request->url_to(url_buf);
  std::string path(url.c_str());
#else
  std::string path(request->url().c_str());
#endif

  auto send_err = [&](const char *msg) {
    char buf[128];
    snprintf(buf, sizeof(buf), "{\"error\":\"%s\"}", msg);
    request->send(400, "application/json", buf);
  };

  if (path == "/setup/hello") {
    // {"role":"control|pot","name":"...","mac":"AA:BB:..."}
    std::string role, name, mac_s;
    bool ok = json::parse_json(body, [&](JsonObject root) -> bool {
      if (!root["role"].is<const char *>() || !root["mac"].is<const char *>())
        return false;
      role = root["role"].as<std::string>();
      name = root["name"].is<const char *>() ? root["name"].as<std::string>() : role;
      mac_s = root["mac"].as<std::string>();
      return true;
    });
    if (!ok) {
      send_err("bad hello");
      return;
    }
    uint8_t mac[6];
    if (!parse_mac_(mac_s.c_str(), mac)) {
      send_err("bad mac");
      return;
    }
    PeerSlot *slot = this->find_or_alloc_peer_(role.c_str(), name.c_str());
    slot->present = true;
    strncpy(slot->role, role.c_str(), sizeof(slot->role) - 1);
    strncpy(slot->name, name.c_str(), sizeof(slot->name) - 1);
    memcpy(slot->mac, mac, 6);
    slot->last_seen_ms = millis();
    if (role == "control") {
      memcpy(this->panel_mac_, mac, 6);
      this->panel_mac_valid_ = true;
    }
    this->save_nvs_();
    this->defer([this]() { this->apply_espnow_peers(); });
    request->send(200, "application/json", "{\"ok\":true}");
    ESP_LOGI(TAG, "Hello from %s %s %s", role.c_str(), name.c_str(), mac_s.c_str());
    return;
  }

  if (path == "/setup/mode") {
    std::string mode, ssid, password, time_local;
    bool ok = json::parse_json(body, [&](JsonObject root) -> bool {
      if (!root["mode"].is<const char *>())
        return false;
      mode = root["mode"].as<std::string>();
      if (root["ssid"].is<const char *>())
        ssid = root["ssid"].as<std::string>();
      if (root["password"].is<const char *>())
        password = root["password"].as<std::string>();
      if (root["time_local"].is<const char *>())
        time_local = root["time_local"].as<std::string>();
      return true;
    });
    if (!ok) {
      send_err("bad mode body");
      return;
    }
    uint8_t mac[6];
    get_mac_address_raw(mac);
    memcpy(this->hub_mac_, mac, 6);
    this->hub_mac_valid_ = true;

    if (mode == "home") {
      if (ssid.empty()) {
        send_err("ssid required");
        return;
      }
      this->net_mode_ = NetMode::HOME_WIFI;
      strncpy(this->sta_ssid_, ssid.c_str(), sizeof(this->sta_ssid_) - 1);
      strncpy(this->sta_pass_, password.c_str(), sizeof(this->sta_pass_) - 1);
      this->save_nvs_();
      this->defer([this, ssid, password]() { this->apply_wifi_credentials_(ssid, password); });
      this->add_device_window_ = true;
      request->send(200, "application/json", "{\"ok\":true,\"mode\":\"home\"}");
      ESP_LOGI(TAG, "Home WiFi mode -> %s", ssid.c_str());
      return;
    }
    if (mode == "local") {
      this->net_mode_ = NetMode::LOCAL_AP;
      std::string local_ssid = this->make_setup_ssid_();
      strncpy(this->sta_ssid_, local_ssid.c_str(), sizeof(this->sta_ssid_) - 1);
      strncpy(this->sta_pass_, this->setup_ap_password_.c_str(), sizeof(this->sta_pass_) - 1);
      this->save_nvs_();
      this->add_device_window_ = true;
      // Optional rough clock from browser
      if (!time_local.empty()) {
        ESP_LOGI(TAG, "Client suggested local time: %s", time_local.c_str());
      }
      request->send(200, "application/json", "{\"ok\":true,\"mode\":\"local\"}");
      ESP_LOGI(TAG, "Local-only SoftAP fleet mode (%s)", local_ssid.c_str());
      return;
    }
    send_err("unknown mode");
    return;
  }

  if (path == "/setup/complete") {
    this->add_device_window_ = false;
    if (this->net_mode_ == NetMode::UNCONFIGURED) {
      send_err("configure mode first");
      return;
    }
    this->save_nvs_();
    request->send(200, "application/json", "{\"ok\":true}");
    ESP_LOGI(TAG, "Setup marked complete");
    return;
  }

  if (path == "/setup/add-device") {
    this->open_add_device_window();
    request->send(200, "application/json", "{\"ok\":true}");
    return;
  }

  if (path == "/setup/reset") {
    this->factory_reset_fleet();
    request->send(200, "application/json", "{\"ok\":true}");
    return;
  }

  send_err("unknown");
}

// ---- Satellite HTTP helpers (ESP-IDF esp_http_client; Arduino HTTPClient fallback) ----
static bool http_get_string_(const char *url, std::string &out) {
#ifdef USE_ESP32
#if defined(USE_ESP_IDF)
  esp_http_client_config_t cfg = {};
  cfg.url = url;
  cfg.timeout_ms = 8000;
  esp_http_client_handle_t client = esp_http_client_init(&cfg);
  if (client == nullptr)
    return false;
  if (esp_http_client_open(client, 0) != ESP_OK) {
    esp_http_client_cleanup(client);
    return false;
  }
  int content_length = esp_http_client_fetch_headers(client);
  out.clear();
  char buf[256];
  int read_len;
  while ((read_len = esp_http_client_read(client, buf, sizeof(buf))) > 0)
    out.append(buf, read_len);
  esp_http_client_close(client);
  esp_http_client_cleanup(client);
  return content_length >= 0 || !out.empty();
#else
  HTTPClient http;
  if (!http.begin(url))
    return false;
  int code = http.GET();
  if (code != 200) {
    http.end();
    return false;
  }
  out = http.getString().c_str();
  http.end();
  return true;
#endif
#else
  return false;
#endif
}

static bool http_post_json_(const char *url, const std::string &json_body) {
#ifdef USE_ESP32
#if defined(USE_ESP_IDF)
  esp_http_client_config_t cfg = {};
  cfg.url = url;
  cfg.timeout_ms = 8000;
  cfg.method = HTTP_METHOD_POST;
  esp_http_client_handle_t client = esp_http_client_init(&cfg);
  if (client == nullptr)
    return false;
  esp_http_client_set_header(client, "Content-Type", "application/json");
  esp_err_t err = esp_http_client_open(client, json_body.size());
  if (err != ESP_OK) {
    esp_http_client_cleanup(client);
    return false;
  }
  esp_http_client_write(client, json_body.c_str(), json_body.size());
  esp_http_client_fetch_headers(client);
  int status = esp_http_client_get_status_code(client);
  esp_http_client_close(client);
  esp_http_client_cleanup(client);
  return status >= 200 && status < 300;
#else
  HTTPClient http;
  if (!http.begin(url))
    return false;
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(json_body.c_str());
  http.end();
  return code >= 200 && code < 300;
#endif
#else
  return false;
#endif
}

bool DscFleetSetup::satellite_join_setup_ap_() {
  if (wifi::global_wifi_component == nullptr)
    return false;
  // Scan for DSC-Setup-* 
  wifi::global_wifi_component->start_scanning();
  delay(50);
  std::string match;
  {
    wifi::ScanResultsLock lock(wifi::global_wifi_component);
    for (const auto &scan : wifi::global_wifi_component->get_scan_result()) {
      std::string ssid = scan.get_ssid();
      if (ssid.rfind(this->setup_ap_prefix_, 0) == 0) {
        match = ssid;
        break;
      }
    }
  }
  if (match.empty()) {
    ESP_LOGW(TAG, "No %s-* SoftAP visible yet", this->setup_ap_prefix_.c_str());
    return false;
  }
  ESP_LOGI(TAG, "Joining setup AP %s", match.c_str());
  this->apply_wifi_credentials_(match, this->setup_ap_password_);
  return true;
}

bool DscFleetSetup::satellite_pull_config_() {
  std::string body;
  if (!http_get_string_("http://192.168.4.1/setup/config", body)) {
    ESP_LOGW(TAG, "GET /setup/config failed");
    return false;
  }
  std::string mode, ssid, password, hub_mac;
  bool ok = json::parse_json(body, [&](JsonObject root) -> bool {
    if (root["mode"].is<const char *>())
      mode = root["mode"].as<std::string>();
    if (root["ssid"].is<const char *>())
      ssid = root["ssid"].as<std::string>();
    if (root["password"].is<const char *>())
      password = root["password"].as<std::string>();
    if (root["hub_mac"].is<const char *>())
      hub_mac = root["hub_mac"].as<std::string>();
    return !ssid.empty() && !hub_mac.empty() && mode != "unconfigured";
  });
  if (!ok) {
    ESP_LOGW(TAG, "Hub not ready yet (mode/ssid). body=%s", body.c_str());
    return false;
  }
  uint8_t mac[6];
  if (!parse_mac_(hub_mac.c_str(), mac))
    return false;
  memcpy(this->hub_mac_, mac, 6);
  this->hub_mac_valid_ = true;
  if (mode == "home")
    this->net_mode_ = NetMode::HOME_WIFI;
  else
    this->net_mode_ = NetMode::LOCAL_AP;
  strncpy(this->sta_ssid_, ssid.c_str(), sizeof(this->sta_ssid_) - 1);
  strncpy(this->sta_pass_, password.c_str(), sizeof(this->sta_pass_) - 1);
  this->save_nvs_();
  ESP_LOGI(TAG, "Pulled config mode=%s ssid=%s hub=%s", mode.c_str(), ssid.c_str(), hub_mac.c_str());
  return true;
}

bool DscFleetSetup::satellite_post_hello_() {
  char mac_s[18];
  uint8_t mac[6];
  get_mac_address_raw(mac);
  mac_to_str_(mac, mac_s);
  const char *role = this->role_ == FleetRole::CONTROL ? "control" : "pot";
  char name[24];
  if (!this->device_name_.empty())
    strncpy(name, this->device_name_.c_str(), sizeof(name) - 1);
  else if (this->role_ == FleetRole::POT)
    snprintf(name, sizeof(name), "pot%u", (unsigned) this->pot_index_);
  else
    strncpy(name, "control", sizeof(name) - 1);
  char json[160];
  snprintf(json, sizeof(json), "{\"role\":\"%s\",\"name\":\"%s\",\"mac\":\"%s\"}", role, name, mac_s);
  if (!http_post_json_("http://192.168.4.1/setup/hello", json)) {
    ESP_LOGW(TAG, "POST /setup/hello failed");
    return false;
  }
  return true;
}

void DscFleetSetup::satellite_tick_() {
  if (!this->needs_provision())
    return;
  uint32_t now = millis();
  if (now < this->sat_next_ms_)
    return;
  this->sat_next_ms_ = now + 5000;

  switch (this->sat_state_) {
    case 0:  // join setup AP
      if (this->satellite_join_setup_ap_())
        this->sat_state_ = 1;
      break;
    case 1:  // wait associated then hello+config
      if (wifi::global_wifi_component != nullptr && wifi::global_wifi_component->is_connected()) {
        if (this->satellite_post_hello_() && this->satellite_pull_config_()) {
          this->sat_state_ = 2;
          this->apply_wifi_credentials_(this->sta_ssid_, this->sta_pass_);
          this->apply_espnow_peers();
          ESP_LOGI(TAG, "Provisioned — rebooting onto target network");
          this->defer([]() { App.safe_reboot(); });
        }
      }
      break;
    default:
      break;
  }
}

void DscFleetSetup::setup() {
  if (!this->enabled_) {
    ESP_LOGI(TAG, "Fleet setup disabled (lab build)");
    // Still seed lab MACs for helpers
    if (this->lab_hub_mac_set_) {
      memcpy(this->hub_mac_, this->lab_hub_mac_, 6);
      this->hub_mac_valid_ = true;
    }
    if (this->lab_panel_mac_set_) {
      memcpy(this->panel_mac_, this->lab_panel_mac_, 6);
      this->panel_mac_valid_ = true;
    }
    return;
  }

  this->load_nvs_();

  if (!this->hub_mac_valid_ && this->lab_hub_mac_set_) {
    memcpy(this->hub_mac_, this->lab_hub_mac_, 6);
    this->hub_mac_valid_ = true;
  }
  if (!this->panel_mac_valid_ && this->lab_panel_mac_set_) {
    memcpy(this->panel_mac_, this->lab_panel_mac_, 6);
    this->panel_mac_valid_ = true;
  }

  if (this->role_ == FleetRole::HUB) {
    // Own MAC is hub MAC
    uint8_t mac[6];
    get_mac_address_raw(mac);
    memcpy(this->hub_mac_, mac, 6);
    this->hub_mac_valid_ = true;
    if (this->net_mode_ == NetMode::UNCONFIGURED || this->add_device_window_)
      this->start_hub_portal_();
    else if (this->net_mode_ == NetMode::HOME_WIFI && this->sta_ssid_[0])
      this->apply_wifi_credentials_(this->sta_ssid_, this->sta_pass_);
    this->apply_espnow_peers();
  } else {
    if (this->is_configured()) {
      this->apply_wifi_credentials_(this->sta_ssid_, this->sta_pass_);
      this->apply_espnow_peers();
    } else {
      this->sat_state_ = 0;
      this->sat_next_ms_ = millis() + 3000;
      ESP_LOGI(TAG, "Satellite unconfigured — will seek %s-*", this->setup_ap_prefix_.c_str());
    }
  }
}

void DscFleetSetup::loop() {
  if (!this->enabled_)
    return;
  if (this->role_ != FleetRole::HUB)
    this->satellite_tick_();
}

void DscFleetSetup::dump_config() {
  ESP_LOGCONFIG(TAG, "DSC fleet setup:");
  ESP_LOGCONFIG(TAG, "  Enabled: %s", YESNO(this->enabled_));
  ESP_LOGCONFIG(TAG, "  Role: %s",
                this->role_ == FleetRole::HUB ? "hub" : (this->role_ == FleetRole::CONTROL ? "control" : "pot"));
  ESP_LOGCONFIG(TAG, "  Net mode: %u", (unsigned) this->net_mode_);
  ESP_LOGCONFIG(TAG, "  Setup AP prefix: %s", this->setup_ap_prefix_.c_str());
}

}  // namespace dsc_fleet_setup
}  // namespace esphome
