#!/usr/bin/env python3
"""Shared catalog dump / fetch helpers for N-087 importers."""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "homeassistant" / "data"
UA = "DSC-HUB-catalog-research/0.1 (+local research corpus; contact: repo DSC-HUB)"


def name_norm(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (value or "").lower()).strip()


def write_dump(path: Path, kind: str, items: list[dict[str, Any]], **meta: Any) -> Path:
    DATA.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema_version": 2,
        "kind": kind,
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(items),
        **meta,
        "items": items,
    }
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    return path


def fetch_bytes(url: str, *, timeout: int = 120) -> bytes:
    from urllib.parse import quote, urlsplit, urlunsplit

    parts = urlsplit(url)
    # Manufacturer CDNs often use non-ASCII filenames; quote the path.
    safe_url = urlunsplit(
        (
            parts.scheme,
            parts.netloc,
            quote(parts.path, safe="/%"),
            parts.query,
            parts.fragment,
        )
    )
    req = urllib.request.Request(safe_url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def fetch_text(url: str, *, timeout: int = 120, encoding: str = "utf-8") -> str:
    return fetch_bytes(url, timeout=timeout).decode(encoding, errors="replace")


def fetch_json(url: str, *, timeout: int = 120) -> Any:
    return json.loads(fetch_text(url, timeout=timeout))


def polite_get(url: str, *, delay: float = 0.5, timeout: int = 60) -> str:
    time.sleep(max(0.0, delay))
    try:
        return fetch_text(url, timeout=timeout)
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"HTTP {exc.code} for {url}") from exc


def parse_grow_fields(text: str) -> dict:
    """Extract flowering/height/THC/CBD/yield from free text when present."""
    props: dict = {}
    m = re.search(
        r"(?i)flower(?:ing)?(?:\s*time|\s*period)?[:\s]+(\d+)\s*[-–]\s*(\d+)\s*(?:days|day)",
        text,
    )
    if m:
        props["flowering_days"] = [int(m.group(1)), int(m.group(2))]
    else:
        m = re.search(
            r"(?i)flower(?:ing)?(?:\s*time|\s*period)?[:\s]+(\d+)\s*(?:days|day)",
            text,
        )
        if m:
            props["flowering_days"] = int(m.group(1))
    m = re.search(r"(?i)height[:\s]+(\d+)\s*[-–]\s*(\d+)\s*cm", text)
    if m:
        props["height_cm"] = [int(m.group(1)), int(m.group(2))]
    else:
        m = re.search(r"(?i)height[:\s]+(\d+)\s*cm", text)
        if m:
            props["height_cm"] = int(m.group(1))
    m = re.search(r"(?i)thc[:\s]+(\d+(?:\.\d+)?)\s*[-–]?\s*(\d+(?:\.\d+)?)?\s*%?", text)
    if m:
        a = float(m.group(1))
        b = float(m.group(2) or m.group(1))
        props["thc_range"] = [a, b]
        props["chemistry"] = {"thc_range": [a, b]}
    m = re.search(r"(?i)cbd[:\s]+(\d+(?:\.\d+)?)\s*[-–]?\s*(\d+(?:\.\d+)?)?\s*%?", text)
    if m:
        a = float(m.group(1))
        b = float(m.group(2) or m.group(1))
        props.setdefault("chemistry", {})
        props["chemistry"]["cbd_range"] = [a, b]
        props["cbd_range"] = [a, b]
    m = re.search(r"(?i)yield(?:\s*indoor)?[:\s]+([^\n.]{3,60})", text)
    if m:
        props["yield_indoor"] = m.group(1).strip()
    m = re.search(r"(?i)(?:indica|sativa|hybrid|ruderalis)", text)
    if m:
        props["type"] = m.group(0).lower()
    return props
