# DSC fleet SoftAP provisioning (hub portal + satellite credential pull).
import esphome.codegen as cg
from esphome.components import web_server_base
from esphome.components.web_server_base import CONF_WEB_SERVER_BASE_ID
import esphome.config_validation as cv
from esphome.const import CONF_ID
from esphome.core import CORE

CODEOWNERS = ["@weddas"]

DEPENDENCIES = ["wifi"]

CONF_ROLE = "role"
CONF_ENABLED = "enabled"
CONF_SETUP_AP_PREFIX = "setup_ap_prefix"
CONF_SETUP_AP_PASSWORD = "setup_ap_password"
CONF_ESPNOW_KEY = "espnow_key"
CONF_ESPNOW_CMD_TAG = "espnow_cmd_tag"
CONF_POT_INDEX = "pot_index"
CONF_LAB_HUB_MAC = "lab_hub_mac"
CONF_LAB_PANEL_MAC = "lab_panel_mac"
CONF_DEVICE_NAME = "device_name"

dsc_fleet_setup_ns = cg.esphome_ns.namespace("dsc_fleet_setup")
DscFleetSetup = dsc_fleet_setup_ns.class_("DscFleetSetup", cg.Component)


def AUTO_LOAD():
    return ["web_server_base", "json"]


def _validate_mac(value):
    value = cv.string_strict(value)
    parts = value.split(":")
    if len(parts) != 6:
        raise cv.Invalid("MAC must be AA:BB:CC:DD:EE:FF")
    out = []
    for p in parts:
        if len(p) != 2:
            raise cv.Invalid(f"Invalid MAC octet: {p}")
        out.append(int(p, 16))
    return out


CONFIG_SCHEMA = cv.Schema(
    {
        cv.GenerateID(): cv.declare_id(DscFleetSetup),
        cv.GenerateID(CONF_WEB_SERVER_BASE_ID): cv.use_id(web_server_base.WebServerBase),
        cv.Required(CONF_ROLE): cv.one_of("hub", "control", "pot", lower=True),
        cv.Optional(CONF_ENABLED, default=True): cv.boolean,
        cv.Optional(CONF_SETUP_AP_PREFIX, default="DSC-Setup"): cv.string,
        cv.Required(CONF_SETUP_AP_PASSWORD): cv.string,
        cv.Optional(CONF_ESPNOW_KEY, default=""): cv.string,
        cv.Optional(CONF_ESPNOW_CMD_TAG, default=54727): cv.int_range(min=0, max=65535),
        cv.Optional(CONF_POT_INDEX, default=0): cv.int_range(min=0, max=4),
        cv.Optional(CONF_LAB_HUB_MAC): _validate_mac,
        cv.Optional(CONF_LAB_PANEL_MAC): _validate_mac,
        cv.Optional(CONF_DEVICE_NAME): cv.string,
    }
).extend(cv.COMPONENT_SCHEMA)


async def to_code(config):
    var = cg.new_Pvariable(config[CONF_ID])
    await cg.register_component(var, config)

    base = await cg.get_variable(config[CONF_WEB_SERVER_BASE_ID])
    cg.add(var.set_web_server_base(base))
    cg.add(var.set_enabled(config[CONF_ENABLED]))
    cg.add(var.set_role(config[CONF_ROLE]))
    cg.add(var.set_setup_ap_prefix(config[CONF_SETUP_AP_PREFIX]))
    cg.add(var.set_setup_ap_password(config[CONF_SETUP_AP_PASSWORD]))
    cg.add(var.set_espnow_key(config[CONF_ESPNOW_KEY]))
    cg.add(var.set_espnow_cmd_tag(config[CONF_ESPNOW_CMD_TAG]))
    cg.add(var.set_pot_index(config[CONF_POT_INDEX]))
    if CONF_DEVICE_NAME in config:
        cg.add(var.set_device_name(config[CONF_DEVICE_NAME]))
    elif CORE.name:
        cg.add(var.set_device_name(CORE.name))
    if CONF_LAB_HUB_MAC in config:
        mac = config[CONF_LAB_HUB_MAC]
        cg.add(var.set_lab_hub_mac(mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]))
    if CONF_LAB_PANEL_MAC in config:
        mac = config[CONF_LAB_PANEL_MAC]
        cg.add(var.set_lab_panel_mac(mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]))
