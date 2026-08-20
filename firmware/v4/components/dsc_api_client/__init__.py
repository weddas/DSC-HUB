# DSC native API client — Noise NNpsk0 SwitchCommand to ESPHome Sonoffs (F-010).
import esphome.codegen as cg
from esphome.components import binary_sensor
import esphome.config_validation as cv
from esphome.const import (
    CONF_ID,
    CONF_PORT,
    DEVICE_CLASS_CONNECTIVITY,
    ENTITY_CATEGORY_DIAGNOSTIC,
)

CODEOWNERS = ["@weddas"]

DEPENDENCIES = ["network"]
AUTO_LOAD = ["socket", "network"]
MULTI_CONF = True

CONF_HOST = "host"
CONF_ENCRYPTION_KEY = "encryption_key"
CONF_SWITCH_OBJECT_ID = "switch_object_id"
CONF_TEST_MODE_OBJECT_ID = "test_mode_object_id"

dsc_api_client_ns = cg.esphome_ns.namespace("dsc_api_client")
DscApiClient = dsc_api_client_ns.class_("DscApiClient", cg.Component, binary_sensor.BinarySensor)

CONFIG_SCHEMA = (
    binary_sensor.binary_sensor_schema(
        DscApiClient,
        device_class=DEVICE_CLASS_CONNECTIVITY,
        entity_category=ENTITY_CATEGORY_DIAGNOSTIC,
    )
    .extend(
        {
            cv.Required(CONF_HOST): cv.string,
            cv.Optional(CONF_PORT, default=6053): cv.port,
            cv.Required(CONF_ENCRYPTION_KEY): cv.string,
            cv.Optional(CONF_SWITCH_OBJECT_ID, default="main_relay"): cv.string,
            cv.Optional(CONF_TEST_MODE_OBJECT_ID, default="test_mode"): cv.string,
        }
    )
    .extend(cv.COMPONENT_SCHEMA)
)


async def to_code(config):
    var = await binary_sensor.new_binary_sensor(config)
    await cg.register_component(var, config)

    cg.add(var.set_host(config[CONF_HOST]))
    cg.add(var.set_port(config[CONF_PORT]))
    cg.add(var.set_encryption_key(config[CONF_ENCRYPTION_KEY]))
    cg.add(var.set_switch_object_id(config[CONF_SWITCH_OBJECT_ID]))
    cg.add(var.set_test_mode_object_id(config[CONF_TEST_MODE_OBJECT_ID]))

    cg.add_define("USE_API_NOISE")
    cg.add_library("esphome/noise-c", "0.1.21")
