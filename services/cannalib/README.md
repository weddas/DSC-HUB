# Cannalib API — moved

The catalog API, research corpus, scrapers, and merge pipeline now live in the sibling repo:

**`Y:\Digital Stealth Care\Projects\CannaLib`**

Unraid Compose Manager should use:

`/mnt/user/Digital-Documents/Digital Stealth Care/Projects/CannaLib/services/cannalib`

This folder’s `docker-compose.yml` is a **trampoline** so the existing Unraid stack can Recreate onto CannaLib mounts without changing the project path first. After that Recreate, retarget Compose Manager and delete this trampoline.

Ops: [`../../../CannaLib/docs/ops/CANNALIB-API.md`](../../../CannaLib/docs/ops/CANNALIB-API.md)  
DSC-HUB keeps: HA cards, `dsc_v4_cannalib_api.yaml`, curated Want YAML, capped `/local/dsc-catalog/` indexes.
