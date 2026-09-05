"""CLI for offline brain ops without starting the HTTP server."""

from __future__ import annotations

import argparse
import json

from .catalog import init_db, reload_catalogs, search
from .decision_loop import decision_tick
from .want import resolve_want


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="dsc_brain")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("init-db", help="Create slim operational SQLite schema")
    sub.add_parser("reload-catalogs", help="Load data/ packs into SQLite")

    p_search = sub.add_parser("search", help="Search catalog kind")
    p_search.add_argument("kind", choices=["strain", "nutrient", "medium", "light"])
    p_search.add_argument("query", nargs="?", default="")
    p_search.add_argument("--limit", type=int, default=20)

    p_want = sub.add_parser("want", help="Resolve Want for a strain id")
    p_want.add_argument("strain_id")
    p_want.add_argument("--stage", default="veg")

    p_tick = sub.add_parser("tick", help="Dry-run decision tick")
    p_tick.add_argument("--seat", default="pot1")
    p_tick.add_argument("--strain", default="generic_photoperiod")
    p_tick.add_argument("--stage", default="veg")
    p_tick.add_argument("--temp", type=float, default=None)
    p_tick.add_argument("--rh", type=float, default=None)
    p_tick.add_argument("--emit", action="store_true")

    args = parser.parse_args(argv)

    if args.cmd == "init-db":
        path = init_db()
        print(json.dumps({"db": str(path)}))
        return 0

    if args.cmd == "reload-catalogs":
        init_db()
        counts = reload_catalogs()
        print(json.dumps(counts, indent=2))
        return 0

    if args.cmd == "search":
        print(json.dumps(search(args.kind, args.query, limit=args.limit), indent=2))
        return 0

    if args.cmd == "want":
        print(json.dumps(resolve_want(strain_id=args.strain_id, stage=args.stage), indent=2))
        return 0

    if args.cmd == "tick":
        got = {}
        if args.temp is not None:
            got["temp_c"] = args.temp
        if args.rh is not None:
            got["rh_pct"] = args.rh
        proposal = decision_tick(
            seat=args.seat,
            strain_id=args.strain,
            stage=args.stage,
            got=got,
            emit=args.emit,
        )
        print(json.dumps(proposal, indent=2))
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
