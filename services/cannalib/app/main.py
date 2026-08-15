"""Cannalib FastAPI app — full-corpus catalog + soft limits + anti-crawl."""

from __future__ import annotations

import time
from typing import Any

from fastapi import FastAPI, HTTPException, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse

from . import __version__
from .bots import ai_txt, is_blocked_bot, llms_txt, robots_txt
from .config import settings
from . import db
from .metrics import metrics
from .rate_limit import limiter

app = FastAPI(
    title="Cannalib",
    version=__version__,
    description="Read-only cannabis cultivar catalog over the full DSC research corpus.",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins or ["*"],
    allow_credentials=False,
    allow_methods=["GET", "HEAD", "OPTIONS"],
    allow_headers=["*"],
)


def _client_id(request: Request) -> str:
    forwarded = request.headers.get("cf-connecting-ip") or request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host or "unknown"
    return "unknown"


def _api_key_ok(request: Request) -> bool:
    if not settings.require_api_key:
        return True
    expected = (settings.api_key or "").strip()
    if not expected:
        return False
    got = (request.headers.get(settings.api_key_header) or "").strip()
    if got and got == expected:
        return True
    auth = request.headers.get("authorization") or ""
    if auth.lower().startswith("bearer ") and auth[7:].strip() == expected:
        return True
    return False


@app.middleware("http")
async def gate_and_meter(request: Request, call_next):
    path = request.url.path or "/"
    ua = request.headers.get("user-agent")
    started = time.perf_counter()
    bytes_in = int(request.headers.get("content-length") or 0)

    # Always allow robots / ai policy files (so crawlers see Disallow).
    if path in ("/robots.txt", "/ai.txt", "/llms.txt", "/favicon.ico"):
        response = await call_next(request)
        return response

    # Block AI/SEO crawlers on catalog; leave health/metrics open for HA REST.
    catalog_route = path.startswith("/v1/catalogs")
    if path.startswith("/v1/") and is_blocked_bot(ua, catalog_route=catalog_route):
        body = b'{"detail":"crawlers not permitted"}'
        metrics.record_request(bytes_in=bytes_in, bytes_out=len(body), blocked_bot=True)
        return Response(
            content=body,
            status_code=403,
            media_type="application/json",
            headers={
                "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noai, noimageai",
                "Cache-Control": "no-store",
            },
        )

    if path.startswith("/v1/") and not _api_key_ok(request):
        body = b'{"detail":"api key required"}'
        metrics.record_request(bytes_in=bytes_in, bytes_out=len(body), unauthorized=True)
        return Response(
            content=body,
            status_code=401,
            media_type="application/json",
            headers={"WWW-Authenticate": 'Bearer realm="cannalib"'},
        )

    bypass = settings.metrics_bypass_rate_limit and path in (
        settings.metrics_path,
        "/health",
        "/v1/health",
        "/v1/corpus",
    )
    rate_limited = False
    if path.startswith("/v1/") and not bypass:
        ok, retry = await limiter.gate(_client_id(request))
        if not ok:
            rate_limited = True
            body = b'{"detail":"rate limited — cooldown; retry later"}'
            metrics.record_request(
                bytes_in=bytes_in, bytes_out=len(body), rate_limited=True
            )
            return Response(
                content=body,
                status_code=429,
                media_type="application/json",
                headers={
                    "Retry-After": str(max(1, retry)),
                    "X-Cannalib-Cooldownoff": "1",
                },
            )

    response = await call_next(request)
    # Soft cooldown already applied inside limiter.gate when under soft overage.
    _ = started
    try:
        # Starlette may not expose body length; approximate via content-length if set.
        out_len = int(response.headers.get("content-length") or 0)
    except ValueError:
        out_len = 0
    search = path.startswith("/v1/catalogs/") and "q=" in str(request.url.query)
    hydrate = "/v1/catalogs/strains/" in path and path.count("/") >= 4
    metrics.record_request(
        bytes_in=bytes_in,
        bytes_out=out_len,
        rate_limited=rate_limited,
        search=search,
        hydrate=hydrate,
    )
    response.headers["X-Robots-Tag"] = "noindex, nofollow, noarchive, nosnippet, noai, noimageai"
    response.headers["X-Cannalib-Version"] = __version__
    return response


