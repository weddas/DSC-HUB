#!/usr/bin/env python3
"""Find how OZ Stoners exposes grow-topic URLs in HTML."""
from __future__ import annotations

import re
import ssl
import sys
import urllib.request
from collections import Counter
from urllib.parse import urljoin

CTX = ssl.create_default_context()
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60, context=CTX) as resp:
        return resp.read().decode("utf-8", "replace")


def main() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
    for url in (
        "https://community.ozstoners.com/",
        "https://community.ozstoners.com/?forumId=8",
        "https://community.ozstoners.com/index.php?/forum/8-grow-rooms/",
        "https://community.ozstoners.com/forum/8-grow-rooms/",
    ):
        try:
            html = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(url, "ERR", exc)
            continue
        topics = re.findall(r"/topic/\d+-[a-z0-9\-]+", html, re.I)
        print(url, "len", len(html), "topic_hits", len(topics), "unique", len(set(topics)))
        for t in list(dict.fromkeys(topics))[:8]:
            print(" ", t)
        # IPS often uses data-topicid
        ids = re.findall(r"data-topicid=[\"']?(\d+)", html, re.I)
        print("  data-topicid", len(ids), list(dict.fromkeys(ids))[:10])
        # forum path variants
        forums = re.findall(r'href=["\']([^"\']*forum[^"\']*)["\']', html, re.I)
        print("  forum_hrefs sample", forums[:10])


if __name__ == "__main__":
    main()
