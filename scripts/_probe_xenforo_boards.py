#!/usr/bin/env python3
"""Quick probe of XenForo board/thread URL shapes for forum scrapers."""

from __future__ import annotations

import re
import ssl
import urllib.error
import urllib.request
from urllib.parse import urljoin, urlparse

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
CTX = ssl.create_default_context()

URLS = [
    "https://www.420magazine.com/community/",
    "https://phenohunter.org/",
    "https://www.marijuanapassion.com/",
]


def fetch(url: str) -> tuple[int | None, str, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=45, context=CTX) as resp:
            body = resp.read(250_000).decode("utf-8", "replace")
            return resp.status, resp.geturl(), body
    except urllib.error.HTTPError as exc:
        body = exc.read(80_000).decode("utf-8", "replace") if exc.fp else ""
        return exc.code, url, body
    except Exception as exc:  # noqa: BLE001
        return None, url, repr(exc)


def main() -> None:
    for u in URLS:
        code, final, body = fetch(u)
        print(f"\n=== {u}")
        print(f" status={code} final={final} body_len={len(body)}")
        low = body.lower()
        if code not in (200,) or "just a moment" in low or "cf-browser" in low:
            print(" BLOCKER", body[:400].replace("\n", " "))
        forums = sorted(
            {
                urljoin(final, m).split("?")[0].rstrip("/") + "/"
                for m in re.findall(r'href=["\']([^"\']*?/forums/[^"\'#?]+)', body, re.I)
            }
        )
        threads = sorted(
            {
                urljoin(final, m).split("?")[0]
                for m in re.findall(r'href=["\']([^"\']*?/threads/[^"\'#?]+)', body, re.I)
            }
        )
        print(f" forums={len(forums)}")
        for f in forums[:20]:
            print("  F", f)
        print(f" threads={len(threads)}")
        for t in threads[:10]:
            print("  T", t)
        # node list titles near forum links
        pairs = []
        for m in re.finditer(
            r'<a[^>]+href=["\']([^"\']+/forums/[^"\'#?]+)["\'][^>]*>(.*?)</a>',
            body,
            re.I | re.S,
        ):
            href = urljoin(final, m.group(1)).split("?")[0]
            title = re.sub(r"<[^>]+>", "", m.group(2))
            title = re.sub(r"\s+", " ", title).strip()
            if title and len(title) < 120:
                pairs.append((title, href))
        seen = set()
        uniq = []
        for t, h in pairs:
            if h in seen:
                continue
            seen.add(h)
            uniq.append((t, h))
        print(f" named_forums={len(uniq)}")
        for t, h in uniq[:25]:
            print(f"  N {t!r} -> {h}")


if __name__ == "__main__":
    main()
