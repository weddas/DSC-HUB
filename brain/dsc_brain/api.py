"""Minimal FastAPI surface for the future local webserver."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

from . import __version__
from .catalog import get_strain, init_db, reload_catalogs, search
from .decision_loop import decision_tick
from .want import resolve_want

app = FastAPI(title="DSC Brain", version=__version__)


class TickBody(BaseModel):
    seat: str = "pot1"
    strain_id: str | None = "generic_photoperiod"
    stage: str = "veg"
    got: dict[str, float | None] = Field(default_factory=dict)
    custom_want: dict[str, Any] | None = None
    manual_takeover: bool = False
    emit: bool = False


@app.on_event("startup")
def _startup() -> None:
    init_db()
    reload_catalogs()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": __version__}


@app.post("/admin/reload-catalogs")
def admin_reload() -> dict[str, int]:
    return reload_catalogs()


@app.get("/catalogs/{kind}")
def catalogs(kind: str, q: str = Query(""), limit: int = Query(20, ge=1, le=100)) -> list[dict]:
    mapping = {
        "strains": "strain",
        "strain": "strain",
        "nutrients": "nutrient",
        "nutrient": "nutrient",
        "mediums": "medium",
        "medium": "medium",
        "lights": "light",
        "light": "light",
    }
    key = mapping.get(kind)
    if not key:
        raise HTTPException(400, f"unknown kind {kind}")
    return search(key, q, limit=limit)


@app.get("/want/{strain_id}")
def want(strain_id: str, stage: str = "veg") -> dict[str, Any]:
    if not get_strain(strain_id):
        raise HTTPException(404, "strain not found")
    return resolve_want(strain_id=strain_id, stage=stage)


@app.post("/decision/tick")
def tick(body: TickBody) -> dict[str, Any]:
    return decision_tick(
        seat=body.seat,
        strain_id=body.strain_id,
        stage=body.stage,
        got=body.got,
        custom_want=body.custom_want,
        manual_takeover=body.manual_takeover,
        emit=body.emit,
    )


def main() -> None:
    import uvicorn

    uvicorn.run("dsc_brain.api:app", host="0.0.0.0", port=8787, reload=False)


if __name__ == "__main__":
    main()
