import time
from pathlib import Path
hb = Path(__file__).resolve().parents[1] / "brain" / "data" / "_alc_sleep_hb.txt"
hb.write_text("", encoding="utf-8")
for i in range(36):
    line = f"{time.strftime('%H:%M:%S')} tick {i}\n"
    print(line, end="", flush=True)
    with hb.open("a", encoding="utf-8") as f:
        f.write(line); f.flush()
    time.sleep(5)
with hb.open("a", encoding="utf-8") as f:
    f.write("DONE\n")
