#!/usr/bin/env python3
"""Scrape strain-database.com EN strain pages (research corpus).

Sitemap: https://strain-database.com/sitemap/{0,1}.xml (~5k EN /strain/{slug})
Pattern: https://strain-database.com/strain/{slug}  (skip /de/)
robots: Disallow /api/ — never hit /api/

Checkpoint/resume, polite delay, maximize fields, lineage_mermaid via
scripts/lineage_to_mermaid.py. redistributable=false.

On Cloudflare / Anubis wall: stop and print the exact blocked URL.
"""

from __future__ import annotations

import argparse
import hashlib
import html as html_lib
import json
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT))

from catalog_common import DATA, name_norm, parse_grow_fields, write_dump  # noqa: E402
from catalog_fetch import Checkpoint  # noqa: E402
from lineage_to_mermaid import enrich_lineage_fields  # noqa: E402

SOURCE = "strain_database"
SOURCE_URL = "https://strain-database.com/strains"
SITEMAP_INDEX = "https://strain-database.com/sitemap.xml"
SITEMAP_PARTS = (
    "https://strain-database.com/sitemap/0.xml",
    "https://strain-database.com/sitemap/1.xml",
)
NOTE = (
    "research scrape of public strain-database.com HTML; "
    "redistributable=false until legal review"
)
OUT = DATA / "dsc_strains_straindatabase.json"
CK_PATH = DATA / "dsc_strains_straindatabase.checkpoint.json"
SITEMAP_CACHE = DATA / "dsc_strains_straindatabase.sitemap_urls.json"
COOKIE_JAR = DATA / "dsc_strains_straindatabase.cookies.json"
# Chrome export (scripts/chrome_cookies_for_domain.py) — preferred if present
CHROME_COOKIE_EXPORT = DATA / "_strain_database_cookies.json"
# Netscape cookies.txt (e.g. "Get cookies.txt LOCALLY" Chrome extension export)
COOKIE_TXT = DATA / "dsc_strains_straindatabase.cookies.txt"

EN_STRAIN_RE = re.compile(
    r"^https://strain-database\.com/strain/([a-z0-9\-]+)/?$",
    re.I,
)

try:
    from curl_cffi import requests as cffi_requests  # type: ignore

    HAS_CFFI = True
except ImportError:  # pragma: no cover
    cffi_requests = None  # type: ignore
    HAS_CFFI = False

import urllib.error
import urllib.request


