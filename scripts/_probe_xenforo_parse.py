#!/usr/bin/env python3
"""Sample one forum page + one thread per site for parser design."""

from __future__ import annotations

import re
import ssl
import urllib.request
from pathlib import Path

UA = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html",
}
CTX = ssl.create_default_context()
OUT = Path(__file__).resolve().parents[1] / "homeassistant" / "data"

SAMPLES = [
    (
        "420mag",
        "https://www.420magazine.com/community/forums/strain-reviews/",
        "https://www.420magazine.com/community/forums/grow-journals.56/",
        "https://www.420magazine.com/community/forums/cannabis-seeds-clones-strains.26/",
    ),
    (
        "phenohunter",
        "https://phenohunter.org/forums/breeder-threads.15/",
        "https://phenohunter.org/forums/autoflowers.45/",
        "https://phenohunter.org/",
    ),
    (
        "mjpassion",
        "https://www.marijuanapassion.com/forums/grow-journals.25/",
        "https://www.marijuanapassion.com/forums/general-indoor-growing.6/",
        "https://www.marijuanapassion.com/",
    ),
]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45, context=CTX) as resp:
        return resp.read().decode("utf-8", "replace")


def summarize(name: str, url: str, html: str) -> None:
    print(f"\n--- {name} {url} len={len(html)}")
    # structural markers
    for pat in (
        r'data-author=',
        r'class="[^"]*structItem[^"]*"',
        r'class="[^"]*message-body[^"]*"',
        r'itemprop="text"',
        r'class="[^"]*bbWrapper[^"]*"',
        r'class="[^"]*p-title-value[^"]*"',
        r'rel="next"',
        r'page-\d+',
    ):
        print(f"  {pat}: {len(re.findall(pat, html, re.I))}")
    threads = re.findall(
        r'<a[^>]+href=["\']([^"\']+/threads/[^"\'?#]+)["\'][^>]*>(.*?)</a>',
        html,
        re.I | re.S,
    )
    cleaned = []
    for href, title in threads:
        t = re.sub(r"<[^>]+>", "", title)
        t = re.sub(r"\s+", " ", t).strip()
        if t and "/threads/" in href and "prefix" not in href:
            cleaned.append((t[:100], href.split("?")[0]))
    seen = set()
    uniq = []
    for t, h in cleaned:
        if h in seen:
            continue
        seen.add(h)
        uniq.append((t, h))
    print(f"  thread_links={len(uniq)}")
    for t, h in uniq[:8]:
        print(f"    {t!r}")
        print(f"      {h}")
    # pagination
    pages = re.findall(r'href=["\']([^"\']+/page-\d+)["\']', html, re.I)
    print(f"  page_links sample={pages[:5]}")
    # save snippet
    out = OUT / f"_xf_sample_{name}.html"
    out.write_text(html[:120000], encoding="utf-8")
    print(f"  wrote {out.name}")


def main() -> None:
    for name, *urls in SAMPLES:
        for u in urls[:2]:
            try:
                html = fetch(u)
            except Exception as exc:  # noqa: BLE001
                print(name, u, "ERR", exc)
                continue
            summarize(name, u, html)
            # if forum page, also fetch first real thread
            for href_m in re.finditer(
                r'href=["\']([^"\']+/threads/[a-z0-9\-]+\.\d+/?)["\']', html, re.I
            ):
                th = href_m.group(1)
                if th.startswith("/"):
                    from urllib.parse import urljoin

                    th = urljoin(u, th)
                try:
                    thtml = fetch(th)
                except Exception as exc:  # noqa: BLE001
                    print("  thread ERR", th, exc)
                    break
                print(f"\n  THREAD {th} len={len(thtml)}")
                title_m = re.search(
                    r'<h1[^>]*class="[^"]*p-title-value[^"]*"[^>]*>(.*?)</h1>',
                    thtml,
                    re.I | re.S,
                )
                if title_m:
                    title = re.sub(r"<[^>]+>", "", title_m.group(1))
                    title = re.sub(r"\s+", " ", title).strip()
                    print(f"  title={title!r}")
                bodies = re.findall(
                    r'class="[^"]*bbWrapper[^"]*"[^>]*>(.*?)</div>',
                    thtml,
                    re.I | re.S,
                )
                print(f"  bbWrappers={len(bodies)}")
                if bodies:
                    text = re.sub(r"<[^>]+>", " ", bodies[0])
                    text = re.sub(r"\s+", " ", text).strip()
                    print(f"  first_post={text[:400]!r}")
                (OUT / f"_xf_thread_{name}.html").write_text(thtml[:150000], encoding="utf-8")
                break
            break


if __name__ == "__main__":
    main()
