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


def write_dump(
    path: Path,
    kind: str,
    items: list[dict[str, Any]],
    *,
    compact: bool | None = None,
    **meta: Any,
) -> Path:
    DATA.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema_version": 2,
        "kind": kind,
        "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(items),
        **meta,
        "items": items,
    }
    use_compact = compact if compact is not None else len(items) >= 5000
    if use_compact:
        path.write_text(
            json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
    else:
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
    """Extract flowering/height/THC/CBD/yield/lineage/effects from free text when present."""
    props: dict = {}
    raw = text or ""

    # Flowering: days or weeks (GHSC / bank copy often uses weeks).
    m = re.search(
        r"(?i)flower(?:ing)?(?:\s*time|\s*period|\s*indoor|\s*outdoor)?"
        r"[:\s]+(\d+)\s*[-–to]+\s*(\d+)\s*(days?|w(?:ee)?ks?)",
        raw,
    )
    if m:
        a, b = int(m.group(1)), int(m.group(2))
        mul = 7 if m.group(3).lower().startswith("w") else 1
        props["flowering_days"] = [a * mul, b * mul]
    else:
        m = re.search(
            r"(?i)flower(?:ing)?(?:\s*time|\s*period|\s*indoor|\s*outdoor)?"
            r"[:\s]+(\d+)\s*(days?|w(?:ee)?ks?)",
            raw,
        )
        if m:
            n = int(m.group(1))
            mul = 7 if m.group(2).lower().startswith("w") else 1
            props["flowering_days"] = n * mul
        else:
            # "needs 9 weeks of flowering" / "9 weeks of flowering"
            m = re.search(
                r"(?i)(?:needs?\s+)?(\d+)\s*[-–]?\s*(\d+)?\s*w(?:ee)?ks?\s+(?:of\s+)?flower",
                raw,
            )
            if m:
                a = int(m.group(1))
                b = int(m.group(2) or m.group(1))
                props["flowering_days"] = [a * 7, b * 7] if a != b else a * 7

    # Height in cm (also "average height around 160–180 cm").
    m = re.search(
        r"(?i)(?:height|tall(?:ness)?)(?:\s+around|\s+of)?[:\s]+"
        r"(\d+)\s*[-–to]+\s*(\d+)\s*cm",
        raw,
    )
    if m:
        props["height_cm"] = [int(m.group(1)), int(m.group(2))]
    else:
        m = re.search(
            r"(?i)(?:height|tall(?:ness)?)(?:\s+around|\s+of)?[:\s]+(\d+)\s*cm",
            raw,
        )
        if m:
            props["height_cm"] = int(m.group(1))

    m = re.search(
        r"(?i)thc[:\s]+(\d+(?:\.\d+)?)\s*[-–]?\s*(\d+(?:\.\d+)?)?\s*%?",
        raw,
    )
    if m:
        a = float(m.group(1))
        b = float(m.group(2) or m.group(1))
        props["thc_range"] = [a, b]
        props["chemistry"] = {"thc_range": [a, b]}
    m = re.search(
        r"(?i)cbd[:\s]+(\d+(?:\.\d+)?)\s*[-–]?\s*(\d+(?:\.\d+)?)?\s*%?",
        raw,
    )
    if m:
        a = float(m.group(1))
        b = float(m.group(2) or m.group(1))
        props.setdefault("chemistry", {})
        props["chemistry"]["cbd_range"] = [a, b]
        props["cbd_range"] = [a, b]

    # Yield: require mass units so nav "High Yield Seeds" is ignored.
    m = re.search(
        r"(?i)yield(?:\s*(?:indoor|indoors))?[:\s]+(?:up\s+to\s+)?"
        r"(\d+(?:[.,]\d+)?\s*(?:gr?|g|kg)\s*/\s*m(?:2|²)?)",
        raw,
    )
    if m:
        props["yield_indoor"] = m.group(1).strip()
    else:
        m = re.search(
            r"(?i)(?:yield|production)\s+(?:is\s+)?(?:up\s+to\s+)?"
            r"(\d+(?:[.,]\d+)?\s*(?:gr?|g|kg)\s*/\s*m(?:2|²)?)",
            raw,
        )
        if m:
            props["yield_indoor"] = m.group(1).strip()
    m = re.search(
        r"(?i)(?:yield|production)(?:\s*(?:outdoor|outdoors|per\s+plant))?[:\s]+"
        r"(?:up\s+to\s+)?(\d+(?:[.,]\d+)?\s*(?:gr?|g|kg)\s*/\s*plant)",
        raw,
    )
    if m:
        props["yield_outdoor"] = m.group(1).strip()

    # Genetics / parents (do not invent — only when explicitly labeled or "A x B").
    m = re.search(
        r"(?i)(?:genetics|genetic\s+background|parents?|lineage)\s*[:\-]?\s*"
        r"([A-Za-z0-9][A-Za-z0-9\s\-'.]{1,60}?\s+[x×]\s+[A-Za-z0-9][A-Za-z0-9\s\-'.x×]{1,120}?)"
        r"(?=[.;\n]|$)",
        raw,
    )
    if m:
        lineage = re.sub(r"\s+", " ", m.group(1)).strip(" .;")
        # Truncate at Effects/Flowering if the regex overran.
        lineage = re.split(
            r"(?i)\s+(?:effects?|flowering|yield|description|thc|cbd)\b",
            lineage,
            maxsplit=1,
        )[0].strip(" .;")
        if " x " in lineage.lower() or " × " in lineage:
            props["lineage"] = lineage
            props["parents"] = [
                p.strip()
                for p in re.split(r"\s+[x×]\s+", lineage, flags=re.I)
                if p.strip()
            ]

    m = re.search(
        r"(?i)effects?\s*[:\-]?\s*([^\n.]{8,200})",
        raw,
    )
    if m:
        eff = re.sub(r"\s+", " ", m.group(1)).strip(" .;")
        # Drop if it looks like nav garbage.
        if not re.search(r"(?i)\b(?:menu|cart|seeds?\s+back|bundles)\b", eff):
            props["effects"] = eff

    # Prefer ratio-style type when present ("30% SATIVA - 70% INDICA").
    m = re.search(
        r"(?i)(\d+)\s*%\s*(sativa).*?(\d+)\s*%\s*(indica)|"
        r"(\d+)\s*%\s*(indica).*?(\d+)\s*%\s*(sativa)",
        raw,
    )
    if m:
        g = [x for x in m.groups() if x]
        # pairs of (pct, label)
        pairs = [(int(g[i]), g[i + 1].lower()) for i in range(0, len(g) - 1, 2)]
        if pairs:
            dominant = max(pairs, key=lambda p: p[0])[1]
            props["type"] = dominant
            props["sativa_indica_ratio"] = {lab: pct for pct, lab in pairs}
    else:
        m = re.search(r"(?i)\b(indica|sativa|hybrid|ruderalis)\b", raw)
        if m:
            props["type"] = m.group(0).lower()
    return props
