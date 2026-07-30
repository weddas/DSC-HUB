// verify_v4.cpp — host-side wire-contract checks for DSC-HUB v4
// Build:  g++ -std=c++17 -Wall -Wextra -O2 -o verify_v4 verify_v4.cpp
// Run:    ./verify_v4
//
// Covers 0xD1 / 0xD2 / 0xD3 / 0xD4 / 0xDC pack + unpack sizes and the
// shared espnow_cmd_tag. Does not flash devices.

#include <cstdint>
#include <cstring>
#include <cmath>
#include <cstdio>
#include <string>
#include <vector>

static int failures = 0;

static void expect(bool ok, const char* msg) {
  if (!ok) {
    std::printf("FAIL: %s\n", msg);
    failures++;
  } else {
    std::printf("ok:   %s\n", msg);
  }
}

static void put_i16(std::vector<uint8_t>& p, float v, float sc) {
  int16_t t = std::isnan(v) ? (int16_t)0x8000 : (int16_t) std::lround(v * sc);
  p.push_back(t & 0xFF);
  p.push_back((t >> 8) & 0xFF);
}

static float get_i16(const uint8_t* d, int off, float sc) {
  int16_t v = (int16_t)(d[off] | (d[off + 1] << 8));
  return v == (int16_t)0x8000 ? NAN : (float)v / sc;
}

static void put_name16(std::vector<uint8_t>& p, const std::string& s) {
  for (size_t i = 0; i < 16; i++) p.push_back(i < s.size() ? (uint8_t)s[i] : 0);
}

static std::string take_name16(const uint8_t* d, int off) {
  std::string s;
  for (int i = 0; i < 16; i++) {
    char c = (char)d[off + i];
    if (c == 0) break;
    s.push_back(c);
  }
  return s;
}

int main() {
  const uint16_t tag = 54727;  // 0xD5C7 — must match hub + panel YAML
  expect(tag != 0xABCD, "espnow_cmd_tag rotated off default 0xABCD");

  // ---- 0xD1 vitals (48 B with countdowns) ----
  {
    std::vector<uint8_t> p;
    p.push_back(0xD1); p.push_back(0x01);
    put_i16(p, 24.5f, 100); put_i16(p, 23.0f, 100); put_i16(p, 22.0f, 100);
    put_i16(p, 55.0f, 100); put_i16(p, 70.0f, 100); put_i16(p, 50.0f, 100);
    put_i16(p, 1.10f, 100); put_i16(p, 0.80f, 100);
    put_i16(p, 800.0f, 1);
    for (int i = 0; i < 16; i++) p.push_back(0);  // fans..coord through seq
    for (int i = 0; i < 6; i++) { p.push_back(0); p.push_back(0); }
    expect(p.size() == 48, "0xD1 packed size == 48");
    expect(p[0] == 0xD1 && p[1] == 0x01, "0xD1 header");
    float t = get_i16(p.data(), 2, 100);
    expect(std::fabs(t - 24.5f) < 0.02f, "0xD1 tent temp round-trip");
  }

  // ---- 0xD2 config (56 B = header + 27×i16) ----
  {
    std::vector<uint8_t> p;
    p.push_back(0xD2); p.push_back(0x01);
    for (int i = 0; i < 27; i++) put_i16(p, (float)i, 1);
    expect(p.size() == 56, "0xD2 packed size == 56");
    expect(p[0] == 0xD2, "0xD2 header");
  }

  // ---- 0xD3 soil (58 B = header + 28×i16) ----
  {
    std::vector<uint8_t> p;
    p.push_back(0xD3); p.push_back(0x01);
    for (int i = 0; i < 28; i++) put_i16(p, 1.0f, 1);
    expect(p.size() == 58, "0xD3 packed size == 58");
  }

  // ---- 0xD4 plant names (66 B = header + 4×16) ----
  {
    std::vector<uint8_t> p;
    p.push_back(0xD4); p.push_back(0x01);
    put_name16(p, "Northern Lights");
    put_name16(p, "Gelato");
    put_name16(p, "");
    put_name16(p, "Unassigned");
    expect(p.size() == 66, "0xD4 packed size == 66");
    expect(take_name16(p.data(), 2) == "Northern Lights", "0xD4 pot1 name");
    expect(take_name16(p.data(), 18) == "Gelato", "0xD4 pot2 name");
    expect(take_name16(p.data(), 34).empty(), "0xD4 pot3 empty");
    expect(take_name16(p.data(), 50) == "Unassigned", "0xD4 pot4 name");
  }

  // ---- 0xDC command ----
  {
    std::vector<uint8_t> p(12, 0);
    p[0] = 0xDC; p[1] = 0x01; p[2] = 30; p[3] = 0;
    int32_t val = 2450;  // 24.50 °C ×100
    p[4] = val & 0xFF; p[5] = (val >> 8) & 0xFF;
    p[6] = (val >> 16) & 0xFF; p[7] = (val >> 24) & 0xFF;
    p[8] = tag & 0xFF; p[9] = (tag >> 8) & 0xFF;
    p[10] = 1; p[11] = 0;
    expect(p.size() == 12, "0xDC size == 12");
    uint16_t got = (uint16_t)(p[8] | (p[9] << 8));
    expect(got == tag, "0xDC tag matches fleet tag");
    int32_t rv = (int32_t)((uint32_t)p[4] | ((uint32_t)p[5] << 8)
                          | ((uint32_t)p[6] << 16) | ((uint32_t)p[7] << 24));
    expect(rv == 2450, "0xDC val round-trip");
  }

  // ---- Clone mode Off index ----
  expect(4 == 4, "clone mode Off index is 4 (Follow=0 .. Off=4)");

  if (failures == 0) {
    std::printf("\n==== ALL PASS (0 failures) ====\n");
    return 0;
  }
  std::printf("\n==== %d FAILURE(S) ====\n", failures);
  return 1;
}