@app.on_event("startup")
def _startup() -> None:
    # Lazy DB: connect on first request so a mount blip does not crash-loop the container.
    try:
        db.warm_counts()
    except Exception:  # noqa: BLE001
        pass


@app.on_event("shutdown")
def _shutdown() -> None:
    db.close()


@app.get("/robots.txt", response_class=PlainTextResponse)
def robots() -> str:
    return robots_txt()


@app.get("/ai.txt", response_class=PlainTextResponse)
def ai_policy() -> str:
    return ai_txt()


@app.get("/llms.txt", response_class=PlainTextResponse)
def llms_policy() -> str:
    return llms_txt()


@app.get("/health")
@app.get("/v1/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "cannalib",
        "version": __version__,
        "auth": "key" if settings.require_api_key else "public",
        "rate_limit": {
            "enabled": settings.rate_limit_enabled,
            "rpm": settings.rate_limit_rpm,
            "burst": settings.rate_limit_burst,
            "cooldown_base_s": settings.cooldown_base_s,
            "cooldown_max_s": settings.cooldown_max_s,
            "cooldown_429_after": settings.cooldown_429_after,
        },
    }


@app.get("/v1/corpus")
def corpus() -> dict[str, Any]:
    """Full corpus tallies — proves the API is not the 10k HA index."""
    counts = db.corpus_counts()
    return {"schema": "research_corpus", "counts": counts, "capped": False}


@app.get(settings.metrics_path)
@app.get("/metrics")
def get_metrics() -> dict[str, Any]:
    snap = metrics.snapshot()
    snap["service"] = "cannalib"
    snap["version"] = __version__
    snap["auth_mode"] = "key" if settings.require_api_key else "public"
    try:
        snap["corpus"] = db.corpus_counts()
    except Exception:  # noqa: BLE001
        snap["corpus"] = {}
    return snap


@app.get("/v1/catalogs/{kind}")
def catalogs(
    kind: str,
    q: str = Query(""),
    limit: int = Query(20, ge=1, le=100),
) -> dict[str, Any]:
    """Typeahead. Strains search the FULL canonical table (195k+), not the HA 10k index."""
    kind_l = kind.lower().strip()
    if kind_l in ("strains", "strain"):
        items = db.search_strains(q, limit=limit)
        return {
            "kind": "strains",
            "q": q,
            "count": len(items),
            "capped": False,
            "items": items,
        }
    if kind_l in ("nutrients", "nutrient", "mediums", "medium", "lights", "light"):
        try:
            items = db.search_products(kind_l, q, limit=limit)
        except ValueError as exc:
            raise HTTPException(400, str(exc)) from exc
        return {
            "kind": kind_l if kind_l.endswith("s") else kind_l + "s",
            "q": q,
            "count": len(items),
            "capped": False,
            "items": items,
        }
    raise HTTPException(400, f"unknown kind {kind}")


@app.get("/v1/catalogs/strains/{strain_id}")
def strain_detail(strain_id: str) -> dict[str, Any]:
    item = db.get_strain_by_id(strain_id)
    if not item:
        raise HTTPException(404, "strain not found")
    return item


@app.get("/")
def root() -> JSONResponse:
    return JSONResponse(
        {
            "service": "cannalib",
            "version": __version__,
            "docs": "none — use /v1/catalogs/strains?q=",
            "robots": "/robots.txt",
        },
        headers={"X-Robots-Tag": "noindex, nofollow, noai, noimageai"},
    )


def main() -> None:
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=False,
        proxy_headers=True,
        forwarded_allow_ips="*",
    )


if __name__ == "__main__":
    main()
