### Task 7: Pass 3 â€” Overview honesty tests

**Files:**
- Create: `brain/tests/test_live_ux_overview_honesty.py`

**Interfaces:**
- Consumes: `/rooms`, `/journal/room/grow_room`, `/journal/core`, `/health`

- [ ] **Step 1: Write API guards**

```python
def test_overview_journal_stack_reachable(client):
    assert client.get("/rooms").status_code == 200
    assert "grow_room" in {r["room_id"] for r in client.get("/rooms").json()["rooms"]}
    assert client.get("/journal/room/grow_room").status_code == 200
    assert client.get("/journal/core").status_code == 200
    assert client.get("/health").status_code == 200
```

- [ ] **Step 2: pytest PASS**

---
