# Pi SPA / brain hotpatch (Windows)

**In one line:** Push a rebuilt spa-dist (and optionally brain package) into the live `dsc-hub-brain` container with **PuTTY `pscp`/`plink`**, not OpenSSH `scp`.

**Tip:** `3a452f0` / `a2f5f08` · rule [`.cursor/rules/dsc-pi-hotpatch.mdc`](../../.cursor/rules/dsc-pi-hotpatch.mdc)  
**Scripts:** `.audit/stress-spa-only-hotpatch.ps1` · `.audit/stress-roster-hotpatch.ps1`  
**Host:** lab Pi (`dsc@…`, container `dsc-hub-brain`, static `/app/static/`)

## Intent

After SPA or brain changes, verify on the live kit without a full image rebuild. Agent shells on Windows often hang on OpenSSH `scp` password prompts — PuTTY batch tools with an explicit hostkey avoid that.

## When to use which script

| Script | Ships | Restart brain? |
|--------|-------|----------------|
| `stress-spa-only-hotpatch.ps1` | spa-dist tarball → `/app/static/` | No |
| `stress-roster-hotpatch.ps1` | SPA + brain tarball | Yes (script restarts container) |

## SPA-only flow

```mermaid
flowchart LR
  build["Build spa-dist"] --> tar["tar -czf %TEMP%\\stress-spa.tgz -C spa-dist ."]
  tar --> pscp["pscp → Pi /tmp"]
  pscp --> dock["docker cp → /app/static/"]
  dock --> verify["curl :8787/ index hash"]
```

1. Build frontend so `homeassistant/custom_components/dsc_hub/frontend/spa-dist/index.html` references the new `assets/index-*.js`.
2. `tar -czf %TEMP%\stress-spa.tgz -C <spa-dist> .`
3. Run the spa-only hotpatch script (or equivalent `pscp` + remote `docker cp`).
4. Verify both local and served hashes match:

```bash
# On Pi (or via plink)
grep -oE 'assets/index-[^"]+\.js' /path/to/spa-dist/index.html | head -1
curl -sf http://127.0.0.1:8787/ | grep -oE 'assets/index-[^"]+\.js' | head -1
```

Tip `a2f5f08` expects spa-dist **`index-D7pAmjOB.js`**.

## Constraints

- Use **`pscp`/`plink` `-batch -hostkey …`**. Do not rely on interactive OpenSSH `scp`.
- If PowerShell execution policy blocks `-File`, invoke `pscp`/`plink` directly.
- **Never commit** live Pi passwords, sudo phrases, or API keys into docs, FOLLOWUPS tip blurbs, Notion Wiki, or PR bodies. Keep lab credentials in the Notion **API Keys & Credentials** DB (and gitignored local env) — rotate if a shared script ever embedded them.
- Do not invent height/chem/PPFD/NPK in verification notes.

## Related

- Roster audit SoT: [`../brain/ROSTER-STOCK.md`](../brain/ROSTER-STOCK.md)
- Cursor rule: `.cursor/rules/dsc-pi-hotpatch.mdc`
- FOLLOWUPS § *2026-09-01 — Post-stress audit*
