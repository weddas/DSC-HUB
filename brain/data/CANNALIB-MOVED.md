# Hub live copy — delete after Unraid Recreate

The research corpus SoT is:

`Y:\Digital Stealth Care\Projects\CannaLib\brain\data\dsc_brain.sqlite3`

This folder still has a **live bind-mount copy** (`dsc_brain.sqlite3` + wal/shm) because the running `cannalib` container on Digital-Gateway was started from DSC-HUB paths and we cannot Recreate it from this Windows client (no SSH/docker).

After Unraid Compose **Recreate** (trampoline compose already points at CannaLib):

1. Confirm `https://cannalib.plausible-deniability.net/v1/corpus` still reports 195266.
2. Delete `dsc_brain.sqlite3*` from this folder.
3. Hub ops DB is `dsc_ops.sqlite3` (Want/tick), rebuilt with `python -m brain.dsc_brain reload-catalogs`.
