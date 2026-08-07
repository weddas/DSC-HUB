@echo off
set PYTHONUNBUFFERED=1
"C:\Program Files\Python314\python.exe" -u "y:\Digital Stealth Care\Projects\DSC-HUB\scripts\enrich_leafly_flat.py" --apply-from-staging > "y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging\leafly_flat_enrich_apply.log" 2> "y:\Digital Stealth Care\Projects\DSC-HUB\brain\data\staging\leafly_flat_enrich_apply.err"
