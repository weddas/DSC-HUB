#!/usr/bin/env python3
"""Add brain-demo.plausible-deniability.net to the Wordpress Cloudflare tunnel."""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

ACCOUNT_ID = "5f9b66214375fd0bf2f3695647bc301c"
TUNNEL_ID = "9bf3f88d-9f4d-4726-8391-c7ad3e81a228"
ZONE_ID = "4eb7ce33b8ac73556265f9641fbfe3e1"
HOSTNAME = "brain-demo.plausible-deniability.net"
SERVICE = "http://127.0.0.1:8788"


def _request(method: str, url: str, token: str, payload: dict | None = None) -> dict:
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    body = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode(errors="replace")
        raise SystemExit(f"{method} {url} failed ({exc.code}): {detail}") from exc


def main() -> int:
    token = os.environ.get("CF_API_TOKEN") or os.environ.get("CLOUDFLARE_API_TOKEN")
    if not token:
        raise SystemExit("Set CF_API_TOKEN to a token with Cloudflare Tunnel Edit + DNS Edit.")

    cfg = _request(
        "GET",
        f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/cfd_tunnel/{TUNNEL_ID}/configurations",
        token,
    )
    ingress = cfg["result"]["config"]["ingress"]
    core = [rule for rule in ingress if rule.get("service") != "http_status:404"]
    if not any(rule.get("hostname") == HOSTNAME for rule in core):
        core.append({"hostname": HOSTNAME, "service": SERVICE, "originRequest": {}})
    core.append({"service": "http_status:404"})
    _request(
        "PUT",
        f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/cfd_tunnel/{TUNNEL_ID}/configurations",
        token,
        {"config": {"ingress": core}},
    )
    print("tunnel ingress updated")

    dns = _request(
        "GET",
        f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records?name={HOSTNAME}",
        token,
    )
    cname = f"{TUNNEL_ID}.cfargotunnel.com"
    if dns.get("result"):
        record_id = dns["result"][0]["id"]
        _request(
            "PUT",
            f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records/{record_id}",
            token,
            {"type": "CNAME", "name": HOSTNAME, "content": cname, "proxied": True, "ttl": 1},
        )
        print("dns updated")
    else:
        _request(
            "POST",
            f"https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/dns_records",
            token,
            {"type": "CNAME", "name": HOSTNAME, "content": cname, "proxied": True, "ttl": 1},
        )
        print("dns created")
    return 0


if __name__ == "__main__":
    sys.exit(main())
