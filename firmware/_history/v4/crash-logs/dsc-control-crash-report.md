# Crash report: DSC-CONTROL

## What happened

```
tapped screen
```

## Decoded backtrace

The backtrace was not decoded. Raw crash output is below.

## Crash log

```text
[I][wifi:1119]: Connecting to 'Digital-Emotions Studio' (58:D9:D5:D7:AA:82) (priority 0, attempt 1/2 in phase SCAN_CONNECTING)...
[I][wifi:1597]: Connected
[I][espnow:261]: Wifi Channel is changed from 1 to 6.
[W][component:365]: wifi cleared Warning flag
[W][api.connection:2532]: aioesphomeapi (192.168.86.3): Reading failed CONNECTION_CLOSED errno=128
[I][safe_mode:142]: Boot seems successful; resetting boot loop counter
[I][cyd_touch:352]: raw=2420,2706  mapped=198,161
[I][cyd_touch:352]: raw=2892,3529  mapped=241,219
[I][cyd_touch:352]: raw=424,2428  mapped=15,142
[I][cyd_touch:352]: raw=2061,3396  mapped=165,210
[I][cyd_touch:352]: raw=904,2786  mapped=59,167
[W][lvgl:998]: Failed to allocate 768 bytes for draw buffer
[W][lvgl:000]: [Warn] lv_draw_buf_create_ex: No memory: 24x32, cf: 14, stride: 24, 768Byte, 
[E][lvgl:000]: 
E (120751) task_wdt: Task watchdog got triggered. The following tasks/users did not reset the watchdog in time:
E (120751) task_wdt:  - loopTask (CPU 1)
E (120751) task_wdt: Tasks currently running:
E (120751) task_wdt: CPU 0: IDLE0
E (120751) task_wdt: CPU 1: loopTask
E (120751) task_wdt: Aborting.
E (120751) task_wdt: Print CPU 1 backtrace




Backtrace: 0x401228d9:0x3ffb5850 0x40122ff1:0x3ffb58d0 0x40132071:0x3ffb5a60 0x4012e082:0x3ffb5a80 0x401214f3:0x3ffb5aa0 0x40121538:0x3ffb5ac0 0x401215bc:0x3ffb5ae0 0x40122796:0x3ffb5b00 0x4012c87e:0x3ffb5bb0 0x401ae029:0x3ffb5c90 0x4011aa67:0x3ffb5cb0 0x4011ab88:0x3ffb5cf0 0x4011f4f4:0x3ffb5d30 0x4011f0e1:0x3ffb5e90 0x4011f58e:0x3ffb5fa0 0x4011f0e1:0x3ffb6100 0x4011f58e:0x3ffb6210 0x4011f0e1:0x3ffb6370 0x4011f58e:0x3ffb6480 0x4011f0e1:0x3ffb65e0 0x4011f7ba:0x3ffb66f0 0x4011f8cd:0x3ffb6710 0x4011f967:0x3ffb6740 0x40120075:0x3ffb6790 0x4012a8a2:0x3ffb6820 0x400ff71c:0x3ffb6850 0x400db2ea:0x3ffb6870




ELF file SHA256: cf19cfbaa
```

## Warnings and errors

```text
[E][safe_mode:201]: Boot loop detected
[E][component:349]: safe_mode set Error flag: unspecified
[W][safe_mode:236]: SAFE MODE IS ACTIVE
[W][component:342]: wifi set Warning flag: scanning for networks
[W][safe_mode:087]: SAFE MODE IS ACTIVE
[W][component:365]: wifi cleared Warning flag
[W][component:342]: esphome.ota set Warning flag: unspecified
[W][component:365]: esphome.ota cleared Warning flag
[W][touchscreen:031]: Touch Polling Stopped. You can safely remove the 'update_interval:' variable from the YAML file.
[W][component:473]: lvgl took a long time for an operation (327 ms), max is 50 ms
[W][component:342]: wifi set Warning flag: scanning for networks
[W][component:365]: wifi cleared Warning flag
[W][api.connection:2532]: aioesphomeapi (192.168.86.3): Reading failed CONNECTION_CLOSED errno=128
[W][lvgl:998]: Failed to allocate 768 bytes for draw buffer
[W][lvgl:000]: [Warn] lv_draw_buf_create_ex: No memory: 24x32, cf: 14, stride: 24, 768Byte, 
[E][lvgl:000]: 
[W][touchscreen:031]: Touch Polling Stopped. You can safely remove the 'update_interval:' variable from the YAML file.
[W][component:473]: lvgl took a long time for an operation (325 ms), max is 50 ms
[W][component:342]: wifi set Warning flag: scanning for networks
[W][component:365]: wifi cleared Warning flag
```

## Configuration (secrets redacted)

