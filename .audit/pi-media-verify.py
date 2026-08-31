#!/usr/bin/env python3
import json
import urllib.request

BASE = "http://192.168.86.48:8787"
d = json.load(urllib.request.urlopen(f"{BASE}/v1/catalogs/strains/strain_fritz_the_cat", timeout=25))
media = (d.get("evidence") or {}).get("media") or {}
print("schema", d.get("schema"), "media_n", media.get("n"))
sample = (media.get("sample") or [{}])[0]
url = sample.get("url", "")
print("url", url)
if url:
    full = BASE + url if url.startswith("/") else url
    r = urllib.request.urlopen(full, timeout=20)
    print("asset_status", r.status, "type", r.headers.get("Content-Type"), "bytes", len(r.read()))
