import base64
import pathlib
import re

p = pathlib.Path("secrets.yaml")
t = p.read_text(encoding="utf-8")


def b64(start: int) -> str:
    return base64.b64encode(bytes(range(start, start + 32))).decode("ascii")


keys = {
    "dsc_bridge_api_key": b64(1),
    "dsc_heater_api_key": b64(2),
    "dsc_heatmat_api_key": b64(3),
    "dsc_humidifier_api_key": b64(4),
    "dsc_dehumidifier_api_key": b64(5),
    "dsc_bridge_ota_password": "0123456789abcdef",
    "dsc_bridge_ap_password": "changeme_bridge_ap12",
    "dsc_anchor_ap_password": "changeme_anchor_ap12",
    "dsc_heater_host": "192.168.86.101",
    "dsc_heatmat_host": "192.168.86.102",
    "dsc_humidifier_host": "192.168.86.103",
    "dsc_dehumidifier_host": "192.168.86.104",
}

for k, v in keys.items():
    if re.search(rf"(?m)^{k}:", t):
        t = re.sub(rf"(?m)^{k}:.*$", f'{k}: "{v}"', t)
    else:
        t += f'\n{k}: "{v}"\n'

p.write_text(t, encoding="utf-8")
raw = re.search(r'(?m)^dsc_bridge_api_key:\s*"([^"]*)"', t).group(1)
print("dsc_bridge_api_key bytes", len(base64.b64decode(raw)))
