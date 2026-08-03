# HA auto-sync — Unraid + HAOS bootstrap

One-time setup so pushes to `master` that touch `homeassistant/**` deploy
packages, the YAML dashboard, and www assets to HAOS.

**Rotate any HA password that was shared in chat** before continuing
(Settings → People). Deploy never uses the UI password — only an SSH key
and a long-lived access token.

## Prerequisites

- HAOS reachable at e.g. `http://192.168.86.3:8123`
- Unraid on the same LAN (hosts the self-hosted GitHub Actions runner)
- HAOS **Terminal & SSH** add-on enabled
- Repo secrets (GitHub → Settings → Secrets and variables → Actions)

| Secret | Example | Notes |
|---|---|---|
| `HA_HOST` | `192.168.86.3` | HA API host |
| `HA_PORT` | `8123` | Optional; defaults to 8123 |
| `HA_TOKEN` | `eyJ...` | Long-lived token (Profile → Security) |
| `HA_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Private key; matching public key in HA SSH add-on |
| `HA_SSH_HOST` | `192.168.86.3` | Optional; defaults to `HA_HOST` |
| `HA_SSH_USER` | `root` | Optional; HAOS SSH add-on default |
| `HA_SSH_PORT` | `22` | Optional |

Never commit these values. Never put `secrets.yaml` in the sync path.

## 1. HAOS — SSH + config shape

1. Install / enable **Terminal & SSH** add-on.
2. Add the runner’s **public** key under authorized keys.
3. Merge [`configuration.snippet.yaml`](../homeassistant/configuration.snippet.yaml) into `/config/configuration.yaml`:
   - `homeassistant.packages: !include_dir_named packages`
   - YAML-mode Lovelace dashboard `dsc-hub-pro` → `dashboards/dsc-hub-v4-dashboard.yaml`
4. Create `/config/dashboards/` (the sync script also `mkdir -p`s it).
5. If you already have a **UI-managed** dashboard at URL `dsc-hub-pro`, remove or rename it so the YAML dashboard owns that path.
6. If DSC automations were previously merged into `/config/automations.yaml` or the UI, **delete those duplicate ids** after `dsc_v4_automations.yaml` is in `packages/` (same ids collide).
7. Restart HA once after the `configuration.yaml` change.
8. Profile → Security → **Create long-lived access token** (name e.g. `dsc-hub-sync`) → store as `HA_TOKEN`.

## 2. Unraid — self-hosted runner

1. GitHub repo → Settings → Actions → Runners → **New self-hosted runner**.
2. Install on Unraid (Docker image such as `myoung34/github-runner`, or a privileged LXC/VM).
3. Register with labels including **`unraid-ha-deploy`** (workflow `runs-on` requires this).
4. Ensure the runner container/host can:
   - Reach `HA_HOST:8123` (HTTP)
   - SSH to `HA_SSH_HOST:HA_SSH_PORT`
   - Run `bash`, `scp`, `ssh`, `curl`
5. Keep the runner online; idle runners miss push events until the next job.

Example env for a typical runner container (adjust paths/tokens):

```text
RUNNER_SCOPE=repo
REPO_URL=https://github.com/weddas/DSC-HUB
RUNNER_NAME=unraid-ha-deploy
RUNNER_LABELS=self-hosted,unraid-ha-deploy
ACCESS_TOKEN=<github PAT with repo admin for registration>
```

Use a **registration PAT** only to enroll the runner; day-to-day jobs use the workflow secrets above.

## 3. First sync

1. Confirm secrets are set on the repo.
2. Actions → **HA sync** → Run workflow (optional dry run first).
3. Or push a no-op change under `homeassistant/packages/`.
4. On HA: confirm `/config/packages/dsc_v4_*.yaml` timestamps updated, dashboard URL `dsc-hub-pro` loads, automations with `dsc_` ids are present.

Manual local dry run from a machine that can SSH to HA:

```bash
export HA_HOST=192.168.86.3
export HA_TOKEN=...          # long-lived token
export HA_SSH_KEY=~/.ssh/ha_deploy
export DRY_RUN=1
./scripts/ha-sync.sh
```

## 4. What syncs / what does not

| Syncs on push (ha-sync) | Does not sync / other channel |
|---|---|
| `packages/dsc_v4_*.yaml` | `secrets.yaml` |
| `dashboards/dsc-hub-v4-dashboard.yaml` | `.storage/` |
| `www/` system-map SVG + **bundled** `dsc-system-map-card.js` (system+airflow) | Non-DSC house packages |
| ESPHome stubs only if `SYNC_ESPHOME=1` | Firmware flash / ESPHome Install |
| | **SYSTEM MAP card via HACS** — [`HACS-FRONTEND.md`](HACS-FRONTEND.md) |

Prefer HACS for the SYSTEM MAP card; ha-sync still mirrors `www/` for sites
not using HACS yet.

Firmware still: Cursor → push → ESPHome Validate/Install per device.