def clean(html: str) -> str:
    t = re.sub(r"(?is)<script.*?</script>", " ", html or "")
    t = re.sub(r"(?is)<style.*?</style>", " ", t)
    t = re.sub(r"(?is)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html_lib.unescape(t)).strip()


def is_cloudflare_wall(html: str, status: int | None = None) -> bool:
    low = (html or "").lower()
    if status == 403 and (
        "just a moment" in low
        or "cf-browser-verification" in low
        or "challenge-platform" in low
    ):
        return True
    markers = (
        "just a moment...",
        "cf-browser-verification",
        "attention required | cloudflare",
        "enable javascript and cookies to continue",
        "cdn-cgi/challenge-platform",
    )
    if any(m in low for m in markers):
        return True
    if len(low) < 2500 and ("cloudflare" in low and "challenge" in low):
        return True
    return False


def is_anubis_wall(html: str) -> bool:
    return "anubis_challenge" in (html or "") and (
        "Verifying you" in (html or "") or "cannai" in (html or "").lower()
    )


class FetchError(RuntimeError):
    def __init__(self, url: str, kind: str, status: int | None = None, detail: str = ""):
        self.url = url
        self.kind = kind
        self.status = status
        super().__init__(f"{kind} {status or ''} {url} {detail}".strip())


class Session:
    """HTTPS-only session (curl_cffi preferred). Optional cookie jar path."""

    def __init__(self, *, cookie_path: Path | None = None, impersonate: str = "chrome131"):
        self.cookie_path = cookie_path or COOKIE_JAR
        self.impersonate = impersonate
        self._cffi = cffi_requests.Session() if HAS_CFFI else None
        self._load_cookies()

    def _cookie_candidate_paths(self) -> list[Path]:
        """Prefer Chrome export jar, Netscape txt, then scraper jar."""
        ordered: list[Path] = []
        for p in (CHROME_COOKIE_EXPORT, COOKIE_TXT, self.cookie_path, COOKIE_JAR):
            if p not in ordered:
                ordered.append(p)
        return ordered

    def _apply_cookie_map(self, jar: dict[str, Any], *, domain: str) -> int:
        if not self._cffi or not jar:
            return 0
        n = 0
        for name, value in jar.items():
            if not name or value is None or value == "":
                continue
            self._cffi.cookies.set(str(name), str(value), domain=domain)
            n += 1
        return n

    @staticmethod
    def _parse_netscape_cookies(path: Path) -> dict[str, str]:
        """Parse Netscape cookies.txt (Get cookies.txt LOCALLY export)."""
        jar: dict[str, str] = {}
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            return jar
        for line in text.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 7:
                continue
            domain, _flag, _path, _secure, _expires, name, value = parts[:7]
            host = domain.lstrip(".").lower()
            if "strain-database.com" not in host:
                continue
            if name:
                jar[name] = value
        return jar

    def _load_cookies(self) -> None:
        if not self._cffi:
            return
        loaded_from: Path | None = None
        applied = 0
        for path in self._cookie_candidate_paths():
            if not path.exists():
                continue
            jar: dict[str, Any] = {}
            domain = "strain-database.com"
            if path.suffix.lower() == ".txt":
                jar = self._parse_netscape_cookies(path)
            else:
                try:
                    raw = json.loads(path.read_text(encoding="utf-8"))
                except (OSError, json.JSONDecodeError):
                    continue
                domain = str(raw.get("domain") or "strain-database.com").lstrip(".")
                jar = raw.get("cookies") or {}
                if not isinstance(jar, dict):
                    continue
            if not jar:
                continue
            applied = self._apply_cookie_map(jar, domain=domain)
            if applied:
                loaded_from = path
                # Keep scraper jar in sync for resume / save_cookies
                self.cookie_path = COOKIE_JAR
                break
        if loaded_from:
            print(f"session: loaded {applied} cookies from {loaded_from.name}")

    def reload_cookies(self) -> int:
        """Re-read jar files (after chrome_cookies_for_domain export)."""
        if self._cffi is not None:
            try:
                self._cffi.cookies.clear()
            except Exception:  # noqa: BLE001
                pass
        before = 0
        self._load_cookies()
        if self._cffi is not None:
            before = len(list(self._cffi.cookies))
        return before

    def save_cookies(self) -> None:
        if not self._cffi:
            return
        jar = {c.name: c.value for c in self._cffi.cookies}
        self.cookie_path.parent.mkdir(parents=True, exist_ok=True)
        self.cookie_path.write_text(
            json.dumps(
                {
                    "domain": "strain-database.com",
                    "saved_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "cookies": jar,
                },
                indent=2,
            ),
            encoding="utf-8",
        )

    def get(self, url: str, *, timeout: int = 60) -> tuple[int, str]:
        if not url.startswith("https://strain-database.com/"):
            raise FetchError(url, "BAD_HOST")
        if "/api/" in urlparse(url).path:
            raise FetchError(url, "ROBOTS_DISALLOW_API")
        if self._cffi is not None:
            r = self._cffi.get(url, impersonate=self.impersonate, timeout=timeout)
            return int(r.status_code), r.text or ""
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/128.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return int(getattr(resp, "status", 200) or 200), resp.read().decode(
                    "utf-8", "replace"
                )
        except urllib.error.HTTPError as exc:
            body = ""
            try:
                body = exc.read().decode("utf-8", "replace")
            except Exception:  # noqa: BLE001
                pass
            return int(exc.code), body


def _solve_anubis_fast(random_data: str, difficulty: int) -> tuple[int, str, float]:
    t0 = time.time()
    nonce = 0
    prefix = "0" * int(difficulty)
    while True:
        digest = hashlib.sha256(f"{random_data}{nonce}".encode()).hexdigest()
        if digest.startswith(prefix):
            return nonce, digest, time.time() - t0
        nonce += 1


def try_pass_anubis(session: Session, html: str, *, redir: str) -> bool:
    m = re.search(r'<script id="anubis_challenge"[^>]*>(.*?)</script>', html or "", re.S)
    if not m:
        return False
    doc = json.loads(m.group(1).strip())
    ch = doc.get("challenge") or doc
    rules = doc.get("rules") or {}
    difficulty = int(ch.get("difficulty") or rules.get("difficulty") or 2)
    random_data = ch["randomData"]
    cid = ch["id"]
    nonce, digest, elapsed = _solve_anubis_fast(random_data, difficulty)
    elapsed_ms = max(1, int(elapsed * 1000))
    pass_url = (
        "https://strain-database.com/.within.website/x/cmd/anubis/api/pass-challenge"
        f"?id={quote(cid)}&response={digest}&nonce={nonce}"
        f"&redir={quote(redir, safe='')}&elapsedTime={elapsed_ms}"
    )
    status, body = session.get(pass_url, timeout=60)
    session.save_cookies()
    if is_cloudflare_wall(body, status):
        return False
    if is_anubis_wall(body):
        return False
    return status in (200, 302, 303, 307) or (status == 200 and not is_anubis_wall(body))


def fetch_html(session: Session, url: str, *, delay: float) -> str:
    time.sleep(max(0.0, delay))
    status, body = session.get(url)
    if is_cloudflare_wall(body, status):
        raise FetchError(url, "CLOUDFLARE", status)
    if is_anubis_wall(body):
        ok = try_pass_anubis(session, body, redir=url)
        if not ok:
            raise FetchError(url, "ANUBIS", status)
        time.sleep(max(0.2, delay * 0.5))
        status, body = session.get(url)
        if is_cloudflare_wall(body, status):
            raise FetchError(url, "CLOUDFLARE", status)
        if is_anubis_wall(body):
            raise FetchError(url, "ANUBIS", status)
    if status >= 400:
        raise FetchError(url, "HTTP", status)
    return body


def extract_json_ld(html: str) -> list[dict]:
    out: list[dict] = []
    for m in re.finditer(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html or "",
        re.I | re.S,
    ):
        raw = m.group(1).strip()
        if not raw:
            continue
        try:
            doc = json.loads(raw)
        except json.JSONDecodeError:
            continue
        if isinstance(doc, list):
            out.extend(x for x in doc if isinstance(x, dict))
        elif isinstance(doc, dict):
            out.append(doc)
    return out


def extract_next_data(html: str) -> dict | None:
    m = re.search(
        r'<script[^>]*id=["\']__NEXT_DATA__["\'][^>]*>(.*?)</script>',
        html or "",
        re.I | re.S,
    )
    if not m:
        return None
    try:
        doc = json.loads(m.group(1))
    except json.JSONDecodeError:
        return None
    return doc if isinstance(doc, dict) else None


def _meta(html: str, prop: str) -> str | None:
    m = re.search(
        rf'<meta[^>]+(?:property|name)=["\']{re.escape(prop)}["\'][^>]+content=["\']([^"\']+)["\']',
        html or "",
        re.I,
    )
    if not m:
        m = re.search(
            rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']{re.escape(prop)}["\']',
            html or "",
            re.I,
        )
    return html_lib.unescape(m.group(1)).strip() if m else None


def _label_value(html: str, labels: tuple[str, ...]) -> str | None:
    for lab in labels:
        m = re.search(
            rf"(?is)(?:<th[^>]*>|<dt[^>]*>|<span[^>]*>|<div[^>]*>)\s*{lab}\s*"
            rf"(?:</th>|</dt>|</span>|</div>)\s*"
            rf"(?:<td[^>]*>|<dd[^>]*>|<span[^>]*>|<div[^>]*>)\s*(.*?)\s*"
            rf"(?:</td>|</dd>|</span>|</div>)",
            html or "",
        )
        if m:
            val = clean(m.group(1))
            if val:
                return val[:500]
        m = re.search(rf"(?i){lab}\s*[:=]\s*([^\n<|]{{2,200}})", clean(html))
        if m:
            return m.group(1).strip()[:500]
    return None


def _uniq(seq: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for x in seq:
        k = (x or "").strip()
        if not k:
            continue
        lk = k.lower()
        if lk in seen:
            continue
        seen.add(lk)
        out.append(k)
    return out


def _list_from_links(html: str, path_part: str) -> list[str]:
    labels: list[str] = []
    for m in re.finditer(
        rf'href=["\'][^"\']*{re.escape(path_part)}[^"\']*["\'][^>]*>([^<]+)<',
        html or "",
        re.I,
    ):
        labels.append(html_lib.unescape(m.group(1)).strip())
    return _uniq(labels)


def _parse_reviews(html: str, blocks: list[dict]) -> list[dict]:
    reviews: list[dict] = []
    for b in blocks:
        if b.get("@type") == "Review" or (
            isinstance(b.get("@type"), list) and "Review" in b.get("@type")
        ):
            reviews.append(
                {
                    "author": (b.get("author") or {}).get("name")
                    if isinstance(b.get("author"), dict)
                    else b.get("author"),
                    "rating": (b.get("reviewRating") or {}).get("ratingValue")
                    if isinstance(b.get("reviewRating"), dict)
                    else b.get("ratingValue"),
                    "body": b.get("reviewBody") or b.get("description"),
                    "date": b.get("datePublished"),
                }
            )
        if b.get("@type") == "Product":
            for rev in b.get("review") or []:
                if isinstance(rev, dict):
                    reviews.append(
                        {
                            "author": (rev.get("author") or {}).get("name")
                            if isinstance(rev.get("author"), dict)
                            else rev.get("author"),
                            "rating": (rev.get("reviewRating") or {}).get("ratingValue")
                            if isinstance(rev.get("reviewRating"), dict)
                            else None,
                            "body": rev.get("reviewBody"),
                            "date": rev.get("datePublished"),
                        }
                    )
    # HTML review cards
    for m in re.finditer(
        r'(?is)<(?:article|div)[^>]*class=["\'][^"\']*review[^"\']*["\'][^>]*>(.*?)</(?:article|div)>',
        html or "",
    ):
        chunk = m.group(1)
        body = clean(chunk)[:1200]
        if body and len(body) > 40:
            reviews.append({"body": body})
        if len(reviews) >= 40:
            break
    # dedupe by body prefix
    seen: set[str] = set()
    out: list[dict] = []
    for r in reviews:
        key = str(r.get("body") or r.get("author") or "")[:80].lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append({k: v for k, v in r.items() if v not in (None, "", [], {})})
    return out


def parse_strain_page(html: str, url: str) -> dict[str, Any]:
    blocks = extract_json_ld(html)
    next_data = extract_next_data(html)
    product = next((b for b in blocks if b.get("@type") == "Product"), {}) or {}
    web_page = next((b for b in blocks if b.get("@type") in {"WebPage", "Article"}), {}) or {}

    slug = urlparse(url).path.rstrip("/").split("/")[-1]
    name = str(product.get("name") or web_page.get("name") or "").strip()
    if not name:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", html or "", re.I | re.S)
        name = clean(m.group(1)) if m else ""
    if not name:
        name = (_meta(html, "og:title") or slug.replace("-", " ")).strip()
    name = re.sub(r"\s*\|\s*Strain Database.*$", "", name, flags=re.I).strip()
    name = re.sub(r"\s+Cannabis Strain\s*$", "", name, flags=re.I).strip()

    description = html_lib.unescape(str(product.get("description") or "")).strip()
    if not description:
        description = (_meta(html, "og:description") or _meta(html, "description") or "").strip()
    if not description:
        m = re.search(
            r'(?is)<(?:div|section|p)[^>]*class=["\'][^"\']*(?:description|about|overview)[^"\']*["\'][^>]*>(.*?)</(?:div|section|p)>',
            html or "",
        )
        if m:
            description = clean(m.group(1))

    text = clean(html)
    grow = parse_grow_fields(f"{description or ''} {text[:5000]}")

    breeder = _label_value(html, ("Breeder", "Seed Bank", "Breeders", "Bank"))
    if not breeder:
        m = re.search(r"(?i)\b(?:by|breeder)\s*[:\s]\s*([A-Za-z0-9][A-Za-z0-9 &\-.]{1,60})", text)
        if m:
            breeder = m.group(1).strip()

    type_ = _label_value(html, ("Type", "Species", "Genetics Type", "Category"))
    if not type_:
        m = re.search(r"\b(Indica|Sativa|Hybrid|Ruderalis)\b", text, re.I)
        if m:
            type_ = m.group(1).title()

    lineage_raw = _label_value(
        html,
        ("Genetics", "Lineage", "Pedigree", "Parents", "Genetic Background", "Cross"),
    )
    parent_links: list[dict] = []
    for m in re.finditer(
        r'href=["\'](https://strain-database\.com/strain/[^"\']+)["\'][^>]*>([^<]+)',
        html or "",
        re.I,
    ):
        href = m.group(1).split("?")[0]
        label = html_lib.unescape(m.group(2)).strip()
        if "/de/" in href:
            continue
        if href.rstrip("/") == url.rstrip("/"):
            continue
        if label:
            parent_links.append({"name": label, "url": href})
    # Prefer genetics section parent links near lineage heading
    parents_for_lineage = parent_links[:2] if parent_links and not lineage_raw else None
    if lineage_raw and " x " not in lineage_raw.lower() and parent_links:
        # keep text; also pass parents list
        parents_for_lineage = parent_links[:4]

    lin = enrich_lineage_fields(
        child_name=name,
        lineage_text=lineage_raw,
        source=SOURCE,
        existing_parents=parents_for_lineage,
    )

    effects = _list_from_links(html, "/effect") or _list_from_links(html, "/effects/")
    flavors = _list_from_links(html, "/flavor") or _list_from_links(html, "/flavors/")
    terpenes = _list_from_links(html, "/terpene") or _list_from_links(html, "/terpenes/")
    medical = _list_from_links(html, "/medical") or _list_from_links(html, "/symptom")

    # chem from labels + grow helper
    chem: dict[str, Any] = {}
    if isinstance(grow.get("chemistry"), dict):
        chem.update(grow["chemistry"])
    for key, labels in (
        ("thc", ("THC", "THC %", "THC Content")),
        ("cbd", ("CBD", "CBD %", "CBD Content")),
        ("cbg", ("CBG", "CBG %")),
    ):
        val = _label_value(html, labels)
        if not val:
            continue
        m = re.search(r"([\d.]+)\s*%?", val)
        if m:
            num = float(m.group(1))
            chem[key] = num
            chem[f"{key}_range"] = [num, num]

    thc_range = grow.get("thc_range") or chem.get("thc_range")
    cbd_range = grow.get("cbd_range") or chem.get("cbd_range")

    rating = None
    review_count = None
    agg = product.get("aggregateRating") if isinstance(product, dict) else None
    if isinstance(agg, dict):
        try:
            rating = float(agg.get("ratingValue"))
        except (TypeError, ValueError):
            rating = None
        try:
            review_count = int(float(agg.get("reviewCount") or agg.get("ratingCount") or 0)) or None
        except (TypeError, ValueError):
            review_count = None

    reviews = _parse_reviews(html, blocks)
    images: list[str] = []
    img = product.get("image") if isinstance(product, dict) else None
    if isinstance(img, str):
        images = [img]
    elif isinstance(img, list):
        images = [i for i in img if isinstance(i, str)]
    og = _meta(html, "og:image")
    if og and og not in images:
        images.insert(0, og)

    flowering = _label_value(html, ("Flowering", "Flowering Time", "Flowering Period")) or grow.get(
        "flowering_days"
    )
    height = _label_value(html, ("Height", "Plant Height")) or grow.get("height_cm")
    yield_ = _label_value(html, ("Yield", "Yield Indoor", "Yield Outdoor"))
    difficulty = _label_value(html, ("Difficulty", "Grow Difficulty", "Growing Difficulty"))
    climate = _label_value(html, ("Climate", "Environment", "Grow Environment"))
    sex = _label_value(html, ("Sex", "Seed Type", "Gender", "Feminized"))

    row: dict[str, Any] = {
        "name": name[:200],
        "name_norm": name_norm(name),
        "slug": slug,
        "url": url.split("?")[0].split("#")[0],
        "source": SOURCE,
        "breeder": breeder,
        "type": type_,
        "description": (description or None) and description[:6000],
        "lineage": lin.get("lineage"),
        "lineage_structured": lin.get("lineage_structured"),
        "lineage_mermaid": lin.get("lineage_mermaid"),
        "genetic_background": lin.get("lineage"),
        "parents": (lin.get("lineage_structured") or {}).get("parents") or None,
        "effects": effects or None,
        "flavors": flavors or None,
        "top_effects": (effects or [])[:8] or None,
        "top_flavors": (flavors or [])[:8] or None,
        "terpenes": terpenes or None,
        "top_terpenes": (terpenes or [])[:8] or None,
        "medical": medical or None,
        "may_relieve": medical or None,
        "thc": chem.get("thc"),
        "cbd": chem.get("cbd"),
        "thc_range": thc_range,
        "cbd_range": cbd_range,
        "chemistry": chem or None,
        "flowering_days": flowering,
        "height_cm": height,
        "yield": yield_,
        "grow_difficulty": difficulty,
        "climate": climate,
        "seed_gender": sex,
        "rating": rating,
        "review_count": review_count,
        "reviews": reviews or None,
        "image_url": images[0] if images else None,
        "images": images or None,
        "json_ld": blocks or None,
        "next_data": next_data,
        "page_text_excerpt": text[:3000] or None,
        "html_sha1": hashlib.sha256((html or "").encode("utf-8", "replace")).hexdigest()[:40],
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "redistributable": False,
    }
    if lin.get("followup_gap"):
        row["followup_gap"] = [lin["followup_gap"]]

    # Keep full raw-ish payload compact: drop empty
    return {k: v for k, v in row.items() if v not in (None, "", [], {})}


def load_sitemap_urls(*, session: Session, delay: float, refresh: bool) -> list[str]:
    if SITEMAP_CACHE.exists() and not refresh:
        try:
            doc = json.loads(SITEMAP_CACHE.read_text(encoding="utf-8"))
            urls = [u for u in (doc.get("urls") or []) if EN_STRAIN_RE.match(u)]
            if urls:
                print(f"sitemap cache: {len(urls)} EN strain URLs")
                return urls
        except (OSError, json.JSONDecodeError):
            pass

    locs: list[str] = []
    for sm in SITEMAP_PARTS:
        time.sleep(max(0.0, delay * 0.3))
        status, body = session.get(sm)
        if is_cloudflare_wall(body, status) or status >= 400:
            raise FetchError(sm, "CLOUDFLARE" if is_cloudflare_wall(body, status) else "HTTP", status)
        locs.extend(re.findall(r"<loc>([^<]+)</loc>", body, re.I))
        # also capture image titles as inventory sidecar
    urls = sorted({u.split("?")[0].rstrip("/") for u in locs if EN_STRAIN_RE.match(u.split("?")[0])})
    # title map from sitemap image:title when present
    titles: dict[str, str] = {}
    for sm in SITEMAP_PARTS:
        status, body = session.get(sm) if sm == SITEMAP_PARTS[0] else (200, "")
        # re-use already fetched via second pass only for part that has strains
        pass
    # parse titles from last body of sitemap/1 (main strain set)
    status1, body1 = session.get(SITEMAP_PARTS[1])
    if status1 == 200 and not is_cloudflare_wall(body1, status1):
        for block in re.finditer(r"(?is)<url>(.*?)</url>", body1):
            chunk = block.group(1)
            loc_m = re.search(r"<loc>([^<]+)</loc>", chunk, re.I)
            title_m = re.search(r"<image:title>([^<]+)</image:title>", chunk, re.I)
            if loc_m and title_m and EN_STRAIN_RE.match(loc_m.group(1).split("?")[0]):
                titles[loc_m.group(1).split("?")[0].rstrip("/")] = html_lib.unescape(
                    title_m.group(1)
                ).strip()

    SITEMAP_CACHE.write_text(
        json.dumps(
            {
                "built_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "count": len(urls),
                "urls": urls,
                "titles": titles,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"sitemap: {len(locs)} locs -> {len(urls)} EN strain URLs (titles={len(titles)})")
    return urls


def write_partial(items: list[dict], *, note: str, blockers: list[str] | None = None) -> None:
    write_dump(
        OUT,
        "strains",
        items,
        source=SOURCE,
        source_url=SOURCE_URL,
        license=NOTE,
        redistributable=False,
        note=note,
        sitemap=SITEMAP_INDEX,
        blockers=(blockers or [])[-40:],
    )


def scrape(
    *,
    delay: float,
    limit: int | None,
    refresh_sitemap: bool,
    checkpoint_every: int,
) -> Path:
    session = Session()
    urls = load_sitemap_urls(session=session, delay=delay, refresh=refresh_sitemap)
    if limit is not None:
        urls = urls[: max(0, limit)]

    ck = Checkpoint(CK_PATH)
    done = set(ck.data.get("done") or [])
    items: list[dict] = []
    if OUT.exists():
        try:
            prev = json.loads(OUT.read_text(encoding="utf-8"))
            items = [i for i in (prev.get("items") or []) if isinstance(i, dict)]
        except (OSError, json.JSONDecodeError):
            items = []
    by_url = {i.get("url"): i for i in items if i.get("url")}
    blockers: list[str] = []
    scraped_this_run = 0
    t0 = time.time()
    print(f"strain_database: {len(urls)} queued; resume done={len(done)} dump_items={len(items)}")

    for idx, url in enumerate(urls, 1):
        if url in done and url in by_url:
            continue
        if url in done and url not in by_url:
            done.discard(url)
        try:
            html = fetch_html(session, url, delay=delay)
            row = parse_strain_page(html, url)
            by_url[url] = row
            done.add(url)
            scraped_this_run += 1
        except FetchError as exc:
            msg = f"{exc.kind} {exc.url}"
            blockers.append(msg)
            ck.note_error(msg)
            print(f"  STOP: {msg}")
            if exc.kind in {"CLOUDFLARE", "ANUBIS"}:
                items = list(by_url.values())
                ck.data["done"] = sorted(done)
                ck.data["cursor"] = url
                ck.data["blocked_url"] = exc.url
                ck.save()
                write_partial(
                    items,
                    note=f"stopped on {exc.kind} after {scraped_this_run} this run",
                    blockers=blockers,
                )
                session.save_cookies()
                print(f"BLOCKED_URL={exc.url}")
                return OUT
            continue
        except Exception as exc:  # noqa: BLE001
            msg = f"{url}: {exc}"
            blockers.append(msg)
            ck.note_error(msg)
            continue

        if scraped_this_run % checkpoint_every == 0 or idx == len(urls):
            items = list(by_url.values())
            ck.data["done"] = sorted(done)
            ck.data["cursor"] = url
            ck.data["done_count"] = len(done)
            ck.save()
            write_partial(
                items,
                note=f"partial checkpoint {len(items)}/{len(urls)}",
                blockers=blockers,
            )
            session.save_cookies()
            rate = scraped_this_run / max(1.0, time.time() - t0)
            print(
                f"  checkpoint items={len(items)} done={len(done)} "
                f"this_run={scraped_this_run} rate={rate:.2f}/s idx={idx}/{len(urls)}"
            )

    items = list(by_url.values())
    items.sort(key=lambda r: (r.get("name_norm") or "", r.get("url") or ""))
    ck.data["done"] = sorted(done)
    ck.data["done_count"] = len(done)
    ck.save()
    write_partial(items, note="strain-database sitemap scrape complete", blockers=blockers)
    session.save_cookies()
    mermaid_n = sum(1 for i in items if i.get("lineage_mermaid"))
    print(f"wrote {OUT.name} count={len(items)} mermaid={mermaid_n}")
    return OUT


def stage_dump(*, reset: bool = True) -> dict:
    from brain.dsc_brain.staging import write_dump_to_staging  # noqa: WPS433

    if not OUT.exists():
        raise FileNotFoundError(OUT)
    st = write_dump_to_staging(OUT, source_id=SOURCE, reset=reset)
    print(
        "staging:",
        json.dumps(
            {k: st[k] for k in ("family", "staging_db", "count", "bulk", "store_raw", "stats") if k in st},
            indent=2,
            default=str,
        ),
    )
    return st


def import_chrome_cookies(*, domain: str = "strain-database.com") -> dict:
    """Run scripts/chrome_cookies_for_domain.py and return summary dict."""
    from chrome_cookies_for_domain import (  # noqa: WPS433
        OUT_PRIMARY,
        OUT_SCRAPER,
        export_domain,
    )

    return export_domain(domain=domain, outs=[OUT_PRIMARY, OUT_SCRAPER])


def probe_first_pdp(session: Session, *, delay: float = 0.4) -> tuple[str, str]:
    """Fetch first unfinished sitemap URL (or cached cursor). Returns (url, status_kind)."""
    urls: list[str] = []
    if SITEMAP_CACHE.exists():
        try:
            raw = json.loads(SITEMAP_CACHE.read_text(encoding="utf-8"))
            urls = [u for u in (raw.get("urls") or []) if isinstance(u, str)]
        except (OSError, json.JSONDecodeError):
            urls = []
    ck_cursor = None
    if CK_PATH.exists():
        try:
            ck = json.loads(CK_PATH.read_text(encoding="utf-8"))
            ck_cursor = ck.get("blocked_url") or ck.get("cursor")
        except (OSError, json.JSONDecodeError):
            pass
    url = ck_cursor if isinstance(ck_cursor, str) and ck_cursor else (urls[0] if urls else None)
    if not url:
        url = "https://strain-database.com/strain/blue-dream"
    try:
        html = fetch_html(session, url, delay=delay)
    except FetchError as exc:
        return url, exc.kind
    if len(html) < 500:
        return url, "EMPTY"
    return url, "OK"


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Scrape strain-database.com EN strains")
    ap.add_argument("--delay", type=float, default=0.55)
    ap.add_argument("--limit", type=int, default=None)
    ap.add_argument("--refresh-sitemap", action="store_true")
    ap.add_argument("--checkpoint-every", type=int, default=25)
    ap.add_argument("--sitemap-only", action="store_true")
    ap.add_argument("--stage", action="store_true")
    ap.add_argument("--stage-only", action="store_true")
    ap.add_argument(
        "--import-chrome-cookies",
        action="store_true",
        help="Export Chrome cookies for strain-database.com then probe/scrape",
    )
    ap.add_argument(
        "--probe-pdp",
        action="store_true",
        help="Only probe first PDP with current cookie jar (no full scrape)",
    )
    args = ap.parse_args(argv)

    if args.import_chrome_cookies:
        try:
            payload = import_chrome_cookies()
        except PermissionError as exc:
            print(f"COOKIE_IMPORT_LOCKED: {exc}")
            print(
                "Close Chrome briefly OR finish the CF challenge in Chrome, "
                "then re-run: python scripts/chrome_cookies_for_domain.py"
            )
            return 2
        except Exception as exc:  # noqa: BLE001
            print(f"COOKIE_IMPORT_FAIL: {exc}")
            return 1
        names = sorted((payload.get("cookies") or {}).keys())
        print(
            json.dumps(
                {
                    "cookie_import": True,
                    "cookie_count": len(names),
                    "cookie_names": names,
                    "errors": payload.get("errors") or [],
                },
                indent=2,
            )
        )
        if not names:
            print(
                "No Chrome cookies for strain-database.com. "
                "Open https://strain-database.com/ in Chrome, pass CF, "
                "close Chrome briefly, re-run --import-chrome-cookies."
            )
            return 3

    if args.stage_only:
        stage_dump()
        return 0

    if args.sitemap_only:
        session = Session()
        urls = load_sitemap_urls(session=session, delay=args.delay, refresh=True)
        print(json.dumps({"sitemap_urls": len(urls), "sample": urls[:5]}, indent=2))
        return 0

    if args.probe_pdp or args.import_chrome_cookies:
        session = Session()
        if args.import_chrome_cookies:
            session.reload_cookies()
        url, kind = probe_first_pdp(session, delay=args.delay)
        print(json.dumps({"probe_url": url, "result": kind}, indent=2))
        if kind != "OK":
            print(
                f"First PDP still blocked ({kind}). "
                "Pass CF in Chrome, close Chrome briefly, re-run cookie import."
            )
            return 4
        if args.probe_pdp:
            return 0

    scrape(
        delay=args.delay,
        limit=args.limit,
        refresh_sitemap=args.refresh_sitemap,
        checkpoint_every=max(5, args.checkpoint_every),
    )
    if args.stage:
        stage_dump()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