```yaml
Attaching external pullup/down resistors to strapping pins can cause unexpected failures.
See https://esphome.io/guides/faq/#why-am-i-getting-a-warning-about-strapping-pins
Attaching external pullup/down resistors to strapping pins can cause unexpected failures.
See https://esphome.io/guides/faq/#why-am-i-getting-a-warning-about-strapping-pins
Attaching external pullup/down resistors to strapping pins can cause unexpected failures.
See https://esphome.io/guides/faq/#why-am-i-getting-a-warning-about-strapping-pins
substitutions:
  name: dsc-control
  friendly_name: DSC-CONTROL
  hub_mac: 84:1F:E8:16:E6:60
  espnow_cmd_tag: '43981'
  ent_clone_temp: sensor.dsc_hub_clone_temperature
  ent_clone_rh: sensor.dsc_hub_clone_humidity
  ent_clone_vpd: sensor.dsc_hub_clone_vpd_kpa
  ent_main_temp: sensor.dsc_hub_tent_temperature
  ent_main_rh: sensor.dsc_hub_tent_humidity
  ent_main_vpd: sensor.dsc_hub_vpd_kpa
  ent_room_temp: sensor.dsc_hub_room_temperature
  ent_room_rh: sensor.dsc_hub_room_humidity
  ent_co2: sensor.dsc_hub_dynamic_co2_ppm
  ent_win_4x8: binary_sensor.dsc_hub_4x8_window_open
  ent_win_2x4: binary_sensor.dsc_hub_2x4_window_open
  ent_fault_climate: binary_sensor.dsc_hub_climate_sensor_fault
  ent_fault_aux: binary_sensor.dsc_hub_aux_sensor_fault
  ent_fault_rootzone: binary_sensor.dsc_hub_root_zone_sensor_fault
  ent_fan_out: fan.dsc_hub_6_inch_exhaust_outside
  ent_fan_recirc: fan.dsc_hub_6_inch_exhaust_room
  ent_fan_int_main: fan.dsc_hub_4_inch_intake_fan_main
  ent_fan_int_clone: fan.dsc_hub_4_inch_intake_fan_2x4
  ent_sf1000: light.dsc_hub_sf1000_dimmer
  ent_dem_hum: switch.dsc_hub_humidifier_demand
  ent_dem_dehum: switch.dsc_hub_dehumidifier_demand
  ent_dem_heater: switch.dsc_hub_heater_demand
  ent_dem_mat: switch.dsc_hub_grow_mat_demand
  ent_dem_ac: switch.dsc_hub_ac_demand
  ent_dem_clone_hum: switch.dsc_hub_clone_humidifier_demand
  ent_full_auto: switch.dsc_hub_tent_full_auto_mode
  ent_takeover: switch.dsc_hub_manual_takeover
  ent_auto_photo: switch.dsc_hub_auto_photoperiod
  ent_light_hold: switch.dsc_hub_manual_light_hold
  ent_sel_stage: select.dsc_hub_grow_stage
  ent_sel_strategy: select.dsc_hub_control_strategy
  ent_sel_clone_mode: select.dsc_hub_clone_mode
  ent_sel_priority: select.dsc_hub_priority_tent
  ent_num_temp: number.dsc_hub_target_temp
  ent_num_vpd_min: number.dsc_hub_vpd_target_min
  ent_num_vpd_max: number.dsc_hub_vpd_target_max
  ent_num_rh_min: number.dsc_hub_rh_target_min
  ent_num_rh_max: number.dsc_hub_rh_target_max
  ent_num_c_temp: number.dsc_hub_clone_target_temp
  ent_num_c_vpd_min: number.dsc_hub_clone_vpd_min
  ent_num_c_vpd_max: number.dsc_hub_clone_vpd_max
  ent_num_c_rh_min: number.dsc_hub_clone_rh_min
  ent_num_c_rh_max: number.dsc_hub_clone_rh_max
  ent_num_sf_target: number.dsc_hub_sf1000_target_brightness
  ent_cd_hum: sensor.dsc_hub_humidifier_fire_countdown
  ent_cd_dehum: sensor.dsc_hub_dehumidifier_fire_countdown
  ent_cd_heater: sensor.dsc_hub_heater_fire_countdown
  ent_cd_ac: sensor.dsc_hub_ac_fire_countdown
  ent_cd_mat: sensor.dsc_hub_grow_mat_fire_countdown
  ent_cd_clone_hum: sensor.dsc_hub_clone_humidifier_fire_countdown
  ent_p1_moist: sensor.dsc_pot1_soil_moisture
  ent_p1_temp: sensor.dsc_pot1_soil_temperature
  ent_p1_ec: sensor.dsc_pot1_soil_conductivity
  ent_p1_ph: sensor.dsc_pot1_soil_ph
  ent_p1_n: sensor.dsc_pot1_soil_nitrogen
  ent_p1_p: sensor.dsc_pot1_soil_phosphorus
  ent_p1_k: sensor.dsc_pot1_soil_potassium
  ent_p1_plant: text.dsc_pot1_plant_name
  ent_p2_moist: sensor.dsc_pot2_soil_moisture
  ent_p2_temp: sensor.dsc_pot2_soil_temperature
  ent_p2_ec: sensor.dsc_pot2_soil_conductivity
  ent_p2_ph: sensor.dsc_pot2_soil_ph
  ent_p2_n: sensor.dsc_pot2_soil_nitrogen
  ent_p2_p: sensor.dsc_pot2_soil_phosphorus
  ent_p2_k: sensor.dsc_pot2_soil_potassium
  ent_p2_plant: text.dsc_pot2_plant_name
  ent_p3_moist: sensor.dsc_pot3_soil_moisture
  ent_p3_temp: sensor.dsc_pot3_soil_temperature
  ent_p3_ec: sensor.dsc_pot3_soil_conductivity
  ent_p3_ph: sensor.dsc_pot3_soil_ph
  ent_p3_n: sensor.dsc_pot3_soil_nitrogen
  ent_p3_p: sensor.dsc_pot3_soil_phosphorus
  ent_p3_k: sensor.dsc_pot3_soil_potassium
  ent_p3_plant: text.dsc_pot3_plant_name
  ent_p4_moist: sensor.dsc_pot4_soil_moisture
  ent_p4_temp: sensor.dsc_pot4_soil_temperature
  ent_p4_ec: sensor.dsc_pot4_soil_conductivity
  ent_p4_ph: sensor.dsc_pot4_soil_ph
  ent_p4_n: sensor.dsc_pot4_soil_nitrogen
  ent_p4_p: sensor.dsc_pot4_soil_phosphorus
  ent_p4_k: sensor.dsc_pot4_soil_potassium
  ent_p4_plant: text.dsc_pot4_plant_name
  ent_num_ramp_floor: number.dsc_hub_sf1000_ramp_floor
  ent_num_sunrise: number.dsc_hub_sunrise_duration
  ent_num_sunset: number.dsc_hub_sunset_duration
  ent_num_clone_light_hours: number.dsc_hub_clone_light_hours
  ent_num_mat_low: number.dsc_hub_mat_root_zone_low
  ent_num_mat_high: number.dsc_hub_mat_root_zone_high
  ent_num_mat_min_off: number.dsc_hub_mat_min_off_time
  ent_num_clone_hum_hyst: number.dsc_hub_clone_hum_hysteresis
  ent_num_clone_hum_min_off: number.dsc_hub_clone_hum_min_off_time
  ent_num_hum_min_off: number.dsc_hub_humidifier_min_off_time
  ent_num_heater_min_off: number.dsc_hub_heater_min_off_time
  ent_num_destrat_period: number.dsc_hub_de_strat_pulse_period
  ent_num_destrat_length: number.dsc_hub_de_strat_pulse_length
  ent_num_destrat_level: number.dsc_hub_de_strat_pulse_level
  ent_sel_clone_photo: select.dsc_hub_clone_photoperiod
  ent_hum_routing: switch.dsc_hub_humidifier_intake_routing
  ent_destrat: switch.dsc_hub_recirc_de_strat_pulse
esphome:
  name: dsc-control
  friendly_name: DSC-CONTROL
  project:
    name: digital_emotions.dsc-hub
    version: 4.0.1
  min_version: 2026.7.2
  build_path: build/dsc-control
  platformio_options: {}
  build_flags: []
  environment_variables: {}
  includes: []
  includes_c: []
  libraries: []
  name_add_mac_suffix: false
  merge_warnings: true
  debug_scheduler: false
  areas: []
  devices: []
esp32:
  board: esp32dev
  framework:
    type: esp-idf
    advanced:
      sram1_as_iram: true
      minimum_chip_revision: '3.1'
      compiler_optimization: SIZE
      enable_idf_experimental_features: false
      enable_lwip_assert: true
      ignore_efuse_custom_mac: false
      ignore_efuse_mac_crc: false
      enable_lwip_mdns_queries: true
      enable_lwip_bridge_interface: false
      enable_lwip_tcpip_core_locking: true
      enable_lwip_check_thread_safety: true
      disable_libc_locks_in_iram: true
      disable_vfs_support_termios: true
      disable_vfs_support_select: true
      disable_vfs_support_dir: true
      freertos_in_iram: false
      ringbuf_in_iram: false
      heap_in_iram: false
      execute_from_psram: false
      loop_task_stack_size: 8192
      enable_ota_rollback: true
      enable_ota_downgrade_protection: false
      use_full_certificate_bundle: false
      include_builtin_idf_components: []
      enable_full_printf: false
      disable_debug_stubs: true
      disable_ocd_aware: true
      disable_usb_serial_jtag_secondary: true
      disable_dev_null_vfs: true
      disable_mbedtls_peer_cert: true
      disable_mbedtls_pkcs7: true
      disable_regi2c_in_iram: true
      adc_oneshot_in_iram: false
      disable_fatfs: true
    sdkconfig_options:
      CONFIG_ESP_WIFI_STATIC_RX_BUFFER_NUM: '6'
      CONFIG_ESP_WIFI_DYNAMIC_RX_BUFFER_NUM: '16'
      CONFIG_ESP_WIFI_DYNAMIC_TX_BUFFER_NUM: '16'
    version: 5.5.5
    log_level: ERROR
    components: []
  flash_size: 4MB
  watchdog_timeout: 5s
  variant: ESP32
  cpu_frequency: 240MHZ
logger:
  level: INFO
  baud_rate: 115200
  tx_buffer_size: 512
  deassert_rts_dtr: false
  task_log_buffer_size: 768
  hardware_uart: UART0
  logs: {}
  runtime_tag_levels: false
debug:
  update_interval: 60s
api:
  encryption:
    key: !secret 'dsc_control_api_key'
  reboot_timeout: 0s
  port: 6053
  batch_delay: 100ms
  custom_services: false
  homeassistant_services: false
  homeassistant_states: false
  listen_backlog: 4
  max_connections: 5
  max_send_queue: 8
ota:
  - platform: esphome
    password: !secret 'dsc_control_ota_password'
    version: 2
    port: 3232
    allow_partition_access: false
wifi:
  power_save_mode: NONE
  ap:
    ssid: <removed>
    password: !secret 'dsc_control_ap_password'
    ap_timeout: 90s
  on_connect:
    then:
      - lambda: !lambda |-
          id(wifi_conn) = true;
  on_disconnect:
    then:
      - lambda: !lambda |-
          id(wifi_conn) = false;
  domain: .local
  reboot_timeout: 15min
  fast_connect:
    enabled: false
    storage: flash
  enable_btm: false
  enable_rrm: false
  passive_scan: false
  enable_on_boot: true
  post_connect_roaming: true
  min_auth_mode: WPA2
  networks:
    - ssid: !secret 'wifi_ssid'
      password: !secret 'wifi_password'
      priority: 0
  use_address: dsc-control.local
espnow:
  auto_add_peer: false
  peers:
    - 84:1F:E8:16:E6:60
  on_receive:
    - then:
        - lambda: !lambda |-
            if (size < 2 || data[1] != 0x01) return;
            auto rd = [&](int off) -> float { int16_t v = (int16_t)(data[off] | (data[off+1] << 8)); return v == (int16_t)0x8000 ? NAN : (float) v; };
            uint8_t ty = data[0];
            if (ty == 0xD1 && size >= 36) {
              id(gv_hub_last) = millis();
              id(gv_tent_t)=rd(2)/100.0f; id(gv_clone_t)=rd(4)/100.0f; id(gv_room_t)=rd(6)/100.0f;
              id(gv_tent_rh)=rd(8)/100.0f; id(gv_clone_rh)=rd(10)/100.0f; id(gv_room_rh)=rd(12)/100.0f;
              id(gv_tent_vpd)=rd(14)/100.0f; id(gv_clone_vpd)=rd(16)/100.0f; id(gv_co2)=rd(18);
              id(gv_fan_out)=data[20]; id(gv_fan_recirc)=data[21]; id(gv_fan_imain)=data[22]; id(gv_fan_iclone)=data[23];
              id(gv_sf_pct)=data[24]; id(gv_ramp)=data[25];
              id(gv_stage)=data[26]; id(gv_strat)=data[27]; id(gv_cmode)=data[28]; id(gv_prio)=data[29];
              id(gv_dem)=data[30]; id(gv_mode)=data[31]; id(gv_arm)=data[32]; id(gv_flt)=data[33]; id(gv_coord)=data[34];
              if (size >= 48) for (int i = 0; i < 6; i++) { uint16_t c = data[36+i*2] | (data[37+i*2] << 8); id(gv_cd)[i] = (float) c; }
            } else if (ty == 0xD2 && size >= 56) {
              static const float sc[27] = {100,100,100,100,100, 100,100,100,100,100, 1,1,1,1, 1,100,1,1,1, 100,100,1,1,1,1, 1,1};
              for (int i = 0; i < 27; i++) { float v = rd(2 + i*2); id(gv_cfg)[i] = isnan(v) ? NAN : v / sc[i]; }
            } else if (ty == 0xD3 && size >= 58) {
              static const float ss[7] = {100,10,1,100,1,1,1};
              for (int i = 0; i < 28; i++) { float v = rd(2 + i*2); id(gv_soil)[i] = isnan(v) ? NAN : v / ss[i % 7]; }
            }
  enable_on_boot: true
  max_payload_size: 250
time:
  - platform: sntp
    id: sntp_time
    timezone: AEST-10AEDT,M10.1.0,M4.1.0/3
    update_interval: 15min
    servers:
      - 0.pool.ntp.org
      - 1.pool.ntp.org
      - 2.pool.ntp.org
  - platform: homeassistant
    id: ha_time
    update_interval: 15min
spi:
  - id: spi_tft
    clk_pin:
      number: 14
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    mosi_pin:
      number: 13
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    miso_pin:
      number: 12
      mode:
        input: true
        output: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    interface: any
    type: single
    interface_index: 0
  - id: spi_touch
    clk_pin:
      number: 25
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    mosi_pin:
      number: 32
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    miso_pin:
      number: 39
      mode:
        input: true
        output: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    interface: any
    type: single
    interface_index: 1
display:
  - platform: ili9xxx
    id: cyd_display
    model: ST7789V
    spi_id: spi_tft
    cs_pin:
      number: 15
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    dc_pin:
      number: 2
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    data_rate: 40000000.0
    invert_colors: false
    dimensions:
      width: 320
      height: 240
      offset_height: 0
      offset_width: 0
    transform:
      swap_xy: true
      mirror_x: true
      mirror_y: false
    color_order: BGR
    auto_clear_enabled: false
    update_interval: 4294967295ms
    color_palette: NONE
    color_palette_images: []
touchscreen:
  - platform: xpt2046
    id: cyd_touch
    spi_id: spi_touch
    cs_pin:
      number: 33
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    interrupt_pin:
      number: 36
      mode:
        input: true
        output: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    threshold: 400
    calibration:
      x_min: 250
      x_max: 3750
      y_min: 400
      y_max: 3820
    transform:
      swap_xy: true
      mirror_x: false
      mirror_y: false
    on_touch:
      then:
        - lambda: !lambda |-
            ESP_LOGI("cyd_touch", "raw=%d,%d  mapped=%d,%d", touch.x_raw, touch.y_raw, touch.x, touch.y);
        - if:
            condition:
              lambda: !lambda |-
                return id(panel_sleeping);
            then:
              - script.execute:
                  id: wake_panel
    update_interval: 50ms
output:
  - platform: ledc
    pin:
      number: 21
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    id: backlight_pwm
    frequency: 1000.0
    zero_means_zero: false
  - platform: ledc
    pin:
      number: 4
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    id: led_r
    inverted: true
    zero_means_zero: false
    frequency: 1000.0
  - platform: ledc
    pin:
      number: 16
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    id: led_g
    inverted: true
    zero_means_zero: false
    frequency: 1000.0
  - platform: ledc
    pin:
      number: 17
      mode:
        output: true
        input: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    id: led_b
    inverted: true
    zero_means_zero: false
    frequency: 1000.0
light:
  - platform: monochromatic
    output: backlight_pwm
    id: backlight
    name: Backlight
    restore_mode: ALWAYS_ON
    default_transition_length: 250ms
    disabled_by_default: false
    gamma_correct: 2.8
    flash_transition_length: 0s
  - platform: rgb
    id: status_led
    name: Status LED
    red: led_r
    green: led_g
    blue: led_b
    restore_mode: ALWAYS_OFF
    effects:
      - pulse:
          name: Breathe
          transition_length: 500ms
          update_interval: 600ms
          min_brightness: 0.0
          max_brightness: 1.0
    disabled_by_default: false
    gamma_correct: 2.8
    default_transition_length: 1s
    flash_transition_length: 0s
button:
  - platform: restart
    name: Restart
    disabled_by_default: false
    icon: mdi:restart
    entity_category: config
    device_class: restart
sensor:
  - platform: debug
    free:
      name: Panel Free Heap
      id: panel_free_heap
      entity_category: diagnostic
      disabled_by_default: false
      force_update: false
      unit_of_measurement: B
      icon: mdi:counter
      accuracy_decimals: 0
      state_class: measurement
    block:
      name: Panel Largest Free Block
      entity_category: diagnostic
      disabled_by_default: false
      force_update: false
      unit_of_measurement: B
      icon: mdi:counter
      accuracy_decimals: 0
      state_class: measurement
  - platform: adc
    pin:
      number: 34
      mode:
        input: true
        output: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    id: ldr_raw
    name: Ambient Light (raw)
    attenuation: 12db
    update_interval: 60s
    entity_category: diagnostic
    disabled_by_default: false
    force_update: false
    unit_of_measurement: V
    accuracy_decimals: 2
    device_class: voltage
    state_class: measurement
    raw: false
    samples: 1
    sampling_mode: avg
  - platform: wifi_signal
    id: wifi_rssi
    name: WiFi RSSI
    update_interval: 60s
    entity_category: diagnostic
    disabled_by_default: false
    force_update: false
    unit_of_measurement: dBm
    accuracy_decimals: 0
    device_class: signal_strength
    state_class: measurement
  - platform: adc
    pin:
      number: 35
      mode:
        input: true
        output: false
        open_drain: false
        pullup: false
        pulldown: false
      inverted: false
      ignore_pin_validation_error: false
      ignore_strapping_warning: false
      drive_strength: 20.0
    id: batt_v
    attenuation: 12db
    update_interval: 10s
    internal: true
    filters:
      - multiply: 2.0
    disabled_by_default: false
    force_update: false
    unit_of_measurement: V
    accuracy_decimals: 2
    device_class: voltage
    state_class: measurement
    raw: false
    samples: 1
    sampling_mode: avg
    name: batt_v
  - platform: template
    id: clone_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_clone_t);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: clone_temp
  - platform: template
    id: clone_rh
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_clone_rh);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: clone_rh
  - platform: template
    id: clone_vpd
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_clone_vpd);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: clone_vpd
  - platform: template
    id: main_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_tent_t);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: main_temp
  - platform: template
    id: main_rh
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_tent_rh);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: main_rh
  - platform: template
    id: main_vpd
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_tent_vpd);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: main_vpd
  - platform: template
    id: room_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_room_t);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: room_temp
  - platform: template
    id: room_rh
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_room_rh);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: room_rh
  - platform: template
    id: co2_ppm
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_co2);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: co2_ppm
  - platform: template
    id: t_main_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[0];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_main_temp
  - platform: template
    id: t_main_vpd_min
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[1];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_main_vpd_min
  - platform: template
    id: t_main_vpd_max
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[2];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_main_vpd_max
  - platform: template
    id: t_main_rh_min
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[3];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_main_rh_min
  - platform: template
    id: t_main_rh_max
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[4];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_main_rh_max
  - platform: template
    id: t_clone_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[5];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_clone_temp
  - platform: template
    id: t_clone_vpd_min
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[6];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_clone_vpd_min
  - platform: template
    id: t_clone_vpd_max
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[7];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_clone_vpd_max
  - platform: template
    id: t_clone_rh_min
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[8];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_clone_rh_min
  - platform: template
    id: t_clone_rh_max
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[9];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: t_clone_rh_max
  - platform: template
    id: sf_target
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[10];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: sf_target
  - platform: template
    id: fan_out_pct
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return (float)id(gv_fan_out);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: fan_out_pct
  - platform: template
    id: fan_recirc_pct
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return (float)id(gv_fan_recirc);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: fan_recirc_pct
  - platform: template
    id: fan_int_main_pct
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return (float)id(gv_fan_imain);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: fan_int_main_pct
  - platform: template
    id: fan_int_clone_pct
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return (float)id(gv_fan_iclone);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: fan_int_clone_pct
  - platform: template
    id: sf_brightness
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return (float)id(gv_sf_pct);
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: sf_brightness
  - platform: template
    id: cd_hum
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cd)[0];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: cd_hum
  - platform: template
    id: cd_dehum
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cd)[1];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: cd_dehum
  - platform: template
    id: cd_heater
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cd)[2];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: cd_heater
  - platform: template
    id: cd_ac
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cd)[3];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: cd_ac
  - platform: template
    id: cd_mat
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cd)[4];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: cd_mat
  - platform: template
    id: cd_clone_hum
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cd)[5];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: cd_clone_hum
  - platform: template
    id: p1_moist
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[1];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p1_moist
  - platform: template
    id: p1_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[0];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p1_temp
  - platform: template
    id: p1_ec
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[2];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p1_ec
  - platform: template
    id: p1_ph
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[3];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p1_ph
  - platform: template
    id: p1_n
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[4];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p1_n
  - platform: template
    id: p1_p
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[5];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p1_p
  - platform: template
    id: p1_k
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[6];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p1_k
  - platform: template
    id: p2_moist
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[8];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p2_moist
  - platform: template
    id: p2_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[7];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p2_temp
  - platform: template
    id: p2_ec
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[9];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p2_ec
  - platform: template
    id: p2_ph
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[10];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p2_ph
  - platform: template
    id: p2_n
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[11];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p2_n
  - platform: template
    id: p2_p
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[12];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p2_p
  - platform: template
    id: p2_k
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[13];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p2_k
  - platform: template
    id: p3_moist
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[15];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p3_moist
  - platform: template
    id: p3_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[14];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p3_temp
  - platform: template
    id: p3_ec
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[16];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p3_ec
  - platform: template
    id: p3_ph
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[17];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p3_ph
  - platform: template
    id: p3_n
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[18];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p3_n
  - platform: template
    id: p3_p
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[19];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p3_p
  - platform: template
    id: p3_k
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[20];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p3_k
  - platform: template
    id: p4_moist
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[22];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p4_moist
  - platform: template
    id: p4_temp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[21];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p4_temp
  - platform: template
    id: p4_ec
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[23];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p4_ec
  - platform: template
    id: p4_ph
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[24];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p4_ph
  - platform: template
    id: p4_n
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[25];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p4_n
  - platform: template
    id: p4_p
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[26];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p4_p
  - platform: template
    id: p4_k
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_soil)[27];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: p4_k
  - platform: template
    id: n_ramp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[14];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_ramp
  - platform: template
    id: n_sunrise
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[11];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_sunrise
  - platform: template
    id: n_sunset
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[12];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_sunset
  - platform: template
    id: n_clh
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[13];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_clh
  - platform: template
    id: n_rzlo
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[19];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_rzlo
  - platform: template
    id: n_rzhi
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[20];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_rzhi
  - platform: template
    id: n_matoff
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[21];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_matoff
  - platform: template
    id: n_chh
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[15];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_chh
  - platform: template
    id: n_chmo
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[16];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_chmo
  - platform: template
    id: n_hmo
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[17];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_hmo
  - platform: template
    id: n_htmo
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[18];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_htmo
  - platform: template
    id: n_dsp
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[22];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_dsp
  - platform: template
    id: n_dsl
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[23];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_dsl
  - platform: template
    id: n_dslv
    internal: true
    update_interval: 1s
    lambda: !lambda |-
      return id(gv_cfg)[24];
    disabled_by_default: false
    force_update: false
    accuracy_decimals: 1
    name: n_dslv
binary_sensor:
  - platform: status
    id: api_link
    name: HA Link Status
    disabled_by_default: false
    entity_category: diagnostic
    device_class: connectivity
    update_interval: 1s
  - platform: template
    id: win_4x8
    internal: true
    lambda: !lambda |-
      return (id(gv_flt)&32);
    disabled_by_default: false
    name: win_4x8
  - platform: template
    id: win_2x4
    internal: true
    lambda: !lambda |-
      return (id(gv_flt)&64);
    disabled_by_default: false
    name: win_2x4
  - platform: template
    id: fault_climate
    internal: true
    lambda: !lambda |-
      return (id(gv_flt)&1);
    disabled_by_default: false
    name: fault_climate
  - platform: template
    id: fault_aux
    internal: true
    lambda: !lambda |-
      return (id(gv_flt)&6);
    disabled_by_default: false
    name: fault_aux
  - platform: template
    id: fault_rootzone
    internal: true
    lambda: !lambda |-
      return (id(gv_flt)&8);
    disabled_by_default: false
    name: fault_rootzone
  - platform: template
    id: dem_hum
    internal: true
    lambda: !lambda |-
      return (id(gv_dem)&1);
    disabled_by_default: false
    name: dem_hum
  - platform: template
    id: dem_dehum
    internal: true
    lambda: !lambda |-
      return (id(gv_dem)&2);
    disabled_by_default: false
    name: dem_dehum
  - platform: template
    id: dem_heater
    internal: true
    lambda: !lambda |-
      return (id(gv_dem)&4);
    disabled_by_default: false
    name: dem_heater
  - platform: template
    id: dem_mat
    internal: true
    lambda: !lambda |-
      return (id(gv_dem)&8);
    disabled_by_default: false
    name: dem_mat
  - platform: template
    id: dem_ac
    internal: true
    lambda: !lambda |-
      return (id(gv_dem)&16);
    disabled_by_default: false
    name: dem_ac
  - platform: template
    id: dem_clone_hum
    internal: true
    lambda: !lambda |-
      return (id(gv_dem)&32);
    disabled_by_default: false
    name: dem_clone_hum
  - platform: template
    id: fan_out_on
    internal: true
    lambda: !lambda |-
      return (id(gv_fan_out)>0);
    disabled_by_default: false
    name: fan_out_on
  - platform: template
    id: fan_recirc_on
    internal: true
    lambda: !lambda |-
      return (id(gv_fan_recirc)>0);
    disabled_by_default: false
    name: fan_recirc_on
  - platform: template
    id: fan_int_main_on
    internal: true
    lambda: !lambda |-
      return (id(gv_fan_imain)>0);
    disabled_by_default: false
    name: fan_int_main_on
  - platform: template
    id: fan_int_clone_on
    internal: true
    lambda: !lambda |-
      return (id(gv_fan_iclone)>0);
    disabled_by_default: false
    name: fan_int_clone_on
  - platform: template
    id: st_full_auto
    internal: true
    lambda: !lambda |-
      return (id(gv_mode)&1);
    disabled_by_default: false
    name: st_full_auto
  - platform: template
    id: st_takeover
    internal: true
    lambda: !lambda |-
      return (id(gv_mode)&4);
    disabled_by_default: false
    name: st_takeover
  - platform: template
    id: st_auto_photo
    internal: true
    lambda: !lambda |-
      return (id(gv_mode)&8);
    disabled_by_default: false
    name: st_auto_photo
  - platform: template
    id: st_light_hold
    internal: true
    lambda: !lambda |-
      return (id(gv_mode)&16);
    disabled_by_default: false
    name: st_light_hold
  - platform: template
    id: st_hum_routing
    internal: true
    lambda: !lambda |-
      return (id(gv_coord)&1);
    disabled_by_default: false
    name: st_hum_routing
  - platform: template
    id: st_destrat
    internal: true
    lambda: !lambda |-
      return (id(gv_coord)&2);
    disabled_by_default: false
    name: st_destrat
text_sensor:
  - platform: template
    id: sel_stage
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      const char* o[]={"Germination","Seedling","Early Vegetative","Vegetative","Late (Push) Vegetative","Early Flowering","Flowering","Late Flowering","Final 48-72h Flowering","Dry Mode","Off"}; int i=id(gv_stage); return std::string(i>=0&&i<11?o[i]:"--");
    disabled_by_default: false
    name: sel_stage
  - platform: template
    id: p1_plant
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      return std::string("");
    disabled_by_default: false
    name: p1_plant
  - platform: template
    id: p2_plant
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      return std::string("");
    disabled_by_default: false
    name: p2_plant
  - platform: template
    id: p3_plant
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      return std::string("");
    disabled_by_default: false
    name: p3_plant
  - platform: template
    id: p4_plant
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      return std::string("");
    disabled_by_default: false
    name: p4_plant
  - platform: template
    id: sel_strategy
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      const char* o[]={"VPD","Temperature","Humidity"}; int i=id(gv_strat); return std::string(i>=0&&i<3?o[i]:"--");
    disabled_by_default: false
    name: sel_strategy
  - platform: template
    id: sel_clone_mode
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      const char* o[]={"Follow 4x8","Clones & Seedlings","Mother","Custom","Off"}; int i=id(gv_cmode); return std::string(i>=0&&i<5?o[i]:"--");
    disabled_by_default: false
    name: sel_clone_mode
  - platform: template
    id: sel_priority
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      return std::string(id(gv_prio)?"4x8 Main":"2x4 Clone");
    disabled_by_default: false
    name: sel_priority
  - platform: template
    id: sel_clone_photo
    internal: true
    update_interval: 2s
    lambda: !lambda |-
      return std::string((id(gv_coord)&64)?"Follow 4x8":"Independent");
    disabled_by_default: false
    name: sel_clone_photo
  - platform: wifi_info
    ssid:
      id: wifi_ssid_ts
      internal: true
      disabled_by_default: false
      entity_category: diagnostic
      name: wifi_ssid_ts
    ip_address:
      id: wifi_ip_ts
      internal: true
      disabled_by_default: false
      entity_category: diagnostic
      name: wifi_ip_ts
globals:
  - id: gv_hub_last
    type: uint32_t
    initial_value: '0'
    restore_value: false
  - id: cmd_tx_seq
    type: uint16_t
    initial_value: '0'
    restore_value: false
  - id: gv_tent_t
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_clone_t
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_room_t
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_tent_rh
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_clone_rh
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_room_rh
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_tent_vpd
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_clone_vpd
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_co2
    type: float
    initial_value: NAN
    restore_value: false
  - id: gv_fan_out
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_fan_recirc
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_fan_imain
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_fan_iclone
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_sf_pct
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_ramp
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_stage
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_strat
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_cmode
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_prio
    type: int
    initial_value: '1'
    restore_value: false
  - id: gv_dem
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_mode
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_arm
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_flt
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_coord
    type: int
    initial_value: '0'
    restore_value: false
  - id: gv_cfg
    type: float[27]
    initial_value: '{NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN}'
    restore_value: false
  - id: gv_soil
    type: float[28]
    initial_value: '{NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN,NAN}'
    restore_value: false
  - id: gv_cd
    type: float[6]
    initial_value: '{NAN,NAN,NAN,NAN,NAN,NAN}'
    restore_value: false
  - id: panel_sleeping
    type: bool
    initial_value: 'false'
    restore_value: false
  - id: night_mode
    type: bool
    initial_value: 'false'
    restore_value: false
  - id: alerts_silenced
    type: bool
    initial_value: 'false'
    restore_value: false
  - id: green_heartbeat
    type: bool
    restore_value: true
    initial_value: 'true'
    update_interval: 1s
  - id: fl_active
    type: bool
    initial_value: 'false'
    restore_value: false
  - id: fl_color
    type: int
    restore_value: true
    initial_value: '0'
    update_interval: 1s
  - id: fl_bright
    type: int
    restore_value: true
    initial_value: '70'
    update_interval: 1s
  - id: bl_last
    type: int
    initial_value: '-1'
    restore_value: false
  - id: led_last
    type: int
    initial_value: '-1'
    restore_value: false
  - id: alert_count
    type: int
    initial_value: '0'
    restore_value: false
  - id: last_touch_ms
    type: uint32_t
    initial_value: '0'
    restore_value: false
  - id: edit_target
    type: int
    initial_value: '0'
    restore_value: false
  - id: active_tab
    type: int
    initial_value: '0'
    restore_value: false
  - id: lock_engaged
    type: bool
    initial_value: 'false'
    restore_value: false
  - id: holding
    type: bool
    initial_value: 'false'
    restore_value: false
  - id: hold_start
    type: uint32_t
    initial_value: '0'
    restore_value: false
  - id: anim_phase
    type: int
    initial_value: '0'
    restore_value: false
  - id: dev_mask
    type: int
    initial_value: '0'
    restore_value: false
  - id: wifi_conn
    type: bool
    initial_value: 'false'
    restore_value: false
  - id: wifi_since
    type: uint32_t
    initial_value: '0'
    restore_value: false
  - id: wifi_was
    type: bool
    initial_value: 'false'
    restore_value: false
  - id: api_since
    type: uint32_t
    initial_value: '0'
    restore_value: false
  - id: api_was
    type: bool
    initial_value: 'false'
    restore_value: false
font:
  - file:
      family: Montserrat
      weight: 700
      italic: false
      refresh: 1d
      type: gfonts
    id: f_title
    size: 20
    bpp: 4
    glyphs:
      - ' '
      - '!'
      - '"'
      - '#'
      - $
      - '%'
      - '&'
      - ''''
      - (
      - )
      - '*'
      - +
      - ','
      - '-'
      - .
      - /
      - '0'
      - '1'
      - '2'
      - '3'
      - '4'
      - '5'
      - '6'
      - '7'
      - '8'
      - '9'
      - ':'
      - ;
      - <
      - '='
      - '>'
      - '?'
      - '@'
      - A
      - B
      - C
      - D
      - E
      - F
      - G
      - H
      - I
      - J
      - K
      - L
      - M
      - N
      - O
      - P
      - Q
      - R
      - S
      - T
      - U
      - V
      - W
      - X
      - Y
      - Z
      - '['
      - \
      - ']'
      - ^
      - _
      - '`'
      - a
      - b
      - c
      - d
      - e
      - f
      - g
      - h
      - i
      - j
      - k
      - l
      - m
      - n
      - o
      - p
      - q
      - r
      - s
      - t
      - u
      - v
      - w
      - x
      - y
      - z
      - '{'
      - '|'
      - '}'
      - '~'
      - °
      - ·
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      family: Montserrat
      weight: 600
      italic: false
      refresh: 1d
      type: gfonts
    id: f_big
    size: 30
    bpp: 4
    glyphs:
      - ' '
      - '!'
      - '"'
      - '#'
      - $
      - '%'
      - '&'
      - ''''
      - (
      - )
      - '*'
      - +
      - ','
      - '-'
      - .
      - /
      - '0'
      - '1'
      - '2'
      - '3'
      - '4'
      - '5'
      - '6'
      - '7'
      - '8'
      - '9'
      - ':'
      - ;
      - <
      - '='
      - '>'
      - '?'
      - '@'
      - A
      - B
      - C
      - D
      - E
      - F
      - G
      - H
      - I
      - J
      - K
      - L
      - M
      - N
      - O
      - P
      - Q
      - R
      - S
      - T
      - U
      - V
      - W
      - X
      - Y
      - Z
      - '['
      - \
      - ']'
      - ^
      - _
      - '`'
      - a
      - b
      - c
      - d
      - e
      - f
      - g
      - h
      - i
      - j
      - k
      - l
      - m
      - n
      - o
      - p
      - q
      - r
      - s
      - t
      - u
      - v
      - w
      - x
      - y
      - z
      - '{'
      - '|'
      - '}'
      - '~'
      - °
      - ·
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      family: Montserrat
      weight: 600
      italic: false
      refresh: 1d
      type: gfonts
    id: f_med
    size: 17
    bpp: 4
    glyphs:
      - ' '
      - '!'
      - '"'
      - '#'
      - $
      - '%'
      - '&'
      - ''''
      - (
      - )
      - '*'
      - +
      - ','
      - '-'
      - .
      - /
      - '0'
      - '1'
      - '2'
      - '3'
      - '4'
      - '5'
      - '6'
      - '7'
      - '8'
      - '9'
      - ':'
      - ;
      - <
      - '='
      - '>'
      - '?'
      - '@'
      - A
      - B
      - C
      - D
      - E
      - F
      - G
      - H
      - I
      - J
      - K
      - L
      - M
      - N
      - O
      - P
      - Q
      - R
      - S
      - T
      - U
      - V
      - W
      - X
      - Y
      - Z
      - '['
      - \
      - ']'
      - ^
      - _
      - '`'
      - a
      - b
      - c
      - d
      - e
      - f
      - g
      - h
      - i
      - j
      - k
      - l
      - m
      - n
      - o
      - p
      - q
      - r
      - s
      - t
      - u
      - v
      - w
      - x
      - y
      - z
      - '{'
      - '|'
      - '}'
      - '~'
      - °
      - ·
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      family: Montserrat
      weight: 500
      italic: false
      refresh: 1d
      type: gfonts
    id: f_body
    size: 14
    bpp: 4
    glyphs:
      - ' '
      - '!'
      - '"'
      - '#'
      - $
      - '%'
      - '&'
      - ''''
      - (
      - )
      - '*'
      - +
      - ','
      - '-'
      - .
      - /
      - '0'
      - '1'
      - '2'
      - '3'
      - '4'
      - '5'
      - '6'
      - '7'
      - '8'
      - '9'
      - ':'
      - ;
      - <
      - '='
      - '>'
      - '?'
      - '@'
      - A
      - B
      - C
      - D
      - E
      - F
      - G
      - H
      - I
      - J
      - K
      - L
      - M
      - N
      - O
      - P
      - Q
      - R
      - S
      - T
      - U
      - V
      - W
      - X
      - Y
      - Z
      - '['
      - \
      - ']'
      - ^
      - _
      - '`'
      - a
      - b
      - c
      - d
      - e
      - f
      - g
      - h
      - i
      - j
      - k
      - l
      - m
      - n
      - o
      - p
      - q
      - r
      - s
      - t
      - u
      - v
      - w
      - x
      - y
      - z
      - '{'
      - '|'
      - '}'
      - '~'
      - °
      - ·
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      family: Montserrat
      weight: 600
      italic: false
      refresh: 1d
      type: gfonts
    id: f_small
    size: 12
    bpp: 4
    glyphs:
      - ' '
      - '!'
      - '"'
      - '#'
      - $
      - '%'
      - '&'
      - ''''
      - (
      - )
      - '*'
      - +
      - ','
      - '-'
      - .
      - /
      - '0'
      - '1'
      - '2'
      - '3'
      - '4'
      - '5'
      - '6'
      - '7'
      - '8'
      - '9'
      - ':'
      - ;
      - <
      - '='
      - '>'
      - '?'
      - '@'
      - A
      - B
      - C
      - D
      - E
      - F
      - G
      - H
      - I
      - J
      - K
      - L
      - M
      - N
      - O
      - P
      - Q
      - R
      - S
      - T
      - U
      - V
      - W
      - X
      - Y
      - Z
      - '['
      - \
      - ']'
      - ^
      - _
      - '`'
      - a
      - b
      - c
      - d
      - e
      - f
      - g
      - h
      - i
      - j
      - k
      - l
      - m
      - n
      - o
      - p
      - q
      - r
      - s
      - t
      - u
      - v
      - w
      - x
      - y
      - z
      - '{'
      - '|'
      - '}'
      - '~'
      - °
      - ·
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      url: https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/fonts/materialdesignicons-webfont.ttf
      weight: 400
      italic: false
      refresh: 1d
      type: web
    id: mdi_22
    size: 22
    bpp: 4
    glyphs:
      - 󰖩
      - 󰖪
      - 󰂚
      - 󰂛
      - 󰟤
      - 󰗶
      - 󰹦
      - 󰌪
      - 󰙪
      - 󰒓
      - 󰌾
      - 󰿆
      - 󰹇
      - 󰈐
      - 󰔏
      - 󰖎
      - 󰊚
      - 󰜗
      - 󰐸
      - 󱂙
      - 󱔌
      - 󱪯
      - 󰖨
      - 󱇜
      - 󰖝
      - 󰖔
      - 󰗠
      - 󰀨
      - 󱩷
      - 󰅃
      - 󰅀
      - 󰅂
      - 󰁍
      - 󱔊
      - 󰈸
      - 󱩅
      - 󰅐
      - 󰉄
      - 󰂯
      - 󰀂
      - 󰟐
      - 󰁹
      - 󰂄
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      url: https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/fonts/materialdesignicons-webfont.ttf
      weight: 400
      italic: false
      refresh: 1d
      type: web
    id: mdi_16
    size: 16
    bpp: 4
    glyphs:
      - 󰖩
      - 󰖪
      - 󰂚
      - 󰂛
      - 󰟤
      - 󰗶
      - 󰹦
      - 󰌪
      - 󰙪
      - 󰒓
      - 󰌾
      - 󰿆
      - 󰹇
      - 󰈐
      - 󰔏
      - 󰖎
      - 󰊚
      - 󰜗
      - 󰐸
      - 󱂙
      - 󱔌
      - 󱪯
      - 󰖨
      - 󱇜
      - 󰖝
      - 󰖔
      - 󰗠
      - 󰀨
      - 󱩷
      - 󰅃
      - 󰅀
      - 󰅂
      - 󰁍
      - 󱔊
      - 󰈸
      - 󱩅
      - 󰅐
      - 󰉄
      - 󰂯
      - 󰀂
      - 󰟐
      - 󰁹
      - 󰂄
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      url: https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/fonts/materialdesignicons-webfont.ttf
      weight: 400
      italic: false
      refresh: 1d
      type: web
    id: mdi_28
    size: 28
    bpp: 4
    glyphs:
      - 󰖩
      - 󰖪
      - 󰂚
      - 󰂛
      - 󰟤
      - 󰗶
      - 󰹦
      - 󰌪
      - 󰙪
      - 󰒓
      - 󰌾
      - 󰿆
      - 󰹇
      - 󰈐
      - 󰔏
      - 󰖎
      - 󰊚
      - 󰜗
      - 󰐸
      - 󱂙
      - 󱔌
      - 󱪯
      - 󰖨
      - 󱇜
      - 󰖝
      - 󰖔
      - 󰗠
      - 󰀨
      - 󱩷
      - 󰅃
      - 󰅀
      - 󰅂
      - 󰁍
      - 󱔊
      - 󰈸
      - 󱩅
      - 󰅐
      - 󰉄
      - 󰂯
      - 󰀂
      - 󰟐
      - 󰁹
      - 󰂄
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      url: https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/fonts/materialdesignicons-webfont.ttf
      weight: 400
      italic: false
      refresh: 1d
      type: web
    id: mdi_grow
    size: 62
    bpp: 4
    glyphs:
      - 󰹢
      - 󰹦
      - 󰌪
      - 󰎎
      - 󰉊
      - 󰌾
      - 󰿆
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
  - file:
      url: https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/fonts/materialdesignicons-webfont.ttf
      weight: 400
      italic: false
      refresh: 1d
      type: web
    id: mdi_34
    size: 34
    bpp: 4
    glyphs:
      - 󰖩
      - 󰖪
      - 󰂚
      - 󰂛
      - 󰟤
      - 󰗶
      - 󰹦
      - 󰌪
      - 󰙪
      - 󰒓
      - 󰌾
      - 󰿆
      - 󰹇
      - 󰈐
      - 󰔏
      - 󰖎
      - 󰊚
      - 󰜗
      - 󰐸
      - 󱂙
      - 󱔌
      - 󱪯
      - 󰖨
      - 󱇜
      - 󰖝
      - 󰖔
      - 󰗠
      - 󰀨
      - 󱩷
      - 󰅃
      - 󰅀
      - 󰅂
      - 󰁍
      - 󱔊
      - 󰈸
      - 󱩅
      - 󰅐
      - 󰉄
      - 󰂯
      - 󰀂
      - 󰟐
      - 󰁹
      - 󰂄
    glyphsets: []
    ignore_missing_glyphs: false
    extras: []
