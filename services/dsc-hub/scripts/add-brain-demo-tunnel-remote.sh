#!/bin/bash
# Run on Digital-Gateway (Unraid) as root. Uses NPM Cloudflare DNS token if CF_API_TOKEN unset.
set -euo pipefail

ACCT="5f9b66214375fd0bf2f3695647bc301c"
TUNNEL="9bf3f88d-9f4d-4726-8391-c7ad3e81a228"
ZONE="4eb7ce33b8ac73556265f9641fbfe3e1"
HOST="brain-demo.plausible-deniability.net"
SERVICE="http://127.0.0.1:8788"

if [[ -z "${CF_API_TOKEN:-}" ]]; then
  CF_API_TOKEN="$(docker exec Nginx-Proxy-Manager-Official sh -c "grep dns_cloudflare_api_token /etc/letsencrypt/credentials/credentials-12 | cut -d= -f2- | tr -d '\r'")"
fi

auth=(-H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json")
base="https://api.cloudflare.com/client/v4"

cfg="$(curl -sf "${auth[@]}" "${base}/accounts/${ACCT}/cfd_tunnel/${TUNNEL}/configurations")"
python3 - <<PY
import json, os, subprocess, sys
cfg = json.loads('''${cfg}''')
ingress = cfg["result"]["config"]["ingress"]
host = "${HOST}"
service = "${SERVICE}"
core = [r for r in ingress if r.get("service") != "http_status:404"]
if not any(r.get("hostname") == host for r in core):
    core.append({"hostname": host, "service": service, "originRequest": {}})
core.append({"service": "http_status:404"})
payload = json.dumps({"config": {"ingress": core}})
open("/tmp/brain-demo-ingress.json", "w").write(payload)
print("ingress rules:", len(core))
PY

put="$(curl -sf -X PUT "${auth[@]}" -d @/tmp/brain-demo-ingress.json "${base}/accounts/${ACCT}/cfd_tunnel/${TUNNEL}/configurations")"
echo "$put" | python3 -c "import json,sys; d=json.load(sys.stdin); print('tunnel put', d.get('success')); sys.exit(0 if d.get('success') else 1)"

dnsq="$(curl -sf "${auth[@]}" "${base}/zones/${ZONE}/dns_records?name=${HOST}")"
exists="$(echo "$dnsq" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['result'][0]['id'] if d.get('result') else '')")"
cname="${TUNNEL}.cfargotunnel.com"
body="$(python3 - <<PY
import json
print(json.dumps({"type":"CNAME","name":"${HOST}","content":"${cname}","proxied":True,"ttl":1}))
PY
)"
if [[ -n "$exists" ]]; then
  dns="$(curl -sf -X PUT "${auth[@]}" -d "$body" "${base}/zones/${ZONE}/dns_records/${exists}")"
else
  dns="$(curl -sf -X POST "${auth[@]}" -d "$body" "${base}/zones/${ZONE}/dns_records")"
fi
echo "$dns" | python3 -c "import json,sys; d=json.load(sys.stdin); print('dns', d.get('success')); sys.exit(0 if d.get('success') else 1)"

curl -sf "http://127.0.0.1:8788/health" | head -c 200
echo
