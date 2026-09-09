"""Pass S6 — grow journal actions and media.

The plan's acceptance for S6 is one sentence: *"A watering entry from the phone with a
photo lands in the plant journal with a frozen snapshot; the storage card shows the bytes;
the archive bundle contains the image."* test_s6_acceptance_end_to_end is that sentence.
"""

from __future__ import annotations

import io
import struct
import zipfile
import zlib
from pathlib import Path

import pytest


def _png(width: int = 40, height: int = 30) -> bytes:
    """A real, decodable PNG — ffmpeg has to be able to read it for the resize path."""

    def chunk(tag: bytes, payload: bytes) -> bytes:
        return (
            struct.pack(">I", len(payload))
            + tag
            + payload
            + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF)
        )

    rows = bytearray()
    for y in range(height):
        rows.append(0)  # filter type 0 (None) for this scanline
        for x in range(width):
            rows += bytes(((x + y) % 256, (x * 3) % 256, (y * 3) % 256))

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)  # 8-bit RGB
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(bytes(rows), 6))
        + chunk(b"IEND", b"")
    )


# --- the action catalogue ---------------------------------------------------------------


def test_every_builtin_action_freezes_a_snapshot(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """"Every entry is backed by the kit's sensors" is the promise; the per-type flag is
    there so operator-defined types can opt OUT, not to trim the built-ins."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_actions import BUILTIN_ACTIONS, wants_snapshot

    for action in BUILTIN_ACTIONS:
        assert action["snapshot"] is True, f"{action['id']} would silently stop snapshotting"
        assert wants_snapshot(action["id"]) is True


def test_an_unknown_action_still_gets_a_snapshot(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_actions import wants_snapshot

    assert wants_snapshot("something_new") is True


def test_fields_are_coerced_to_their_declared_kind(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_actions import clean_fields

    out = clean_fields("water", {"amount_l": "2.5", "ph": 6.2, "nonsense": "dropped", "runoff_ph": ""})
    assert out == {"amount_l": 2.5, "ph": 6.2}, "unknown and empty fields must not be stored"

    # A number field that cannot parse is dropped rather than stored as prose — a chart
    # reading it later must never meet a string.
    assert clean_fields("water", {"amount_l": "a lot"}) == {}


def test_summary_reads_like_a_grower_wrote_it(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_actions import summarise

    assert summarise("water", {"amount_l": 2.0, "ph": 6.2}) == "Water · 2 L · pH 6.2"


# --- media ------------------------------------------------------------------------------


def test_media_refuses_what_it_should(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_media import MAX_UPLOAD_BYTES, MediaError, add_media

    with pytest.raises(MediaError, match="empty"):
        add_media("plant", 1, b"", content_type="image/png")

    with pytest.raises(MediaError, match="limit"):
        add_media("plant", 1, b"x" * (MAX_UPLOAD_BYTES + 1), content_type="image/png")

    with pytest.raises(MediaError, match="not an image"):
        add_media("plant", 1, b"MZ...", content_type="application/x-msdownload")


def test_media_lands_on_disk_not_in_sqlite(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_media import add_media, read_media

    saved = add_media("plant", 7, _png(), content_type="image/png", scope_id="plant-a")
    found = read_media(saved["id"])
    assert found is not None
    path, _ctype = found
    assert path.exists() and path.stat().st_size > 0
    # Images must never be inlined into the database file.
    assert "media" in path.parts and path.suffix in {".jpg", ".png"}


def test_the_same_photo_twice_is_stored_once(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Content-hash naming: two entries can share a file, and deleting one must not blank
    the other."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_media import add_media, delete_media, read_media

    png = _png()
    first = add_media("plant", 1, png, content_type="image/png", scope_id="p")
    second = add_media("plant", 2, png, content_type="image/png", scope_id="p")
    path_one = read_media(first["id"])[0]
    path_two = read_media(second["id"])[0]
    assert path_one == path_two, "identical bytes should not be stored twice"

    delete_media(first["id"])
    assert read_media(first["id"]) is None
    still = read_media(second["id"])
    assert still is not None and still[0].exists(), "the other entry's photo was deleted with it"


def test_a_filename_cannot_escape_the_media_root(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """The stored name is a content hash, so a hostile filename is never a path."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_media import add_media, read_media
    from dsc_brain.paths import media_root

    saved = add_media(
        "plant", 1, _png(), content_type="image/png",
        scope_id="../../etc", filename="../../../../etc/passwd",
    )
    path = read_media(saved["id"])[0]
    assert media_root().resolve() in path.resolve().parents


# --- the acceptance sentence ------------------------------------------------------------


def test_s6_acceptance_end_to_end(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """A watering entry with a photo -> frozen snapshot, bytes on the storage card, and the
    image inside the archive bundle."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_media import add_media
    from dsc_brain.journal_storage import export_archive, archive_plant, storage_stats
    from dsc_brain.plant_journal import add_plant_entry

    entry = add_plant_entry(
        "plant-uuid-1",
        None,
        "first watering of the week",
        action="water",
        fields={"amount_l": 2.0, "ph": 6.2},
        fleet={},
    )

    # ... lands in the plant journal, typed, with a frozen snapshot.
    assert entry["action"] == "water"
    assert entry["fields"] == {"amount_l": 2.0, "ph": 6.2}
    assert entry["summary"] == "Water · 2 L · pH 6.2"
    assert entry["snapshot"] is not None

    saved = add_media("plant", entry["id"], _png(), content_type="image/png", scope_id="plant-uuid-1")

    # ... the storage card shows the bytes, measured on disk and outside the db file.
    stats = storage_stats()
    assert stats["media"]["files"] == 1
    assert stats["media"]["bytes"] == saved["bytes"] > 0

    # ... and the archive bundle contains the image.
    archived = archive_plant("plant-uuid-1", reason="harvest")
    assert archived is not None
    _name, _ctype, blob = export_archive(int(archived["id"]), fmt="zip")
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        media_names = [n for n in z.namelist() if n.startswith("media/")]
        assert media_names, f"archive carried no media: {z.namelist()}"
        assert z.read(media_names[0]), "the archived image is empty"


def test_pruning_a_journal_takes_its_photos_with_it(temp_db: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """Rows without files would leave bytes on disk that nothing references and the storage
    card keeps counting."""
    monkeypatch.setenv("DSC_DATA", str(temp_db.parent))
    from dsc_brain.journal_media import add_media, read_media
    from dsc_brain.journal_storage import prune_journals, set_retention
    from dsc_brain.plant_journal import add_plant_entry

    old = add_plant_entry("plant-old", 1.0, "ancient", action="note", fleet={})
    saved = add_media("plant", old["id"], _png(), content_type="image/png", scope_id="plant-old")
    path = read_media(saved["id"])[0]
    assert path.exists()

    set_retention({"plant": 1})
    prune_journals()

    assert read_media(saved["id"]) is None, "the media row outlived its entry"
    assert not path.exists(), "the file was orphaned on disk"