lvgl:
  - buffer_size: 0.12
    displays:
      - cyd_display
    touchscreens:
      - touchscreen_id: cyd_touch
        long_press_time: 400ms
        long_press_repeat_time: 100ms
    color_depth: 16
    default_font: f_body
    bg_color: 921878
    text_color: 16777215
    on_idle:
      - timeout: 60s
        then:
          - script.execute:
              id: go_sleep
    style_definitions:
      - id: card
        bg_color: 1514274
        bg_opa: 1.0
        border_color: 2304563
        border_width: 1
        radius: 8
        pad_all: 6
        text_color: 16777215
      - id: rowbtn
        bg_color: 1514274
        bg_opa: 1.0
        border_color: 2304563
        border_width: 1
        radius: 8
        pad_all: 8
        shadow_width: 0
        text_color: 16777215
        width: 300
    top_layer:
      widgets:
        - obj:
            id: tabbar
            x: 0
            y: 200
            width: 320
            height: 40
            bg_color: 658705
            bg_opa: 1.0
            border_width: 0
            radius: 0
            pad_all: 0
            scrollable: false
            widgets:
              - button:
                  id: tab_btn0
                  x: 0
                  y: 0
                  width: 64
                  height: 40
                  bg_opa: 0.0
                  border_width: 0
                  shadow_width: 0
                  radius: 0
                  widgets:
                    - label:
                        id: tab_ic0
                        text: 󰗶
                        text_font: mdi_28
                        align: LV_ALIGN_CENTER
                        text_color: 58998
                  on_click:
                    - then:
                        - lvgl.page.show:
                            id: page_pulse
                            animation: LV_SCREEN_LOAD_ANIM_NONE
                            time: 50ms
                        - lambda: !lambda |-
                            id(active_tab) = 0;
                        - script.execute:
                            id: restyle_tabs
              - button:
                  id: tab_btn1
                  x: 64
                  y: 0
                  width: 64
                  height: 40
                  bg_opa: 0.0
                  border_width: 0
                  shadow_width: 0
                  radius: 0
                  widgets:
                    - label:
                        id: tab_ic1
                        text: 󰹦
                        text_font: mdi_28
                        align: LV_ALIGN_CENTER
                        text_color: 5923954
                  on_click:
                    - then:
                        - lvgl.page.show:
                            id: page_clone
                            animation: LV_SCREEN_LOAD_ANIM_NONE
                            time: 50ms
                        - lambda: !lambda |-
                            id(active_tab) = 1;
                        - script.execute:
                            id: restyle_tabs
              - button:
                  id: tab_btn2
                  x: 128
                  y: 0
                  width: 64
                  height: 40
                  bg_opa: 0.0
                  border_width: 0
                  shadow_width: 0
                  radius: 0
                  widgets:
                    - label:
                        id: tab_ic2
                        text: 󰌪
                        text_font: mdi_28
                        align: LV_ALIGN_CENTER
                        text_color: 5923954
                  on_click:
                    - then:
                        - lvgl.page.show:
                            id: page_main
                            animation: LV_SCREEN_LOAD_ANIM_NONE
                            time: 50ms
                        - lambda: !lambda |-
                            id(active_tab) = 2;
                        - script.execute:
                            id: restyle_tabs
              - button:
                  id: tab_btn3
                  x: 192
                  y: 0
                  width: 64
                  height: 40
                  bg_opa: 0.0
                  border_width: 0
                  shadow_width: 0
                  radius: 0
                  widgets:
                    - label:
                        id: tab_ic3
                        text: 󰖎
                        text_font: mdi_28
                        align: LV_ALIGN_CENTER
                        text_color: 5923954
                  on_click:
                    - then:
                        - lvgl.page.show:
                            id: page_soil
                            animation: LV_SCREEN_LOAD_ANIM_NONE
                            time: 50ms
                        - lambda: !lambda |-
                            id(active_tab) = 3;
                        - script.execute:
                            id: restyle_tabs
              - button:
                  id: tab_btn4
                  x: 256
                  y: 0
                  width: 64
                  height: 40
                  bg_opa: 0.0
                  border_width: 0
                  shadow_width: 0
                  radius: 0
                  widgets:
                    - label:
                        id: tab_ic4
                        text: 󰙪
                        text_font: mdi_28
                        align: LV_ALIGN_CENTER
                        text_color: 5923954
                  on_click:
                    - then:
                        - lvgl.page.show:
                            id: page_control
                            animation: LV_SCREEN_LOAD_ANIM_NONE
                            time: 50ms
                        - lambda: !lambda |-
                            id(active_tab) = 4;
                        - script.execute:
                            id: restyle_tabs
        - button:
            id: btn_silence
            hidden: true
            x: 0
            y: 0
            width: 320
            height: 40
            bg_color: 16007990
            radius: 0
            shadow_width: 0
            widgets:
              - label:
                  text: 󰂛
                  text_font: mdi_22
                  align: LV_ALIGN_CENTER
                  x: -84
                  text_color: 16777215
              - label:
                  text: SILENCE ALERT
                  text_font: f_med
                  align: LV_ALIGN_CENTER
                  x: 14
                  text_color: 16777215
            on_click:
              - then:
                  - lambda: !lambda |-
                      id(alerts_silenced) = true;
                  - script.execute:
                      id: refresh_ui
        - obj:
            id: saver
            hidden: true
            x: 0
            y: 0
            width: 320
            height: 240
            bg_color: 395275
            bg_opa: 1.0
            border_width: 0
            radius: 0
            widgets:
              - label:
                  id: saver_clock
                  text: --:--
                  text_font: f_big
                  align: LV_ALIGN_CENTER
                  y: -14
                  text_color: 3046736
              - label:
                  id: saver_status
                  text: DSC-HUB
                  text_font: f_small
                  align: LV_ALIGN_CENTER
                  y: 22
                  text_color: 3818832
            on_click:
              - then:
                  - script.execute:
                      id: wake_panel
        - obj:
            id: editor
            hidden: true
            x: 0
            y: 0
            width: 320
            height: 240
            bg_color: 0
            bg_opa: 0.6
            border_width: 0
            radius: 0
            widgets:
              - obj:
                  align: LV_ALIGN_CENTER
                  width: 280
                  height: 190
                  bg_color: 1514274
                  bg_opa: 1.0
                  border_color: 58998
                  border_width: 1
                  radius: 10
                  pad_all: 10
                  widgets:
                    - label:
                        id: ed_title
                        text: Grow Stage
                        text_font: f_med
                        align: LV_ALIGN_TOP_LEFT
                        text_color: 58998
                    - roller:
                        id: ed_roller
                        align: LV_ALIGN_TOP_MID
                        y: 30
                        width: 250
                        visible_row_count: 3
                        options:
                          - Germination
                          - Vegetative
                          - Flowering
                        bg_color: 921878
                        text_color: 16777215
                        text_font: f_body
                    - button:
                        id: ed_cancel
                        align: LV_ALIGN_BOTTOM_LEFT
                        width: 118
                        height: 38
                        bg_color: 2765115
                        radius: 8
                        shadow_width: 0
                        widgets:
                          - label:
                              text: Cancel
                              align: LV_ALIGN_CENTER
                              text_color: 16777215
                              text_font: f_body
                        on_click:
                          - then:
                              - lambda: !lambda |-
                                  lv_obj_add_flag(id(editor), LV_OBJ_FLAG_HIDDEN);
                    - button:
                        id: ed_apply
                        align: LV_ALIGN_BOTTOM_RIGHT
                        width: 118
                        height: 38
                        bg_color: 1188890
                        border_color: 58998
                        border_width: 1
                        radius: 8
                        shadow_width: 0
                        widgets:
                          - label:
                              text: Apply
                              align: LV_ALIGN_CENTER
                              text_color: 58998
                              text_font: f_body
                        on_click:
                          - then:
                              - script.execute:
                                  id: apply_editor
        - obj:
            id: confirm_takeover
            hidden: true
            x: 0
            y: 0
            width: 320
            height: 240
            bg_color: 0
            bg_opa: 0.6
            border_width: 0
            widgets:
              - obj:
                  align: LV_ALIGN_CENTER
                  width: 280
                  height: 150
                  bg_color: 1514274
                  bg_opa: 1.0
                  border_color: 16755200
                  border_width: 1
                  radius: 10
                  pad_all: 12
                  widgets:
                    - label:
                        text: Manual Takeover
                        text_font: f_med
                        align: LV_ALIGN_TOP_MID
                        text_color: 16755200
                    - label:
                        text: 'You will drive every output

                          from HA. Safety stays armed.'
                        text_font: f_small
                        align: LV_ALIGN_TOP_MID
                        y: 30
                        text_color: 12633804
                        text_align: LV_TEXT_ALIGN_CENTER
                    - button:
                        align: LV_ALIGN_BOTTOM_LEFT
                        width: 118
                        height: 38
                        bg_color: 2765115
                        radius: 8
                        shadow_width: 0
                        widgets:
                          - label:
                              text: Cancel
                              align: LV_ALIGN_CENTER
                              text_color: 16777215
                              text_font: f_body
                        on_click:
                          - then:
                              - lambda: !lambda |-
                                  lv_obj_add_flag(id(confirm_takeover), LV_OBJ_FLAG_HIDDEN);
                    - button:
                        align: LV_ALIGN_BOTTOM_RIGHT
                        width: 118
                        height: 38
                        bg_color: 3811858
                        border_color: 16755200
                        border_width: 1
                        radius: 8
                        shadow_width: 0
                        widgets:
                          - label:
                              text: Engage
                              align: LV_ALIGN_CENTER
                              text_color: 16755200
                              text_font: f_body
                        on_click:
                          - then:
                              - script.execute:
                                  id: hub_cmd
                                  op: 5
                                  val: !lambda |-
                                    return id(st_takeover).state ? 0 : 1;
                              - lambda: !lambda |-
                                  lv_obj_add_flag(id(confirm_takeover), LV_OBJ_FLAG_HIDDEN);
        - obj:
            id: fl_screen
            hidden: true
            x: 0
            y: 0
            width: 320
            height: 240
            bg_color: 395275
            bg_opa: 1.0
            border_width: 0
            radius: 0
            pad_all: 0
            scrollable: false
            widgets:
              - label:
                  id: fl_title
                  text: TORCH
                  text_font: f_med
                  align: LV_ALIGN_TOP_LEFT
                  x: 16
                  y: 12
                  text_color: 16777215
              - label:
                  text: onboard LED
                  text_font: f_small
                  align: LV_ALIGN_TOP_LEFT
                  x: 16
                  y: 36
                  text_color: 9081500
              - button:
                  id: fl_onoff
                  align: LV_ALIGN_TOP_RIGHT
                  x: -12
                  y: 10
                  width: 92
                  height: 38
                  bg_color: 1188890
                  border_color: 58998
                  border_width: 1
                  radius: 8
                  shadow_width: 0
                  widgets:
                    - label:
                        id: fl_onoff_lbl
                        text: 'ON'
                        text_font: f_med
                        align: LV_ALIGN_CENTER
                        text_color: 58998
                  on_click:
                    - then:
                        - lambda: !lambda |-
                            id(fl_active) = !id(fl_active);
                        - script.execute:
                            id: apply_flashlight
              - obj:
                  id: fl_dot
                  align: LV_ALIGN_TOP_MID
                  y: 52
                  width: 54
                  height: 54
                  bg_color: 65280
                  bg_opa: 1.0
                  radius: 27
                  border_width: 0
                  scrollable: false
              - label:
                  id: fl_pct
                  text: 70%
                  text_font: f_med
                  align: LV_ALIGN_TOP_MID
                  y: 112
                  text_color: 16777215
              - button:
                  id: fl_bg
                  align: LV_ALIGN_TOP_MID
                  x: -62
                  y: 138
                  width: 54
                  height: 32
                  bg_color: 932374
                  border_color: 58998
                  border_width: 3
                  radius: 8
                  shadow_width: 0
                  widgets:
                    - label:
                        text: G
                        text_font: f_med
                        align: LV_ALIGN_CENTER
                        text_color: 58998
                  on_click:
                    - then:
                        - lambda: !lambda |-
                            id(fl_color) = 0;
                        - script.execute:
                            id: apply_flashlight
              - button:
                  id: fl_bw
                  align: LV_ALIGN_TOP_MID
                  x: 0
                  y: 138
                  width: 54
                  height: 32
                  bg_color: 2765115
                  border_color: 16777215
                  border_width: 1
                  radius: 8
                  shadow_width: 0
                  widgets:
                    - label:
                        text: W
                        text_font: f_med
                        align: LV_ALIGN_CENTER
                        text_color: 16777215
                  on_click:
                    - then:
                        - lambda: !lambda |-
                            id(fl_color) = 1;
                        - script.execute:
                            id: apply_flashlight
              - button:
                  id: fl_br
                  align: LV_ALIGN_TOP_MID
                  x: 62
                  y: 138
                  width: 54
                  height: 32
                  bg_color: 3805714
                  border_color: 16007990
                  border_width: 1
                  radius: 8
                  shadow_width: 0
                  widgets:
                    - label:
                        text: R
                        text_font: f_med
                        align: LV_ALIGN_CENTER
                        text_color: 16007990
                  on_click:
                    - then:
                        - lambda: !lambda |-
                            id(fl_color) = 2;
                        - script.execute:
                            id: apply_flashlight
              - button:
                  id: fl_dn
                  align: LV_ALIGN_TOP_MID
                  x: -128
                  y: 178
                  width: 34
                  height: 30
                  bg_color: 2765115
                  radius: 8
                  shadow_width: 0
                  widgets:
                    - label:
                        text: '-'
                        text_font: f_med
                        align: LV_ALIGN_CENTER
                        text_color: 16777215
                  on_click:
                    - then:
                        - lambda: !lambda |-
                            id(fl_bright) -= 10; if (id(fl_bright) < 10) id(fl_bright) = 10;
                        - script.execute:
                            id: apply_flashlight
              - bar:
                  id: fl_bar
                  align: LV_ALIGN_TOP_MID
                  x: 0
                  y: 187
                  width: 168
                  height: 10
                  min_value: 0
                  max_value: 100
                  value: 70
                  indicator:
                    bg_color: 58998
                  bg_color: 2304563
                  animated: LV_ANIM_ON
              - button:
                  id: fl_up
                  align: LV_ALIGN_TOP_MID
                  x: 128
                  y: 178
                  width: 34
                  height: 30
                  bg_color: 2765115
                  radius: 8
                  shadow_width: 0
                  widgets:
                    - label:
                        text: +
                        text_font: f_med
                        align: LV_ALIGN_CENTER
                        text_color: 16777215
                  on_click:
                    - then:
                        - lambda: !lambda |-
                            id(fl_bright) += 10; if (id(fl_bright) > 100) id(fl_bright) = 100;
                        - script.execute:
                            id: apply_flashlight
              - button:
                  id: fl_close
                  align: LV_ALIGN_BOTTOM_MID
                  y: -6
                  width: 150
                  height: 28
                  bg_color: 1514274
                  border_color: 9081500
                  border_width: 1
                  radius: 8
                  shadow_width: 0
                  widgets:
                    - label:
                        text: CLOSE
                        text_font: f_body
                        align: LV_ALIGN_CENTER
                        text_color: 16777215
                  on_click:
                    - then:
                        - script.execute:
                            id: close_flashlight
        - button:
            id: lock_overlay
            hidden: true
            x: 0
            y: 0
            width: 320
            height: 240
            bg_color: 0
            bg_opa: 1.0
            border_width: 0
            radius: 0
            shadow_width: 0
            pad_all: 0
            widgets:
              - label:
                  id: lock_clock
                  text: --:--
                  text_font: f_big
                  align: LV_ALIGN_TOP_MID
                  y: 22
                  text_color: 16777215
              - label:
                  text: ASLEEP
                  text_font: f_small
                  align: LV_ALIGN_TOP_MID
                  y: 60
                  text_color: 5923954
              - label:
                  id: lk_fan
                  text: 󰈐
                  text_font: mdi_34
                  align: LV_ALIGN_CENTER
                  x: -125
                  y: 4
                  text_color: 2763306
              - label:
                  id: lk_int
                  text: 󱇜
                  text_font: mdi_34
                  align: LV_ALIGN_CENTER
                  x: -75
                  y: 4
                  text_color: 2763306
              - label:
                  id: lk_heat
                  text: 󰈸
                  text_font: mdi_34
                  align: LV_ALIGN_CENTER
                  x: -25
                  y: 4
                  text_color: 2763306
              - label:
                  id: lk_hum
                  text: 󱂙
                  text_font: mdi_34
                  align: LV_ALIGN_CENTER
                  x: 25
                  y: 4
                  text_color: 2763306
              - label:
                  id: lk_deh
                  text: 󱔌
                  text_font: mdi_34
                  align: LV_ALIGN_CENTER
                  x: 75
                  y: 4
                  text_color: 2763306
              - label:
                  id: lk_light
                  text: 󰖨
                  text_font: mdi_34
                  align: LV_ALIGN_CENTER
                  x: 125
                  y: 4
                  text_color: 2763306
              - label:
                  id: lock_hint
                  text: hold anywhere to wake
                  text_font: f_small
                  align: LV_ALIGN_BOTTOM_MID
                  y: -26
                  text_color: 5923954
              - label:
                  text: 󰌾
                  text_font: mdi_22
                  align: LV_ALIGN_BOTTOM_MID
                  y: -4
                  text_color: 3818832
            on_press:
              - then:
                  - script.execute:
                      id: hold_begin
            on_pressing:
              - then:
                  - script.execute:
                      id: hold_tick
            on_release:
              - then:
                  - script.execute:
                      id: hold_cancel
        - obj:
            id: hold_hud
            hidden: true
            x: 0
            y: 0
            width: 320
            height: 240
            bg_color: 0
            bg_opa: 0.72
            border_width: 0
            radius: 0
            scrollable: false
            widgets:
              - label:
                  id: hud_sky
                  text: 󰖔
                  text_font: mdi_28
                  align: LV_ALIGN_CENTER
                  y: -86
                  text_color: 5923954
              - label:
                  id: hud_plant
                  text: 󰹢
                  text_font: mdi_grow
                  align: LV_ALIGN_CENTER
                  y: -18
                  text_color: 58998
              - label:
                  id: hud_hint
                  text: GOING TO SLEEP
                  text_font: f_med
                  align: LV_ALIGN_CENTER
                  y: 46
                  text_color: 16777215
              - bar:
                  id: hud_bar
                  align: LV_ALIGN_CENTER
                  y: 74
                  width: 200
                  height: 8
                  min_value: 0
                  max_value: 100
                  value: 0
                  indicator:
                    bg_color: 58998
                  bg_color: 2304563
                  animated: LV_ANIM_ON
        - obj:
            id: conn_screen
            hidden: true
            x: 0
            y: 0
            width: 320
            height: 240
            bg_color: 395275
            bg_opa: 1.0
            border_width: 0
            radius: 0
            pad_all: 0
            scrollable: false
            widgets:
              - label:
                  text: 󰖩
                  text_font: mdi_22
                  align: LV_ALIGN_TOP_LEFT
                  x: 12
                  y: 12
                  text_color: 58998
              - label:
                  text: CONNECTIONS
                  text_font: f_med
                  align: LV_ALIGN_TOP_LEFT
                  x: 44
                  y: 14
                  text_color: 16777215
              - button:
                  id: conn_close
                  align: LV_ALIGN_TOP_RIGHT
                  x: -8
                  y: 8
                  width: 66
                  height: 30
                  bg_color: 1514274
                  border_color: 9081500
                  border_width: 1
                  radius: 8
                  shadow_width: 0
                  widgets:
                    - label:
                        text: CLOSE
                        text_font: f_small
                        align: LV_ALIGN_CENTER
                        text_color: 16777215
                  on_click:
                    - then:
                        - script.execute:
                            id: close_connections
              - obj:
                  x: 10
                  y: 44
                  width: 300
                  height: 42
                  bg_color: 921878
                  border_color: 2304563
                  border_width: 1
                  radius: 8
                  pad_all: 6
                  scrollable: false
                  widgets:
                    - label:
                        id: conn_wifi_ic
                        text: 󰖩
                        text_font: mdi_22
                        align: LV_ALIGN_LEFT_MID
                        x: 2
                        text_color: 58998
                    - label:
                        text: Wi-Fi
                        text_font: f_body
                        align: LV_ALIGN_TOP_LEFT
                        x: 36
                        y: 0
                        text_color: 16777215
                    - label:
                        id: conn_wifi_sub
                        text: —
                        text_font: f_small
                        align: LV_ALIGN_BOTTOM_LEFT
                        x: 36
                        y: 0
                        width: 180
                        long_mode: LV_LABEL_LONG_SCROLL_CIRCULAR
                        text_color: 9081500
                    - label:
                        id: conn_wifi_up
                        text: 0s
                        text_font: f_body
                        align: LV_ALIGN_RIGHT_MID
                        x: -2
                        text_color: 58998
              - obj:
                  x: 10
                  y: 90
                  width: 300
                  height: 42
                  bg_color: 921878
                  border_color: 2304563
                  border_width: 1
                  radius: 8
                  pad_all: 6
                  scrollable: false
                  widgets:
                    - label:
                        id: conn_api_ic
                        text: 󰟐
                        text_font: mdi_22
                        align: LV_ALIGN_LEFT_MID
                        x: 2
                        text_color: 58998
                    - label:
                        text: Home Assistant
                        text_font: f_body
                        align: LV_ALIGN_TOP_LEFT
                        x: 36
                        y: 0
                        text_color: 16777215
                    - label:
                        id: conn_api_sub
                        text: —
                        text_font: f_small
                        align: LV_ALIGN_BOTTOM_LEFT
                        x: 36
                        y: 0
                        text_color: 9081500
                    - label:
                        id: conn_api_up
                        text: 0s
                        text_font: f_body
                        align: LV_ALIGN_RIGHT_MID
                        x: -2
                        text_color: 58998
              - obj:
                  x: 10
                  y: 136
                  width: 300
                  height: 42
                  bg_color: 921878
                  border_color: 2304563
                  border_width: 1
                  radius: 8
                  pad_all: 6
                  scrollable: false
                  widgets:
                    - label:
                        text: 󰂯
                        text_font: mdi_22
                        align: LV_ALIGN_LEFT_MID
                        x: 2
                        text_color: 3818832
                    - label:
                        text: Bluetooth
                        text_font: f_body
                        align: LV_ALIGN_TOP_LEFT
                        x: 36
                        y: 0
                        text_color: 12633804
                    - label:
                        text: radio off
                        text_font: f_small
                        align: LV_ALIGN_BOTTOM_LEFT
                        x: 36
                        y: 0
                        text_color: 5923954
                    - label:
                        text: —
                        text_font: f_body
                        align: LV_ALIGN_RIGHT_MID
                        x: -2
                        text_color: 5923954
              - obj:
                  x: 10
                  y: 182
                  width: 300
                  height: 42
                  bg_color: 921878
                  border_color: 2304563
                  border_width: 1
                  radius: 8
                  pad_all: 6
                  scrollable: false
                  widgets:
                    - label:
                        text: 󰀂
                        text_font: mdi_22
                        align: LV_ALIGN_LEFT_MID
                        x: 2
                        text_color: 3818832
                    - label:
                        text: ESP-NOW
                        text_font: f_body
                        align: LV_ALIGN_TOP_LEFT
                        x: 36
                        y: 0
                        text_color: 12633804
                    - label:
                        text: arrives with hub firmware
                        text_font: f_small
                        align: LV_ALIGN_BOTTOM_LEFT
                        x: 36
                        y: 0
                        text_color: 5923954
                    - label:
                        text: —
                        text_font: f_body
                        align: LV_ALIGN_RIGHT_MID
                        x: -2
                        text_color: 5923954
    pages:
      - id: page_pulse
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        on_swipe_left:
          - then:
              - script.execute:
                  id: tab_next
        on_swipe_right:
          - then:
              - script.execute:
                  id: tab_prev
        on_swipe_down:
          - then:
              - script.execute:
                  id: open_flashlight
        widgets:
          - label:
              id: pill_wifi_ic
              text: 󰖩
              text_font: mdi_16
              align: LV_ALIGN_TOP_LEFT
              x: 12
              y: 10
              text_color: 58998
          - button:
              id: pill_wifi_btn
              x: 6
              y: 4
              width: 34
              height: 30
              bg_opa: 0.0
              border_width: 0
              shadow_width: 0
              radius: 0
              on_click:
                - then:
                    - script.execute:
                        id: open_connections
          - label:
              id: pill_bell_ic
              text: 󰂚
              text_font: mdi_16
              align: LV_ALIGN_TOP_LEFT
              x: 46
              y: 10
              text_color: 5923954
          - label:
              id: pill_alert_ct
              text: '0'
              text_font: f_small
              align: LV_ALIGN_TOP_LEFT
              x: 68
              y: 12
              text_color: 5923954
          - label:
              id: pill_batt_ic
              hidden: true
              text: 󰁹
              text_font: mdi_16
              align: LV_ALIGN_TOP_LEFT
              x: 92
              y: 10
              text_color: 58998
          - label:
              id: pill_batt_pct
              hidden: true
              text: --
              text_font: f_small
              align: LV_ALIGN_TOP_LEFT
              x: 112
              y: 12
              text_color: 58998
          - label:
              id: lbl_co2
              text: CO2 --- ppm
              text_font: f_body
              align: LV_ALIGN_TOP_RIGHT
              x: -12
              y: 11
              text_color: 12633804
          - obj:
              id: card2x4
              x: 8
              y: 40
              width: 98
              height: 52
              styles:
                - card
              scrollable: false
              widgets:
                - label:
                    text: 2x4
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    text_color: 9081500
                - label:
                    id: lbl_2x4
                    text: --
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 16777215
          - obj:
              id: card4x8
              x: 111
              y: 40
              width: 98
              height: 52
              styles:
                - card
              scrollable: false
              widgets:
                - label:
                    text: 4x8
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    text_color: 9081500
                - label:
                    id: lbl_4x8
                    text: --
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 16777215
          - obj:
              id: cardroom
              x: 214
              y: 40
              width: 98
              height: 52
              styles:
                - card
              scrollable: false
              widgets:
                - label:
                    text: ROOM
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    text_color: 9081500
                - label:
                    id: lbl_room
                    text: --
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 16777215
          - label:
              text: ESCALATION LADDER
              text_font: f_small
              align: LV_ALIGN_TOP_LEFT
              x: 10
              y: 98
              text_color: 9081500
          - obj:
              id: rung1
              x: 8
              y: 114
              width: 150
              height: 46
              styles:
                - card
              border_color: 48340
              scrollable: false
              widgets:
                - label:
                    text: Rung 1 · Fans
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    text_color: 9081500
                - label:
                    id: lbl_rung1
                    text: --
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 48340
          - obj:
              id: rung2
              x: 162
              y: 114
              width: 150
              height: 46
              styles:
                - card
              scrollable: false
              widgets:
                - label:
                    text: Rung 2 · Appliances
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    text_color: 9081500
                - label:
                    id: lbl_rung2
                    text: standing by
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 5923954
          - obj:
              id: alert_strip
              x: 8
              y: 164
              width: 304
              height: 32
              styles:
                - card
              border_color: 1980971
              scrollable: false
              widgets:
                - label:
                    id: alert_ic
                    text: 󰗠
                    text_font: mdi_16
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    text_color: 58998
                - label:
                    id: lbl_alert
                    text: all clear · nothing needs attention
                    text_font: f_body
                    align: LV_ALIGN_LEFT_MID
                    x: 28
                    text_color: 12633804
                - button:
                    id: btn_mute
                    hidden: true
                    align: LV_ALIGN_RIGHT_MID
                    x: -4
                    width: 60
                    height: 24
                    bg_color: 2765115
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          id: lbl_mute
                          text: mute
                          align: LV_ALIGN_CENTER
                          text_font: f_small
                          text_color: 16777215
                    on_click:
                      - then:
                          - lambda: !lambda |-
                              id(alerts_silenced) = !id(alerts_silenced);
                          - script.execute:
                              id: refresh_ui
        skip: false
      - id: page_clone
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        on_swipe_left:
          - then:
              - script.execute:
                  id: tab_next
        on_swipe_right:
          - then:
              - script.execute:
                  id: tab_prev
        widgets:
          - obj:
              id: clone_scroll
              x: 0
              y: 0
              width: 320
              height: 240
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              widgets:
                - label:
                    text: 2x4 CLONE
                    text_font: f_title
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 8
                    text_color: 16777215
                - label:
                    id: clone_hdr_note
                    text: ''
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    x: 150
                    y: 15
                    text_color: 9081500
                - label:
                    text: 󰔏
                    text_font: mdi_16
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 44
                    text_color: 12633804
                - label:
                    text: Air temp
                    text_font: f_body
                    align: LV_ALIGN_TOP_LEFT
                    x: 34
                    y: 45
                    text_color: 12633804
                - label:
                    id: clv_temp_val
                    text: --
                    text_font: f_med
                    align: LV_ALIGN_TOP_RIGHT
                    x: -12
                    y: 42
                    text_color: 58998
                - bar:
                    id: clv_temp_bar
                    x: 12
                    y: 66
                    width: 296
                    height: 8
                    min_value: 10
                    max_value: 35
                    value: 22
                    indicator:
                      bg_color: 58998
                    bg_color: 2304563
                    animated: LV_ANIM_ON
                - label:
                    text: 󰖎
                    text_font: mdi_16
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 96
                    text_color: 12633804
                - label:
                    text: RH
                    text_font: f_body
                    align: LV_ALIGN_TOP_LEFT
                    x: 34
                    y: 97
                    text_color: 12633804
                - label:
                    id: clv_rh_val
                    text: --
                    text_font: f_med
                    align: LV_ALIGN_TOP_RIGHT
                    x: -12
                    y: 94
                    text_color: 58998
                - bar:
                    id: clv_rh_bar
                    x: 12
                    y: 118
                    width: 296
                    height: 8
                    min_value: 0
                    max_value: 100
                    value: 60
                    indicator:
                      bg_color: 58998
                    bg_color: 2304563
                    animated: LV_ANIM_ON
                - label:
                    text: 󰊚
                    text_font: mdi_16
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 148
                    text_color: 12633804
                - label:
                    text: VPD
                    text_font: f_body
                    align: LV_ALIGN_TOP_LEFT
                    x: 34
                    y: 149
                    text_color: 12633804
                - label:
                    id: clv_vpd_val
                    text: --
                    text_font: f_med
                    align: LV_ALIGN_TOP_RIGHT
                    x: -12
                    y: 146
                    text_color: 58998
                - bar:
                    id: clv_vpd_bar
                    x: 12
                    y: 170
                    width: 296
                    height: 8
                    min_value: 0
                    max_value: 200
                    value: 100
                    indicator:
                      bg_color: 58998
                    bg_color: 2304563
                    animated: LV_ANIM_ON
                - label:
                    text: DEVICES
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 202
                    text_color: 9081500
                - obj:
                    id: cdev_sf
                    x: 8
                    y: 222
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          id: ic_csf
                          text: 󰖨
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: SF1000 light
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: sf1000_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 29
                                    val: !lambda |-
                                      int v = isnan(id(sf_target).state) ? 0 : (int) id(sf_target).state; v -= 5; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 29
                                    val: !lambda |-
                                      int v = isnan(id(sf_target).state) ? 0 : (int) id(sf_target).state; v += 5; if (v > 100) v = 100; return (int)lroundf((float)v * 1);
                - obj:
                    id: cdev_int
                    x: 8
                    y: 268
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          id: ic_cint
                          text: 󰈐
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: 2x4 intake fan
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: fanclone_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 28
                                    val: !lambda |-
                                      int v = isnan(id(fan_int_clone_pct).state) ? 0 : (int) id(fan_int_clone_pct).state; v -= 10; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 28
                                    val: !lambda |-
                                      int v = isnan(id(fan_int_clone_pct).state) ? 0 : (int) id(fan_int_clone_pct).state; v += 10; if (v > 100) v = 100; return (int)lroundf((float)v * 1);
                - button:
                    id: cdev_hum
                    x: 8
                    y: 314
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          id: ic_chum
                          text: 󱂙
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: Clone humidifier
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: dem_clone_hum_st
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 17
                              val: !lambda |-
                                return id(dem_clone_hum).state ? 0 : 1;
                - button:
                    id: cdev_mat
                    x: 8
                    y: 360
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          id: ic_cmat
                          text: 󱪯
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: Grow mat
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: dem_mat_st
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 15
                              val: !lambda |-
                                return id(dem_mat).state ? 0 : 1;
                - label:
                    text: ' '
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    x: 4
                    y: 408
        skip: false
      - id: page_main
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        on_swipe_left:
          - then:
              - script.execute:
                  id: tab_next
        on_swipe_right:
          - then:
              - script.execute:
                  id: tab_prev
        widgets:
          - obj:
              id: main_scroll
              x: 0
              y: 0
              width: 320
              height: 240
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              widgets:
                - label:
                    text: 4x8 MAIN
                    text_font: f_title
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 8
                    text_color: 16777215
                - label:
                    text: · no lamp fitted
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    x: 150
                    y: 15
                    text_color: 9081500
                - label:
                    text: 󰔏
                    text_font: mdi_16
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 44
                    text_color: 12633804
                - label:
                    text: Air temp
                    text_font: f_body
                    align: LV_ALIGN_TOP_LEFT
                    x: 34
                    y: 45
                    text_color: 12633804
                - label:
                    id: mnv_temp_val
                    text: --
                    text_font: f_med
                    align: LV_ALIGN_TOP_RIGHT
                    x: -12
                    y: 42
                    text_color: 58998
                - bar:
                    id: mnv_temp_bar
                    x: 12
                    y: 66
                    width: 296
                    height: 8
                    min_value: 10
                    max_value: 35
                    value: 22
                    indicator:
                      bg_color: 58998
                    bg_color: 2304563
                    animated: LV_ANIM_ON
                - label:
                    text: 󰖎
                    text_font: mdi_16
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 96
                    text_color: 12633804
                - label:
                    text: RH
                    text_font: f_body
                    align: LV_ALIGN_TOP_LEFT
                    x: 34
                    y: 97
                    text_color: 12633804
                - label:
                    id: mnv_rh_val
                    text: --
                    text_font: f_med
                    align: LV_ALIGN_TOP_RIGHT
                    x: -12
                    y: 94
                    text_color: 58998
                - bar:
                    id: mnv_rh_bar
                    x: 12
                    y: 118
                    width: 296
                    height: 8
                    min_value: 0
                    max_value: 100
                    value: 60
                    indicator:
                      bg_color: 58998
                    bg_color: 2304563
                    animated: LV_ANIM_ON
                - label:
                    text: 󰊚
                    text_font: mdi_16
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 148
                    text_color: 12633804
                - label:
                    text: VPD
                    text_font: f_body
                    align: LV_ALIGN_TOP_LEFT
                    x: 34
                    y: 149
                    text_color: 12633804
                - label:
                    id: mnv_vpd_val
                    text: --
                    text_font: f_med
                    align: LV_ALIGN_TOP_RIGHT
                    x: -12
                    y: 146
                    text_color: 58998
                - bar:
                    id: mnv_vpd_bar
                    x: 12
                    y: 170
                    width: 296
                    height: 8
                    min_value: 0
                    max_value: 200
                    value: 100
                    indicator:
                      bg_color: 58998
                    bg_color: 2304563
                    animated: LV_ANIM_ON
                - label:
                    text: DEVICES
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    x: 12
                    y: 202
                    text_color: 9081500
                - obj:
                    id: mdev_out
                    x: 8
                    y: 222
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          id: ic_mout
                          text: 󰈐
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: 6" exhaust (out)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: exhout_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 25
                                    val: !lambda |-
                                      int v = isnan(id(fan_out_pct).state) ? 0 : (int) id(fan_out_pct).state; v -= 10; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 25
                                    val: !lambda |-
                                      int v = isnan(id(fan_out_pct).state) ? 0 : (int) id(fan_out_pct).state; v += 10; if (v > 100) v = 100; return (int)lroundf((float)v * 1);
                - obj:
                    id: mdev_room
                    x: 8
                    y: 268
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          id: ic_mroom
                          text: 󰈐
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: 6" exhaust (room)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: exhroom_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 26
                                    val: !lambda |-
                                      int v = isnan(id(fan_recirc_pct).state) ? 0 : (int) id(fan_recirc_pct).state; v -= 10; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 26
                                    val: !lambda |-
                                      int v = isnan(id(fan_recirc_pct).state) ? 0 : (int) id(fan_recirc_pct).state; v += 10; if (v > 100) v = 100; return (int)lroundf((float)v * 1);
                - obj:
                    id: mdev_intm
                    x: 8
                    y: 314
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          id: ic_mint
                          text: 󱇜
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: 4" intake (main)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: intmain_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 27
                                    val: !lambda |-
                                      int v = isnan(id(fan_int_main_pct).state) ? 0 : (int) id(fan_int_main_pct).state; v -= 10; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 27
                                    val: !lambda |-
                                      int v = isnan(id(fan_int_main_pct).state) ? 0 : (int) id(fan_int_main_pct).state; v += 10; if (v > 100) v = 100; return (int)lroundf((float)v * 1);
                - button:
                    id: mdev_heat
                    x: 8
                    y: 360
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          id: ic_mheat
                          text: 󰈸
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: Heater
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: dem_heater_st
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 14
                              val: !lambda |-
                                return id(dem_heater).state ? 0 : 1;
                - button:
                    id: mdev_ac
                    x: 8
                    y: 406
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          id: ic_mac
                          text: 󰜗
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: AC
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: dem_ac_st
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 16
                              val: !lambda |-
                                return id(dem_ac).state ? 0 : 1;
                - button:
                    id: mdev_hum
                    x: 8
                    y: 452
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          id: ic_mhum
                          text: 󱂙
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: Humidifier
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: dem_hum_st
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 12
                              val: !lambda |-
                                return id(dem_hum).state ? 0 : 1;
                - button:
                    id: mdev_dehum
                    x: 8
                    y: 498
                    width: 304
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          id: ic_mdeh
                          text: 󱔌
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 5923954
                      - label:
                          text: Dehumidifier
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          id: dem_dehum_st
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 13
                              val: !lambda |-
                                return id(dem_dehum).state ? 0 : 1;
                - label:
                    text: ' '
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    x: 4
                    y: 546
        skip: false
      - id: page_soil
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        on_swipe_left:
          - then:
              - script.execute:
                  id: tab_next
        on_swipe_right:
          - then:
              - script.execute:
                  id: tab_prev
        on_swipe_down:
          - then:
              - script.execute:
                  id: open_flashlight
        widgets:
          - label:
              text: SOIL · ROOT ZONE
              text_font: f_small
              align: LV_ALIGN_TOP_LEFT
              x: 12
              y: 7
              text_color: 9081500
          - obj:
              id: card_p1
              x: 8
              y: 26
              width: 304
              height: 40
              styles:
                - card
              scrollable: false
              widgets:
                - label:
                    id: lbl_p1_name
                    text: P1
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    width: 184
                    long_mode: LV_LABEL_LONG_SCROLL_CIRCULAR
                    text_color: 16777215
                - label:
                    id: lbl_p1_npk
                    text: N/P/K --
                    text_font: f_small
                    align: LV_ALIGN_TOP_RIGHT
                    text_color: 9081500
                - label:
                    id: lbl_p1_vals
                    text: --
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 58998
          - obj:
              id: card_p2
              x: 8
              y: 70
              width: 304
              height: 40
              styles:
                - card
              scrollable: false
              widgets:
                - label:
                    id: lbl_p2_name
                    text: P2
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    width: 184
                    long_mode: LV_LABEL_LONG_SCROLL_CIRCULAR
                    text_color: 16777215
                - label:
                    id: lbl_p2_npk
                    text: N/P/K --
                    text_font: f_small
                    align: LV_ALIGN_TOP_RIGHT
                    text_color: 9081500
                - label:
                    id: lbl_p2_vals
                    text: --
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 58998
          - obj:
              id: card_p3
              x: 8
              y: 114
              width: 304
              height: 40
              styles:
                - card
              scrollable: false
              widgets:
                - label:
                    id: lbl_p3_name
                    text: P3
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    width: 184
                    long_mode: LV_LABEL_LONG_SCROLL_CIRCULAR
                    text_color: 16777215
                - label:
                    id: lbl_p3_npk
                    text: N/P/K --
                    text_font: f_small
                    align: LV_ALIGN_TOP_RIGHT
                    text_color: 9081500
                - label:
                    id: lbl_p3_vals
                    text: --
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 58998
          - obj:
              id: card_p4
              x: 8
              y: 158
              width: 304
              height: 40
              styles:
                - card
              scrollable: false
              widgets:
                - label:
                    id: lbl_p4_name
                    text: P4
                    text_font: f_small
                    align: LV_ALIGN_TOP_LEFT
                    width: 184
                    long_mode: LV_LABEL_LONG_SCROLL_CIRCULAR
                    text_color: 16777215
                - label:
                    id: lbl_p4_npk
                    text: N/P/K --
                    text_font: f_small
                    align: LV_ALIGN_TOP_RIGHT
                    text_color: 9081500
                - label:
                    id: lbl_p4_vals
                    text: --
                    text_font: f_body
                    align: LV_ALIGN_BOTTOM_LEFT
                    text_color: 58998
        skip: false
      - id: page_control
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        on_swipe_left:
          - then:
              - script.execute:
                  id: tab_next
        on_swipe_right:
          - then:
              - script.execute:
                  id: tab_prev
        widgets:
          - obj:
              id: ctrl_scroll
              x: 0
              y: 0
              width: 320
              height: 240
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 10
              pad_bottom: 48
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - label:
                    text: SETTINGS
                    text_font: f_small
                    text_color: 9081500
                    pad_top: 2
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰒓
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: Modes & Automation
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: Auto, takeover, switches
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_modes
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰹦
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: Grow Profile
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: Stage, strategy, clone
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_profile
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰔏
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: Main Climate  4x8
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: Temp, VPD, RH
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_mainclim
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰌪
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: Clone Climate  2x4
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: Temp, VPD, RH
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_cloneclim
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰖨
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: Lighting
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: SF1000, sun times, clone
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_light
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰐸
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: Root Zone (Mat)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: RZ low/high, min-off
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_mat
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰅐
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: Cycle Timers
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: Min-off, hysteresis
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_timers
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰖝
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: De-Strat Pulse
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: Period, length, level
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_destrat
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - button:
                    styles:
                      - rowbtn
                    height: 50
                    widgets:
                      - label:
                          text: 󰙪
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 6
                          text_color: 58998
                      - label:
                          text: Panel & System
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: -9
                          text_color: 16777215
                      - label:
                          text: Flashlight, screen lock
                          text_font: f_small
                          align: LV_ALIGN_LEFT_MID
                          x: 44
                          y: 10
                          text_color: 9081500
                      - label:
                          text: 󰅂
                          text_font: mdi_22
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          text_color: 5923954
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_set_panel
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: DSC-CONTROL v4.0  ·  ESP-NOW primary
                    text_font: f_small
                    text_color: 3818832
                    pad_top: 8
                    pad_bottom: 8
        skip: false
      - id: page_set_modes
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: Modes & Automation
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_modes_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - button:
                    id: takeover_card
                    width: 300
                    height: 52
                    bg_color: 1514274
                    border_color: 2304563
                    border_width: 1
                    radius: 8
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰹇
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 12633804
                      - label:
                          text: MANUAL TAKEOVER
                          text_font: f_med
                          align: LV_ALIGN_TOP_LEFT
                          x: 38
                          y: 6
                          text_color: 16777215
                      - label:
                          id: lbl_takeover_state
                          text: tap to engage
                          text_font: f_small
                          align: LV_ALIGN_BOTTOM_LEFT
                          x: 38
                          y: -6
                          text_color: 9081500
                    on_click:
                      - then:
                          - lambda: !lambda |-
                              lv_obj_clear_flag(id(confirm_takeover), LV_OBJ_FLAG_HIDDEN);
                - button:
                    id: btn_fullauto
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Full Auto
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: lbl_fullauto_state
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -4
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 1
                              val: !lambda |-
                                return id(st_full_auto).state ? 0 : 1;
                - button:
                    id: btn_autophoto
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Auto Photoperiod
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: lbl_autophoto_state
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -4
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 4
                              val: !lambda |-
                                return id(st_auto_photo).state ? 0 : 1;
                - label:
                    text: MASTER SWITCHES
                    text_font: f_small
                    text_color: 9081500
                    pad_top: 6
                - button:
                    id: sw_lighthold
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Manual Light Hold
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: st_lighthold_v
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 3
                              val: !lambda |-
                                return id(st_light_hold).state ? 0 : 1;
                - button:
                    id: sw_humroute
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Humidifier Routing
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: st_humroute_v
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 18
                              val: !lambda |-
                                return id(st_hum_routing).state ? 0 : 1;
                - button:
                    id: sw_destrat
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: RECIRC De-Strat
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: st_destrat_v
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: hub_cmd
                              op: 19
                              val: !lambda |-
                                return id(st_destrat).state ? 0 : 1;
                - button:
                    id: sw_greenhb
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Green OK heartbeat
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: st_greenhb_v
                          text: 'off'
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -8
                          text_color: 5923954
                    on_click:
                      - then:
                          - lambda: !lambda |-
                              id(green_heartbeat) = !id(green_heartbeat);
                          - script.execute:
                              id: refresh_ui
        skip: false
      - id: page_set_profile
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: Grow Profile
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_profile_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - button:
                    id: btn_stage
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Grow Stage
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: lbl_stage_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -20
                          text_color: 58998
                      - label:
                          text: 󰅂
                          text_font: mdi_16
                          align: LV_ALIGN_RIGHT_MID
                          x: -2
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: open_editor
                              target: 0
                - button:
                    id: btn_strategy
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Control Strategy
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: lbl_strategy_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -20
                          text_color: 58998
                      - label:
                          text: 󰅂
                          text_font: mdi_16
                          align: LV_ALIGN_RIGHT_MID
                          x: -2
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: open_editor
                              target: 1
                - button:
                    id: btn_clonemode
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Clone Mode
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: lbl_clonemode_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -20
                          text_color: 58998
                      - label:
                          text: 󰅂
                          text_font: mdi_16
                          align: LV_ALIGN_RIGHT_MID
                          x: -2
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: open_editor
                              target: 2
                - button:
                    id: btn_priority
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Priority Tent
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: lbl_priority_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -20
                          text_color: 58998
                      - label:
                          text: 󰅂
                          text_font: mdi_16
                          align: LV_ALIGN_RIGHT_MID
                          x: -2
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: open_editor
                              target: 3
                - button:
                    id: btn_clonephoto
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: Clone Photoperiod
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: lbl_clonephoto_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -20
                          text_color: 58998
                      - label:
                          text: 󰅂
                          text_font: mdi_16
                          align: LV_ALIGN_RIGHT_MID
                          x: -2
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: open_editor
                              target: 4
        skip: false
      - id: page_set_mainclim
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: Main Climate  4x8
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_mainclim_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - obj:
                    id: s_temp
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Target Temp
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_temp_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 30
                                    val: !lambda |-
                                      float v = isnan(id(t_main_temp).state) ? 15.0f : id(t_main_temp).state; v -= 0.5f; if (v < 15.0f) v = 15.0f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 30
                                    val: !lambda |-
                                      float v = isnan(id(t_main_temp).state) ? 15.0f : id(t_main_temp).state; v += 0.5f; if (v > 32.0f) v = 32.0f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_vmin
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: VPD Min
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_vmin_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 31
                                    val: !lambda |-
                                      float v = isnan(id(t_main_vpd_min).state) ? 0.4f : id(t_main_vpd_min).state; v -= 0.1f; if (v < 0.4f) v = 0.4f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 31
                                    val: !lambda |-
                                      float v = isnan(id(t_main_vpd_min).state) ? 0.4f : id(t_main_vpd_min).state; v += 0.1f; if (v > 1.6f) v = 1.6f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_vmax
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: VPD Max
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_vmax_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 32
                                    val: !lambda |-
                                      float v = isnan(id(t_main_vpd_max).state) ? 0.4f : id(t_main_vpd_max).state; v -= 0.1f; if (v < 0.4f) v = 0.4f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 32
                                    val: !lambda |-
                                      float v = isnan(id(t_main_vpd_max).state) ? 0.4f : id(t_main_vpd_max).state; v += 0.1f; if (v > 1.8f) v = 1.8f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_rmin
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: RH Min
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_rmin_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 33
                                    val: !lambda |-
                                      float v = isnan(id(t_main_rh_min).state) ? 20 : id(t_main_rh_min).state; v -= 1; if (v < 20) v = 20; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 33
                                    val: !lambda |-
                                      float v = isnan(id(t_main_rh_min).state) ? 20 : id(t_main_rh_min).state; v += 1; if (v > 90) v = 90; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_rmax
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: RH Max
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_rmax_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 34
                                    val: !lambda |-
                                      float v = isnan(id(t_main_rh_max).state) ? 20 : id(t_main_rh_max).state; v -= 1; if (v < 20) v = 20; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 34
                                    val: !lambda |-
                                      float v = isnan(id(t_main_rh_max).state) ? 20 : id(t_main_rh_max).state; v += 1; if (v > 95) v = 95; return (int)lroundf((float)v * 100);
        skip: false
      - id: page_set_cloneclim
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: Clone Climate  2x4
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_cloneclim_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - obj:
                    id: s_ctemp
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Clone Temp
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_ctemp_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 37
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_temp).state) ? 15.0f : id(t_clone_temp).state; v -= 0.5f; if (v < 15.0f) v = 15.0f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 37
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_temp).state) ? 15.0f : id(t_clone_temp).state; v += 0.5f; if (v > 32.0f) v = 32.0f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_cvmin
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Clone VPD Min
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_cvmin_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 38
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_vpd_min).state) ? 0.2f : id(t_clone_vpd_min).state; v -= 0.1f; if (v < 0.2f) v = 0.2f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 38
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_vpd_min).state) ? 0.2f : id(t_clone_vpd_min).state; v += 0.1f; if (v > 1.6f) v = 1.6f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_cvmax
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Clone VPD Max
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_cvmax_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 39
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_vpd_max).state) ? 0.2f : id(t_clone_vpd_max).state; v -= 0.1f; if (v < 0.2f) v = 0.2f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 39
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_vpd_max).state) ? 0.2f : id(t_clone_vpd_max).state; v += 0.1f; if (v > 1.8f) v = 1.8f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_crmin
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Clone RH Min
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_crmin_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 40
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_rh_min).state) ? 20 : id(t_clone_rh_min).state; v -= 1; if (v < 20) v = 20; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 40
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_rh_min).state) ? 20 : id(t_clone_rh_min).state; v += 1; if (v > 90) v = 90; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_crmax
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Clone RH Max
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_crmax_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 41
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_rh_max).state) ? 20 : id(t_clone_rh_max).state; v -= 1; if (v < 20) v = 20; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 41
                                    val: !lambda |-
                                      float v = isnan(id(t_clone_rh_max).state) ? 20 : id(t_clone_rh_max).state; v += 1; if (v > 95) v = 95; return (int)lroundf((float)v * 100);
        skip: false
      - id: page_set_light
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: Lighting
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_light_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - obj:
                    id: s_sftgt
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: SF1000 Target
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_sftgt_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 29
                                    val: !lambda |-
                                      float v = isnan(id(sf_target).state) ? 0 : id(sf_target).state; v -= 5; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 29
                                    val: !lambda |-
                                      float v = isnan(id(sf_target).state) ? 0 : id(sf_target).state; v += 5; if (v > 100) v = 100; return (int)lroundf((float)v * 1);
                - obj:
                    id: s_ramp
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: SF1000 Ramp Floor
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_ramp_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 43
                                    val: !lambda |-
                                      float v = isnan(id(n_ramp).state) ? 0 : id(n_ramp).state; v -= 1; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 43
                                    val: !lambda |-
                                      float v = isnan(id(n_ramp).state) ? 0 : id(n_ramp).state; v += 1; if (v > 50) v = 50; return (int)lroundf((float)v * 1);
                - obj:
                    id: s_sunrise
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Sunrise (min)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_sunrise_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 35
                                    val: !lambda |-
                                      float v = isnan(id(n_sunrise).state) ? 0 : id(n_sunrise).state; v -= 5; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 35
                                    val: !lambda |-
                                      float v = isnan(id(n_sunrise).state) ? 0 : id(n_sunrise).state; v += 5; if (v > 120) v = 120; return (int)lroundf((float)v * 1);
                - obj:
                    id: s_sunset
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Sunset (min)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_sunset_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 36
                                    val: !lambda |-
                                      float v = isnan(id(n_sunset).state) ? 0 : id(n_sunset).state; v -= 5; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 36
                                    val: !lambda |-
                                      float v = isnan(id(n_sunset).state) ? 0 : id(n_sunset).state; v += 5; if (v > 120) v = 120; return (int)lroundf((float)v * 1);
                - obj:
                    id: s_clh
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Clone Light Hours
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_clh_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 42
                                    val: !lambda |-
                                      float v = isnan(id(n_clh).state) ? 0 : id(n_clh).state; v -= 1; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 42
                                    val: !lambda |-
                                      float v = isnan(id(n_clh).state) ? 0 : id(n_clh).state; v += 1; if (v > 24) v = 24; return (int)lroundf((float)v * 1);
        skip: false
      - id: page_set_mat
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: Root Zone (Mat)
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_mat_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - obj:
                    id: s_rzlo
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Root-Zone Low
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_rzlo_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 48
                                    val: !lambda |-
                                      float v = isnan(id(n_rzlo).state) ? 12.0f : id(n_rzlo).state; v -= 0.5f; if (v < 12.0f) v = 12.0f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 48
                                    val: !lambda |-
                                      float v = isnan(id(n_rzlo).state) ? 12.0f : id(n_rzlo).state; v += 0.5f; if (v > 26.0f) v = 26.0f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_rzhi
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Root-Zone High
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_rzhi_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 49
                                    val: !lambda |-
                                      float v = isnan(id(n_rzhi).state) ? 14.0f : id(n_rzhi).state; v -= 0.5f; if (v < 14.0f) v = 14.0f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 49
                                    val: !lambda |-
                                      float v = isnan(id(n_rzhi).state) ? 14.0f : id(n_rzhi).state; v += 0.5f; if (v > 28.0f) v = 28.0f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_matoff
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Mat Min Off (s)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_matoff_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 50
                                    val: !lambda |-
                                      float v = isnan(id(n_matoff).state) ? 0 : id(n_matoff).state; v -= 60; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 50
                                    val: !lambda |-
                                      float v = isnan(id(n_matoff).state) ? 0 : id(n_matoff).state; v += 60; if (v > 1800) v = 1800; return (int)lroundf((float)v * 1);
        skip: false
      - id: page_set_timers
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: Cycle Timers
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_timers_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - obj:
                    id: s_chh
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Clone Hum Hyst
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_chh_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 44
                                    val: !lambda |-
                                      float v = isnan(id(n_chh).state) ? 2.0f : id(n_chh).state; v -= 0.5f; if (v < 2.0f) v = 2.0f; return (int)lroundf((float)v * 100);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 44
                                    val: !lambda |-
                                      float v = isnan(id(n_chh).state) ? 2.0f : id(n_chh).state; v += 0.5f; if (v > 15.0f) v = 15.0f; return (int)lroundf((float)v * 100);
                - obj:
                    id: s_chmo
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Clone Hum Min Off
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_chmo_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 45
                                    val: !lambda |-
                                      float v = isnan(id(n_chmo).state) ? 0 : id(n_chmo).state; v -= 30; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 45
                                    val: !lambda |-
                                      float v = isnan(id(n_chmo).state) ? 0 : id(n_chmo).state; v += 30; if (v > 900) v = 900; return (int)lroundf((float)v * 1);
                - obj:
                    id: s_hmo
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Humidifier Min Off
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_hmo_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 46
                                    val: !lambda |-
                                      float v = isnan(id(n_hmo).state) ? 0 : id(n_hmo).state; v -= 30; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 46
                                    val: !lambda |-
                                      float v = isnan(id(n_hmo).state) ? 0 : id(n_hmo).state; v += 30; if (v > 900) v = 900; return (int)lroundf((float)v * 1);
                - obj:
                    id: s_htmo
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Heater Min Off
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_htmo_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 47
                                    val: !lambda |-
                                      float v = isnan(id(n_htmo).state) ? 0 : id(n_htmo).state; v -= 30; if (v < 0) v = 0; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 47
                                    val: !lambda |-
                                      float v = isnan(id(n_htmo).state) ? 0 : id(n_htmo).state; v += 30; if (v > 900) v = 900; return (int)lroundf((float)v * 1);
        skip: false
      - id: page_set_destrat
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: De-Strat Pulse
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_destrat_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - obj:
                    id: s_dsp
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Pulse Period (s)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_dsp_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 51
                                    val: !lambda |-
                                      float v = isnan(id(n_dsp).state) ? 30 : id(n_dsp).state; v -= 30; if (v < 30) v = 30; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 51
                                    val: !lambda |-
                                      float v = isnan(id(n_dsp).state) ? 30 : id(n_dsp).state; v += 30; if (v > 1800) v = 1800; return (int)lroundf((float)v * 1);
                - obj:
                    id: s_dsl
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Pulse Length (s)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_dsl_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 52
                                    val: !lambda |-
                                      float v = isnan(id(n_dsl).state) ? 5 : id(n_dsl).state; v -= 5; if (v < 5) v = 5; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 52
                                    val: !lambda |-
                                      float v = isnan(id(n_dsl).state) ? 5 : id(n_dsl).state; v += 5; if (v > 120) v = 120; return (int)lroundf((float)v * 1);
                - obj:
                    id: s_dslv
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    scrollable: false
                    widgets:
                      - label:
                          text: Pulse Level (%)
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16777215
                      - label:
                          id: s_dslv_val
                          text: --
                          text_font: f_body
                          align: LV_ALIGN_RIGHT_MID
                          x: -92
                          text_color: 58998
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -48
                          width: 38
                          height: 30
                          bg_color: 2765115
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: '-'
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 16777215
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 53
                                    val: !lambda |-
                                      float v = isnan(id(n_dslv).state) ? 25 : id(n_dslv).state; v -= 5; if (v < 25) v = 25; return (int)lroundf((float)v * 1);
                      - button:
                          align: LV_ALIGN_RIGHT_MID
                          x: -6
                          width: 38
                          height: 30
                          bg_color: 1188890
                          border_color: 58998
                          border_width: 1
                          radius: 6
                          shadow_width: 0
                          widgets:
                            - label:
                                text: +
                                text_font: f_med
                                align: LV_ALIGN_CENTER
                                text_color: 58998
                          on_click:
                            - then:
                                - script.execute:
                                    id: hub_cmd
                                    op: 53
                                    val: !lambda |-
                                      float v = isnan(id(n_dslv).state) ? 25 : id(n_dslv).state; v += 5; if (v > 100) v = 100; return (int)lroundf((float)v * 1);
        skip: false
      - id: page_set_panel
        scrollbar_mode: LV_SCROLLBAR_MODE_OFF
        bg_color: 921878
        scrollable: false
        widgets:
          - obj:
              x: 0
              y: 0
              width: 320
              height: 36
              bg_color: 1514274
              bg_opa: 1.0
              border_width: 0
              radius: 0
              pad_all: 0
              scrollable: false
              widgets:
                - button:
                    align: LV_ALIGN_LEFT_MID
                    x: 4
                    width: 46
                    height: 30
                    bg_color: 2304563
                    radius: 6
                    shadow_width: 0
                    widgets:
                      - label:
                          text: 󰁍
                          text_font: mdi_22
                          align: LV_ALIGN_CENTER
                          text_color: 16777215
                    on_click:
                      - then:
                          - lvgl.page.show:
                              id: page_control
                              animation: LV_SCREEN_LOAD_ANIM_NONE
                              time: 50ms
                - label:
                    text: Panel & System
                    text_font: f_med
                    align: LV_ALIGN_CENTER
                    text_color: 16777215
                - label:
                    text: 󰒓
                    text_font: mdi_16
                    align: LV_ALIGN_RIGHT_MID
                    x: -8
                    text_color: 3818832
          - obj:
              id: set_panel_scroll
              x: 0
              y: 36
              width: 320
              height: 204
              bg_opa: 0.0
              border_width: 0
              radius: 0
              pad_all: 10
              pad_top: 6
              pad_bottom: 44
              scrollbar_mode: LV_SCROLLBAR_MODE_AUTO
              scroll_dir: LV_DIR_VER
              layout:
                type: flex
                flex_flow: LV_FLEX_FLOW_COLUMN
                pad_row: 8
                flex_align_main: LV_FLEX_ALIGN_START
                flex_align_cross: LV_FLEX_ALIGN_START
                flex_align_track: LV_FLEX_ALIGN_START
              widgets:
                - button:
                    id: sw_torch
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: 󰉄
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 16755200
                      - label:
                          text: Flashlight
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          text: 󰅂
                          text_font: mdi_16
                          align: LV_ALIGN_RIGHT_MID
                          x: -2
                          text_color: 5923954
                    on_click:
                      - then:
                          - script.execute:
                              id: open_flashlight
                - button:
                    id: sw_lock
                    width: 300
                    height: 40
                    styles:
                      - rowbtn
                    widgets:
                      - label:
                          text: 󰌾
                          text_font: mdi_22
                          align: LV_ALIGN_LEFT_MID
                          x: 4
                          text_color: 58998
                      - label:
                          text: Screen Lock
                          text_font: f_body
                          align: LV_ALIGN_LEFT_MID
                          x: 34
                          text_color: 16777215
                      - label:
                          text: hold 3s
                          text_font: f_small
                          align: LV_ALIGN_RIGHT_MID
                          x: -4
                          text_color: 5923954
                    on_press:
                      - then:
                          - script.execute:
                              id: hold_begin
                    on_pressing:
                      - then:
                          - script.execute:
                              id: hold_tick
                    on_release:
                      - then:
                          - script.execute:
                              id: hold_cancel
        skip: false
    update_interval: 1s
    full_refresh: false
    update_when_display_idle: false
    draw_rounding: 2
    log_level: WARN
    page_wrap: true
    transparency_key: <removed>
    encoders: []
    keypads: []
    resume_on_input: true
    paused: false
    byte_order: big_endian
