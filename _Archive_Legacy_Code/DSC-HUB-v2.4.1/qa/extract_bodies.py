#!/usr/bin/env python3
"""Extract the hub's control lambdas from the firmware YAML into the
*_body.cpp files the QA rig #includes. Run from the qa/ directory."""
import sys

YAML = "../esphome/dsc-hub-v2_4_1.yaml"

def extract(src, script_id, out):
    start = next(i for i, l in enumerate(src) if f"id: {script_id}" in l)
    lam = next(j for j in range(start, start + 10) if "- lambda: |-" in src[j])
    indent = len(src[lam]) - len(src[lam].lstrip())
    body = []
    for k in range(lam + 1, len(src)):
        l = src[k]
        if l.strip() == "":
            body.append("")
            continue
        if len(l) - len(l.lstrip()) <= indent:
            break
        body.append(l[indent + 4:])
    with open(out, "w") as f:
        f.write("\n".join(body) + "\n")
    print(f"{out}: {len(body)} lines")

src = open(YAML).read().split("\n")
extract(src, "run_climate_logic", "climate_body.cpp")
extract(src, "run_photoperiod", "photo_body.cpp")
extract(src, "run_clone_photoperiod", "clonephoto_body.cpp")
