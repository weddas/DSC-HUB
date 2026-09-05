---
name: dsc-spa-pi-verify
description: >-
  Verify DSC-HUB SPA on the Pi brain after frontend changes: build spa-dist,
  hot-patch static into dsc-hub-brain, confirm bundle hash, screenshot checklist,
  and optional multi-plant create/undo. Use when deploying SPA, closing a UI
  pass, or the user asks to verify on Pi / .48:8787.
disable-model-invocation: true
---

# DSC SPA Pi verify

## Hosts

- Pi SPA: `http://192.168.86.48:8787/`
- SSH: `dsc@192.168.86.48`, hostkey `SHA256:4XD2kIJ5qNCnULKNmo/L9mvzLbmZdURLwLW7Utt9NJs`
- Deploy password: project default from `services/dsc-hub/pi/deploy-brain.ps1` (never commit secrets)

## Build + hot-patch (Windows)

From `frontend/`:

```powershell
npm.cmd run build
```

Pack `spa-dist`, `pscp` to `/tmp/…tgz`, then on Pi (sudo):

1. Unpack → `/opt/dsc-hub-repo/brain/static/` (`rsync -a --delete`)
2. `docker cp /opt/dsc-hub-repo/brain/static/. dsc-hub-brain:/app/static/`
3. Confirm `index.html` references the new `assets/index-*.js`
4. `curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8787/` → 200

Cache-bust browser: `?v=<short-hash>#/…`

## Bundle proof

```powershell
(Invoke-WebRequest "http://192.168.86.48:8787/" -UseBasicParsing).Content
# match assets/index-….js then grep strings in that chunk
```

## Screenshot checklist

Save under `docs/qa-screenshots-YYYY-MM-DD/`:

| Surface | Must show |
|---------|-----------|
| `#/live/root` | Probe 1–2 only; horizontal gauges; NPK honesty; no Probe 3/4 cards |
| `#/live/climate` | Air path only; no Sankey / particle theater |
| `#/live/twin` or `#/ops/dash` | Honesty / gated — not blank WebGL |
| `#/settings/device` | Kit probes primary; pot3/4 Advanced restore if present |
| `#/grow/roster` | Probe chrome; after create/delete, UI updates without hard reload |

## Multi-plant create/undo

1. Compose → kit Probe only (empty probe) → Review → Add  
2. Roster shows plant **without** hard reload  
3. Delete → Unassigned **without** hard reload  
4. Leave real plants (e.g. Amnesia) untouched unless user says otherwise  

## Done when

- Live HTML serves the new bundle hash  
- Checklist screenshots exist  
- FOLLOWUPS dated section notes bundle + shot paths  
---