script:
  - id: hub_cmd
    parameters:
      op: int
      val: int
    then:
      - espnow.send:
          address: 84:1F:E8:16:E6:60
          wait_for_sent: false
          data: !lambda |-
            std::vector<uint8_t> p(12, 0);
            p[0]=0xDC; p[1]=0x01; p[2]=(uint8_t) op; p[3]=0;
            uint32_t uv=(uint32_t) val; p[4]=uv&0xFF; p[5]=(uv>>8)&0xFF; p[6]=(uv>>16)&0xFF; p[7]=(uv>>24)&0xFF;
            uint16_t tg=(uint16_t) 43981; p[8]=tg&0xFF; p[9]=(tg>>8)&0xFF;
            uint16_t sq=id(cmd_tx_seq)++; p[10]=sq&0xFF; p[11]=(sq>>8)&0xFF;
            return p;
          continue_on_error: true
    mode: single
  - id: show_active_tab
    then:
      - if:
          condition:
            lambda: !lambda |-
              return id(active_tab) == 0;
          then:
            - lvgl.page.show:
                id: page_pulse
                animation: LV_SCREEN_LOAD_ANIM_NONE
                time: 50ms
      - if:
          condition:
            lambda: !lambda |-
              return id(active_tab) == 1;
          then:
            - lvgl.page.show:
                id: page_clone
                animation: LV_SCREEN_LOAD_ANIM_NONE
                time: 50ms
      - if:
          condition:
            lambda: !lambda |-
              return id(active_tab) == 2;
          then:
            - lvgl.page.show:
                id: page_main
                animation: LV_SCREEN_LOAD_ANIM_NONE
                time: 50ms
      - if:
          condition:
            lambda: !lambda |-
              return id(active_tab) == 3;
          then:
            - lvgl.page.show:
                id: page_soil
                animation: LV_SCREEN_LOAD_ANIM_NONE
                time: 50ms
      - if:
          condition:
            lambda: !lambda |-
              return id(active_tab) == 4;
          then:
            - lvgl.page.show:
                id: page_control
                animation: LV_SCREEN_LOAD_ANIM_NONE
                time: 50ms
      - script.execute:
          id: restyle_tabs
    mode: single
    parameters: {}
  - id: tab_next
    then:
      - lambda: !lambda |-
          if (id(active_tab) < 4) id(active_tab)++;
      - script.execute:
          id: show_active_tab
    mode: single
    parameters: {}
  - id: tab_prev
    then:
      - lambda: !lambda |-
          if (id(active_tab) > 0) id(active_tab)--;
      - script.execute:
          id: show_active_tab
    mode: single
    parameters: {}
  - id: restyle_tabs
    then:
      - lambda: !lambda |-
          lv_color_t on = lv_color_hex(0x00E676), off = lv_color_hex(0x5A6472);
          auto S = [&](lv_obj_t* ic, bool a) { lv_obj_set_style_text_color(ic, a ? on : off, 0); };
          int t = id(active_tab);
          S(id(tab_ic0), t == 0);
          S(id(tab_ic1), t == 1);
          S(id(tab_ic2), t == 2);
          S(id(tab_ic3), t == 3);
          S(id(tab_ic4), t == 4);
    mode: single
    parameters: {}
  - id: wake_panel
    then:
      - lambda: !lambda |-
          id(panel_sleeping) = false;
          lv_obj_add_flag(id(saver), LV_OBJ_FLAG_HIDDEN);
      - script.execute:
          id: refresh_ui
    mode: single
    parameters: {}
  - id: go_sleep
    then:
      - if:
          condition:
            lambda: !lambda |-
              return !id(fl_active);
          then:
            - lambda: !lambda |-
                id(panel_sleeping) = true;
                lv_obj_clear_flag(id(saver), LV_OBJ_FLAG_HIDDEN);
            - script.execute:
                id: refresh_ui
    mode: single
    parameters: {}
  - id: apply_flashlight
    then:
      - lambda: !lambda |-
          uint32_t tint;
          switch (id(fl_color)) {
            case 1: tint = 0xFFFFFF; break;   // white
            case 2: tint = 0xFF0000; break;   // red
            default: tint = 0x00FF00; break;  // green
          }
          char b[8]; snprintf(b, sizeof(b), "%d%%", id(fl_bright));
          lv_label_set_text(id(fl_pct), b);
          lv_bar_set_value(id(fl_bar), id(fl_bright), LV_ANIM_ON);
          lv_obj_set_style_border_width(id(fl_bg), id(fl_color) == 0 ? 3 : 1, 0);
          lv_obj_set_style_border_width(id(fl_bw), id(fl_color) == 1 ? 3 : 1, 0);
          lv_obj_set_style_border_width(id(fl_br), id(fl_color) == 2 ? 3 : 1, 0);
          if (id(fl_active)) {
            lv_label_set_text(id(fl_onoff_lbl), "ON");
            lv_obj_set_style_bg_color(id(fl_onoff), lv_color_hex(0x12241A), 0);
            lv_obj_set_style_border_color(id(fl_onoff), lv_color_hex(0x00E676), 0);
            lv_obj_set_style_text_color(id(fl_onoff_lbl), lv_color_hex(0x00E676), 0);
            lv_obj_set_style_bg_color(id(fl_dot), lv_color_hex(tint), 0);
            // drive the real onboard RGB LED
            float r = 0, g = 0, bl = 0;
            switch (id(fl_color)) { case 1: r = g = bl = 1; break; case 2: r = 1; break; default: g = 1; break; }
            auto c = id(status_led).turn_on();
            c.set_effect("None");
            c.set_rgb(r, g, bl);
            c.set_brightness(id(fl_bright) / 100.0f);
            c.perform();
          } else {
            lv_label_set_text(id(fl_onoff_lbl), "OFF");
            lv_obj_set_style_bg_color(id(fl_onoff), lv_color_hex(0x2A313B), 0);
            lv_obj_set_style_border_color(id(fl_onoff), lv_color_hex(0x8A929C), 0);
            lv_obj_set_style_text_color(id(fl_onoff_lbl), lv_color_hex(0xFFFFFF), 0);
            lv_obj_set_style_bg_color(id(fl_dot), lv_color_hex(0x2A313B), 0);
            id(led_last) = -1;   // hand the LED back to the status machine
          }
      - if:
          condition:
            lambda: !lambda |-
              return !id(fl_active);
          then:
            - script.execute:
                id: refresh_ui
    mode: single
    parameters: {}
  - id: open_flashlight
    then:
      - lambda: !lambda |-
          id(fl_active) = true;
          lv_obj_clear_flag(id(fl_screen), LV_OBJ_FLAG_HIDDEN);
      - script.execute:
          id: apply_flashlight
    mode: single
    parameters: {}
  - id: close_flashlight
    then:
      - lambda: !lambda |-
          id(fl_active) = false;
          id(led_last) = -1;   // status machine reclaims the LED
          lv_obj_add_flag(id(fl_screen), LV_OBJ_FLAG_HIDDEN);
      - script.execute:
          id: refresh_ui
    mode: single
    parameters: {}
  - id: open_connections
    then:
      - lambda: !lambda |-
          lv_obj_clear_flag(id(conn_screen), LV_OBJ_FLAG_HIDDEN);
      - script.execute:
          id: refresh_ui
    mode: single
    parameters: {}
  - id: close_connections
    then:
      - lambda: !lambda |-
          lv_obj_add_flag(id(conn_screen), LV_OBJ_FLAG_HIDDEN);
    mode: single
    parameters: {}
  - id: hold_begin
    then:
      - lambda: !lambda |-
          id(holding) = true;
          id(hold_start) = millis();
          lv_bar_set_value(id(hud_bar), 0, LV_ANIM_OFF);
          bool waking = id(lock_engaged);   // currently locked -> this hold WAKES it
          lv_label_set_text(id(hud_hint), waking ? "WAKING UP" : "GOING TO SLEEP");
          // start at the current state: waking begins asleep (seed+moon),
          // sleeping begins awake (flower+sun)
          lv_label_set_text(id(hud_plant), waking ? "\U000F0E62" : "\U000F024A");
          lv_label_set_text(id(hud_sky),   waking ? "\U000F0594" : "\U000F05A8");
          lv_obj_set_style_text_color(id(hud_plant), lv_color_hex(waking ? 0x3A4550 : 0x00E676), 0);
          lv_obj_set_style_text_color(id(hud_sky),   lv_color_hex(waking ? 0x5A6472 : 0xFFC24A), 0);
          lv_obj_clear_flag(id(hold_hud), LV_OBJ_FLAG_HIDDEN);
    mode: single
    parameters: {}
  - id: hold_tick
    then:
      - lambda: !lambda |-
          if (!id(holding)) return;
          const uint32_t HOLD_MS = 3000;
          uint32_t el = millis() - id(hold_start);
          if (el > HOLD_MS) el = HOLD_MS;
          float prog = (float) el / HOLD_MS;               // 0..1 hold progress
          // wake: 0 = asleep (seed + moon), 1 = awake (flower + sun).
          // unlocking WAKES it (0->1); locking puts it to SLEEP (1->0).
          float wake = id(lock_engaged) ? prog : (1.0f - prog);
          const char* icon;
          if      (wake < 0.20f) icon = "\U000F0E62";      // seed   (asleep)
          else if (wake < 0.45f) icon = "\U000F0E66";      // sprout
          else if (wake < 0.70f) icon = "\U000F032A";      // leaf
          else if (wake < 0.95f) icon = "\U000F038E";      // nature
          else                   icon = "\U000F024A";      // flower (awake)
          lv_label_set_text(id(hud_plant), icon);
          lv_label_set_text(id(hud_sky), wake < 0.5f ? "\U000F0594" : "\U000F05A8");  // moon : sun
          lv_obj_set_style_text_color(id(hud_plant), lv_color_hex(wake < 0.5f ? 0x3A4550 : 0x00E676), 0);
          lv_obj_set_style_text_color(id(hud_sky),   lv_color_hex(wake < 0.5f ? 0x5A6472 : 0xFFC24A), 0);
          lv_bar_set_value(id(hud_bar), (int)(prog * 100), LV_ANIM_OFF);
          if (el < HOLD_MS) return;
          // ---- 3s reached: commit the flip ----
          id(holding) = false;
          lv_obj_add_flag(id(hold_hud), LV_OBJ_FLAG_HIDDEN);
          if (id(lock_engaged)) {                          // was locked -> unlock
            id(lock_engaged) = false;
            lv_obj_add_flag(id(lock_overlay), LV_OBJ_FLAG_HIDDEN);
            id(panel_sleeping) = false;
            lv_obj_add_flag(id(saver), LV_OBJ_FLAG_HIDDEN);
            id(bl_last) = -1;                              // refresh_ui restores backlight
          } else {                                         // was unlocked -> lock
            id(lock_engaged) = true;
            lv_obj_clear_flag(id(lock_overlay), LV_OBJ_FLAG_HIDDEN);
          }
    mode: single
    parameters: {}
  - id: hold_cancel
    then:
      - lambda: !lambda |-
          if (!id(holding)) return;   // already committed at 3s; nothing to abort
          id(holding) = false;
          lv_obj_add_flag(id(hold_hud), LV_OBJ_FLAG_HIDDEN);
    mode: single
    parameters: {}
  - id: open_editor
    parameters:
      target: int
    then:
      - lambda: !lambda |-
          id(edit_target) = target;
          const char* title; std::string opts; std::string cur;
          switch (target) {
            case 0: title = "Grow Stage";
              opts = "Germination\nSeedling\nEarly Vegetative\nVegetative\nLate (Push) Vegetative\nEarly Flowering\nFlowering\nLate Flowering\nFinal 48-72h Flowering\nDry Mode\nOff";
              cur = id(sel_stage).state; break;
            case 1: title = "Control Strategy";
              opts = "VPD\nTemperature\nHumidity";
              cur = id(sel_strategy).state; break;
            case 2: title = "Clone Mode";
              opts = "Follow 4x8\nClones & Seedlings\nMother\nCustom\nOff";
              cur = id(sel_clone_mode).state; break;
            case 3: title = "Priority Tent";
              opts = "4x8 Main\n2x4 Clone";
              cur = id(sel_priority).state; break;
            default: title = "Clone Photoperiod";
              opts = "Follow 4x8\nIndependent";
              cur = id(sel_clone_photo).state; break;
          }
          lv_label_set_text(id(ed_title), title);
          lv_roller_set_options(id(ed_roller)->obj, opts.c_str(), LV_ROLLER_MODE_NORMAL);
          int idx = 0, pos = 0; size_t start = 0;
          for (size_t i = 0; i <= opts.size(); i++) {
            if (i == opts.size() || opts[i] == '\n') {
              if (opts.substr(start, i - start) == cur) { idx = pos; break; }
              pos++; start = i + 1;
            }
          }
          lv_roller_set_selected(id(ed_roller)->obj, idx, LV_ANIM_OFF);
          lv_obj_clear_flag(id(editor), LV_OBJ_FLAG_HIDDEN);
    mode: single
  - id: apply_editor
    then:
      - script.execute:
          id: hub_cmd
          op: !lambda |-
            switch (id(edit_target)) {
              case 0: return 20;   // grow_stage
              case 1: return 21;   // control_strategy
              case 2: return 22;   // clone_mode
              case 3: return 24;   // priority_tent
              default: return 23;  // clone_photoperiod
            }
          val: !lambda |-
            return (int) lv_roller_get_selected(id(ed_roller)->obj);
      - lambda: !lambda |-
          lv_obj_add_flag(id(editor), LV_OBJ_FLAG_HIDDEN);
    mode: single
    parameters: {}
  - id: refresh_ui
    then:
      - lambda: !lambda "const uint32_t NEON=0x00E676, AMBER=0xFFAA00, RED=0xF44336,\
          \ CYAN=0x00BCD4,\n               GREY=0x5A6472, WHITE=0xFFFFFF, DIM=0xC0C6CC,\
          \ BORD=0x232A33,\n               BLUE=0x2196F3, ORANGE=0xFF9800;\nchar b[64];\n\
          auto setc = [](lv_obj_t* o, uint32_t c){ lv_obj_set_style_text_color(o,\
          \ lv_color_hex(c), 0); };\nauto bordc = [](lv_obj_t* o, uint32_t c){ lv_obj_set_style_border_color(o,\
          \ lv_color_hex(c), 0); };\nauto bandcol = [&](float v, float lo, float hi)->uint32_t{\n\
          \  if (isnan(v) || isnan(lo) || isnan(hi)) return GREY;\n  if (v >= lo &&\
          \ v <= hi) return NEON;\n  float m = (hi - lo) * 0.15f; if (m < 0.05f) m\
          \ = 0.05f;\n  if (v >= lo - m && v <= hi + m) return AMBER;\n  return RED;\n\
          };\n\n// ---------------- resolved target bands ----------------\nbool cfollow\
          \ = id(sel_clone_mode).state == \"Follow 4x8\";\nfloat c_rmin = cfollow\
          \ ? id(t_main_rh_min).state  : id(t_clone_rh_min).state;\nfloat c_rmax =\
          \ cfollow ? id(t_main_rh_max).state  : id(t_clone_rh_max).state;\nfloat\
          \ c_vmin = cfollow ? id(t_main_vpd_min).state : id(t_clone_vpd_min).state;\n\
          float c_vmax = cfollow ? id(t_main_vpd_max).state : id(t_clone_vpd_max).state;\n\
          float c_tt   = cfollow ? id(t_main_temp).state    : id(t_clone_temp).state;\n\
          float m_rmin = id(t_main_rh_min).state,  m_rmax = id(t_main_rh_max).state;\n\
          float m_vmin = id(t_main_vpd_min).state, m_vmax = id(t_main_vpd_max).state;\n\
          float m_tt   = id(t_main_temp).state;\n\n// ---------------- PULSE: pills\
          \ ----------------\nbool link = id(api_link).state;\nsetc(id(pill_wifi_ic),\
          \ link ? NEON : RED);\nfloat co2 = id(co2_ppm).state;\nif (isnan(co2)) strcpy(b,\
          \ \"CO2 --- ppm\"); else snprintf(b, sizeof(b), \"CO2 %d ppm\", (int)co2);\n\
          lv_label_set_text(id(lbl_co2), b);\n\n// ---------------- connection uptimes\
          \ (millis-stamped; reset on drop) ----\n{\n  uint32_t nowms = millis();\n\
          \  bool w = id(wifi_conn);\n  if (w && !id(wifi_was)) id(wifi_since) = nowms;\
          \   // rising edge -> restart timer\n  id(wifi_was) = w;\n  if (link &&\
          \ !id(api_was)) id(api_since) = nowms;\n  id(api_was) = link;\n  // format\
          \ seconds -> compact \"Ns / Nm / Nh Nm\"\n  auto upstr = [](char* out, size_t\
          \ n, bool on, uint32_t since, uint32_t now){\n    if (!on) { strncpy(out,\
          \ \"0s\", n); return; }\n    uint32_t s = (now - since) / 1000;\n    if\
          \ (s < 60)      snprintf(out, n, \"%us\", s);\n    else if (s<3600) snprintf(out,\
          \ n, \"%um\", s/60);\n    else             snprintf(out, n, \"%uh %um\"\
          , s/3600, (s%3600)/60);\n  };\n  char u[16];\n  upstr(u, sizeof(u), w, id(wifi_since),\
          \ nowms);\n  lv_label_set_text(id(conn_wifi_up), u); setc(id(conn_wifi_up),\
          \ w ? NEON : GREY);\n  setc(id(conn_wifi_ic), w ? NEON : RED);\n  upstr(u,\
          \ sizeof(u), link, id(api_since), nowms);\n  lv_label_set_text(id(conn_api_up),\
          \ u); setc(id(conn_api_up), link ? NEON : GREY);\n  setc(id(conn_api_ic),\
          \ link ? NEON : RED);\n  // Wi-Fi sub-line: SSID · RSSI\n  std::string ssid\
          \ = id(wifi_ssid_ts).state;\n  float rssi = id(wifi_rssi).state;\n  if (ssid.empty())\
          \ ssid = \"—\";\n  if (isnan(rssi)) snprintf(b, sizeof(b), \"%s\", ssid.c_str());\n\
          \  else             snprintf(b, sizeof(b), \"%s · %ddBm\", ssid.c_str(),\
          \ (int)rssi);\n  lv_label_set_text(id(conn_wifi_sub), b);\n  lv_label_set_text(id(conn_api_sub),\
          \ id(wifi_ip_ts).state.c_str());\n}\n\n// ---------------- battery chip\
          \ (hidden until a real pack is wired) ----\n{\n  float bv = id(batt_v).state;\
          \                 // pack volts after the /2 divider\n  bool valid = !isnan(bv)\
          \ && bv > 2.8f && bv < 4.6f;   // 1S Li-ion plausibility gate\n  if (valid)\
          \ {\n    int pct = (int)((bv - 3.30f) / (4.20f - 3.30f) * 100.0f);\n   \
          \ if (pct < 0) pct = 0; if (pct > 100) pct = 100;\n    snprintf(b, sizeof(b),\
          \ \"%d%%\", pct);\n    lv_label_set_text(id(pill_batt_pct), b);\n    setc(id(pill_batt_pct),\
          \ pct <= 15 ? RED : (pct <= 40 ? AMBER : NEON));\n    setc(id(pill_batt_ic),\
          \  pct <= 15 ? RED : (pct <= 40 ? AMBER : NEON));\n    lv_obj_clear_flag(id(pill_batt_ic),\
          \  LV_OBJ_FLAG_HIDDEN);\n    lv_obj_clear_flag(id(pill_batt_pct), LV_OBJ_FLAG_HIDDEN);\n\
          \  } else {\n    lv_obj_add_flag(id(pill_batt_ic),  LV_OBJ_FLAG_HIDDEN);\n\
          \    lv_obj_add_flag(id(pill_batt_pct), LV_OBJ_FLAG_HIDDEN);\n  }\n}\n\n\
          // ---------------- PULSE: env cards ----------------\nauto envtxt = [&](lv_obj_t*\
          \ o, float t, float rh){\n  if (isnan(t) || isnan(rh)) { lv_label_set_text(o,\
          \ \"--\"); return; }\n  char x[32]; snprintf(x, sizeof(x), \"%.1f° · %.0f%%\"\
          , t, rh); lv_label_set_text(o, x);\n};\nenvtxt(id(lbl_2x4), id(clone_temp).state,\
          \ id(clone_rh).state);\nenvtxt(id(lbl_4x8), id(main_temp).state,  id(main_rh).state);\n\
          envtxt(id(lbl_room), id(room_temp).state, id(room_rh).state);\n\n// ----------------\
          \ PULSE: ladder rung 1 (fans) ----------------\nint fans = (id(fan_out_on).state?1:0)\
          \ + (id(fan_recirc_on).state?1:0)\n         + (id(fan_int_main_on).state?1:0)\
          \ + (id(fan_int_clone_on).state?1:0);\nif (fans > 0) { snprintf(b, sizeof(b),\
          \ \"active · %d fans\", fans);\n  setc(id(lbl_rung1), CYAN); bordc(id(rung1),\
          \ CYAN); }\nelse { strcpy(b, \"idle\"); setc(id(lbl_rung1), GREY); bordc(id(rung1),\
          \ BORD); }\nlv_label_set_text(id(lbl_rung1), b);\n\n// ----------------\
          \ PULSE: ladder rung 2 (appliances) ----------------\nbool any_dem = id(dem_hum).state||id(dem_dehum).state||id(dem_heater).state\n\
          \             ||id(dem_ac).state||id(dem_mat).state||id(dem_clone_hum).state;\n\
          const char* dem = nullptr;\nif (id(dem_dehum).state) dem = \"dehumidifier\"\
          ;\nelse if (id(dem_hum).state) dem = \"humidifier\";\nelse if (id(dem_heater).state)\
          \ dem = \"heater\";\nelse if (id(dem_ac).state) dem = \"AC\";\nelse if (id(dem_mat).state)\
          \ dem = \"grow mat\";\nelse if (id(dem_clone_hum).state) dem = \"clone humid\"\
          ;\nif (dem) { snprintf(b, sizeof(b), \"%s active\", dem);\n  setc(id(lbl_rung2),\
          \ AMBER); bordc(id(rung2), AMBER); }\nelse {\n  float best = 1e9f; const\
          \ char* who = nullptr;\n  auto chk = [&](float v, const char* n){ if (!isnan(v)\
          \ && v > 0 && v < best) { best = v; who = n; } };\n  chk(id(cd_dehum).state,\"\
          dehum\"); chk(id(cd_hum).state,\"humid\"); chk(id(cd_heater).state,\"heater\"\
          );\n  chk(id(cd_ac).state,\"AC\"); chk(id(cd_mat).state,\"mat\"); chk(id(cd_clone_hum).state,\"\
          c-hum\");\n  if (who) { snprintf(b, sizeof(b), \"%s in %ds\", who, (int)best);\
          \ setc(id(lbl_rung2), AMBER); bordc(id(rung2), BORD); }\n  else { strcpy(b,\
          \ \"standing by\"); setc(id(lbl_rung2), GREY); bordc(id(rung2), BORD); }\n\
          }\nlv_label_set_text(id(lbl_rung2), b);\n\n// ---------------- alerts ----------------\n\
          int ac = 0; std::string head; char hb[48];\nauto AL = [&](bool cond, std::string\
          \ txt){ if (cond) { if (ac == 0) head = txt; ac++; } };\nAL(id(fault_climate).state,\
          \ \"Climate sensor fault\");\nAL(id(fault_rootzone).state, \"Root-zone probe\
          \ fault\");\nAL(id(fault_aux).state, \"Aux sensor offline\");\nfloat crh\
          \ = id(clone_rh).state, cvp = id(clone_vpd).state, mrh = id(main_rh).state,\
          \ mvp = id(main_vpd).state;\nif (!isnan(crh) && !isnan(c_rmax) && crh >\
          \ c_rmax + 2) { snprintf(hb,sizeof(hb),\"Clone RH high · %.0f%%\",crh);\
          \ AL(true,hb); }\nif (!isnan(cvp) && !isnan(c_vmax) && cvp > c_vmax + 0.1f)\
          \ { snprintf(hb,sizeof(hb),\"Clone VPD high · %.2f\",cvp); AL(true,hb);\
          \ }\nif (!isnan(mrh) && !isnan(m_rmax) && mrh > m_rmax + 2) { snprintf(hb,sizeof(hb),\"\
          Main RH high · %.0f%%\",mrh); AL(true,hb); }\nif (!isnan(mvp) && !isnan(m_vmax)\
          \ && mvp > m_vmax + 0.1f) { snprintf(hb,sizeof(hb),\"Main VPD high · %.2f\"\
          ,mvp); AL(true,hb); }\nid(alert_count) = ac;\n\n// bell pill\nsnprintf(b,\
          \ sizeof(b), \"%d\", ac); lv_label_set_text(id(pill_alert_ct), b);\nsetc(id(pill_alert_ct),\
          \ ac>0?RED:GREY); setc(id(pill_bell_ic), ac>0?RED:GREY);\n// big SILENCE\
          \ banner: visible whenever an alert is live + unsilenced\nif (ac > 0 &&\
          \ !id(alerts_silenced)) lv_obj_clear_flag(id(btn_silence), LV_OBJ_FLAG_HIDDEN);\n\
          else lv_obj_add_flag(id(btn_silence), LV_OBJ_FLAG_HIDDEN);\n\n// alert strip\n\
          if (ac == 0) {\n  id(alerts_silenced) = false;\n  lv_label_set_text(id(lbl_alert),\
          \ \"all clear · nothing needs attention\");\n  setc(id(lbl_alert), DIM);\
          \ setc(id(alert_ic), NEON); bordc(id(alert_strip), 0x1E3A2B);\n  lv_obj_add_flag(id(btn_mute),\
          \ LV_OBJ_FLAG_HIDDEN);\n} else {\n  if (id(alerts_silenced)) {\n    snprintf(b,\
          \ sizeof(b), \"%d muted · %s\", ac, head.c_str());\n    lv_label_set_text(id(lbl_alert),\
          \ b);\n    setc(id(lbl_alert), 0x8A929C); setc(id(alert_ic), 0x8A929C);\
          \ bordc(id(alert_strip), 0x3A2A12);\n  } else {\n    lv_label_set_text(id(lbl_alert),\
          \ head.c_str());\n    setc(id(lbl_alert), WHITE); setc(id(alert_ic), RED);\
          \ bordc(id(alert_strip), RED);\n  }\n  lv_obj_clear_flag(id(btn_mute), LV_OBJ_FLAG_HIDDEN);\n\
          \  lv_label_set_text(id(lbl_mute), id(alerts_silenced) ? \"unmute\" : \"\
          mute\");\n}\n\n// ---------------- CLONE vitals ----------------\n{\n  float\
          \ t = id(clone_temp).state; uint32_t c = bandcol(t, c_tt-2, c_tt+2);\n \
          \ if (isnan(t)) lv_label_set_text(id(clv_temp_val),\"--\"); else { snprintf(b,sizeof(b),\"\
          %.1f°\",t); lv_label_set_text(id(clv_temp_val),b);} \n  setc(id(clv_temp_val),c);\
          \ lv_bar_set_value(id(clv_temp_bar), isnan(t)?10:(int)t, LV_ANIM_OFF);\n\
          \  lv_obj_set_style_bg_color(id(clv_temp_bar), lv_color_hex(c), LV_PART_INDICATOR);\n\
          \  float rh = id(clone_rh).state; c = bandcol(rh, c_rmin, c_rmax);\n  if\
          \ (isnan(rh)) lv_label_set_text(id(clv_rh_val),\"--\"); else { snprintf(b,sizeof(b),\"\
          %.0f%%\",rh); lv_label_set_text(id(clv_rh_val),b);} \n  setc(id(clv_rh_val),c);\
          \ lv_bar_set_value(id(clv_rh_bar), isnan(rh)?0:(int)rh, LV_ANIM_OFF);\n\
          \  lv_obj_set_style_bg_color(id(clv_rh_bar), lv_color_hex(c), LV_PART_INDICATOR);\n\
          \  float vp = id(clone_vpd).state; c = bandcol(vp, c_vmin, c_vmax);\n  if\
          \ (isnan(vp)) lv_label_set_text(id(clv_vpd_val),\"--\"); else { snprintf(b,sizeof(b),\"\
          %.2f kPa\",vp); lv_label_set_text(id(clv_vpd_val),b);} \n  setc(id(clv_vpd_val),c);\
          \ lv_bar_set_value(id(clv_vpd_bar), isnan(vp)?0:(int)(vp*100), LV_ANIM_OFF);\n\
          \  lv_obj_set_style_bg_color(id(clv_vpd_bar), lv_color_hex(c), LV_PART_INDICATOR);\n\
          }\nlv_label_set_text(id(clone_hdr_note), id(sel_clone_mode).state.c_str());\n\
          \n// ---------------- MAIN vitals ----------------\n{\n  float t = id(main_temp).state;\
          \ uint32_t c = bandcol(t, m_tt-2, m_tt+2);\n  if (isnan(t)) lv_label_set_text(id(mnv_temp_val),\"\
          --\"); else { snprintf(b,sizeof(b),\"%.1f°\",t); lv_label_set_text(id(mnv_temp_val),b);}\
          \ \n  setc(id(mnv_temp_val),c); lv_bar_set_value(id(mnv_temp_bar), isnan(t)?10:(int)t,\
          \ LV_ANIM_OFF);\n  lv_obj_set_style_bg_color(id(mnv_temp_bar), lv_color_hex(c),\
          \ LV_PART_INDICATOR);\n  float rh = id(main_rh).state; c = bandcol(rh, m_rmin,\
          \ m_rmax);\n  if (isnan(rh)) lv_label_set_text(id(mnv_rh_val),\"--\"); else\
          \ { snprintf(b,sizeof(b),\"%.0f%%\",rh); lv_label_set_text(id(mnv_rh_val),b);}\
          \ \n  setc(id(mnv_rh_val),c); lv_bar_set_value(id(mnv_rh_bar), isnan(rh)?0:(int)rh,\
          \ LV_ANIM_OFF);\n  lv_obj_set_style_bg_color(id(mnv_rh_bar), lv_color_hex(c),\
          \ LV_PART_INDICATOR);\n  float vp = id(main_vpd).state; c = bandcol(vp,\
          \ m_vmin, m_vmax);\n  if (isnan(vp)) lv_label_set_text(id(mnv_vpd_val),\"\
          --\"); else { snprintf(b,sizeof(b),\"%.2f kPa\",vp); lv_label_set_text(id(mnv_vpd_val),b);}\
          \ \n  setc(id(mnv_vpd_val),c); lv_bar_set_value(id(mnv_vpd_bar), isnan(vp)?0:(int)(vp*100),\
          \ LV_ANIM_OFF);\n  lv_obj_set_style_bg_color(id(mnv_vpd_bar), lv_color_hex(c),\
          \ LV_PART_INDICATOR);\n}\n\n// ---------------- CONTROL state ----------------\n\
          bool fa = id(st_full_auto).state, ta = id(st_takeover).state, ap = id(st_auto_photo).state;\n\
          lv_label_set_text(id(lbl_fullauto_state), fa ? \"ON\" : \"off\"); setc(id(lbl_fullauto_state),\
          \ fa ? NEON : GREY);\nlv_label_set_text(id(lbl_autophoto_state), ap ? \"\
          ON\" : \"off\"); setc(id(lbl_autophoto_state), ap ? NEON : GREY);\nif (ta)\
          \ { lv_label_set_text(id(lbl_takeover_state), \"ENGAGED — you own outputs\"\
          ); setc(id(lbl_takeover_state), AMBER); bordc(id(takeover_card), AMBER);\
          \ }\nelse { lv_label_set_text(id(lbl_takeover_state), \"tap to engage\"\
          ); setc(id(lbl_takeover_state), 0x8A929C); bordc(id(takeover_card), BORD);\
          \ }\nlv_label_set_text(id(lbl_stage_val), id(sel_stage).state.c_str());\n\
          lv_label_set_text(id(lbl_strategy_val), id(sel_strategy).state.c_str());\n\
          lv_label_set_text(id(lbl_clonemode_val), id(sel_clone_mode).state.c_str());\n\
          lv_label_set_text(id(lbl_priority_val), id(sel_priority).state.c_str());\n\
          \n// ---------------- SOIL tab (4 pot cards) ----------------\nauto potrow\
          \ = [&](lv_obj_t* nameL, lv_obj_t* npkL, lv_obj_t* valL, int idx,\n    \
          \              const std::string& plant, float mo, float tp, float ec, float\
          \ ph,\n                  float nn, float pp, float kk){\n  char x[80];\n\
          \  snprintf(x, sizeof(x), \"P%d · %s\", idx, plant.empty() ? \"—\" : plant.c_str());\n\
          \  lv_label_set_text(nameL, x);\n  if (isnan(nn) && isnan(pp) && isnan(kk))\
          \ lv_label_set_text(npkL, \"N/P/K —\");\n  else { snprintf(x, sizeof(x),\
          \ \"N/P/K %d/%d/%d\", (int)(isnan(nn)?0:nn), (int)(isnan(pp)?0:pp), (int)(isnan(kk)?0:kk));\
          \ lv_label_set_text(npkL, x); }\n  if (isnan(mo) && isnan(tp) && isnan(ph))\
          \ { lv_label_set_text(valL, \"offline / no data\"); setc(valL, GREY); return;\
          \ }\n  char mS[10], tS[12], pS[10], eS[12];\n  if (isnan(mo)) strcpy(mS,\
          \ \"--\"); else snprintf(mS, sizeof(mS), \"%.0f%%\", mo);\n  if (isnan(tp))\
          \ strcpy(tS, \"--\"); else snprintf(tS, sizeof(tS), \"%.1f°\", tp);\n  if\
          \ (isnan(ph)) strcpy(pS, \"--\"); else snprintf(pS, sizeof(pS), \"%.1f\"\
          , ph);\n  if (isnan(ec)) strcpy(eS, \"--\"); else snprintf(eS, sizeof(eS),\
          \ \"%.0f\", ec);\n  snprintf(x, sizeof(x), \"M %s · T %s · pH %s · EC %s\"\
          , mS, tS, pS, eS);\n  lv_label_set_text(valL, x);\n  bool healthy = (!isnan(mo)\
          \ && mo >= 30.0f) && (!isnan(ph) && ph >= 5.8f && ph <= 6.8f);\n  setc(valL,\
          \ healthy ? NEON : AMBER);\n};\npotrow(id(lbl_p1_name), id(lbl_p1_npk),\
          \ id(lbl_p1_vals), 1, id(p1_plant).state,\n       id(p1_moist).state, id(p1_temp).state,\
          \ id(p1_ec).state, id(p1_ph).state, id(p1_n).state, id(p1_p).state, id(p1_k).state);\n\
          potrow(id(lbl_p2_name), id(lbl_p2_npk), id(lbl_p2_vals), 2, id(p2_plant).state,\n\
          \       id(p2_moist).state, id(p2_temp).state, id(p2_ec).state, id(p2_ph).state,\
          \ id(p2_n).state, id(p2_p).state, id(p2_k).state);\npotrow(id(lbl_p3_name),\
          \ id(lbl_p3_npk), id(lbl_p3_vals), 3, id(p3_plant).state,\n       id(p3_moist).state,\
          \ id(p3_temp).state, id(p3_ec).state, id(p3_ph).state, id(p3_n).state, id(p3_p).state,\
          \ id(p3_k).state);\npotrow(id(lbl_p4_name), id(lbl_p4_npk), id(lbl_p4_vals),\
          \ 4, id(p4_plant).state,\n       id(p4_moist).state, id(p4_temp).state,\
          \ id(p4_ec).state, id(p4_ph).state, id(p4_n).state, id(p4_p).state, id(p4_k).state);\n\
          \n// ---------------- device rows (2x4 + 4x8) ----------------\n{\n  auto\
          \ pctlbl = [&](lv_obj_t* L, float v){ if (isnan(v)) lv_label_set_text(L,\
          \ \"--\"); else { char q[8]; snprintf(q, sizeof(q), \"%d%%\", (int)v); lv_label_set_text(L,\
          \ q); } };\n  auto stlbl = [&](lv_obj_t* L, bool on){ lv_label_set_text(L,\
          \ on ? \"ON\" : \"off\"); setc(L, on ? NEON : GREY); };\n  pctlbl(id(sf1000_val),\
          \ id(sf_target).state);\n  pctlbl(id(fanclone_val), id(fan_int_clone_pct).state);\n\
          \  stlbl(id(dem_clone_hum_st), id(dem_clone_hum).state);\n  stlbl(id(dem_mat_st),\
          \ id(dem_mat).state);\n  pctlbl(id(exhout_val), id(fan_out_pct).state);\n\
          \  pctlbl(id(exhroom_val), id(fan_recirc_pct).state);\n  pctlbl(id(intmain_val),\
          \ id(fan_int_main_pct).state);\n  stlbl(id(dem_heater_st), id(dem_heater).state);\n\
          \  stlbl(id(dem_ac_st), id(dem_ac).state);\n  stlbl(id(dem_hum_st), id(dem_hum).state);\n\
          \  stlbl(id(dem_dehum_st), id(dem_dehum).state);\n\n  // ---- animated device\
          \ icons (icon + sensor state) ----\n  // base colour = function tint when\
          \ on, dim grey when off; the\n  // 250ms pass then breathes whichever are\
          \ on (dev_mask bits).\n  auto pon = [](float v){ return !isnan(v) && v >\
          \ 0; };\n  int mask = 0;\n  auto ic = [&](lv_obj_t* L, bool on, uint32_t\
          \ col, int bit){\n    setc(L, on ? col : 0x39424D);\n    if (on) mask |=\
          \ (1 << bit);\n  };\n  ic(id(ic_csf),  pon(id(sf_target).state),       \
          \ AMBER, 0);  // light\n  ic(id(ic_cint), pon(id(fan_int_clone_pct).state),\
          \ CYAN, 1);  // fan\n  ic(id(ic_chum), id(dem_clone_hum).state,        \
          \  CYAN, 2);  // humidifier\n  ic(id(ic_cmat), id(dem_mat).state,      \
          \         ORANGE,3);  // grow mat\n  ic(id(ic_mout), pon(id(fan_out_pct).state),\
          \       CYAN, 4);  // exhaust\n  ic(id(ic_mroom),pon(id(fan_recirc_pct).state),\
          \    CYAN, 5);  // recirc\n  ic(id(ic_mint), pon(id(fan_int_main_pct).state),\
          \  BLUE, 6);  // intake\n  ic(id(ic_mheat),id(dem_heater).state,       \
          \     ORANGE,7);  // heater\n  ic(id(ic_mac),  id(dem_ac).state,       \
          \          BLUE, 8);  // AC\n  ic(id(ic_mhum), id(dem_hum).state,      \
          \          CYAN, 9);  // humidifier\n  ic(id(ic_mdeh), id(dem_dehum).state,\
          \              AMBER,10); // dehumid\n  id(dev_mask) = mask;\n}\n\n// ----------------\
          \ Setup steppers + switches ----------------\n{\n  auto numlbl = [&](lv_obj_t*\
          \ L, float v, const char* fmt){ if (isnan(v)) { lv_label_set_text(L, \"\
          --\"); return; } char q[16]; snprintf(q, sizeof(q), fmt, v); lv_label_set_text(L,\
          \ q); };\n  auto stv = [&](lv_obj_t* L, bool on){ lv_label_set_text(L, on\
          \ ? \"ON\" : \"off\"); setc(L, on ? NEON : GREY); };\n  numlbl(id(s_temp_val),\
          \ id(t_main_temp).state, \"%.1f°\");\n  numlbl(id(s_vmin_val), id(t_main_vpd_min).state,\
          \ \"%.1f\");\n  numlbl(id(s_vmax_val), id(t_main_vpd_max).state, \"%.1f\"\
          );\n  numlbl(id(s_rmin_val), id(t_main_rh_min).state, \"%.0f%\");\n  numlbl(id(s_rmax_val),\
          \ id(t_main_rh_max).state, \"%.0f%\");\n  numlbl(id(s_ctemp_val), id(t_clone_temp).state,\
          \ \"%.1f°\");\n  numlbl(id(s_cvmin_val), id(t_clone_vpd_min).state, \"%.1f\"\
          );\n  numlbl(id(s_cvmax_val), id(t_clone_vpd_max).state, \"%.1f\");\n  numlbl(id(s_crmin_val),\
          \ id(t_clone_rh_min).state, \"%.0f%\");\n  numlbl(id(s_crmax_val), id(t_clone_rh_max).state,\
          \ \"%.0f%\");\n  numlbl(id(s_sftgt_val), id(sf_target).state, \"%.0f%\"\
          );\n  numlbl(id(s_ramp_val), id(n_ramp).state, \"%.0f%\");\n  numlbl(id(s_sunrise_val),\
          \ id(n_sunrise).state, \"%.0fm\");\n  numlbl(id(s_sunset_val), id(n_sunset).state,\
          \ \"%.0fm\");\n  numlbl(id(s_clh_val), id(n_clh).state, \"%.0fh\");\n  numlbl(id(s_rzlo_val),\
          \ id(n_rzlo).state, \"%.1f°\");\n  numlbl(id(s_rzhi_val), id(n_rzhi).state,\
          \ \"%.1f°\");\n  numlbl(id(s_matoff_val), id(n_matoff).state, \"%.0fs\"\
          );\n  numlbl(id(s_chh_val), id(n_chh).state, \"%.1f%\");\n  numlbl(id(s_chmo_val),\
          \ id(n_chmo).state, \"%.0fs\");\n  numlbl(id(s_hmo_val), id(n_hmo).state,\
          \ \"%.0fs\");\n  numlbl(id(s_htmo_val), id(n_htmo).state, \"%.0fs\");\n\
          \  numlbl(id(s_dsp_val), id(n_dsp).state, \"%.0fs\");\n  numlbl(id(s_dsl_val),\
          \ id(n_dsl).state, \"%.0fs\");\n  numlbl(id(s_dslv_val), id(n_dslv).state,\
          \ \"%.0f%\");\n  stv(id(st_lighthold_v), id(st_light_hold).state);\n  stv(id(st_humroute_v),\
          \ id(st_hum_routing).state);\n  stv(id(st_destrat_v), id(st_destrat).state);\n\
          \  stv(id(st_greenhb_v), id(green_heartbeat));\n  lv_label_set_text(id(lbl_clonephoto_val),\
          \ id(sel_clone_photo).state.c_str());\n}\n\n// ---------------- night mode,\
          \ backlight, status LED ----------------\nbool night = !id(win_4x8).state;\n\
          id(night_mode) = night;\nint want = id(panel_sleeping) ? 12 : (night ? 40\
          \ : 100);\nif (want != id(bl_last)) {\n  id(bl_last) = want; auto bl = id(backlight).turn_on();\
          \ bl.set_brightness(want/100.0f); bl.perform();\n}\n// The flashlight commandeers\
          \ the onboard RGB LED while it's on, so\n// the status machine yields; close_flashlight\
          \ sets led_last = -1 to\n// force a re-assert here.\nif (!id(fl_active))\
          \ {\n  // LED state (written only on change — no per-second log spam):\n\
          \  //   1 = ISSUE  -> pulsing red, overrides night (an alert you\n  // \
          \                can't see is useless)\n  //   0 = night dark window ->\
          \ LED off (no stray photons)\n  //   2 = appliance demand   -> solid amber\n\
          \  //   3 = all good           -> dim green\n  int lm;\n  if (ac > 0 &&\
          \ !id(alerts_silenced)) lm = 1;          // ISSUE: red pulse (overrides\
          \ night)\n  else if (night) lm = 0;                               // night\
          \ dark window: off\n  else if (any_dem) lm = 2;                        \
          \     // appliance demand: solid amber\n  else lm = id(green_heartbeat)\
          \ ? 3 : 0;                // all-OK: green pulse if enabled, else off\n\
          \  if (lm != id(led_last)) {\n    id(led_last) = lm;\n    if (lm == 0) {\n\
          \      id(status_led).turn_off().perform();\n    } else if (lm == 1) {\n\
          \      auto c = id(status_led).turn_on();\n      c.set_rgb(1.0f, 0.0f, 0.0f);\
          \ c.set_brightness(1.0f);\n      c.set_effect(\"Breathe\"); c.perform();\n\
          \    } else if (lm == 3) {\n      auto c = id(status_led).turn_on();\n \
          \     c.set_rgb(0.0f, 1.0f, 0.25f); c.set_brightness(1.0f);\n      c.set_effect(\"\
          Breathe\"); c.perform();\n    } else {\n      auto c = id(status_led).turn_on();\n\
          \      c.set_effect(\"None\"); c.set_brightness(0.6f);\n      c.set_rgb(1.0f,\
          \ 0.60f, 0.0f);   // amber = appliance demand\n      c.perform();\n    }\n\
          \  }\n}\n\n// ---------------- screensaver clock ----------------\nauto\
          \ now = id(sntp_time).now();\nif (!now.is_valid()) now = id(ha_time).now();\n\
          if (now.is_valid()) { snprintf(b, sizeof(b), \"%02d:%02d\", now.hour, now.minute);\
          \ lv_label_set_text(id(saver_clock), b); lv_label_set_text(id(lock_clock),\
          \ b); }"
    mode: single
    parameters: {}
