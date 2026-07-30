# DSC-HUB firmware v4

Working directory for ESPHome configs. See the repo [README](../../README.md) for the full setup.

## Quick validate

```bash
esphome config dsc-hub-v4_0.yaml
esphome config dsc-control.yaml
g++ -std=c++17 -Wall -Wextra -O2 -o verify_v4 verify_v4.cpp && ./verify_v4
```

Requires `secrets.yaml` in this folder (gitignored). Start from `secrets.yaml.template` if needed.

`espnow_cmd_tag` is **54727** (`0xD5C7`) on hub + panel — flash both after changing it.
