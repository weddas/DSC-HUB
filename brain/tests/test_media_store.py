"""Media save location and external transfers.

The transfer tests carry most of the weight here: a Move is the only operation in the whole
brain that deletes a grow log, so it gets tested for what it does when things go wrong, not
just when they go right.
"""

from __future__ import annotations


from pathlib import Path

import pytest

from dsc_brain import media_store
from dsc_brain.media_store import (
    Transfer,
    list_locations,
    run_transfer,
    set_media_root,
    start_transfer,
)


def _tree(root: Path, files: dict[str, bytes]) -> None:
    for rel, data in files.items():
        p = root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(data)


def _run_sync(mode: str, src: Path, dst: Path) -> Transfer:
    """Run a transfer on this thread so the assertions are not racing it."""
    job = Transfer(job_id="test", mode=mode, source=str(src), dest=str(dst))
    run_transfer(job)
    return job


# ---------------------------------------------------------------------------------------
# copy / move
# ---------------------------------------------------------------------------------------


def test_copy_leaves_the_source_intact(tmp_path: Path) -> None:
    src, dst = tmp_path / "media", tmp_path / "stick"
    _tree(src, {"camera/4x8 tent/corner/260910/1430.jpg": b"a" * 10, "journal/note.jpg": b"b" * 20})

    job = _run_sync("copy", src, dst)

    assert job.state == "done", job.error
    assert job.files_total == 2 and job.files_done == 2
    assert job.bytes_total == 30
    assert (dst / "camera/4x8 tent/corner/260910/1430.jpg").read_bytes() == b"a" * 10
    assert (src / "camera/4x8 tent/corner/260910/1430.jpg").is_file(), "copy must not remove the source"
    assert job.deleted == 0


def test_move_copies_then_deletes_and_keeps_the_tree(tmp_path: Path) -> None:
    src, dst = tmp_path / "media", tmp_path / "stick"
    _tree(src, {"camera/4x8 tent/corner/260910/1430.jpg": b"a" * 10, "camera/4x8 tent/corner/260910/1440.jpg": b"c" * 5})

    job = _run_sync("move", src, dst)

    assert job.state == "done", job.error
    assert job.deleted == 2
    assert (dst / "camera/4x8 tent/corner/260910/1430.jpg").read_bytes() == b"a" * 10
    assert not (src / "camera/4x8 tent/corner/260910/1430.jpg").exists()
    # The root survives even though it is now empty — recording continues into it.
    assert src.is_dir()


def test_move_does_not_delete_what_it_could_not_copy(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """The one that matters. A truncated copy must never license a delete.

    Simulates the realistic failure — a stick pulled early, or a disk that fills — by
    letting copy2 write a short file. The source file must still be there afterwards.
    """
    src, dst = tmp_path / "media", tmp_path / "stick"
    _tree(src, {"a.jpg": b"x" * 100, "b.jpg": b"y" * 100})

    real_copy = media_store.shutil.copy2

    def _truncating_copy(s, d, *a, **k):  # type: ignore[no-untyped-def]
        if Path(s).name == "b.jpg":
            Path(d).write_bytes(b"y" * 3)  # arrived short
            return d
        return real_copy(s, d, *a, **k)

    monkeypatch.setattr(media_store.shutil, "copy2", _truncating_copy)

    job = _run_sync("move", src, dst)

    assert job.state == "done", job.error
    assert job.deleted == 1, "only the file that arrived whole may be deleted"
    assert not (src / "a.jpg").exists()
    assert (src / "b.jpg").read_bytes() == b"y" * 100, "the short copy must leave its source alone"


def test_transfer_refuses_a_destination_that_will_not_fit(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    src, dst = tmp_path / "media", tmp_path / "stick"
    _tree(src, {"big.jpg": b"z" * 1000})

    class _Usage:
        total = 1000
        free = 10

    monkeypatch.setattr(media_store.shutil, "disk_usage", lambda p: _Usage())
    job = _run_sync("copy", src, dst)

    assert job.state == "failed"
    assert "GB free" in job.error
    assert (src / "big.jpg").is_file()


def test_transfer_refuses_to_copy_into_itself(tmp_path: Path) -> None:
    src = tmp_path / "media"
    _tree(src, {"a.jpg": b"x"})
    with pytest.raises(ValueError, match="inside the media folder"):
        start_transfer(str(src / "backup"), "copy", source=str(src))
    with pytest.raises(ValueError, match="current media folder"):
        start_transfer(str(src), "copy", source=str(src))


def test_transfer_rejects_an_unknown_mode(tmp_path: Path) -> None:
    with pytest.raises(ValueError, match="copy or move"):
        start_transfer(str(tmp_path / "out"), "sync", source=str(tmp_path))


# ---------------------------------------------------------------------------------------
# locations
# ---------------------------------------------------------------------------------------


def test_locations_report_why_a_path_is_unusable(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """An unwritable candidate is listed WITH its reason, never silently dropped.

    "Why isn't my drive in the list" has to have an answer on screen, or the operator is
    left guessing whether the brain saw the drive at all.
    """
    monkeypatch.setenv("DSC_DATA", str(tmp_path / "data"))
    monkeypatch.setattr(media_store, "EXTERNAL_MOUNT_ROOTS", ())

    def _no(path: Path) -> str:
        return "not writable (Read-only file system)"

    monkeypatch.setattr(media_store, "_probe_writable", _no)
    out = list_locations()
    assert out["locations"], "an unusable location still gets listed"
    assert all(not loc["writable"] for loc in out["locations"])
    assert "Read-only" in out["locations"][0]["reason"]


def test_set_media_root_refuses_an_unwritable_path(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(media_store, "_probe_writable", lambda p: "not writable (No such device)")
    with pytest.raises(ValueError, match="No such device"):
        set_media_root(str(tmp_path / "gone"))


def test_media_root_setting_round_trips(tmp_path: Path, temp_db: Path) -> None:
    """Setting the root changes where media_root() points, without a restart.

    Deliberately does NOT repoint DSC_DATA: temp_db already owns it, and media_root() reads
    the setting from the default database. Moving DSC_DATA out from under it would have the
    writer and the reader looking at two different databases.
    """
    from dsc_brain.paths import default_media_root, media_root

    target = tmp_path / "stick" / "dsc-hub-media"
    set_media_root(str(target), temp_db)
    assert str(media_root()) == str(target)

    set_media_root("", temp_db)
    assert str(media_root()) == str(default_media_root())