interval:
  - interval: 1s
    then:
      - script.execute:
          id: refresh_ui
    startup_delay: 0s
  - interval: 250ms
    then:
      - lambda: !lambda |-
          id(anim_phase) = (id(anim_phase) + 1) % 24;
          int tri = id(anim_phase) < 12 ? id(anim_phase) : 24 - id(anim_phase);   // 0..12
          uint8_t opa = 90 + (uint8_t)(tri * 165 / 12);                           // 90..255
          if (id(lock_engaged)) {
            // lock screen: active devices glow white and breathe, idle sit dim
            lv_color_t white = lv_color_hex(0xFFFFFF), dim = lv_color_hex(0x2A2A2A);
            auto dev = [&](lv_obj_t* L, bool on){
              if (on) { lv_obj_set_style_text_color(L, white, 0); lv_obj_set_style_text_opa(L, opa, 0); }
              else    { lv_obj_set_style_text_color(L, dim, 0);   lv_obj_set_style_text_opa(L, 255, 0); }
            };
            bool fan_on = !isnan(id(fan_out_pct).state) && id(fan_out_pct).state > 0;
            bool int_on = !isnan(id(fan_int_main_pct).state) && id(fan_int_main_pct).state > 0;
            dev(id(lk_fan), fan_on); dev(id(lk_int), int_on); dev(id(lk_heat), id(dem_heater).state);
            dev(id(lk_hum), id(dem_hum).state); dev(id(lk_deh), id(dem_dehum).state); dev(id(lk_light), id(win_4x8).state);
            return;
          }
          // control pages: breathe the opacity of whichever device icons are on
          int m = id(dev_mask);
          auto br = [&](lv_obj_t* L, int bit){ lv_obj_set_style_text_opa(L, (m & (1 << bit)) ? opa : 255, 0); };
          br(id(ic_csf),0);  br(id(ic_cint),1); br(id(ic_chum),2); br(id(ic_cmat),3);
          br(id(ic_mout),4); br(id(ic_mroom),5); br(id(ic_mint),6); br(id(ic_mheat),7);
          br(id(ic_mac),8);  br(id(ic_mhum),9); br(id(ic_mdeh),10);
    startup_delay: 0s
```

## Environment

- Device: DSC-CONTROL (dsc-control.yaml)
- Board: esp32dev
- Platform: esp32
- ESPHome (compiled): 2026.7.2
- ESPHome (running): 2026.7.2
- Device Builder: 1.6.9 (Home Assistant Add-on)
