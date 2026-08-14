"""Block AI / scrapers / robots from crawling the catalog API."""

from __future__ import annotations

import re

# Known AI / SEO / archive crawlers — hard block on catalog routes.
AI_CRAWLER_NEEDLES = (
    "gptbot",
    "chatgpt",
    "ccbot",
    "anthropic",
    "claudebot",
    "claude-web",
    "google-extended",
    "bytespider",
    "petalbot",
    "perplexity",
    "omgili",
    "diffbot",
    "semrush",
    "ahrefs",
    "mj12bot",
    "dotbot",
    "dataforseo",
    "meta-externalagent",
    "amazonbot",
    "applebot-extended",
    "bingbot",
    "googlebot",
    "yandex",
    "baiduspider",
    "duckduckbot",
    "ia_archiver",
    "archive.org_bot",
)

# Generic scrapers — blocked on catalog, not on /health|/metrics (HA uses aiohttp).
SCRAPER_NEEDLES = (
    "scrapy",
    "wget",
    "libwww",
    "go-http-client",
)

# Allow HA / browsers even if UA contains "bot".
ALLOW_UA_NEEDLES = (
    "homeassistant",
    "home-assistant",
    "hass.io",
    "dsc-hub",
    "cannalib-ha",
    "mozilla/",
    "chrome/",
    "safari/",
    "firefox/",
    "edg/",
)

_ROBOTS_TXT = """\
User-agent: *
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /
"""

_AI_TXT = """\
# ai.txt — machine-readable refusal for training / scraping
User-Agent: *
Disallow: /
"""

_LLMS_TXT = """\
# llms.txt — no content offered for LLM ingestion
User-Agent: *
Disallow: /
"""


def robots_txt() -> str:
    return _ROBOTS_TXT


def ai_txt() -> str:
    return _AI_TXT


def llms_txt() -> str:
    return _LLMS_TXT


def is_blocked_bot(user_agent: str | None, *, catalog_route: bool = True) -> bool:
    """Return True when the client should be refused.

    Metrics/health scrapes from HA must not hit this with catalog_route=False
    (or an allowlisted UA). Catalog routes block AI crawlers + empty UA.
    """
    ua = (user_agent or "").strip().lower()
    if any(a in ua for a in ALLOW_UA_NEEDLES):
        return False
    if any(n in ua for n in AI_CRAWLER_NEEDLES):
        return True
    if not catalog_route:
        return False
    if not ua:
        return True
    if any(n in ua for n in SCRAPER_NEEDLES):
        return True
    # Generic *bot* / *spider* / *crawl* on catalog only.
    if "bot" in ua or "spider" in ua or "crawl" in ua or "slurp" in ua:
        return True
    return False


_SLUG_RE = re.compile(r"[^a-z0-9]+")


def slug(*parts: str) -> str:
    s = _SLUG_RE.sub("_", "_".join(parts).lower()).strip("_")
    return s[:80] or "unknown"
