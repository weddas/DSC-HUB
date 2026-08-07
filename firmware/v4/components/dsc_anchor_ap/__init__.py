# SoftAP channel anchor for ETH01 (F-012) — works with ethernet (no wifi: component).
import esphome.codegen as cg
from esphome.components import binary_sensor, text_sensor, sensor
import esphome.config_validation as cv
from esphome.const import (
    CONF_CHANNEL,
    CONF_ID,
    CONF_PASSWORD,
    CONF_SSID,
    DEVICE_CLASS_CONNECTIVITY,
    ENTITY_CATEGORY_DIAGNOSTIC,
    STATE_CLASS_MEASUREMENT,
)

CODEOWNERS = ["@weddas"]
DEPENDENCIES = ["network"]
AUTO_LOAD = ["binary_sensor", "text_sensor", "sensor"]

CONF_BSSID_SENSOR = "bssid_sensor"
CONF_CHANNEL_SENSOR = "channel_sensor"
CONF_UP_SENSOR = "up_sensor"

dsc_anchor_ap_ns = cg.esphome_ns.namespace("dsc_anchor_ap")
DscAnchorAp = dsc_anchor_ap_ns.class_("DscAnchorAp", cg.Component)

CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(DscAnchorAp),
        cv.Required(CONF_SSID): cv.ssid,
        cv.Required(CONF_PASSWORD): cv.string,
        cv.Optional(CONF_CHANNEL, default=11): cv.int_range(min=1, max=13),
        cv.Optional(CONF_BSSID_SENSOR): cv.use_id(text_sensor.TextSensor),
        cv.Optional(CONF_CHANNEL_SENSOR): cv.use_id(sensor.Sensor),
        cv.Optional(CONF_UP_SENSOR): cv.use_id(binary_sensor.BinarySensor),
    }
).extend(cv.COMPONENT_SCHEMA)


async def to_code(config):
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)
    cg.add(var.set_ssid(config[CONF_SSID]))
    cg.add(var.set_password(config[CONF_PASSWORD]))
    cg.add(var.set_channel(config[CONF_CHANNEL]))
    if CONF_BSSID_SENSOR in config:
        sens = await cg.get_variable(config[CONF_BSSID_SENSOR])
        cg.add(var.set_bssid_sensor(sens))
    if CONF_CHANNEL_SENSOR in config:
        sens = await cg.get_variable(config[CONF_CHANNEL_SENSOR])
        cg.add(var.set_channel_sensor(sens))
    if CONF_UP_SENSOR in config:
        sens = await cg.get_variable(config[CONF_UP_SENSOR])
        cg.add(var.set_up_sensor(sens))
